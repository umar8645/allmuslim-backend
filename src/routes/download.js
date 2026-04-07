import express from "express";
import axios from "axios";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const fileUrl = req.query.url;

    if (!fileUrl) {
      return res.status(400).json({ error: "No URL" });
    }

    const fileName = Date.now() + ".mp4";
    const filePath = path.join("downloads", fileName);

    const writer = fs.createWriteStream(filePath);

    const response = await axios({
      url: fileUrl,
      method: "GET",
      responseType: "stream"
    });

    response.data.pipe(writer);

    writer.on("finish", () => {
      res.download(filePath);
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;