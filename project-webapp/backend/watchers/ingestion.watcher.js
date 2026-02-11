import chokidar from "chokidar";
import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";

const WATCH_DIR = "/watch-folder";
const BACKEND_URL = "http://echofin-api:8000/file/register";

const ALLOWED_EXTENSIONS = [".mp3", ".mpeg", ".wav", ".m4a", ".aac"];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const isAudioFile = (filePath) =>
  ALLOWED_EXTENSIONS.includes(path.extname(filePath).toLowerCase());

const isFileStable = async (filePath) => {
  let lastSize = -1;

  for (let i = 0; i < 3; i++) {
    const { size } = await fs.promises.stat(filePath);
    if (size === lastSize) return true;
    lastSize = size;
    await sleep(2000);
  }

  return false;
};

const ingestFile = async (filePath) => {
  const fileName = path.basename(filePath);

  console.log("Event received:", filePath);

  try {
    if (!isAudioFile(filePath)) {
      console.log("Skipping non-audio:", fileName);
      return;
    }

    const stable = await isFileStable(filePath);
    if (!stable) {
      console.warn("File not stable, skipping:", fileName);
      return;
    }

    console.log("Ingesting:", fileName);

    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));
    form.append("upload_preset", "audio_unsigned");

    const cloudinaryRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_FRONTEND_NAME}/video/upload`,
      form,
      { headers: form.getHeaders() }
    );

    if (!cloudinaryRes.data?.secure_url) {
      throw new Error("Cloudinary upload failed");
    }

    await axios.post(BACKEND_URL, {
      secure_url: cloudinaryRes.data.secure_url,
      public_id: cloudinaryRes.data.public_id
    });

    console.log("Queued for normalization:", fileName);

    const processedDir = path.join(WATCH_DIR, "processed");
    await fs.promises.mkdir(processedDir, { recursive: true });

    await fs.promises.rename(
      filePath,
      path.join(processedDir, fileName)
    );

    console.log("📦 Moved to processed:", fileName);

  } catch (err) {
    console.error("Ingestion failed:", fileName, err.message);
  }
};

console.log("Watching folder:", WATCH_DIR);

const watcher = chokidar.watch(WATCH_DIR, {
  persistent: true,
  ignoreInitial: false,
  depth: 0,

  usePolling: true,
  interval: 1000,          // poll every 1s
  binaryInterval: 1000,

  awaitWriteFinish: {
    stabilityThreshold: 3000,
    pollInterval: 1000
  }
});

watcher
  .on("ready", () => {
    console.log("Watcher is ready");
  })
  .on("add", (filePath) => {
    console.log("add:", filePath);
    ingestFile(filePath);
  })
  .on("change", (filePath) => {
    console.log("change:", filePath);
    ingestFile(filePath);
  })
  .on("error", (err) => {
    console.error("Watcher error:", err);
  }
);