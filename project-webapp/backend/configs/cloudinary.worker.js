import { v2 as cloudinary } from "cloudinary";

console.log("Cloudinary config:", {
  cloud_name: process.env.CLOUDINARY_WORKER_NAME,
  api_key: process.env.CLOUDINARY_WORKER_KEY ? "LOADED" : "MISSING",
  api_secret: process.env.CLOUDINARY_WORKER_SECRET ? "LOADED" : "MISSING"
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_WORKER_NAME,
  api_key: process.env.CLOUDINARY_WORKER_KEY,
  api_secret: process.env.CLOUDINARY_WORKER_SECRET
});

export default cloudinary;