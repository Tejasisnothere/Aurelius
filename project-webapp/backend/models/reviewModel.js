import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },

    reviewerId: {
        type: String,
        required: True
    },

    reviewerRegion: {
        type: String
    },

    rating: {
        type: Number,
        required: True
    },

    verifiedPurchase: {
        type: Boolean,
        default: false
    },

    text: {
        type: String,
    },

    helpfulVotes: {
        type: Number
    },

    title: {
        type: String
    }
})

export default mongoose.model("Review", reviewSchema);