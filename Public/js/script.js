const menu = document.querySelector(".menu");
const close = document.querySelector(".close");
const links = document.querySelector(".links");
const profileImg = document.getElementById("profile-img");
const profileModal = document.querySelector(".user-profile-modal");

// console.log(profileModal);
// console.log(profileImg);
if (profileImg & profileModal) {
  profileImg.addEventListener("mouseover", () => {
    profileModal.style.opacity = 1;
  });

  profileImg.addEventListener("mouseout", () => {
    setTimeout(() => {
      profileModal.style.opacity = 0;
    }, 1000);
  });
}

// Adding toggle effec to display the menu
if (menu & close & links) {
  menu.addEventListener("click", () => {
    links.style.display = "block";
    menu.style.display = "none";
    close.style.display = "inline";
  });

  close.addEventListener("click", () => {
    links.style.display = "none";
    close.style.display = "none";
    menu.style.display = "inline";
  });
}

// Tour carousel animation in MOBILE
document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".tours");
  const cards = document.querySelectorAll(".tour");

  let currentIndex = 0;
  const totalCards = cards.length;

  function scrollToCard(index) {
    const cardWidth = cards[0].offsetWidth;
    container.scrollTo({
      left: cardWidth * index,
      behavior: "smooth",
    });
  }

  function startCarousel() {
    setInterval(() => {
      currentIndex = (currentIndex + 1) % totalCards;
      scrollToCard(currentIndex);
    }, 2000); // change every second
  }

  // Run carousel only on mobile
  if (window.innerWidth <= 768) {
    startCarousel();
  }
});
// === MOBILE REVIEWS AUTO CAROUSEL ===
document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".reviews");
  const cards = document.querySelectorAll(".review");

  let currentIndex = 0;
  const totalCards = cards.length;

  function scrollToCard(index) {
    const cardWidth = cards[0].offsetWidth;
    container.scrollTo({
      left: cardWidth * index,
      behavior: "smooth",
    });
  }

  function startCarousel() {
    setInterval(() => {
      currentIndex = (currentIndex + 1) % totalCards;
      scrollToCard(currentIndex);
    }, 3000); // every 3 seconds
  }

  // Run carousel only on mobile
  if (window.innerWidth <= 768) {
    startCarousel();
  }
});

// === DESKTOP REVIEWS SLIDER WITH BUTTONS ===
document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".reviews");
  const cards = document.querySelectorAll(".review");
  const nextBtn = document.getElementById("next");
  const prevBtn = document.getElementById("prev");

  let currentIndex = 0;
  const visibleCards = 1;
  const totalCards = cards.length;

  // Ensure container uses flex layout
  container.style.display = "flex";
  container.style.scrollBehavior = "smooth";
  container.style.overflow = "hidden";

  // Get width of one card (including margin)
  function getCardWidth() {
    const style = getComputedStyle(cards[0]);
    const cardWidth = cards[0].offsetWidth + parseFloat(style.marginRight);
    return cardWidth;
  }

  function scrollToCurrent() {
    const cardWidth = getCardWidth();
    container.scrollTo({
      left: cardWidth * currentIndex,
      behavior: "smooth",
    });
  }

  nextBtn.addEventListener("click", () => {
    if (currentIndex < totalCards - visibleCards) {
      currentIndex += visibleCards; // move two at a time
    } else {
      currentIndex = 0; // loop back to start
    }
    scrollToCurrent();
  });

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex -= visibleCards; // go back two cards
    } else {
      currentIndex = totalCards - visibleCards; // loop to end
    }
    scrollToCurrent();
  });

  // Optional: adjust on resize
  window.addEventListener("resize", scrollToCurrent);
});

document.addEventListener("DOMContentLoaded", () => {
  const sortSelect = document.getElementById("sort");
  const durationSelect = document.getElementById("duration");
  const searchInput = document.getElementById("search");

  // Restore selected values
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("sort")) sortSelect.value = urlParams.get("sort");
  if (urlParams.has("duration"))
    durationSelect.value = urlParams.get("duration");
  if (urlParams.has("search")) searchInput.value = urlParams.get("search");

  const handleFilters = () => {
    const sort = sortSelect.value;
    const duration = durationSelect.value;
    const search = searchInput.value.trim();

    let query = `/tours?`;
    if (sort !== "default") query += `sort=${sort}&`;
    if (duration !== "all") query += `duration=${duration}&`;
    if (search) query += `search=${search}&`;

    location.assign(query);
  };

  sortSelect.addEventListener("change", handleFilters);
  durationSelect.addEventListener("change", handleFilters);
  searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") handleFilters();
  });
});
