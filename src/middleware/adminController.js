import User from "../models/User.js";
import Video from "../models/Video.js";
import RSSFeed from "../models/RSSFeed.js";

export const dashboardStats = async (req, res) => {
  const [users, videos, rss] = await Promise.all([
    User.countDocuments(),
    Video.countDocuments(),
    RSSFeed.countDocuments()
  ]);

  res.json({
    users,
    videos,
    rssFeeds: rss
  });
};

// list users (admin only)
export const listUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};