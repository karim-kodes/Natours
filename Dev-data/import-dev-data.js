const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/userModel");
const Tour = require("../models/tourModel");
const Booking = require("../models/bookingModel");
const Review = require("../models/reviewModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log("DB connection successfull!!!");
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);
const bookings = JSON.parse(
  fs.readFileSync(`${__dirname}/bookings.json`, "utf-8")
);

// ✅ Check that all review references exist
// const reviewIssues = reviews.filter((r) => {
//   const tourExists = tours.some((t) => t._id === r.tour);
//   const userExists = users.some((u) => u._id === r.user);
//   return !tourExists || !userExists;
// });

// if (reviewIssues.length > 0) {
//   console.log("⚠️ Reviews referencing missing tours or users:");
//   console.log(reviewIssues);
// } else {
//   console.log("✅ All reviews reference valid tours and users!");
// }

// Importing data into database
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    await Booking.create(bookings);
    console.log("Data Successfully loaded!!!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    // await Booking.deleteMany();
    console.log("Data deleted successfully!!!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
