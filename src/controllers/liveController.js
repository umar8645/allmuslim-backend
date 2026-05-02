import LiveLecture from "../models/LiveLecture.js";
import { io } from "../server.js";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

// ✅ Helper: process video with FFmpeg
const processVideo = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    const command = `ffmpeg -i "${inputPath}" -vf "scale=1280:720,eq=contrast=1.2:brightness=0.05" -c:v libx264 -preset fast -b:v 1500k -c:a aac "${outputPath}"`;
    exec(command, (error) => {
      if (error) {
        console.error("❌ FFmpeg error:", error.message);
        reject(error);
      } else {
        resolve(outputPath);
      }
    });
  });
};

// ✅ Get all live lectures
export const getLiveLectures = async (req, res) => {
  try {
    const lectures = await LiveLecture.find().sort({ createdAt: -1 });
    res.json({ success: true, lectures });
  } catch (error) {
    console.error("❌ Fetch error:", error.message);
    res.status(500).json({ success: false, message: "Error fetching live lectures" });
  }
};

// ✅ Upload new live lecture video
export const uploadLiveLecture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No video uploaded" });
    }

    const inputPath = req.file.path;
    const outputPath = path.join("uploads", `processed-${Date.now()}.mp4`);

    // 🔥 Process video with FFmpeg
    await processVideo(inputPath, outputPath);

    const { title, scholar, thumbnail } = req.body;
    const lecture = await LiveLecture.create({
      title,
      url: `/uploads/${path.basename(outputPath)}`,
      scholar,
      thumbnail: thumbnail || ""
    });

    // 🔥 Emit real-time update
    io.emit("newLecture", lecture);

    // ✅ Clean up raw file
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);

    res.status(201).json({ success: true, lecture });
  } catch (error) {
    console.error("❌ Upload error:", error.message);
    res.status(500).json({ success: false, message: "Error uploading lecture" });
  }
};

// ✅ Delete live lecture
export const deleteLiveLecture = async (req, res) => {
  try {
    const lecture = await LiveLecture.findByIdAndDelete(req.params.id);
    if (!lecture) {
      return res.status(404).json({ success: false, message: "Lecture not found" });
    }

    io.emit("deleteLecture", { id: req.params.id });
    res.json({ success: true, message: "Lecture deleted successfully" });
  } catch (error) {
    console.error("❌ Delete error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
