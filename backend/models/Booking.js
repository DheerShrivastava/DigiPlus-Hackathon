import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      sparse: true
    },
    hoardingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hoarding",
      required: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    monthlyRate: {
      type: Number,
      required: true
    },
    totalRevenue: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "CANCELLED", "UPCOMING"],
      default: "ACTIVE"
    },
    campaignName: String,
    industry: String
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Booking", bookingSchema);