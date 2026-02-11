import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  { 
    type: {
      type: String,
      enum: ["audio"],
      required: true
    },

    status: {
      type: String,
      enum: ["uploaded", "normalizing", "normalized", "failed", "queued"],
      default: "uploaded"
    },

    original: {
      url: String,
      public_id: String
    },

    normalized: {
      url: String,
      public_id: String
    },

    error: {
      type: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);
