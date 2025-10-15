const Tour = require("../models/tourModel");

exports.getSignup = (req, res) => {
  res.status(200).render("pages/signup", {
    title: "Sign Up",
    bodyClass: "login-body",
  });
};

exports.getLogin = (req, res) => {
  res.status(200).render("pages/login", {
    title: "Log In",
    bodyClass: "login-body",
  });
};

exports.getHomepage = async (req, res, next) => {
  try {
    // Fetch top 4 tours (sorted by ratingsAverage or any other field)
    const tours = await Tour.find().sort({ ratingsAverage: -1 }).limit(4);

    res.status(200).render("pages/Home", {
      title: "Natours | Explore the World",
      tours,
    });
  } catch (err) {
    console.error("Error fetching tours:", err);
    res.status(500).render("error", {
      title: "Error",
      message: "Failed to load tours. Please try again later.",
    });
  }
};

exports.getToursPage = async (req, res, next) => {
  try {
    // Fetch all tours from DB
    const tours = await Tour.find();

    res.status(200).render("pages/allTours", {
      title: "All Tours",
      tours,
    });
    console.log("✅ getToursPage controller hit");

  } catch (err) {
    console.error("Error fetching tours:", err);
    res.status(500).render("error", {
      title: "error",
      message: "Failed to load tours. please try again.",
    });
  }
};
