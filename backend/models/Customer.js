import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      unique: true,
      sparse: true
    },
    name: {
      type: String,
      required: true
    },
    companyName: {
      type: String,
      required: true
    },
    industry: {
      type: String,
      required: true,
      index: true
    },
    email: String,
    phone: String,
    budgetMin: {
      type: Number,
      default: 0
    },
    budgetMax: {
      type: Number,
      default: 0
    },
    budgetBand: String,
    relationshipScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 75,
      index: true
    },
    totalBookings: {
      type: Number,
      default: 0
    },
    totalSpend: {
      type: Number,
      default: 0,
      index: true
    },
    preferredCities: [String],
    preferredLocations: [String],
    preferredHoardingSizes: [String],
    lastBookingDate: Date,
    bookingFrequency: String,
    customerStatus: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "PROSPECT"],
      default: "ACTIVE",
      index: true
    },
    website: String,
    notes: String
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Customer", customerSchema);