import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["audio"],
      required: true,
    },

    status: {
      type: String,
      enum: ["uploaded", "normalizing", "normalized", "failed", "queued"],
      default: "uploaded",
    },

    original: {
      url: String,
      public_id: String,
    },

    normalized: {
      url: String,
      public_id: String,
    },

    error: {
      type: String,
    },

    aiStatus: {
      type: String,
      enum: ["pending", "sent", "processed", "failed"],
      default: "pending",
    },

    aiResults: {
      sentimentScore: Number,
      intent: String,
      aspects: [
        {
          name: String,
          score: Number,
        },
      ],
      churnRiskScore: Number,
    },

    productRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true },
);

fileSchema.index({ productRef: 1 });
fileSchema.index({ status: 1 });
fileSchema.index({ aiStatus: 1 });
fileSchema.index({ createdAt: -1 });

export default mongoose.model("File", fileSchema);
