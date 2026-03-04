export function passFilters({ title = "", description = "" }) {
  const block = /(music|song|mix|prank|shorts|comedy|politics)/i;
  if (block.test(title) || block.test(description)) return false;

  const allow = /(wa'azi|waazi|tafseer|qur'an|quran|khutbah|lecture|recitation|karatu|tafsir|islam|hadith|sermon|dars|mahubiri)/i;
  return allow.test(title + " " + description);
}
