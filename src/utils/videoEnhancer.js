import cv2 from "opencv4nodejs";
import fs from "fs";

// Simple denoising + sharpening pipeline
export const enhanceVideo = async (inputPath, outputPath) => {
  const cap = new cv2.VideoCapture(inputPath);
  const frameWidth = cap.get(cv2.CAP_PROP_FRAME_WIDTH);
  const frameHeight = cap.get(cv2.CAP_PROP_FRAME_HEIGHT);
  const fps = cap.get(cv2.CAP_PROP_FPS);

  const out = new cv2.VideoWriter(
    outputPath,
    cv2.VideoWriter.fourcc("H", "2", "6", "4"),
    fps,
    new cv2.Size(frameWidth, frameHeight)
  );

  let frame;
  while (true) {
    frame = cap.read();
    if (frame.empty) break;

    // ✅ Denoise
    let denoised = frame.gaussianBlur(new cv2.Size(3, 3), 0);

    // ✅ Sharpen
    const kernel = new cv2.Mat([
      [-1, -1, -1],
      [-1, 9, -1],
      [-1, -1, -1]
    ], cv2.CV_32F);
    let sharpened = denoised.filter2D(-1, kernel);

    out.write(sharpened);
  }

  cap.release();
  out.release();
  fs.unlinkSync(inputPath); // clean up raw file
};
