import { reviewIngestionQueue } from "../queues/reviewIngestion.queue.js";
import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";

export const uploadCSV = async (req, res) => {
  try {
    await reviewIngestionQueue.add("process-csv", {
      filePath: `/app/${req.file.path}`,
      userId: req.user._id
    });

    res.status(202).json({
      success: true,
      message: "CSV uploaded. Processing in background."
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewsByProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.productId,
      userRef: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const reviews = await Review.find({
      productRef: product._id,
    }).sort({ reviewTimestamp: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate("productRef");

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    // Tenant protection
    if (review.productRef.userRef.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
