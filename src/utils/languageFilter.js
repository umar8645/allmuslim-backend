const LANGUAGE_HINTS = {
  en: /(islam|quran|lecture|hadith)/i,
  ar: /[\u0600-\u06FF]/,
  ha: /(wa'azi|waazi|musulunci|allah|sunnah|qurani|tafseer|karatu|hausa)/i, // ✅ Hausa regex
  ur: /[؀-ۿ]/,
  fr: /(islam|coran|prêche)/i,
  tr: /(islam|kuran|vaaz|kuranı)/i,
  id: /(islam|kajian|ceramah)/i,
  es: /(islam|corán|hadiz|predica)/i,
  de: /(islam|koran|hadith|vortrag)/i,
  zh: /[\u4e00-\u9fff]/,
  hi: /(इस्लाम|कुरान|हदीस|वाज़)/,
  ru: /(ислам|коран|хадис|проповедь)/i,
  sw: /(islam|qurani|hadithi|mahubiri|mhubiri)/i
};

export function isAllowedLanguage(text) {
  const allowed = (process.env.ALLOWED_LANGUAGES || "")
    .split(",")
    .map((t) => t.trim());

  return allowed.some((lang) => LANGUAGE_HINTS[lang]?.test(text));
}
