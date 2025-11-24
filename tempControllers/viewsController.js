const Tour = require("../models/tourModel");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);
const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");

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
      title: "Explore Kenya's Beauty",
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

exports.getMe = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id);
  const bookings = await Booking.find({ user: req.user.id }).populate("tour");
  const reviews = await Review.find({ user: req.user.id }).populate("tour");
  res.status(200).render("pages/userProfile", {
    title: "Profile",
    user,
    bookings,
    reviews,
  });
});

exports.getCheckout = catchAsync(async (req, res) => {
  const tour = await Tour.findById(req.params.tourId);
  if (!tour) {
    return res.status(404).render("error", { message: "Tour not found" });
  }
  res.status(200).render("pages/checkoutPage", {
    title: "checkout",
    tour,
  });
});

exports.getAdminDashboard = catchAsync(async (req, res) => {
  // --- 1. Overview Stats ---
  const totalBookings = await Booking.countDocuments();
  const totalTours = await Tour.countDocuments();
  const totalReviews = await Review.countDocuments();

  // Stats last week
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const [lastWeekBookings, lastWeekTours, lastWeekReviews] = await Promise.all([
    Booking.countDocuments({ createdAt: { $gte: lastWeek } }),
    Tour.countDocuments({ createdAt: { $gte: lastWeek } }),
    Review.countDocuments({ createdAt: { $gte: lastWeek } }),
  ]);

  const calcPercent = (curr, prev) => {
    if (!prev || prev === 0) return "0%";
    const diff = ((curr - prev) / prev) * 100;
    return (diff > 0 ? "+" : "") + diff.toFixed(2) + "%";
  };

  const overviewStats = {
    totalBookings,
    totalTours,
    totalReviews,
    bookingsPercent: calcPercent(totalBookings, lastWeekBookings),
    toursPercent: calcPercent(totalTours, lastWeekTours),
    reviewsPercent: calcPercent(totalReviews, lastWeekReviews),
  };

  // --- 2. Recent Bookings & Latest Tours ---
  const [recentBookings, latestTours] = await Promise.all([
    Booking.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("user", "name photo")
      .populate("tour", "name imageCover")
      .lean(),
    Tour.find().sort({ createdAt: -1 }).limit(3).lean(),
  ]);

  const formattedRecentBookings = recentBookings.map((b) => ({
    ...b,
    timeAgo: dayjs(b.createdAt).fromNow(),
  }));

  // --- 3. Top Tour (Most Booked) ---
  const topTourAgg = await Booking.aggregate([
    { $group: { _id: "$tour", totalBookings: { $sum: 1 } } },
    { $sort: { totalBookings: -1 } },
    { $limit: 1 },
  ]);

  let topTour = null;

  if (topTourAgg.length > 0) {
    const tourId = topTourAgg[0]._id;
    const tour = await Tour.findById(tourId).lean();
    const totalRatings = await Review.countDocuments({ tour: tourId });

    if (tour) {
      topTour = {
        name: tour.name,
        imageCover: tour.imageCover,
        totalBookings: topTourAgg[0].totalBookings,
        totalRatings,
      };
    }
  }

  // --- 4. Tables (for server-side pagination, only fetch first page) ---
  const limit = 100; // default rows per page
  const bookings = await Booking.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("user", "name photo")
    .populate("tour", "name")
    .lean();

  const tours = await Tour.find().sort({ createdAt: -1 }).limit(limit).lean();
  const reviews = await Review.find()
    .sort({ createdAt: -1 })
    .populate("user", "name photo")
    .populate("tour", "name")
    .limit(limit)
    .lean();

  const users = await User.find()
    .select("+isActive")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  // --- 5. Render Dashboard ---
  res.status(200).render("pages/adminDashboard", {
    title: "Admin Dashboard",
    overviewStats,
    recentBookings: formattedRecentBookings,
    latestTours,
    topTour,
    bookings,
    tours,
    reviews,
    users,
    admin: req.user,
  });
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
