import axios from "axios";
import fs from "fs";
import path from "path";

export const downloadLecture = async (req, res) => {
  try {
    const { url, type } = req.query; // type: video or audio
    if (!url || !type) return res.status(400).json({ message: "URL and type required" });

    // Example: download file to server
    const fileName = path.basename(url);
    const filePath = path.join("./downloads", fileName);

    const response = await axios({ url, responseType: "stream" });
    response.data.pipe(fs.createWriteStream(filePath));
    
    response.data.on("end", () => res.download(filePath));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error downloading lecture" });
  }
};