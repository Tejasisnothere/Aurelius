import { Queue } from "bullmq";
import {redis} from "../configs/redis.js";

export const reviewIngestionQueue = new Queue (
    "review-ingestion",
    {connection: redis}
)