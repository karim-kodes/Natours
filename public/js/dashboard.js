const links = document.querySelectorAll(".tab-link");
const tabContents = document.querySelectorAll(".tab-content");
const mainHeading = document.querySelector(".main-header h3");

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    // remove the active class from all the links
    links.forEach((l) => l.classList.remove("sidelink-active"));
    // remove the active class from all the tab contents
    tabContents.forEach((t) => t.classList.remove("tab-content-active"));
    // Add active class to the clicked link

    link.classList.add("sidelink-active");

    // Show the corresponding section
    const target = link.dataset.tab;
    document.getElementById(target).classList.add("tab-content-active");

    // Show Heading Dynamically
    const tabTitle = link.querySelector("a").textContent.trim();
    mainHeading.textContent = tabTitle;
  });
});

const dashLinks = document.querySelectorAll(".navlink");
const dashContent = document.querySelectorAll(".user-section");
const userHeader = document.querySelector(".user-header h3");

dashLinks.forEach((dashlink) => {
  dashlink.addEventListener("click", (e) => {
    e.preventDefault();
    // remove the active class from all the links
    dashLinks.forEach((l) => l.classList.remove("active"));
    // remove the active class from all the tab contents
    dashContent.forEach((t) => t.classList.remove("user-section-active"));
    // Add active class to the clicked link

    dashlink.classList.add("active");

    // Show the corresponding section
    const target = dashlink.dataset.tab;
    document.getElementById(target).classList.add("user-section-active");

    // Show Heading Dynamically
    const tabTitle = dashlink.querySelector("span").textContent.trim();
    userHeader.textContent = tabTitle;
  });
});

// ADDING TOUR FORM
document
  .getElementById("addTourForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // prevent page from reloading

    const form = document.getElementById("addTourForm");
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/v1/tours", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status === "success") {
        alert("Tour created successfully!");

        // Optionally refresh tours list
        window.location.reload();
      } else {
        alert("Error creating tour: " + data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  });

// PAGINATION
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Dashboard pagination script loaded");

  function setupPagination(tableId) {
    const table = document.getElementById(tableId);
    if (!table) {
      console.warn(`❌ Table with ID "${tableId}" not found`);
      return;
    }

    const rows = table.querySelectorAll("tbody tr");
    console.log(`📊 Table "${tableId}" found with ${rows.length} rows`);

    if (rows.length <= 10) {
      console.log(`ℹ️ Table "${tableId}" has ≤10 rows — pagination skipped`);
      return;
    }

    const paginationContainer = table
      .closest("section")
      ?.querySelector(".pagination");

    if (!paginationContainer) {
      console.warn(`⚠️ No .pagination found for "${tableId}"`);
      return;
    }

    const pageText = paginationContainer.querySelector("span");
    const prevBtn = paginationContainer.querySelector(".prev");
    const nextBtn = paginationContainer.querySelector(".next");

    const rowsPerPage = 10;
    const totalPages = Math.ceil(rows.length / rowsPerPage);
    let currentPage = 1;

    function displayPage(page) {
      console.log(`🔹 Showing page ${page} of ${totalPages} for ${tableId}`);

      rows.forEach((row, index) => {
        row.style.display =
          index >= (page - 1) * rowsPerPage && index < page * rowsPerPage
            ? ""
            : "none";
      });

      pageText.textContent = `Page ${page} of ${totalPages}`;
      prevBtn.disabled = page === 1;
      nextBtn.disabled = page === totalPages;
    }

    prevBtn.addEventListener("click", () => {
      console.log("btn xlixked");
      if (currentPage > 1) {
        currentPage--;
        displayPage(currentPage);
      }
    });

    nextBtn.addEventListener("click", () => {
      console.log("btn clicked");
      if (currentPage < totalPages) {
        currentPage++;
        displayPage(currentPage);
      }
    });

    // ✅ Initialize first page
    displayPage(currentPage);
  }

  // Apply to all tables
  setupPagination("bookingsTable");
  setupPagination("toursTable");
  setupPagination("reviewsTable");
  setupPagination("usersTable");
});

// DELETING TOUR FROM THE ADMIN DASHBOARD
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const tourId = e.target.dataset.id;

    const confirmDelete = confirm("Are you sure you want to delete this tour?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/v1/tours/${tourId}`, {
        method: "DELETE",
      });

      if (res.status === 204) {
        alert("Tour deleted successfully");
        location.reload(); // refresh table
      } else {
        alert("Failed to delete tour");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting tour");
    }
  }
});

// EDITING TOUR ON THE ADMIN DASHBOARD
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("edit-btn")) {
    const tourId = e.target.dataset.id;

    // Fetch the tour details
    const res = await fetch(`/api/v1/tours/${tourId}`);
    const data = await res.json();
    const tour = data.data.tour;

    // Fill the modal form with tour details
    document.getElementById("name").value = tour.name;
    document.getElementById("price").value = tour.price;
    document.getElementById("duration").value = tour.duration;
    document.getElementById("location").value =
      tour.startLocation.description || "";
    document.getElementsByName("difficulty")[0].value = tour.difficulty;
    document.getElementsByName("maxGroupSize")[0].value = tour.maxGroupSize;
    document.getElementById("summary").value = tour.summary;

    // show modal in EDIT mode
    document.getElementById("addTourForm").dataset.editing = tourId;

    openModal();
  }
});

// MODAL ELEMENTS
// const confirmModal = document.getElementById("confirmDeleteModal");
// const cancelConfirmBtn = confirmModal.querySelector(".cancel-btn");
// const confirmDeleteBtn = confirmModal.querySelector(".delete-btn");

// let selectedTourId = null; // store which tour is being deleted

// // Step 1 — When user clicks delete icon
// document.addEventListener("click", (e) => {
//   const btn = e.target.closest(".delete-btn");
//   if (!btn) return;

//   selectedTourId = btn.dataset.id;

//   // Show modal
//   confirmModal.style.display = "flex";
// });

// // Step 2 — Cancel button closes modal
// cancelConfirmBtn.addEventListener("click", () => {
//   confirmModal.style.display = "none";
//   selectedTourId = null;
// });

// // Step 3 — Confirm delete button
// confirmDeleteBtn.addEventListener("click", async () => {
//   if (!selectedTourId) return;

//   try {
//     const res = await fetch(`/api/v1/tours/${selectedTourId}`, {
//       method: "DELETE",
//     });

//     if (res.status === 204) {
//       confirmModal.style.display = "none";
//       alert("Tour deleted successfully!");
//       location.reload();
//     } else {
//       confirmModal.style.display = "none";
//       alert("Failed to delete tour.");
//     }
//   } catch (err) {
//     console.error(err);
//     alert("Error deleting tour.");
//   }

//   selectedTourId = null;
// });

// Theme Toggle Logic
const html = document.documentElement;
const sunIcon = document.querySelector(".theme-toggle .fa-sun");
const moonIcon = document.querySelector(".theme-toggle .fa-moon");

// 1. Load theme from localStorage
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  html.setAttribute("data-theme", "dark");
  sunIcon.classList.remove("active");
  moonIcon.classList.add("active");
}

// 2. Toggle theme on click
document.querySelector(".theme-toggle").addEventListener("click", () => {
  const isDark = html.getAttribute("data-theme") === "dark";

  if (isDark) {
    // Switch to light theme
    html.removeAttribute("data-theme");
    sunIcon.classList.add("active");
    moonIcon.classList.remove("active");
    localStorage.setItem("theme", "light");
  } else {
    // Switch to dark theme
    html.setAttribute("data-theme", "dark");
    sunIcon.classList.remove("active");
    moonIcon.classList.add("active");
    localStorage.setItem("theme", "dark");
  }
});

const addTourBtn = document.querySelector(".add-tour-btn");
const addTourModal = document.querySelector(".add-tour-modal");
const closeBtn = document.getElementById("closeModal");
const imageCoverInput = document.getElementById("imageCover");
const coverPreview = document.getElementById("coverPreview");
const imagesInput = document.getElementById("images");
const imagePreview = document.getElementById("imagePreview");

console.log(imagesInput);
console.log(imagePreview);

addTourBtn.addEventListener("click", () => {
  addTourModal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  addTourModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === addTourModal) addTourModal.style.display = "none";
});
// Image cover preview logic
imageCoverInput.addEventListener("change", () => {
  coverPreview.innerHTML = "";
  const file = imageCoverInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = document.createElement("img");
    img.src = e.target.result;
    coverPreview.appendChild(img);
  };
  reader.readAsDataURL(file);
});

// Images prev
// iew logic
imagesInput.addEventListener("change", () => {
  imagePreview.innerHTML = "";
  const files = Array.from(imagesInput.files).slice(0, 3);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      imagePreview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

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
