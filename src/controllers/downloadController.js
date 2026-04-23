import path from "path";
import fs from "fs";

// Misali: download lecture file ta ID
export const downloadLecture = (req, res) => {
  try {
    const { id } = req.params;

    // A nan zaka iya daidaita inda lecture files suke a server
    // Misali: ./uploads/lectures/<id>.pdf
    const filePath = path.join(process.cwd(), "uploads", "lectures", `${id}.pdf`);

    if (fs.existsSync(filePath)) {
      res.download(filePath, `${id}.pdf`, (err) => {
        if (err) {
          console.error("❌ Error sending file:", err);
          res.status(500).json({ error: "Error downloading file" });
        }
      });
    } else {
      res.status(404).json({ error: "Lecture file not found" });
    }
  } catch (error) {
    console.error("❌ Download error:", error.message);
    res.status(500).json({ error: "Server error during download" });
  }
};
