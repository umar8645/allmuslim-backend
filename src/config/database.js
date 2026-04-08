import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // ✅ Ƙarin options don guje wa warning
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected:", mongoose.connection.host);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }

  // ✅ Event listeners don debugging
  mongoose.connection.on("connected", () => {
    console.log("📡 Mongoose connected to DB");
  });

  mongoose.connection.on("error", (err) => {
    console.error("⚠ Mongoose connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("🔌 Mongoose disconnected");
  });
};

export default connectDB;
