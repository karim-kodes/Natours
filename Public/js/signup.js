// signup.js
import { signup } from "./auth.js";

console.log("Signup.js loaded ✅");
const form = document.querySelector(".form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("Form submitted 🚀");

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;

    await signup(name, email, password, passwordConfirm);
  });
}
