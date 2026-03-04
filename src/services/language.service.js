export function detectLanguage(text = "") {
  // Arabic script
  if (/[\u0600-\u06FF]/.test(text)) return "ar";

  // Hausa keywords
  if (/(wa'azi|waazi|hausa|karatu|tafseer|musulunci|qurani|allah|sunnah)/i.test(text)) return "ha";

  // Qur'an / recitation
  if (/(qur'an|recitation)/i.test(text)) return "ar";

  // Hindi script
  if (/[\u0900-\u097F]/.test(text)) return "hi";

  // Chinese characters
  if (/[\u4e00-\u9fff]/.test(text)) return "zh";

  // Russian Cyrillic
  if (/[\u0400-\u04FF]/.test(text)) return "ru";

  // Default fallback
  return "en";
}
