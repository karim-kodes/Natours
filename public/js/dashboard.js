// const { document } = require("pdfkit/js/page");

const links = document.querySelectorAll(".tab-link");
const tabContents = document.querySelectorAll(".tab-content");
const mainHeading = document.querySelector(".main-header h3");

function openModal() {
  document.querySelector(".add-tour-modal").style.display = "flex";
}

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

// PAGINATION
document.addEventListener("DOMContentLoaded", () => {
  function setupPagination(tableId) {
    const table = document.getElementById(tableId);
    if (!table) {
      return;
    }

    const rows = table.querySelectorAll("tbody tr");

    if (rows.length <= 10) {
      return;
    }

    const paginationContainer = table
      .closest("section")
      ?.querySelector(".pagination");

    if (!paginationContainer) {
      return;
    }

    const pageText = paginationContainer.querySelector("span");
    const prevBtn = paginationContainer.querySelector(".prev");
    const nextBtn = paginationContainer.querySelector(".next");

    const rowsPerPage = 10;
    const totalPages = Math.ceil(rows.length / rowsPerPage);
    let currentPage = 1;

    function displayPage(page) {
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
      if (currentPage > 1) {
        currentPage--;
        displayPage(currentPage);
      }
    });

    nextBtn.addEventListener("click", () => {
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

// EDITING TOUR ON THE ADMIN DASHBOARD
document.addEventListener("click", async (e) => {
  const editBtn = e.target.closest(".edit-btn");
  if (!editBtn) return;

  const tourId = editBtn.dataset.id;
  console.log("Editing tour:", tourId);

  try {
    const res = await fetch(`/api/v1/tours/${tourId}`);
    const data = await res.json();

    const tour = data.data; // ✅ correct based on your API

    // Fill form fields
    document.getElementById("name").value = tour.name;
    document.getElementById("price").value = tour.price;
    document.getElementById("duration").value = tour.duration;
    document.getElementById("location").value =
      tour.startLocation?.description || "";
    document.getElementsByName("difficulty")[0].value = tour.difficulty;
    document.getElementsByName("maxGroupSize")[0].value = tour.maxGroupSize;
    document.getElementById("summary").value = tour.summary;

    const form = document.getElementById("addTourForm");
    form.dataset.editing = tourId;

    // 🔥 UPDATE MODAL UI
    document.getElementById("modalTitle").textContent = "Update Tour";
    document.getElementById("submitTourBtn").textContent = "Update Tour";

    // Optional: remove image requirement when editing
    document.getElementById("imageCover").required = false;
    document.getElementById("images").required = false;

    console.log("API response:", data);
    console.log("Tour object:", tour);

    openModal();
  } catch (err) {
    console.error("Error loading tour:", err);
  }
});

// Submit Hnadler
const form = document.getElementById("addTourForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const isEditing = form.dataset.editing; // tourId if editing
  const formData = new FormData(form);

  // If editing, adjust request
  let url = "/api/v1/tours";
  let method = "POST";

  if (isEditing) {
    url = `/api/v1/tours/${isEditing}`;
    method = "PATCH";

    // Remove images if not updated
    if (!form.imageCover.files.length) formData.delete("imageCover");
    if (!form.images.files.length) formData.delete("images");

    // Remove location to avoid MongoDB GeoJSON error
    formData.delete("startLocation[description]");
  }

  try {
    const res = await fetch(url, {
      method,
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Something went wrong");

    isEditing
      ? showSuccess("Tour created  successfully!!", "success", () => {
          window.location.reload();
        })
      : showSuccess("Tour added successfully!!", "success", () => {
          window.location.reload();
        });

    // Clear edit mode
    form.dataset.editing = "";
    form.reset();

    // Optional: reload page or update UI dynamically
    window.location.reload();
  } catch (err) {
    console.error(err);
    alert(err.message || "Something went wrong");
  }
});

// DELETING TOUR FROM THE ADMIN DASHBOARD
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const tourId = e.target.dataset.id;

    // Use the reusable confirmation modal
    showConfirm(
      "Are you sure you want to delete this tour? This action cannot be undone.",
      "Delete Tour?",
      async () => {
        // User clicked confirm - proceed with deletion
        try {
          const res = await fetch(`/api/v1/tours/${tourId}`, {
            method: "DELETE",
          });

          if (res.status === 204) {
            showSuccess("Tour deleted successfully!", "Deleted", () => {
              location.reload();
            });
          } else {
            showError(
              "Failed to delete tour. Please try again.",
              "Delete Failed"
            );
          }
        } catch (err) {
          console.error(err);
          showError(
            "Error deleting tour. Please check your connection.",
            "Error"
          );
        }
      },
      () => {
        // User clicked cancel - do nothing
        console.log("Delete cancelled");
      }
    );
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
