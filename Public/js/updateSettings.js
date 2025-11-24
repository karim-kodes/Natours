// UPDATE USER DATA (name, email, photo)

export const updateUserSettings = async (formData) => {
  try {
    const res = await axios({
      method: "PATCH", // or PATCH depending on your route
      url: "/api/v1/users/updateMe",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.status === "success") {
      alert("Profile updated successfully!");
      location.reload();
    }
  } catch (err) {
    alert(err.response.data.message || "Failed to update settings");
  }
};

// UPDATE USER PASSWORD
export const updateUserPassword = async (currentPassword, confirmPassword) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "/api/v1/users/updateMyPassword",
      data: {
        currentPassword,
        newPassword,
        confirmPassword,
      },
    });

    if (res.data.status === "success") {
      alert("Password updated successfully!");
      location.reload();
    }
  } catch (err) {
    alert(err.response.data.message || "Failed to update password");
  }
};

// DOM Elements
const settingsForm = document.querySelector(".setting-form");
const passwordForm = document.querySelector(".password-form");

// USER INFO FORM SUBMIT

if (settingsForm) {
  settingsForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = new FormData(); // MUST use FormData for image uploads

    form.append("name", document.querySelector('input[name="name"]').value);
    form.append("email", document.querySelector('input[name="email"]').value);

    const photoFile = document.querySelector('input[name="photo"]')?.files[0];
    if (photoFile) form.append("photo", photoFile);

    await updateUserSettings(form);
  });
}

// PASSWORD FORM SUBMIT

if (passwordForm) {
  passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const currentPassword = document.querySelector(
      'input[name="currentPassword"]'
    ).value;
    const newPassword = document.querySelector(
      'input[name="newPassword"]'
    ).value;
    const confirmPassword = document.querySelector(
      'input[name="confirmPassword"]'
    ).value;

    await updateUserPassword(currentPassword, newPassword, confirmPassword);

    // Clear fields after success
    document.querySelector('input[name="currentPassword"]').value = "";
    document.querySelector('input[name="newPassword"]').value = "";
    document.querySelector('input[name="confirmPassword"]').value = "";
  });
}
