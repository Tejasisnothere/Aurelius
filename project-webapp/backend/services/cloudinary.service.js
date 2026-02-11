import cloudinary from "../configs/cloudinary.worker.js";
import fs from "fs";
import os from "os";
import path from "path";

export const uploadNormalizedAudio = async (buffer, fileId) => {
  if (!buffer?.length) {
    throw new Error("Empty WAV buffer");
  }

  const tmpDir = path.join(os.tmpdir(), "echofin");
  const tmpPath = path.join(tmpDir, `${fileId}.wav`);

  await fs.promises.mkdir(tmpDir, { recursive: true });
  await fs.promises.writeFile(tmpPath, buffer);

  console.log(`[${fileId}] ⬆ Uploading normalized WAV`);

  let result;
  try {
    result = await cloudinary.uploader.upload(tmpPath, {
      resource_type: "video",          
      folder: "echofin/audio/normalized",
    });
  } finally {
    fs.promises.unlink(tmpPath).catch(() => {});
  }

  if (!result?.secure_url) {
    throw new Error("Cloudinary did not return secure_url");
  }

  return result;
};
