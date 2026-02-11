import cloudinary from "../configs/cloudinary.js";
import FormData from "form-data";
import axios from "axios";
import streamifier from "streamifier";
import fs from "fs";
import path from "path";
import os from "os";

export const uploadBuffer = async (buffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "video"
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          console.log("Cloudinary upload success:", result.public_id);
          resolve(result);
        }
      }
    ).end(buffer); 
  });
};

export const uploadRawAudio = async (buffer, filename) => {
  const base64 = buffer.toString("base64");

  return cloudinary.uploader.upload(
    `data:audio/mpeg;base64,${base64}`,
    {
      folder: "echofin/audio/original",
      resource_type: "raw",
      public_id: filename,
      overwrite: true
    }
  );
};

export const uploadNormalizedAudio = async (buffer, fileId) => {
  if (!fileId) {
    throw new Error("fileId is required for upload");
  }

  const tmpDir = path.join(os.tmpdir(), "echofin");
  const tmpPath = path.join(tmpDir, `${fileId}.wav`);

  await fs.promises.mkdir(tmpDir, { recursive: true });

  // write file safely
  await fs.promises.writeFile(tmpPath, buffer);

  let result;
  try {
    result = await cloudinary.uploader.upload(tmpPath, {
      resource_type: "video",
      format: "wav",
      folder: "echofin/audio/normalized"
    });
  } finally {
    fs.promises.unlink(tmpPath).catch(() => {});
  }

  return result; // MUST contain secure_url
};

export const uploadNormalizedDirect = async (buffer) => {
  const form = new FormData();

  form.append("file", buffer, {
    filename: "normalized.wav",
    contentType: "audio/wav"
  });

  form.append("upload_preset", "audio_normalized_unsigned");

  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dtzavevsb/video/upload",
    form,
    {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 300000                                                                                                                 
    }
  );

  return res.data;
};

export const uploadNormalizedStream = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        format: "wav"
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary stream upload failed:", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const uploadNormalizedChunked = async (buffer, fileId) => {
  if (!fileId) {
    throw new Error("uploadNormalizedChunked: fileId is required");
  }

  const tmpDir = path.join(os.tmpdir(), "echofin");
  const tmpPath = path.join(tmpDir, `${fileId}.wav`);

  // Ensure tmp dir exists
  await fs.promises.mkdir(tmpDir, { recursive: true });

  // Write file using stream (safer than writeFile for larger buffers)
  await new Promise((resolve, reject) => {
    const ws = fs.createWriteStream(tmpPath);
    ws.on("error", reject);
    ws.on("finish", resolve);
    ws.end(buffer);
  });

  let result;
  try {
    result = await cloudinary.uploader.upload_large(tmpPath, {
      resource_type: "video",
      format: "wav",
      folder: "echofin/audio/normalized",
      chunk_size: 6 * 1024 * 1024
    });
  } finally {
    // Cleanup AFTER upload fully finishes
    try {
      await fs.promises.unlink(tmpPath);
    } catch (_) {}
  }

  return result;
};