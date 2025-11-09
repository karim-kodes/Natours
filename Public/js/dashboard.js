document.addEventListener("DOMContentLoaded", () => {
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const bookings = [120, 90, 140, 100, 160, 180, 210, 200, 150, 130, 170, 190];

  const canvas = document.getElementById("booking-chart");
  const ctx = canvas.getContext("2d");

  // Create a horizontal gradient (45deg style)
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#19264f");
  gradient.addColorStop(1, "#1a327fba");

  // Plugin to draw gray background bars behind each actual bar
  const backgroundBars = {
    id: "backgroundBars",
    beforeDatasetsDraw(chart) {
      const {
        ctx,
        chartArea: { top, bottom },
        scales: { x, y },
      } = chart;
      const dataset = chart.getDatasetMeta(0);
      ctx.save();
      dataset.data.forEach((bar) => {
        const { x: barX, width } = bar;
        const barBottom = y.getPixelForValue(0);
        const barTop = top + (bottom - top) * 0.05; // small offset for padding
        const fullHeight = barBottom - barTop;
        const radius = 10;

        // Draw gray background with same bar shape
        ctx.fillStyle = "#97adf634";
        const xPos = barX - width / 2;
        const yPos = barBottom - fullHeight;
        const barHeight = fullHeight;

        // Draw rounded rect background
        const r = radius;
        ctx.beginPath();
        ctx.moveTo(xPos + r, yPos);
        ctx.lineTo(xPos + width - r, yPos);
        ctx.quadraticCurveTo(xPos + width, yPos, xPos + width, yPos + r);
        ctx.lineTo(xPos + width, yPos + barHeight - r);
        ctx.quadraticCurveTo(
          xPos + width,
          yPos + barHeight,
          xPos + width - r,
          yPos + barHeight
        );
        ctx.lineTo(xPos + r, yPos + barHeight);
        ctx.quadraticCurveTo(
          xPos,
          yPos + barHeight,
          xPos,
          yPos + barHeight - r
        );
        ctx.lineTo(xPos, yPos + r);
        ctx.quadraticCurveTo(xPos, yPos, xPos + r, yPos);
        ctx.closePath();
        ctx.fill();
      });
      ctx.restore();
    },
  };

  new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Bookings",
          data: bookings,
          backgroundColor: gradient,
          borderRadius: 10,
          borderSkipped: false,
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
        title: {
          display: false,
          text: "Monthly Bookings (2025)",
          font: { size: 18 },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Bookings" },
          grid: { display: false },
        },
        x: {
          title: { display: true, text: "Month" },
          grid: { display: false },
        },
      },
    },
    plugins: [backgroundBars],
  });
});
