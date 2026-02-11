import { Redis } from "ioredis";

export const redis = new Redis({
  host: "redis",   //service added here so that I don't have to manually call host ip and all this happens from the dockerfile
  port: 6379,
  maxRetriesPerRequest: null
});