const axios = require("axios");
const Tour = require("../models/tourModel");
const Booking = require("../models/bookingModel");
const Email = require("../utils/email");

exports.initiatePayment = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.tourId);

    if (!tour) {
      return res.status(404).json({
        status: "fail",
        message: "Tour not found",
      });
    }

    const userEmail = req.user.email;
    const amountKES = tour.price;

    const paystackData = {
      email: userEmail,
      amount: amountKES * 100, // Paystack uses kobo (cents)
      currency: "KES",
      callback_url: `${req.protocol}://${req.get("host")}/me`,
      metadata: {
        tourId: tour._id.toString(),
        userId: req.user._id.toString(),
        tourName: tour.name,
      },
    };

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      paystackData,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      status: "success",
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference,
    });
  } catch (err) {
    console.error(
      "Payment initiation error:",
      err.response?.data || err.message
    );
    res.status(500).json({
      status: "fail",
      message: "Failed to initiate payment. Please try again.",
    });
  }
};

exports.handlePaymentSuccess = async (req, res) => {
  try {
    const { reference } = req.query;

    if (!reference) {
      console.log("❌ No reference provided");
      return res.redirect("/");
    }

    console.log("🔍 Verifying payment with reference:", reference);

    // Verify payment with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = response.data.data;
    console.log("✅ Payment verified:", data.status);

    if (data.status === "success") {
      // Check if booking already exists
      const existing = await Booking.findOne({ reference });

      if (existing) {
        console.log("⚠️  Booking already exists for reference:", reference);
        return res.redirect("/me");
      }

      // Create new booking
      const booking = await Booking.create({
        tour: data.metadata.tourId,
        user: data.metadata.userId,
        price: data.amount / 100,
        paid: true,
        reference,
      });

      console.log("✅ Booking created:", booking._id);

      // Populate tour and user details
      await booking.populate("tour user");

      // Send confirmation email
      try {
        await new Email(booking.user, null).sendBookingConfirmation({
          tour: booking.tour.name,
          date: booking.tour.startDates?.[0]
            ? new Date(booking.tour.startDates[0]).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "To be confirmed",
          duration: booking.tour.duration,
          participants: booking.tour.maxGroupSize,
          price: booking.price,
        });

        console.log("✅ Confirmation email sent to:", booking.user.email);
      } catch (emailErr) {
        console.error("❌ Failed to send email:", emailErr.message);
        // Continue anyway - booking is created
      }
    } else {
      console.log("⚠️  Payment status is not successful:", data.status);
    }

    // Redirect to user profile
    res.redirect("/me");
  } catch (err) {
    console.error(
      "❌ Payment verification error:",
      err.response?.data || err.message
    );
    res.redirect("/");
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const event = req.body;

    // Verify webhook signature (recommended for security)
    const crypto = require("crypto");
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      console.log("❌ Invalid webhook signature");
      return res.sendStatus(400);
    }

    if (event.event === "charge.success") {
      const data = event.data;
      const amount = data.amount / 100;
      const reference = data.reference;
      const tourId = data.metadata.tourId;
      const userId = data.metadata.userId;

      console.log("🎉 PAYMENT SUCCESS via Webhook");
      console.log({ reference, amount, tourId, userId });

      // Check if booking already exists
      const existing = await Booking.findOne({ reference });

      if (existing) {
        console.log("⚠️  Booking already exists for reference:", reference);
        return res.sendStatus(200);
      }

      // Create booking
      const booking = await Booking.create({
        tour: tourId,
        user: userId,
        price: amount,
        paid: true,
        reference,
      });

      console.log("✅ Booking created via webhook:", booking._id);

      // Populate tour and user details
      await booking.populate("tour user");

      // Send confirmation email
      try {
        await new Email(booking.user, null).sendBookingConfirmation({
          tour: booking.tour.name,
          date: booking.tour.startDates?.[0]
            ? new Date(booking.tour.startDates[0]).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "To be confirmed",
          duration: booking.tour.duration,
          participants: booking.tour.maxGroupSize,
          price: booking.price,
        });

        console.log("✅ Confirmation email sent to:", booking.user.email);
      } catch (emailErr) {
        console.error("❌ Email error:", emailErr.message);
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.sendStatus(500);
  }
};
