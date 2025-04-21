export interface WordData {
    phonetic: string;
    audio: string;
    partOfSpeech: string;
    definitions: string[];
    examples: string[];
  }
  
  
  export async function fetchSingleWordData(
    word: string,
    preferredPOS: string[] = ['noun', 'verb', 'adjective']
  ): Promise<WordData | null> {
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await res.json();

  
      if (!Array.isArray(data) || !data[0]?.meanings) {
        console.warn('Unexpected API response:', data);
        return null;
      }
  
      const entry = data[0];
      const allMeanings = entry.meanings;
      const audioUrl = entry.phonetics.find((p: any) => p.audio)?.audio || '';
  
      const selectedMeaning = allMeanings.find((m: any) =>
        preferredPOS.includes(m.partOfSpeech)
      ) || allMeanings[0];
  
      const definitions = selectedMeaning.definitions.map((d: any) => d.definition);
      const examples = selectedMeaning.definitions
        .map((d: any) => d.example)
        .filter(Boolean);
  
      return {
        phonetic: entry.phonetic || '',
        audio: audioUrl,
        partOfSpeech: selectedMeaning.partOfSpeech || '',
        definitions: definitions.slice(0, 3),
        examples: examples.slice(0, 3),
      };
    } catch (error) {
      console.error('Error fetching word data:', error);
      return null;
    }
  }
  