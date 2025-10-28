const mongoose = require("mongoose");
const slugify = require("slugify");

// Creating the Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      maxLength: [40, "A name must have less than 40 characters"],
      minLength: [10, "A name must have atleast 10 characters"],
      // validate: [validator.isAlpha, 'A tour name should only contain letters'],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, " A tour must have a groupsize"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty level"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: " a tour can only be easy, medium or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1.0, "a rating must be atleast 1"],
      max: [5.0, " a rating must be less or equal to 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below the actual price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Performing Reading using indexes
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });

// Creating virtual fields
tourSchema.virtual("durationweeks").get(function () {
  return this.duration / 7;
});

// Vitual populate

tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

// DOCUMENT MIDDLEWARE RUNS BEFORE .save() and .create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// Aggregation MIDDLEWARE
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});
// Creating a model of the Schema
// Creating a model of the Schema safely
const Tour = mongoose.models.Tour || mongoose.model("Tour", tourSchema);

module.exports = Tour;
