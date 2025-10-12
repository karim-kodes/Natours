const User = require("../Models/userModel");
const catchAsync = require("../Utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("../Utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  // Create the token
  const token = signToken(user._id);
  // remove the password from the output
  user.password = undefined;
  // Send the token
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// SIGNING UP USER
exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  createSendToken(newUser, 200, res);
});

// LOGGING IN USER
exports.login = catchAsync(async (req, res, next) => {
  // get email and password from body
  const { email, password } = req.body;
  // 1. check if email and password exist
  if (!email || !password) {
    return next(new AppError("please provide email and password", 400));
  }
  // 2.check if user exists and password is correct
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  // Send token to client
  createSendToken(user, 200, res);
});
