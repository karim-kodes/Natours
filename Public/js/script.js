const menu = document.querySelector(".menu");
const close = document.querySelector(".close");
const links = document.querySelector(".links");

// Adding toggle effec to display the menu
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
  if (window.innerWidth > 768) {
    const container = document.querySelector(".reviews");
    const nextBtn = document.getElementById("next");
    const prevBtn = document.getElementById("prev");
    const cards = document.querySelectorAll(".review");

    const totalCards = cards.length;
    console.log(totalCards);
    const visibleCards = 2;
    let index = 0;

    function updateSlider() {
      const shiftPercent = (100 / visibleCards) * index;
      container.style.transform = `translateX(-${shiftPercent}%)`;
    }

    nextBtn.addEventListener("click", () => {
      if (index < totalCards / visibleCards - 1) {
        index++;
      } else {
        index = 0;
      }
      updateSlider();
    });

    prevBtn.addEventListener("click", () => {
      if (index > 0) {
        index--;
      } else {
        index = totalCards / visibleCards - 1;
      }
      updateSlider();
    });
  }
});
