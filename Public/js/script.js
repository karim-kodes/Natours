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
