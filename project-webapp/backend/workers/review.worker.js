import { Worker } from "bullmq";
import fs from "fs";
import csv from "csv-parser";
import {redis} from "../configs/redis.js";
import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";

const BATCH_SIZE = 1000;

new Worker(
  "review-ingestion",
  async (job) => {
    const { filePath, userId } = job.data;

    const productCache = new Map();
    const batch = [];

    const stream = fs.createReadStream(filePath).pipe(csv());

    for await (const row of stream) {

      // Find or create product (using ASIN)
      let product = productCache.get(row.asin);

      if (!product) {
        product = await Product.findOne({
          externalProductId: row.asin,
          userRef: userId
        });

        if (!product) {
          product = await Product.create({
            name: row.asin,
            category: "amazon",
            userRef: userId,
            externalProductId: row.asin,
            parentExternalId: row.parent_asin
          });
        }

        productCache.set(row.asin, product);
      }

      // Transform row → Mongo format
      batch.push({
        productRef: product._id,
        externalProductId: row.asin,
        parentExternalId: row.parent_asin,
        reviewerId: row.user_id,
        rating: Number(row.rating),
        title: row.title,
        text: row.text,
        helpfulVotes: Number(row.helpful_votes || 0),
        verifiedPurchase: row.verified_purchase === "TRUE",
        reviewTimestamp: new Date(Number(row.timestamp))
      });

      // 3️⃣ Batch insert
      if (batch.length >= BATCH_SIZE) {
        await Review.insertMany(batch, { ordered: false });
        batch.length = 0;
      }
    }

    // Insert remaining
    if (batch.length > 0) {
      await Review.insertMany(batch, { ordered: false });
    }

    // Cleanup uploaded file
    fs.unlinkSync(filePath);

    return { success: true };
  },
  { connection: redis }
);