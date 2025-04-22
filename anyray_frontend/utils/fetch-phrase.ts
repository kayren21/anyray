export async function translatePhrase(phrase: string): Promise<string | null> {
  try {
    const encoded = encodeURIComponent(phrase);
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encoded}&langpair=en|ru`);

    if (!res.ok) {
      console.warn('Failed to fetch translation');
      return null;
    }

    const data = await res.json();
    const matches = data.matches || [];
    const translatedText = data.responseData?.translatedText?.trim();
    const phraseLower = phrase.trim().toLowerCase();

    const wordCount = phrase.trim().split(/\s+/).length;

    if (wordCount === 1) {
      // для слов: только идеальный матч
      const perfectMatch = matches.find(
        (m: any) =>
          m.match === 1 &&
          m.translation &&
          m.translation.trim().toLowerCase() !== phraseLower
      );
      return perfectMatch?.translation || null;
    }

    // для фраз: ищем хороший матч > 0.6 и не совпадает с исходной
    const bestPhraseMatch = matches.find(
      (m: any) =>
        m.match > 0.55 &&
        m.translation &&
        m.translation.trim().toLowerCase() !== phraseLower
    );

    if (bestPhraseMatch?.translation) return bestPhraseMatch.translation;

    // fallback: responseData если она не равна исходной
    if (translatedText && translatedText.toLowerCase() !== phraseLower) {
      return translatedText;
    }

    return null;

  } catch (error) {
    console.error('Error translating phrase:', error);
    return null;
  }
}
