const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "http://localhost:3000/api/v1/users/logout", // or your correct route
    });

    if (res.data.status === "success") {
      // Reload page or redirect to homepage/login
      location.assign("/");
    }
  } catch (err) {
    console.log("Error logging out:", err);
  }
};

const logoutBtn = document.getElementById("logout-link");
if (logoutBtn) logoutBtn.addEventListener("click", logout);
