// middleware/sanitizeUrl.js
export const sanitizeUrl = (req, res, next) => {
  try {
    let { url, platform, thumbnail } = req.body;

    if (!url) return res.status(400).json({ message: "URL is required" });

    if (platform === "youtube" && !url.startsWith("http")) {
      url = `https://www.youtube.com/watch?v=${url}`;
    }

    if (!url.startsWith("http")) {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    if (thumbnail && !thumbnail.startsWith("http")) {
      thumbnail = "";
    }

    req.body.url = url;
    req.body.thumbnail = thumbnail;
    next();
  } catch (error) {
    res.status(500).json({ message: "Error sanitizing URL" });
  }
};
