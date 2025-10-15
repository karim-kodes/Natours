export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: { email, password },
    });

    if (res.data.status === "success") {
      alert("Logged in successfully!");
      location.assign("/");
    }
  } catch (err) {
    alert(err.response.data.message || "Login failed");
  }
};

export const signup = async (name, email, password, passwordConfirm) => {
  try {
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
      alert("Account created successfully!");
      location.assign("/"); // Redirect to homepage after signup
    }
  } catch (err) {
    alert(err.response.data.message || "Signup failed");
  }
};
