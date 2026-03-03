// src/services/downloadLink.service.js
import jwt from "jsonwebtoken";

export function generateDownloadLink(job) {
  const token = jwt.sign(
    { jobId: job._id },
    process.env.DOWNLOAD_SECRET,
    { expiresIn: "15m" }
  );

  return `/api/download/file/${token}`;
}