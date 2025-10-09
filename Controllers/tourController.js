const AppError = require("../Utils/appError");
const catchAsync = require("../Utils/catchAsync");
const Tour = require("./../Models/tourModel");
const ApiFeatures = require("../Utils/apiFeatures");
const qs = require("qs");

// Get all tours
exports.getAllTours = async (req, res) => {
  // Parse query string correctly
  const parsedQuery = qs.parse(req.query);
  // Execute The query
  const features = new ApiFeatures(Tour.find(), parsedQuery)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

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

// Updating Tour

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { tour },
  });
});

// Deleting Tour
exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError("No tour found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null, // no content
  });
});
