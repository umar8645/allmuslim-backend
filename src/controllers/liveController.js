// This would ideally call a live streaming API or scrape live streams
export const getLiveLectures = async (req, res) => {
  try {
    const liveLectures = [
      { title: "Live Tafsir", url: "https://example.com/live/1", speaker: "Sheikh A" },
      { title: "Live Wa'azi", url: "https://example.com/live/2", speaker: "Sheikh B" },
    ];
    res.json(liveLectures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching live lectures" });
  }
};