// populateLibraryAndNotifications.js
import mongoose from "mongoose";
import dotenv from "dotenv";

// ✅ DAIDAI PATHS (src/models)
import LibraryItem from "./src/models/LibraryItem.js";
import Notification from "./src/models/Notification.js";
import Video from "./src/models/Video.js";
import RSSFeed from "./src/models/RSSFeed.js";
import Content from "./src/models/Content.js";

dotenv.config();

// =====================
// MongoDB Connection
// =====================
mongoose.set("strictQuery", true);

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

// =====================
// Populate Library
// =====================
async function populateLibrary() {
  // RSS → Library
  const rssItems = await RSSFeed.find();
  for (const item of rssItems) {
    await LibraryItem.updateOne(
      { sourceUrl: item.sourceUrl },
      {
        title: item.title,
        speaker: item.speaker || "Unknown",
        publishedAt: item.dateTime || new Date(),
        sourceUrl: item.sourceUrl,
      },
      { upsert: true }
    );
  }

  // Videos → Library
  const videos = await Video.find();
  for (const video of videos) {
    const url = `https://youtube.com/watch?v=${video.videoId}`;
    await LibraryItem.updateOne(
      { sourceUrl: url },
      {
        title: video.title,
        speaker: video.speaker || "Unknown",
        publishedAt: video.publishedAt || new Date(),
        sourceUrl: url,
      },
      { upsert: true }
    );
  }

  console.log("✅ Library populated");
}

// =====================
// Populate Notifications
// =====================
async function populateNotifications() {
  const latestRSS = await RSSFeed.find().sort({ dateTime: -1 }).limit(10);
  for (const item of latestRSS) {
    await Notification.updateOne(
      { message: `New RSS: ${item.title}` },
      { message: `New RSS: ${item.title}` },
      { upsert: true }
    );
  }

  const latestVideos = await Video.find().sort({ publishedAt: -1 }).limit(10);
  for (const video of latestVideos) {
    await Notification.updateOne(
      { message: `New Video: ${video.title}` },
      { message: `New Video: ${video.title}` },
      { upsert: true }
    );
  }

  const latestWaazi = await Content.find().sort({ dateTime: -1 }).limit(10);
  for (const item of latestWaazi) {
    await Notification.updateOne(
      { message: `New Waazi: ${item.title}` },
      { message: `New Waazi: ${item.title}` },
      { upsert: true }
    );
  }

  console.log("✅ Notifications populated");
}

// =====================
// RUN
// =====================
(async () => {
  await connectDB();
  await populateLibrary();
  await populateNotifications();
  await mongoose.connection.close();
  console.log("🎉 DONE");
})();