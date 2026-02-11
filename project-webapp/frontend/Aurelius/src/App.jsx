import { useState } from "react";
import { backend, cloudinaryUpload } from "./api";
import "./App.css";

/* =======================
   SIMPLE ASYNC QUEUE
   ======================= */

const queue = [];
let active = 0;

// ⚠️ KEEP THIS AT 1 for now
const MAX_CONCURRENT_JOBS = 1;

const enqueueUploadJob = (jobFn) => {
  queue.push(jobFn);
  runNext();
};

const runNext = async () => {
  if (active >= MAX_CONCURRENT_JOBS) return;
  if (queue.length === 0) return;

  const job = queue.shift();
  active++;

  try {
    await job();
  } catch (err) {
    console.error("Upload job failed:", err);
  } finally {
    active--;
    runNext();
  }
};

/* =======================
   APP
   ======================= */

export default function App() {
  const [files, setFiles] = useState([]);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [stage, setStage] = useState("idle");

  const handleFileSelect = (e) => {
    setFiles([...e.target.files]);
    setUploadedCount(0);
  };

  const uploadAllFiles = () => {
    if (files.length === 0) return;

    setStage("uploading");

    files.forEach((file) => {
      enqueueUploadJob(async () => {
        await uploadSingleFile(file);
        setUploadedCount((prev) => prev + 1);
      });
    });

    setFiles([]);
  };

  const uploadSingleFile = async (file) => {
    try {
      /* 1️⃣ Upload to Cloudinary (frontend) */
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "audio_unsigned");

      const cloudinaryRes = await cloudinaryUpload.post(
        "/auto/upload",
        formData
      );

      if (!cloudinaryRes.data.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      /* 2️⃣ Register with backend (enqueue worker job) */
      setStage("registering");

      await backend.post("/file/register", {
        secure_url: cloudinaryRes.data.secure_url,
        public_id: cloudinaryRes.data.public_id
      });
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setStage("idle");
    }
  };

  return (
    <div className="page">
      <header>
        <h1>EchoFin Audio Upload</h1>
        <p>Safe, throttled audio uploads</p>
      </header>

      <div className="card">
        <label className="file-drop">
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileSelect}
          />

          {files.length > 0 ? (
            <div>
              <strong>{files.length} file(s) selected</strong>
              <span>{uploadedCount} uploaded</span>
            </div>
          ) : (
            <span>Click to select audio files</span>
          )}
        </label>

        <button
          disabled={files.length === 0 || stage === "uploading"}
          onClick={uploadAllFiles}
        >
          Upload Files
        </button>
      </div>

      <div className="card status">
        <Status
          label="Uploading to Cloudinary"
          active={stage === "uploading"}
          done={uploadedCount > 0}
        />
        <Status
          label="Registering with backend"
          active={stage === "registering"}
          done={stage === "idle" && uploadedCount > 0}
        />
      </div>
    </div>
  );
}

/* =======================
   STATUS UI
   ======================= */

function Status({ label, active, done }) {
  return (
    <div className={`status-row ${active ? "active" : ""}`}>
      <span className="dot">
        {done ? "✔" : active ? "…" : "○"}
      </span>
      <span>{label}</span>
    </div>
  );
}
