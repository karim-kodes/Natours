const PDFDocument = require("pdfkit");
const Booking = require("../models/bookingModel");

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
    const avgBookingValue = totalRevenue / totalBookings;

    // Group by tour
    const bookingsByTour = {};
    const revenueByTour = {};
    bookings.forEach((b) => {
      const name = b.tour.name;
      bookingsByTour[name] = (bookingsByTour[name] || 0) + 1;
      revenueByTour[name] = (revenueByTour[name] || 0) + b.price;
    });

    // Bookings per month
    const bookingsByMonth = {};
    const revenueByMonth = {};
    bookings.forEach((b) => {
      const month = b.createdAt.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
      bookingsByMonth[month] = (bookingsByMonth[month] || 0) + 1;
      revenueByMonth[month] = (revenueByMonth[month] || 0) + b.price;
    });

    const sortedTours = Object.entries(bookingsByTour).sort(
      (a, b) => b[1] - a[1]
    );
    const topTour = sortedTours[0];
    const worstTour = sortedTours[sortedTours.length - 1];

    // 3. Start generating PDF
    const doc = new PDFDocument({
      margin: 50,
      size: "A4",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=natours-booking-report-${Date.now()}.pdf`
    );

    doc.pipe(res);

    // Helper functions for consistent styling
    const colors = {
      primary: "#55c57a",
      secondary: "#7dd56f",
      dark: "#28b485",
      text: "#333333",
      lightGray: "#f7f7f7",
      gray: "#999999",
    };

    const drawHeader = () => {
      doc
        .fillColor(colors.primary)
        .fontSize(32)
        .font("Helvetica-Bold")
        .text("NATOURS", { align: "center" });

      doc
        .fillColor(colors.text)
        .fontSize(18)
        .font("Helvetica")
        .text("Booking Analytics Report", { align: "center" });

      doc
        .fontSize(10)
        .fillColor(colors.gray)
        .text(
          `Generated on ${new Date().toLocaleString("en-US", {
            dateStyle: "full",
            timeStyle: "short",
          })}`,
          { align: "center" }
        );

      doc.moveDown(2);
    };

    const drawSectionTitle = (title) => {
      doc
        .fillColor(colors.dark)
        .fontSize(16)
        .font("Helvetica-Bold")
        .text(title);
      doc.moveDown(0.5);
    };

    const drawStatCard = (label, value, x, y, width) => {
      // Card background
      doc
        .roundedRect(x, y, width, 70, 5)
        .fillAndStroke(colors.lightGray, colors.gray);

      // Label
      doc
        .fillColor(colors.gray)
        .fontSize(10)
        .font("Helvetica")
        .text(label, x + 15, y + 15, { width: width - 30 });

      // Value
      doc
        .fillColor(colors.text)
        .fontSize(15)
        .font("Helvetica-Bold")
        .text(value, x + 15, y + 35, { width: width - 30 });
    };

    const drawTable = (headers, rows, startY) => {
      const tableTop = startY;
      const tableLeft = 50;
      const columnWidth = (doc.page.width - 100) / headers.length;
      let currentY = tableTop;

      // Draw header
      doc
        .fillColor(colors.dark)
        .rect(tableLeft, currentY, doc.page.width - 100, 30)
        .fill();

      headers.forEach((header, i) => {
        doc
          .fillColor("white")
          .fontSize(11)
          .font("Helvetica-Bold")
          .text(header, tableLeft + i * columnWidth + 10, currentY + 10, {
            width: columnWidth - 20,
            align: i > 0 ? "right" : "left",
          });
      });

      currentY += 30;

      // Draw rows
      rows.forEach((row, rowIndex) => {
        const rowColor = rowIndex % 2 === 0 ? "white" : colors.lightGray;

        doc
          .fillColor(rowColor)
          .rect(tableLeft, currentY, doc.page.width - 100, 25)
          .fill();

        row.forEach((cell, i) => {
          doc
            .fillColor(colors.text)
            .fontSize(10)
            .font("Helvetica")
            .text(cell, tableLeft + i * columnWidth + 10, currentY + 8, {
              width: columnWidth - 20,
              align: i > 0 ? "right" : "left",
            });
        });

        currentY += 25;

        // Check if we need a new page
        if (currentY > doc.page.height - 100) {
          doc.addPage();
          currentY = 50;
        }
      });

      return currentY + 20;
    };

    const formatCurrency = (amount) => {
      return `KSH ${amount.toLocaleString("en-KE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    };

    // --- PAGE 1: HEADER & SUMMARY ---
    drawHeader();

    // Key Metrics Cards
    const cardWidth = 140;
    const cardSpacing = 15;
    const startX = (doc.page.width - (cardWidth * 3 + cardSpacing * 2)) / 2;
    const cardY = doc.y;

    drawStatCard(
      "Total Bookings",
      totalBookings.toString(),
      startX,
      cardY,
      cardWidth
    );
    drawStatCard(
      "Total Revenue",
      formatCurrency(totalRevenue),
      startX + cardWidth + cardSpacing,
      cardY,
      cardWidth
    );
    drawStatCard(
      "Avg. Booking",
      formatCurrency(avgBookingValue),
      startX + (cardWidth + cardSpacing) * 2,
      cardY,
      cardWidth
    );

    doc.y = cardY + 90;
    doc.moveDown(1);

    // Performance Highlights
    drawSectionTitle("Performance Highlights");

    doc
      .fillColor(colors.text)
      .fontSize(11)
      .font("Helvetica")
      .text(`Best Performing Tour: `, { continued: true })
      .font("Helvetica-Bold")
      .text(
        `${topTour[0]} (${topTour[1]} bookings, ${formatCurrency(
          revenueByTour[topTour[0]]
        )})`
      );

    doc
      .font("Helvetica")
      .text(`Lowest Performing Tour: `, { continued: true })
      .font("Helvetica-Bold")
      .text(
        `${worstTour[0]} (${worstTour[1]} bookings, ${formatCurrency(
          revenueByTour[worstTour[0]]
        )})`
      );

    doc.moveDown(2);

    // --- BOOKINGS BY TOUR TABLE ---
    drawSectionTitle("Bookings by Tour");

    const tourTableRows = sortedTours.map(([tour, count]) => [
      tour,
      count.toString(),
      formatCurrency(revenueByTour[tour]),
      formatCurrency(revenueByTour[tour] / count),
    ]);

    let nextY = drawTable(
      ["Tour Name", "Bookings", "Revenue", "Avg. Price"],
      tourTableRows,
      doc.y
    );

    doc.y = nextY;
    doc.moveDown(1);

    // --- BOOKINGS BY MONTH TABLE ---
    if (doc.y > doc.page.height - 200) {
      doc.addPage();
    }

    drawSectionTitle("Monthly Performance");

    const monthTableRows = Object.entries(bookingsByMonth)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([month, count]) => [
        month,
        count.toString(),
        formatCurrency(revenueByMonth[month]),
      ]);

    nextY = drawTable(["Month", "Bookings", "Revenue"], monthTableRows, doc.y);

    // --- RECENT BOOKINGS TABLE ---
    doc.addPage();
    drawSectionTitle("Recent Bookings (Last 25)");
    doc.moveDown(0.5);

    const recentBookingsRows = bookings.slice(0, 25).map((b) => [
      b.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      b.user.name,
      b.tour.name,
      formatCurrency(b.price),
    ]);

    drawTable(
      ["Date", "Customer", "Tour", "Amount"],
      recentBookingsRows,
      doc.y
    );

    // Finalize PDF
    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "fail",
      message: "Failed to generate PDF report",
    });
  }
};
