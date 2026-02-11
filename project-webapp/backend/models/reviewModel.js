import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    externalProductId: {   // ASIN
        type: String,
        required: true
    },

    parentExternalId: {    // parent_asin
        type: String
    },

    reviewerId: {          // user_id from Amazon
        type: String,
        required: true
    },

    reviewerRegion: {
        type: String
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    title: {
        type: String,
        trim: true
    },

    text: {
        type: String,
        trim: true
    },

    images: [
        {
            type: String            // can be ignored for now 
        }
    ],

    helpfulVotes: {
        type: Number,
        default: 0
    },

    verifiedPurchase: {
        type: Boolean,
        default: false
    },

    reviewTimestamp: {   // from CSV timestamp column
        type: Date
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
                score: Number
            }
        ],
        churnRiskScore: Number
    }

}, { timestamps: true });

reviewSchema.index({ productRef: 1, reviewTimestamp: -1 });

reviewSchema.index({ aiStatus: 1 });

reviewSchema.index(
  { externalProductId: 1, reviewerId: 1 },
  { unique: true }
);

export default mongoose.model("Review", reviewSchema);