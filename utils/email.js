const nodemailer = require("nodemailer");
const pug = require("pug");
const { htmlToText } = require("html-to-text");

class Email {
  constructor(user, url = null) {
    this.to = user.email;
    this.firstName = user.name ? user.name.split(" ")[0] : "User";
    this.url = url;
    this.from = `Natours <${process.env.EMAIL_FROM}>`;
  }

  // Create transporter based on environment
  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // Use Gmail in production
      return nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USERNAME,
          pass: process.env.GMAIL_PASSWORD, // Use App Password, not regular password
        },
      });
    }

    // Use Mailtrap in development
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Generic send method
  async send(subject, html, text = null) {
    // Convert HTML to plain text if not provided
    const plainText = text || htmlToText(html);

    // Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: plainText,
    };

    // Send email
    await this.newTransport().sendMail(mailOptions);
  }

  // Welcome email
  async sendWelcome() {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #55c57a; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f7f7f7; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: #55c57a; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Natours!</h1>
            </div>
            <div class="content">
              <p>Hi ${this.firstName},</p>
              <p>Welcome to Natours, we're glad to have you on board! 🎉</p>
              <p>We're all a big family here, so we're excited to have you join us on our amazing tours around the world.</p>
              <p>Start exploring our tours and book your next adventure today!</p>
              <a href="${this.url}" class="button">Explore Tours</a>
              <p>If you need any help, feel free to contact us anytime.</p>
              <p>Best regards,<br>The Natours Team</p>
            </div>
            <div class="footer">
              <p>Natours - Your adventure awaits!</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.send("Welcome to Natours!", html);
  }

  // Password reset email
  async sendPasswordReset() {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #55c57a; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f7f7f7; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: #55c57a; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hi ${this.firstName},</p>
              <p>You requested to reset your password. Click the button below to set a new password:</p>
              <a href="${this.url}" class="button">Reset Password</a>
              <div class="warning">
                <strong>⚠️ Important:</strong> This link will expire in 10 minutes.
              </div>
              <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
              <p>Best regards,<br>The Natours Team</p>
            </div>
            <div class="footer">
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all;">${this.url}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.send("Password Reset Request (valid for 10 minutes)", html);
  }

  // Booking confirmation email
  async sendBookingConfirmation(booking) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #55c57a; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f7f7f7; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #28b485; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Booking Confirmed!</h1>
            </div>
            <div class="content">
              <p>Hi ${this.firstName},</p>
              <p>Your booking has been confirmed! Get ready for an amazing adventure.</p>
              <div class="booking-details">
                <h3>Booking Details</h3>
                <div class="detail-row">
                  <span class="label">Tour:</span>
                  <span>${booking.tour}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Date:</span>
                  <span>${booking.date}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Duration:</span>
                  <span>${booking.duration} days</span>
                </div>
                <div class="detail-row">
                  <span class="label">Participants:</span>
                  <span>${booking.participants}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Total Price:</span>
                  <span><strong>KSh ${booking.price.toLocaleString()}</strong></span>
                </div>
              </div>
              <p>We'll send you more details closer to your departure date.</p>
              <p>Best regards,<br>The Natours Team</p>
            </div>
            <div class="footer">
              <p>Questions? Contact us at ${process.env.EMAIL_FROM}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.send("Your Natours Booking Confirmation", html);
  }

  // Contact form notification to admin
  async sendContactNotification(data) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #55c57a; color: white; padding: 20px; text-align: center; }
            .content { background: #f7f7f7; padding: 30px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #28b485; }
            .message-box { background: white; padding: 20px; border-left: 4px solid #55c57a; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <span class="label">From:</span> ${data.customerName}
              </div>
              <div class="field">
                <span class="label">Email:</span> <a href="mailto:${
                  data.customerEmail
                }">${data.customerEmail}</a>
              </div>
              <div class="field">
                <span class="label">Phone:</span> ${data.customerPhone}
              </div>
              <div class="field">
                <span class="label">Subject:</span> ${data.subject}
              </div>
              <div class="message-box">
                <p><strong>Message:</strong></p>
                <p>${data.message.replace(/\n/g, "<br>")}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.send(`New Contact: ${data.subject}`, html);
  }

  // Contact form confirmation to customer
  async sendContactConfirmation(data) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #55c57a; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f7f7f7; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; padding: 20px; color: #999; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Contacting Us!</h1>
            </div>
            <div class="content">
              <p>Dear ${this.firstName},</p>
              <p>Thank you for reaching out to us regarding: <strong>${
                data.subject
              }</strong></p>
              <p>We have received your message and our team will get back to you within 24-48 hours.</p>
              <p>In the meantime, feel free to explore our amazing tours at <a href="${
                process.env.WEBSITE_URL || "https://natours.com"
              }">natours.com</a></p>
              <p>Best regards,<br>The Natours Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.send("We've Received Your Message - Natours", html);
  }

  // Add this method to your Email class

  async sendBookingNotificationToAdmin(data) {
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #55c57a; color: white; padding: 20px; text-align: center; }
          .content { background: #f7f7f7; padding: 30px; }
          .booking-info { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .field { margin-bottom: 10px; }
          .label { font-weight: bold; color: #28b485; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 New Booking Received!</h1>
          </div>
          <div class="content">
            <div class="booking-info">
              <div class="field">
                <span class="label">Customer:</span> ${data.customerName}
              </div>
              <div class="field">
                <span class="label">Email:</span> ${data.customerEmail}
              </div>
              <div class="field">
                <span class="label">Tour:</span> ${data.tour}
              </div>
              <div class="field">
                <span class="label">Amount:</span> KSh ${data.amount.toLocaleString()}
              </div>
              <div class="field">
                <span class="label">Reference:</span> ${data.reference}
              </div>
            </div>
            <p>Check your dashboard for full booking details.</p>
          </div>
        </div>
      </body>
    </html>
  `;

    await this.send("New Booking - Natours", html);
  }
}

module.exports = Email;
