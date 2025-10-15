import { login } from "./auth.js";

const form = document.querySelector(".form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await login(email, password);
});

