import mongoose from "mongoose";
import Lecture from "../models/Lecture.js";
import History from "../models/History.js";
import ytdl from "ytdl-core";
import axios from "axios";

export const downloadLecture = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, userId } = req.query; // audio/video + userId daga frontend

    // Nemo lecture daga DB
    const lecture = await Lecture.findById(id);
    if (!lecture) {
      return res.status(404).json({ error: "Lecture not found" });
    }

    if (!lecture.url) {
      return res.status(400).json({ error: "Lecture has no downloadable URL" });
    }

    // 🔥 Increment views count
    lecture.views = (lecture.views || 0) + 1;
    await lecture.save();

    // 🔥 Save history
    if (userId) {
      await History.create({
        user: userId,
        lectureTitle: lecture.title,
        lectureUrl: lecture.url,
        type: type || "video"
      });
    }

    // Idan lecture daga YouTube ne
    if (lecture.platform === "youtube") {
      const videoUrl = `https://www.youtube.com/watch?v=${lecture.url}`;

      if (type === "audio") {
        res.setHeader("Content-Disposition", `attachment; filename="${lecture.title || "lecture"}.mp3"`);
        res.setHeader("Content-Type", "audio/mpeg");

        ytdl(videoUrl, { quality: "highestaudio", filter: "audioonly" })
          .on("error", (err) => {
            console.error("❌ Error streaming YouTube audio:", err);
            res.status(500).json({ error: "Error downloading audio" });
          })
          .pipe(res);
      } else {
        res.setHeader("Content-Disposition", `attachment; filename="${lecture.title || "lecture"}.mp4"`);
        res.setHeader("Content-Type", "video/mp4");

        ytdl(videoUrl, { quality: "highestvideo" })
          .on("error", (err) => {
            console.error("❌ Error streaming YouTube video:", err);
            res.status(500).json({ error: "Error downloading video" });
          })
          .pipe(res);
      }
    } else {
      // Idan lecture.url direct mp3/mp4 ne
      const response = await axios.get(lecture.url, { responseType: "stream" });

      res.setHeader("Content-Disposition", `attachment; filename="${lecture.title || "lecture"}"`);
      res.setHeader("Content-Type", response.headers["content-type"] || "application/octet-stream");

      response.data.pipe(res);
    }
  } catch (error) {
    console.error("❌ Download error:", error.message);
    res.status(500).json({ error: "Server error during download" });
  }
};
