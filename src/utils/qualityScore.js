export function calculateQualityScore(video) {
  let score = 0;

  // 1️⃣ Title quality
  if (video.title.length > 30) score += 10;
  if (!video.title.match(/episode|part\s?\d+/i)) score += 5;

  // 2️⃣ Description depth
  if (video.description?.length > 100) score += 15;
  if (video.description?.length > 300) score += 10;

  // 3️⃣ Thumbnail quality
  if (video.thumbnail) score += 10;

  // 4️⃣ Freshness
  const ageDays =
    (Date.now() - new Date(video.publishedAt)) / 86400000;
  if (ageDays <= 7) score += 15;
  else if (ageDays <= 30) score += 10;

  // 5️⃣ Speaker credibility (soft check)
  if (
    /(sheikh|imam|ustaz|ustadh|dr\.?|sh\.)/i.test(
      video.channelTitle
    )
  ) {
    score += 10;
  }

  // 6️⃣ Islamic certainty
  if (
    /(quran|hadith|tafsir|khutbah|waazi)/i.test(
      video.title + video.description
    )
  ) {
    score += 20;
  }

  return score;
}