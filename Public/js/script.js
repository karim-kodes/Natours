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
