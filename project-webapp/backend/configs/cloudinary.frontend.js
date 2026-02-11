import { v2 as cloudinary } from "cloudinary";

console.log("Cloudinary config:", {
  cloud_name: process.env.CLOUDINARY_FRONTEND_NAME,
  api_key: process.env.CLOUDINARY_FRONTEND_KEY ? "LOADED" : "MISSING",
  api_secret: process.env.CLOUDINARY_FRONTEND_SECRET ? "LOADED" : "MISSING"
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_FRONTEND_NAME,
  api_key: process.env.CLOUDINARY_FRONTEND_KEY,
  api_secret: process.env.CLOUDINARY_FRONTEND_SECRET
});

export default cloudinary;
