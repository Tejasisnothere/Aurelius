import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },

    reviewerId: {
        type: String,
        required: true
    },

    reviewerRegion: {
        type: String
    },

    rating: {
        type: Number,
        required: true
    },

    verifiedPurchase: {
        type: Boolean,
        default: false
    },

    text: {
        type: String,
    },

    helpfulVotes: {
        type: Number,
        default: 0
    },

    title: {
        type: String
    },

    aiStatus: {
        type: String,
        enum: ["pending", "sent", "processed", "failed"],
        default: "pending"
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
}, {timestamps: true});

reviewSchema.index({ productRef: 1 });
reviewSchema.index({ aiStatus: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ reviewerRegion: 1 });

export default mongoose.model("Review", reviewSchema);