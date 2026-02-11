import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

console.log("Using FFmpeg binary at:", ffmpegPath);

ffmpeg.setFfmpegPath(ffmpegPath);

const normaliseAudio = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioChannels(1)
      .audioFrequency(16000)
      .audioCodec("pcm_s16le")
      .format("wav")
      .on("start", cmd => console.log("FFmpeg command:", cmd))
      .on("end", () => resolve(outputPath))
      .on("error", err => reject(err))
      .save(outputPath);
  });
};

export default normaliseAudio;
