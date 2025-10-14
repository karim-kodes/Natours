const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide a name "],
  },
  email: {
    type: String,
    required: [true, "please provide an email address"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "please provide a password"],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!!!",
    },
    select: false,
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "admin", "guide", "lead-guide"],
    default: "user",
  },

  passwordResetToken: String,
  passwordChangedAt: Date,
  passwordResetExpires: Date,

  isActive: {
    type: Boolean,
    default: true,
    select: false,
  },
});
userSchema.pre("save", async function (next) {
  // ONLY RUN THIS IF PASSWORD IS MODIFIED
  if (!this.isModified("password")) return next();

  // hash the password with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //   Delete passwordCofirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password") || this.isNew) return next();

  // Set the passwordChangedAt property to the current time
  this.passwordChangedAt = Date.now() - 1000; // subtracting 1000ms to ensure the JWT is created after this time
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });

  next();
});

// Instance method to compare password

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
// Instance method to check if password was modified
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
