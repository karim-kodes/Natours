const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Email = require("../utils/email");

exports.sendContactMessage = catchAsync(async (req, res, next) => {
  const { name, email, phoneNumber, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return next(new AppError("Please provide all required fields", 400));
  }

  try {
    // 1. Send notification to Natours admin
    await new Email(
      { email: process.env.EMAIL_FROM, name: "Natours Admin" },
      null
    ).sendContactNotification({
      customerName: name,
      customerEmail: email,
      customerPhone: phoneNumber || "Not provided",
      subject,
      message,
    });

    // 2. Send confirmation to customer
    await new Email({ email, name }, null).sendContactConfirmation({
      subject,
    });

    res.status(200).json({
      status: "success",
      message: "Message sent successfully! We'll get back to you soon.",
    });
  } catch (err) {
    console.error("Email error:", err);
    return next(
      new AppError(
        "There was an error sending your message. Please try again later.",
        500
      )
    );
  }
});
