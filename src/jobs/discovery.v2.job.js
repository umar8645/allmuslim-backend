import Content from "../models/Content.js";

export async function runDiscoveryJob() {
  try {
    console.log("🔎 Discovery started...");

    const exists = await Content.findOne({ videoId: "sample123" });
    if (exists) {
      console.log("⏩ Sample already exists");
      return;
    }

    await Content.create({
      source: "youtube",
      videoId: "sample123",
      title: "Sample Islamic Video",
      description: "Auto discovered content",
      speaker: "Sample Channel",
      channelId: "channel123",
      thumbnail: "",
      language: "ha",
      country: "NG",
      qualityScore: 80,
      publishedAt: new Date(),
    });

    console.log("✅ Discovery inserted sample data");
  } catch (error) {
    console.error("❌ Discovery Error:", error.message);
  }
}