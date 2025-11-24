const login = async (email, password) => {
  try {
    const successToast = document.querySelector(".alert-box-success");
    const successMessage = document.querySelector(".success-message");

    const res = await axios({
      method: "POST",
      url: "http://localhost:3000/api/v1/users/login",
      data: {
        email,
        password,
      },
    });
    if (res.data.status === "success") {
      const userRole = res.data.data.user.role;
      successToast.style.display = "flex";
      successMessage.textContent = "Logged in Successfully!";
      window.setTimeout(() => {
        if (userRole === "admin") {
          location.assign("/admin-dashboard");
        } else {
          location.assign("/");
        }
      }, 3000);
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
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  login(email, password);
});

// signup.js
