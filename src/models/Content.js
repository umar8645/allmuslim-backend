const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema(
  {
    title: String,
    speaker: String,
    dateTime: Date,
    location: String,
    sourceUrl: String,
    mediaThumbnail: String,
    sourceType: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Content", ContentSchema, "contents");