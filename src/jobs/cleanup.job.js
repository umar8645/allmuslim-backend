import Content from "../models/Content.js";

export async function runCleanupJob() {
  try {
    console.log("🧹 Cleanup started...");

    // Example: delete content older than 90 days
    const days90 = new Date();
    days90.setDate(days90.getDate() - 90);

    await Content.deleteMany({
      publishedAt: { $lt: days90 },
    });

    console.log("✅ Cleanup completed");
  } catch (error) {
    console.error("❌ Cleanup Error:", error.message);
  }
}