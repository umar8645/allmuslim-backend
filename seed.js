import mongoose from "mongoose";
import dotenv from "dotenv";

import Category from "./src/models/Category.js";
import Speaker from "./src/models/Speaker.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

await Category.deleteMany({});
await Speaker.deleteMany({});

await Category.insertMany([
  {
    name: "Wa’azi",
    slug: "waazi",
    image: "https://example.com/waazi.jpg"
  },
  {
    name: "Qur’ani",
    slug: "quran",
    image: "https://example.com/quran.jpg"
  },
  {
    name: "Khutbah",
    slug: "khutbah",
    image: "https://example.com/khutbah.jpg"
  }
]);

await Speaker.insertMany([
  {
    name: "Sheikh Ahmad Gumi",
    country: "NG",
    avatar: "https://example.com/gumi.jpg"
  },
  {
    name: "Dr. Zakir Naik",
    country: "IN",
    avatar: "https://example.com/zakir.jpg"
  }
]);

console.log("✅ Seed completed");
process.exit();