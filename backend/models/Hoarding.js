import mongoose from "mongoose";

const hoardingSchema = new mongoose.Schema(
  {
    hoardingId: {
      type: String,
      required: [true, "Hoarding ID is required"],
      unique: true,
      trim: true,
      index: true
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      index: true
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      index: true
    },
    latitude: {
      type: Number,
      required: [true, "Latitude is required for map placement"],
      min: [-90, "Latitude must be between -90 and 90"],
      max: [90, "Latitude must be between -90 and 90"]
    },
    longitude: {
      type: Number,
      required: [true, "Longitude is required for map placement"],
      min: [-180, "Longitude must be between -180 and 180"],
      max: [180, "Longitude must be between -180 and 180"]
    },
    area: {
      type: String,
      trim: true
    },
    size: {
      type: String,
      required: [true, "Size dimensions are required"],
      trim: true
    },
    format: {
      type: String,
      trim: true,
      default: "Billboard"
    },
    trafficScore: {
      type: Number,
      min: [0, "Traffic score must be >= 0"],
      max: [100, "Traffic score must be <= 100"],
      default: 80
    },
    visibilityScore: {
      type: Number,
      min: [0, "Visibility score must be >= 0"],
      max: [100, "Visibility score must be <= 100"],
      default: 80
    },
    monthlyRate: {
      type: Number,
      required: [true, "Monthly rate is required"],
      min: [0, "Monthly rate must be >= 0"]
    },
    bookingEndDate: {
      type: Date,
      index: true
    },
    freeFromDate: {
      type: Date,
      index: true
    },
    occupancyRate: {
      type: Number,
      min: [0, "Occupancy rate must be >= 0"],
      max: [100, "Occupancy rate must be <= 100"],
      default: 85
    },
    bookingFrequency: {
      type: Number,
      default: 20,
      min: [0, "Booking frequency must be >= 0"]
    },
    revenueGenerated: {
      type: Number,
      default: 0,
      min: [0, "Revenue generated must be >= 0"]
    },
    revenueAtRisk: {
      type: Number,
      default: 0,
      min: [0, "Revenue at risk must be >= 0"]
    },
    demandScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
      index: true
    },
    demandLevel: {
      type: String,
      enum: ["high", "medium", "low", "High", "Medium", "Low"],
      default: "medium",
      index: true
    },
    status: {
      type: String,
      default: "available",
      index: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Hoarding", hoardingSchema);