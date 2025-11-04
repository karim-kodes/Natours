const Tour = require("../models/tourModel");
const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

exports.getHomePage = catchAsync(async (req, res) => {
  try {
    // 1. Fetch all tours from the database
    const tours = await Tour.find().limit(4).sort("-price");
    // 2. Get recent reviews
    const reviews = await Review.find()
      .populate({
        path: "user",
        select: "name photo",
      })
      .limit(10);
    // 2. Render the page with data
    res.status(200).render("pages/Home", {
      title: "Natours | Explore Kenya's Beauty",
      tours,
      reviews,
      activePage: "home",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Failed to load home page",
    });
  }
});

exports.getLogin = catchAsync(async (req, res) => {
  res.status(200).render("pages/login", {
    title: "Log into Your Acount",
    bodyClass: "login-body",
  });
});

exports.getSignUp = catchAsync(async (req, res) => {
  res.status(200).render("pages/signup", {
    title: "Log into Your Acount",
    bodyClass: "login-body",
  });
});

exports.getAdminPage = catchAsync(async (req, res) => {
  try {
    const tours = await Tour.find();
    const users = await User.find();
    res.status(200).render("pages/adminDashboard", {
      title: "Admin Dashboard",
      tours,
      users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Failed to load Admin page",
    });
  }
});

exports.getToursPage = catchAsync(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = 6;
  const skip = (page - 1) * limit;

  const sort = req.query.sort;
  const queryObj = {};

  if (req.query.duration === "short") queryObj.duration = { $lte: 3 };
  else if (req.query.duration === "medium")
    queryObj.duration = { $gte: 4, $lte: 7 };
  else if (req.query.duration === "long") queryObj.duration = { $gte: 8 };

  if (req.query.search) {
    queryObj.name = { $regex: req.query.search, $options: "i" };
  }
  let sortBy = "-createdAt"; // default sorting
  if (sort === "price-asc") sortBy = "price";
  if (sort === "price-desc") sortBy = "-price";
  if (sort === "ratings-desc") sortBy = "-ratingsAverage";

  const tours = await Tour.find(queryObj).sort(sortBy).skip(skip).limit(limit);

  const totalTours = await Tour.countDocuments(queryObj);
  const totalPages = Math.ceil(totalTours / limit);

  res.status(200).render("pages/allTours", {
    title: "All Tours",
    tours,
    currentPage: page,
    totalPages,
    activePage: "tours",
  });
});

exports.getTour = catchAsync(async (req, res) => {
  // 1. Get the data, for the requested tour(including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });
  // 2. Build the template
  // 3. render template using data from 1
  res.status(200).render("pages/tour", {
    title: tour.name,
    activePage: "tours",
    tour,
  });
});

exports.getContactPage = catchAsync(async (req, res) => {
  res.status(200).render("pages/contact", {
    title: "Contact Us",
    activePage: "contact",
  });
});

exports.getAboutPage = catchAsync(async (req, res) => {
  res.status(200).render("pages/about", {
    title: "About Us",
    activePage: "about",
  });
});
