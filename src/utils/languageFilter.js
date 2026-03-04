const LANGUAGE_HINTS = {
  en: /(islam|quran|lecture|hadith)/i,
  ar: /[\u0600-\u06FF]/,
  ha: /(wa'azi|waazi|musulunci|allah|sunnah|qurani|tafseer|karatu|hausa)/i,
  ur: /[؀-ۿ]/,
  fr: /(islam|coran|prêche)/i,
  tr: /(islam|kuran|vaaz|kuranı)/i,
  id: /(islam|kajian|ceramah)/i,
  es: /(islam|corán|hadiz|predica)/i,       // Spanish
  de: /(islam|koran|hadith|vortrag)/i,      // German
  zh: /[\u4e00-\u9fff]/,                    // Chinese
  hi: /(इस्लाम|कुरान|हदीस|वाज़)/,          // Hindi
  ru: /(ислам|коран|хадис|проповедь)/i,     // Russian
  sw: /(islam|qurani|hadithi|mahubiri|mhubiri)/i // Swahili
};

export function isAllowedLanguage(text) {
  const allowed = (process.env.ALLOWED_LANGUAGES || "")
    .split(",")
    .map(l => l.trim());

  return allowed.some(lang => LANGUAGE_HINTS[lang]?.test(text));
}
