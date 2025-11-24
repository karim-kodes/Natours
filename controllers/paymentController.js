const axios = require("axios");
const Tour = require("../models/tourModel"); // ensure imported

exports.initiatePayment = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.tourId);

    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    const userEmail = req.user.email; // logged in user
    const amountKES = tour.price; // you already have tour price

    const paystackData = {
      email: userEmail,
      amount: amountKES * 100, // Paystack uses kobo
      currency: "KES",
      metadata: {
        tourId: tour._id.toString(),
        userId: req.user._id.toString(),
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
      authorization_url: response.data.data.authorization_url,
      reference: response.data.data.reference,
    });
  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    const event = req.body;

    if (event.event === "charge.success") {
      const data = event.data;

      const amount = data.amount / 100;
      const email = data.customer.email;
      const tourId = data.metadata.tourId;
      const userId = data.metadata.userId;

      console.log("🎉 PAYMENT SUCCESS");
      console.log({ email, amount, tourId, userId });

      // Example: create booking automatically
      // await Booking.create({
      //   tour: tourId,
      //   user: userId,
      //   price: amount,
      //   paid: true,
      //   reference: data.reference
      // });
    }

    res.sendStatus(200);
  } catch (err) {
    console.log("Webhook error:", err);
    res.sendStatus(500);
  }
};
