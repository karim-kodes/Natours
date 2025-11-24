const axios = require("axios");

exports.initiatePayment = async (req, res) => {
  try {
    const { email, amount, paymentMethod, phone } = req.body;

    const paystackData = {
      email: email || "user@example.com", // Paystack requires email
      amount: amount * 100, // KES to kobo
      currency: "KES",
    };

    if (paymentMethod === "mobile_money") {
      if (!phone)
        return res.status(400).json({ message: "Phone number is required" });
      paystackData.mobile_money = {
        phone: phone,
        provider: "mpesa",
      };
    }

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

    // For mobile money, Paystack automatically sends STK push
    res.status(200).json({
      authorization_url: response.data.data.authorization_url,
      message: "STK push triggered",
    });
  } catch (err) {
    console.log(err.response ? err.response.data : err.message);
    res.status(500).json({ message: err.message });
  }
};

exports.handleWebhook = async (req, res) => {
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET; // optional for extra security

  try {
    // Verify signature if using webhook secret
    const hash = req.headers["x-paystack-signature"];

    // TODO: verify hash if you want additional security
    // Paystack docs: https://paystack.com/docs/payments/webhooks/

    const event = req.body;

    // Handle successful payment
    if (event.event === "charge.success") {
      const reference = event.data.reference;
      const amount = event.data.amount / 100; // back to KES
      const email = event.data.customer.email;

      // TODO: Find booking by reference/email and mark as paid
      console.log(`Payment successful for ${email} - amount: KES ${amount}`);

      // Example: update booking in DB
      // await Booking.findOneAndUpdate({ reference }, { paid: true });
    }

    res.status(200).send("ok");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
};
