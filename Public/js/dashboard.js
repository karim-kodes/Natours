const root = document.documentElement;
const darkIcon = document.querySelector(".fa-moon");
const lightIcon = document.querySelector(".fa-sun");

// LOAD saved THEME from Localstorage ( if any)

const savedTheme = localStorage.getItem("theme") || "light";
root.setAttribute("data-theme", savedTheme);
updateIcons(savedTheme);

function updateIcons(theme) {
  if (theme === "dark") {
    darkIcon.style.display = "none";
    lightIcon.style.display = "flex";
  } else {
    lightIcon.style.display = "none";
    darkIcon.style.display = "flex";
  }
}

darkIcon.addEventListener("click", () => {
  console.log("button clicked");
  root.setAttribute("data-theme", "dark");
  localStorage.setItem("theme", "dark");
  updateIcons("dark");
});

lightIcon.addEventListener("click", () => {
  root.setAttribute("data-theme", "light");
  localStorage.setItem("theme", "light");
  updateIcons("light");
});

function updateChartColors(theme) {
  const isDark = theme === "dark";
  const textColor = isDark ? "#f5f6f8" : "#111219";
  const gridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

  [userGrowthChart, revenueChart].forEach((chart) => {
    chart.options.scales.x.ticks.color = textColor;
    chart.options.scales.y.ticks.color = textColor;
    chart.options.scales.x.grid.color = gridColor;
    chart.options.scales.y.grid.color = gridColor;
    chart.options.plugins.legend.labels.color = textColor;
    chart.update();
  });
}

// Call this whenever theme changes
darkIcon.addEventListener("click", () => {
  root.setAttribute("data-theme", "dark");
  localStorage.setItem("theme", "dark");
  updateIcons("dark");
  updateChartColors("dark");
});

lightIcon.addEventListener("click", () => {
  root.setAttribute("data-theme", "light");
  localStorage.setItem("theme", "light");
  updateIcons("light");
  updateChartColors("light");
});

console.log(darkIcon);
console.log(lightIcon);

// ADMIN DASHBOARD CHARTS LOGICS
// bookings chart

const ctx = document.getElementById("bookingsChart").getContext("2d");
console.log(ctx);

const bookingsChart = new Chart(ctx, {
  type: "bar", // or 'line', 'pie', 'doughnut', etc.
  data: {
    labels: [
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
    ],
    datasets: [
      {
        label: "Total Bookings",
        data: [45, 60, 70, 90, 100, 120, 95, 110, 130, 140, 125, 150],
        backgroundColor: "rgba(93, 202, 209, 0.5)",
        borderColor: "#1c274c",
        borderWidth: 0,
        borderRadius: 50,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#111219",
          font: { size: 14, family: "Inter" },
        },
      },
      title: {
        display: true,
        text: "Monthly Booking Trends",
        color: "#111219",
        font: { size: 18, weight: "bold" },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#4f5a66" },
      },
      y: {
        grid: { display: false },
        ticks: { color: "#4f5a66" },
      },
    },
  },
});

// Revenue Line Chart
// REVENUE DISTRIBUTION DOUGHNUT CHART
const ctxRevenue = document.getElementById("revenueChart").getContext("2d");

const revenueChart = new Chart(ctxRevenue, {
  type: "doughnut",
  data: {
    labels: ["Safari Tours", "Mountain Hikes", "Beach Packages", "City Tours"],
    datasets: [
      {
        label: "Revenue Distribution",
        data: [4500, 3000, 2200, 1500],
        backgroundColor: ["#5dcad1", "#1c274c", "#90e0ef", "#f9c74f"],
        borderWidth: 1,
        hoverOffset: 1,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#111219",
        },
      },
    },
  },
});

// USER GROWTH LINE CHART
const ctxUserGrowth = document
  .getElementById("userGrowthChart")
  .getContext("2d");

const userGrowthChart = new Chart(ctxUserGrowth, {
  type: "line",
  data: {
    labels: [
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
    ],
    datasets: [
      {
        label: "New Users",
        data: [120, 200, 180, 260, 320, 400, 370, 450, 530, 600, 720, 810],
        borderColor: "#1c274c",
        backgroundColor: "rgba(93, 202, 209, 0.3)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#1c274c",
        pointRadius: 4,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#111219",
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#4f5a66",
        },
      },
      y: {
        grid: {
          display: false,
        },
        beginAtZero: true,
        ticks: {
          color: "#4f5a66",
        },
      },
    },
  },
});

const TopToursctx = document.getElementById("topToursChart").getContext("2d");
console.log(TopToursctx);

new Chart(TopToursctx, {
  type: "bar",
  data: {
    labels: [
      "Maasai Mara Park",
      "Amboseli Safari",
      "Tsavo Adventure",
      "Diani Beach Tour",
      "Mount Kenya Hike",
    ],
    datasets: [
      {
        label: "Bookings",
        data: [120, 95, 88, 70, 60],
        backgroundColor: [
          "#2e49a1b9",
          "#2e49a1b9",
          "#2e49a1b9",
          "#2e49a1b9",
          "#2e49a1b9",
        ],
        borderRadius: 8,
        barThickness: 20,
      },
    ],
  },
  options: {
    indexAxis: "y", // makes it horizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Top 5 Tours by Bookings",
        font: { size: 16, weight: 400 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#666" },
      },
      y: {
        grid: { display: false },
        ticks: { color: "#666" },
      },
    },
  },
});
const revenueCtx = document.getElementById("revenue-Chart").getContext("2d");

new Chart(revenueCtx, {
  type: "line",
  data: {
    labels: [
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
    ],
    datasets: [
      {
        label: "Monthly Revenue ($)",
        data: [
          1200, 1900, 3200, 4100, 3600, 4200, 4800, 5100, 4300, 3900, 4500,
          4700,
        ],
        borderColor: "#2e49a1b9",
        backgroundColor: "#2e49a17b",
        fill: true,
        tension: 0.4, // smooth curve
        pointRadius: 2,
        pointBackgroundColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Revenue (Monthly Earnings)",
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `$${context.formattedValue}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          callback: function (value) {
            return "$" + value;
          },
          color: "#666",
        },
      },
    },
  },
});
