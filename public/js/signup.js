// signup.js

const signup = async (name, email, password, passwordConfirm) => {
  try {
    const successToast = document.querySelector(".alert-box-success");
    const successMessage = document.querySelector(".success-message");

    const res = await axios({
      method: "POST",
      url: "/api/v1/users/signup",
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === "success") {
      successToast.style.display = "flex";
      successMessage.textContent = "Account created successfully!";
      window.setTimeout(() => {
        location.assign("/login");
      }, 1500);
    }
  } catch (err) {
    const errorToast = document.querySelector(".alert-box-error");
    const errorMessage = document.querySelector(".error-message");
    errorToast.style.display = "flex";
    errorMessage.textContent = err.response.data.message;
  }
};

document.querySelector(".form").addEventListener("submit", (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const passwordConfirmInput = document.getElementById("passwordConfirm");

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;
  const errorToast = document.querySelector(".alert-box-error");
  const errorMessage = document.querySelector(".error-message");

  console.log(errorMessage);
  console.log(errorToast);

  // === Validation checks ===
  if (!name || !email || !password || !passwordConfirm) {
    errorToast.style.display = "flex";
    errorMessage.textContent = "Please fill in all fields!";
    nameInput.classList.add("input-error");
    emailInput.classList.add("input-error");
    passwordInput.classList.add("input-error");
    passwordConfirmInput.classList.add("input-error");
    return;
  }

  // Name must contain only letters and spaces
  // const nameRegex = /^[A-Za-z\s]+$/;
  // if (!nameRegex.test(name)) {
  //   errorToast.style.display = "flex";
  //   errorMessage.textContent = "Name can only contain letters and spaces!";
  //   nameInput.classList.add("input-error");
  //   return;
  // }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorToast.style.display = "flex";
    errorMessage.textContent = "Please enter a valid email address!";
    emailInput.classList.add("input-error");
    return;
  }

  // Password length check
  if (password.length < 8) {
    alert("Password must be at least 8 characters long.");
    passwordInput.classList.add("input-error");
    return;
  }

  // Passwords must match
  if (password !== passwordConfirm) {
    alert("Passwords do not match.");
    passwordConfirmInput.classList.add("input-error");
    return;
  }

  // If everything passes, proceed to signup
  signup(name, email, password, passwordConfirm);
});
