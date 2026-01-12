// UPDATE USER DATA (name, email, photo)
export const updateUserSettings = async (formData) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "/api/v1/users/updateMe",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.status === "success") {
      showSuccess("Profile updated successfully!", "Success", () => {
        location.reload();
      });
    }
  } catch (err) {
    showError(err.response?.data?.message || "Failed to update settings");
  }
};

// UPDATE USER PASSWORD
export const updateUserPassword = async (
  passwordCurrent,
  password,
  passwordConfirm
) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "/api/v1/users/updateMyPassword",
      data: {
        passwordCurrent, // ✅ Changed from currentPassword
        password, // ✅ Changed from newPassword
        passwordConfirm, // ✅ Changed from confirmPassword
      },
    });

    if (res.data.status === "success") {
      showSuccess("Password updated successfully!", "Success", () => {
        location.reload();
      });
    }
  } catch (err) {
    showError(err.response?.data?.message || "Failed to update password");
  }
};

// DOM Elements
const settingsForm = document.querySelector(".setting-form");
const passwordForm = document.querySelector(".password-form");
const photoInput = document.getElementById("photoInput");
const photoPreview = document.getElementById("photoPreview");
const choosePhotoBtn = document.querySelector(".profile-btn");

// PHOTO UPLOAD HANDLING
if (choosePhotoBtn && photoInput) {
  // Trigger file input when button is clicked
  choosePhotoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    photoInput.click();
  });

  // Preview image when file is selected
  photoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        photoPreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });
}

// USER INFO FORM SUBMIT
if (settingsForm) {
  settingsForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = new FormData();

    form.append("name", document.querySelector('input[name="name"]').value);
    form.append("email", document.querySelector('input[name="email"]').value);

    const photoFile = photoInput?.files[0];
    if (photoFile) {
      form.append("photo", photoFile);
    }

    await updateUserSettings(form);
  });
}

// PASSWORD FORM SUBMIT
if (passwordForm) {
  passwordForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const passwordCurrent = document.querySelector(
      'input[name="currentPassword"]'
    ).value;
    const password = document.querySelector('input[name="newPassword"]').value;
    const passwordConfirm = document.querySelector(
      'input[name="confirmPassword"]'
    ).value;

    // Validate all fields are filled
    if (!passwordCurrent || !password || !passwordConfirm) {
      showError("Please fill in all password fields!");
      return;
    }

    // Validate passwords match
    if (password !== passwordConfirm) {
      showError("New password and confirm password do not match!");
      return;
    }

    // Validate minimum length
    if (password.length < 8) {
      showError("New password must be at least 8 characters long!");
      return;
    }

    await updateUserPassword(passwordCurrent, password, passwordConfirm);

    // Clear fields after success
    passwordForm.reset();
  });
}
