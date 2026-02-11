import axios from "axios";

export const backend = axios.create({
  baseURL: "http://localhost:8000"
});

export const cloudinaryUpload = axios.create({
  baseURL: "https://api.cloudinary.com/v1_1/dtzavevsb"
});