const User = require("../Models/userModel");
const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  //   if (!users) {
  //     return next(new AppError("There are no users in the database", 404));
  //   }

  res.status(200).json({
    status: "success",
    result: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("No document is found on this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
