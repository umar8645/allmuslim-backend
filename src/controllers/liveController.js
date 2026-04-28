// liveController.js
export const getLiveLectures = async (req, res) => {
  try {
    const liveLectures = [
      {
        title: "Live Tafsir",
        url: "https://example.com/live/1",
        scholar: "Sheikh A",   // ✅ gyara daga speaker zuwa scholar
        thumbnail: ""          // ✅ ƙara thumbnail don dacewa da Lecture model
      },
      {
        title: "Live Khutbah",
        url: "https://example.com/live/2",
        scholar: "Sheikh B",   // ✅ gyara daga speaker zuwa scholar
        thumbnail: ""
      }
    ];
    res.json(liveLectures);
  } catch (error) {
    res.status(500).json({ message: "Error fetching live lectures" });
  }
};
