const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  //1.  Create Transporter
  const Transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //  2. Create email options
  const mailOptions = {
    from: "Adnaan Manager <hello@gmail.io>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html, // If you want to send HTML content
    // attachments: options.attachments, // If you want to send attachments
  };
  // 3.Send the email
  await Transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
