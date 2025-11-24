const PDFDocument = require("pdfkit");
const Booking = require("../models/bookingModel");
const Tour = require("../models/tourModel");
const User = require("../models/userModel");

exports.exportBookingsReport = async (req, res, next) => {
  try {
    // 1. Load all bookings with populated data
    const bookings = await Booking.find().populate("tour user");

    if (!bookings.length) {
      return res.status(404).send("No bookings found");
    }

    // 2. Calculate stats
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + b.price, 0);

    // Group by tour
    const bookingsByTour = {};
    bookings.forEach((b) => {
      const name = b.tour.name;
      bookingsByTour[name] = (bookingsByTour[name] || 0) + 1;
    });

    // Bookings per month
    const bookingsByMonth = {};
    bookings.forEach((b) => {
      const month = b.createdAt.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
      bookingsByMonth[month] = (bookingsByMonth[month] || 0) + 1;
    });

    const topTour = Object.entries(bookingsByTour).sort(
      (a, b) => b[1] - a[1]
    )[0];
    const worstTour = Object.entries(bookingsByTour).sort(
      (a, b) => a[1] - b[1]
    )[0];

    // 3. Start generating PDF
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=natours-booking-report.pdf"
    );

    doc.pipe(res);

    // --- PDF HEADER ---
    doc.fontSize(24).text("Natours Booking Report", { align: "center" });
    doc.moveDown(1.5);

    // --- SUMMARY ---
    doc.fontSize(16).text(`Total Bookings: ${totalBookings}`);
    doc.text(`Total Revenue: $${totalRevenue}`);
    doc.text(`Top Tour: ${topTour[0]} (${topTour[1]} bookings)`);
    doc.text(`Lowest Tour: ${worstTour[0]} (${worstTour[1]} bookings)`);
    doc.moveDown();

    // --- BOOKINGS PER TOUR ---
    doc.fontSize(18).text("Bookings Per Tour");
    doc.moveDown(0.5);
    doc.fontSize(13);
    Object.entries(bookingsByTour).forEach(([tour, count]) => {
      doc.text(`• ${tour}: ${count}`);
    });

    doc.moveDown();

    // --- BOOKINGS PER MONTH ---
    doc.fontSize(18).text("Bookings Per Month");
    doc.moveDown(0.5);
    doc.fontSize(13);
    Object.entries(bookingsByMonth).forEach(([month, count]) => {
      doc.text(`• ${month}: ${count}`);
    });

    // --- RECENT BOOKINGS TABLE ---
    doc.addPage();
    doc.fontSize(20).text("Recent Bookings");
    doc.moveDown(1);

    bookings.slice(0, 25).forEach((b) => {
      doc
        .fontSize(12)
        .text(
          `${b.user.name} booked ${b.tour.name} for $${
            b.price
          } on ${b.createdAt.toDateString()}`
        );
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: "Failed to generate PDF report",
    });
  }
};
