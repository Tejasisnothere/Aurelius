import { Queue } from "bullmq";
import { redis } from "../configs/redis.js";

export const normalizationQueue = new Queue("audio-normalization", {
  connection: redis
});