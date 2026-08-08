import mongoose from "mongoose";

const outreachSchema = new mongoose.Schema(
  {
    outreachId: {
      type: String,
      unique: true,
      sparse: true
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead"
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
    channel: {
      type: String,
      default: "EMAIL"
    },
    subject: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    offer: String,
    cta: String,
    status: {
      type: String,
      enum: ["DRAFT", "PENDING", "SCHEDULED", "SENT", "FAILED"],
      default: "PENDING",
      index: true
    },
    scheduledAt: Date,
    sentAt: Date
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Outreach", outreachSchema);