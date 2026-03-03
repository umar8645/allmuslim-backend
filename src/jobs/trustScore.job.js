import Content from "../models/Content.js";

export async function runTrustScoreJob() {
  try {
    console.log("⭐ Trust score update started...");

    const contents = await Content.find();

    for (const item of contents) {
      // simple example logic
      const newScore = item.qualityScore + 1;

      await Content.updateOne(
        { _id: item._id },
        { qualityScore: newScore }
      );
    }

    console.log("✅ Trust score update completed");
  } catch (error) {
    console.error("❌ Trust Score Error:", error.message);
  }
}