import File from "../models/fileModel.js";
import { uploadBuffer } from "../services/cloudinary.service.js";
import { processAudio } from "../workers/audio.worker.js";
import { uploadRawAudio } from "../services/cloudinary.service.js";

export const uploadAudiott = async (req, res) => {
  try {
    console.log("REQ.FILE:", req.file);

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("⬆ Uploading original audio to Cloudinary...");

    const uploaded = await uploadBuffer(
      file.buffer,
      "echofin/audio/original"
    );

    const doc = await File.create({
      type: "audio",
      status: "uploaded",
      original: {
        url: uploaded.secure_url,
        public_id: uploaded.public_id
      }
    });

    // async processing
    processAudio(doc._id, uploaded.secure_url);

    res.status(201).json({
      file_id: doc._id,
      status: doc.status
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export const uploadAudio = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("⬆ Uploading original audio (RAW)…");

    const uploaded = await uploadRawAudio(
      file.buffer,
      file.originalname.split(".")[0]
    );

    const doc = await File.create({
      type: "audio",
      status: "uploaded",
      original: {
        url: uploaded.secure_url,
        public_id: uploaded.public_id
      }
    });

    processAudio(doc._id, uploaded.secure_url);

    res.status(201).json({
      file_id: doc._id,
      status: doc.status
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
