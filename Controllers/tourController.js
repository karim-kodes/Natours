const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");
const Tour = require("./../Models/tourModel");

// Get all tours
exports.getAllTours = async (req, res) => {
  const tours = await Tour.find();

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours,
    },
  });
};

// Create a tour
exports.createTour = async (req, res) => {
  const tour = await Tour.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});
