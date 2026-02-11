import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    name: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true,
        enum: []
    },
    
    rating: {
        type: Number,
        min: 0.0,
        max: 5.0
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
    },
}, {timestamps: true});

productSchema.index({ userRef: 1 });
productSchema.index({ category: 1 });

export default mongoose.model("Product", productSchema);