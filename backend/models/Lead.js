import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    leadId: {
      type: String,
      unique: true,
      sparse: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },
    hoardingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hoarding",
      required: true
    },
    industryFit: {
      type: Number,
      min: 0,
      max: 25,
      default: 20
    },
    budgetFit: {
      type: Number,
      min: 0,
      max: 25,
      default: 20
    },
    historicalBookingMatch: {
      type: Number,
      min: 0,
      max: 25,
      default: 20
    },
    relationshipStrength: {
      type: Number,
      min: 0,
      max: 25,
      default: 20
    },
    leadScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    priority: {
      type: String,
      enum: ["HIGH", "MEDIUM", "LOW"],
      default: "HIGH"
    },
    reasoning: [String],
    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "REJECTED"],
      default: "NEW"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Lead", leadSchema);
