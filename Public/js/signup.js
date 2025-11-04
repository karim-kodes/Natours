// signup.js

const signup = async (name, email, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/users/signup",
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === "success") {
      alert("Account created successfully!");
      window.setTimeout(() => {
        location.assign("/login");
      }, 1500);
    }
  } catch (err) {
    alert(err.response.data.message);
  }
};

document.querySelector(".form").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const passwordConfirm = document.getElementById("passwordConfirm").value;

  // === Validation checks ===
  if (!name || !email || !password || !passwordConfirm) {
    alert("Please fill in all fields.");
    return;
  }

  // Name must contain only letters and spaces
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(name)) {
    alert("Name can only contain letters and spaces.");
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Password length check
  if (password.length < 8) {
    alert("Password must be at least 8 characters long.");
    return;
  }

  // Passwords must match
  if (password !== passwordConfirm) {
    alert("Passwords do not match.");
    return;
  }

  // If everything passes, proceed to signup
  signup(name, email, password, passwordConfirm);
});
