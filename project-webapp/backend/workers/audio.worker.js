import File from "../models/fileModel.js";
import { normalizeFromUrl } from "../services/audio.service.js";
import { uploadNormalizedAudio } from "../services/cloudinary.service.js";

export const processAudio = async (fileId, audioUrl) => {
  console.log(`[${fileId}] WORKER START`);

  try {
    await File.findByIdAndUpdate(fileId, { status: "normalizing" });

    const wavBuffer = await normalizeFromUrl(audioUrl);
    console.log(`[${fileId}] WAV size ${(wavBuffer.length / 1e6).toFixed(2)} MB`);

    const uploaded = await uploadNormalizedAudio(wavBuffer, fileId);

    await File.findByIdAndUpdate(fileId, {
      status: "normalized",
      normalized: {
        url: uploaded.secure_url,
        public_id: uploaded.public_id
      }
    });

    console.log(`[${fileId}] DONE`);
  } catch (err) {
    console.error(`[${fileId}] FAILED`, err);

    await File.findByIdAndUpdate(fileId, {
      status: "failed",
      error: err.message
    });
  }
};
