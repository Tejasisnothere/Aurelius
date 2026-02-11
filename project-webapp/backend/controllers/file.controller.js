import File from "../models/fileModel.js";
import { processAudio } from "../workers/audio.worker.js";
import { enqueueUploadJob } from "../queues/upload.queue.js";
import { normalizationQueue } from "../queues/normalization.queue.js";

export const registerFile = async (req, res) => {
  try {
    const { secure_url, public_id } = req.body;

    if (!secure_url || !public_id) {
      return res.status(400).json({ message: "Missing file data" });
    }

    // respond immediately
    res.status(202).json({
      message: "Upload accepted"
    });

    // queue DB write
    enqueueUploadJob(async () => {
      console.log("Registering file:", public_id);

      const file = await File.create({
        type: "audio",
        status: "uploaded",
        original: {
          url: secure_url,
          public_id
        }
      });

      console.log("File registered:", file._id);

      // DIRECTLY enqueue normalization job into Redis
      await normalizationQueue.add(
        "normalize",
        {
          fileId: file._id.toString(),
          audioUrl: secure_url
        },
        {
          jobId: file._id.toString(), // idempotent
          attempts: 1,            //  no retries
          removeOnComplete: true, //  cleanup
          removeOnFail: true,     //  cleanup
          backoff: false 
        }
      );

      // update status to reflect queueing
      await File.findByIdAndUpdate(file._id, {
        status: "queued"
      });

      console.log("Normalization job enqueued:", file._id);
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Register failed" });
  }
};

export const normalizeFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (file.status !== "uploaded") {
      return res.status(400).json({
        message: "File already processed or processing"
      });
    }

    
    processAudio(file._id, file.original.url);

    res.json({
      message: "Normalization started",
      status: "normalizing"
    });
  } catch (err) {
    console.error("NORMALIZE ERROR:", err);
    res.status(500).json({ message: "Failed to start normalization" });
  }
};

export const getFileStatus = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json({
      file_id: file._id,
      status: file.status,
      normalized: file.normalized || null,
      error: file.error || null
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch status" });
  }
};