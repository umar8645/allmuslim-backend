import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

export const downloadLecture = async (req, res) => {
  try {
    const { id } = req.params;

    // Samu current MongoDB connection daga Mongoose
    const db = mongoose.connection.db;

    // Ƙirƙiri GridFS bucket
    const bucket = new GridFSBucket(db, {
      bucketName: "lectures" // zai yi amfani da collections: lectures.files & lectures.chunks
    });

    // Convert id zuwa ObjectId
    const fileId = new mongoose.Types.ObjectId(id);

    // Bincika ko fayil ɗin yana nan
    const files = await db.collection("lectures.files").find({ _id: fileId }).toArray();
    if (!files || files.length === 0) {
      return res.status(404).json({ error: "Lecture file not found" });
    }

    // Stream file daga GridFS zuwa response
    res.set("Content-Type", files[0].contentType || "application/octet-stream");
    res.set("Content-Disposition", `attachment; filename="${files[0].filename}"`);

    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.on("error", (err) => {
      console.error("❌ Error streaming file:", err);
      res.status(500).json({ error: "Error downloading file" });
    });

    downloadStream.pipe(res);

  } catch (error) {
    console.error("❌ Download error:", error.message);
    res.status(500).json({ error: "Server error during download" });
  }
};
