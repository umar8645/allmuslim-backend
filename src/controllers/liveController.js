export const getLiveLectures = async (req, res) => {
  try {
    const liveLectures = [
      { title: "Live Tafsir", url: "https://example.com/live/1", speaker: "Sheikh A" },
      { title: "Live Khutbah", url: "https://example.com/live/2", speaker: "Sheikh B" },
    ];
    res.json(liveLectures);
  } catch (error) {
    res.status(500).json({ message: "Error fetching live lectures" });
  }
};
