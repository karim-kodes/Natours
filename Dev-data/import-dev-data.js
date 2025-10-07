const fs = require("fs");
const mongoose = require("mongoose");
const Tour = require("../Models/tourModel");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

mongoose.connect(process.env.DATABASE).then(() => {
  console.log("DB connection successful");
});

// Read Json file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));

// Import data into DBa
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data successfully loaded!!");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data successfully deleted!!");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
