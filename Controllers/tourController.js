const Tour = require("./../Models/tourModel");

// Get all tours
exports.getAllTours = async (req, res) => {
  const tours = await Tour.find();

  res.status(200).json({
    status: "success",
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
