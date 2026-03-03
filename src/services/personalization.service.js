// src/services/personalization.service.js
export function personalizeScore({ content, scholar, user }) {
  let score = 0;

  // 1️⃣ followed scholar
  if (user.followedScholars?.includes(scholar._id)) score += 30;

  // 2️⃣ topic match
  if (user.topics?.includes(content.category)) score += 20;

  // 3️⃣ language
  if (user.languages?.includes(content.language)) score += 15;

  // 4️⃣ country
  if (user.countries?.includes(content.country)) score += 15;

  // 5️⃣ trust score
  score += (scholar.trustScore / 100) * 10;

  // 6️⃣ quality
  score += (content.qualityScore / 100) * 10;

  return Math.round(score);
}