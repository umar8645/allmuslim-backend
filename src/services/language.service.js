export function detectLanguage(text = "") {
  // Arabic script
  if (/[\u0600-\u06FF]/.test(text)) return "ar";

  // Hausa keywords
  if (/(wa'azi|waazi|hausa|karatu|tafseer|musulunci|qurani)/i.test(text)) return "ha";

  // Qur'an / recitation
  if (/(qur'an|recitation)/i.test(text)) return "ar";

  // Add more language detection rules if needed
  return "en";
}
