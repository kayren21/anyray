import React, { useState } from 'react';
import styles from '@/styles/LexemeAdd.module.css';
import axios from 'axios';
import { fetchSingleWordData } from '@/utils/fetch-single-word';
import { translatePhrase } from '@/utils/fetch_phrase';
import { useEffect } from 'react';


interface Props {
    onClose: () => void;
    hubId: string;
    onLexemeAdded: (lexeme: {
      id: string;
      lexeme: string;
      created_at: string;
    }) => void;
  }
  

const LexemeAdd: React.FC<Props> = ({ onClose, hubId, onLexemeAdded  }) => {
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [definition, setDefinition] = useState('');
  const [example, setExample] = useState('');

  const [phonetic, setPhonetic] = useState('');
  const [partOfSpeech, setPartOfSpeech] = useState('');
  const [defHints, setDefHints] = useState<string[]>([]);
  const [exHints, setExHints] = useState<string[]>([]);
  const [audioUrl, setAudioUrl] = useState('');
  const [translationHint, setTranslationHint] = useState<string | null>(null);
  const [wasHintUsed, setWasHintUsed] = useState(false);





  useEffect(() => {
    const fetchHints = async () => {
      const raw = text.trim();
  
      if (!raw) {
        setPhonetic('');
        setPartOfSpeech('');
        setDefHints([]);
        setExHints([]);
        setAudioUrl('');
        setTranslation('');
        setTranslationHint(null);
        setWasHintUsed(false);
        return;
      }
      
  
      const words = raw.split(' ').filter(Boolean);
  
      const isPhrase =
        words.length > 2 ||
        (words.length === 2 &&
          !['to', 'a', 'an', 'the'].includes(words[0].toLowerCase()));
  
      if (isPhrase) {
        const translated = await translatePhrase(raw);
        console.log("Translation API result:", translated);
        setTranslationHint(translated || null);
        setPhonetic('');
        setPartOfSpeech('');
        setDefHints([]);
        setExHints([]);
        setAudioUrl('');
        return;
      }
  
      // Это одно слово или короткая конструкция
      const first = words[0]?.toLowerCase();
      const second = words[1]?.toLowerCase();
  
      let preferredPOS: string[] = [];
  
      if (first === 'to') {
        preferredPOS = ['verb'];
      } else if (['a', 'an', 'the'].includes(first)) {
        preferredPOS = ['noun'];
      } else {
        preferredPOS = ['noun', 'verb', 'adjective'];
      }
  
      const targetWord = first === 'to' || ['a', 'an', 'the'].includes(first)
        ? second
        : first;
  
      if (!targetWord) return;
  
      const wordData = await fetchSingleWordData(targetWord, preferredPOS);
  
      if (wordData) {
        setPhonetic(wordData.phonetic);
        setPartOfSpeech(wordData.partOfSpeech);
        setDefHints(wordData.definitions);
        setExHints(wordData.examples);
        setAudioUrl(wordData.audio);
  
        const translated = await translatePhrase(targetWord);
        setTranslationHint(translated || null);
      }
    };
  
    fetchHints();
  }, [text]);
  
  



  const handleSubmit = async () => {
    try {
      if (!text.trim()) {
        alert('Word cannot be empty');
        return;
      }

      // Lexeme creation
      const lexemeRes = await axios.post('http://localhost:3000/lexeme', {
        hubId,
        lexeme: text,
      });

      const lexemeId = lexemeRes.data.id;

      // Adding defition, translation, and example
      if (translation.trim()) {
        await axios.post('http://localhost:3000/translation', {
          lexemeId,
          translation,
        });
      }

      if (definition.trim()) {
        await axios.post('http://localhost:3000/definition', {
          lexemeId,
          definition,
        });
      }

      if (example.trim()) {
        await axios.post('http://localhost:3000/example', {
          lexemeId,
          example,
        });
      }

      onLexemeAdded(lexemeRes.data); // give the new lexeme 
      onClose(); 
    } catch (error) {
      console.error('Error creating lexeme:', error);
      alert('Something went wrong while saving the word.');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        <h2 className={styles.modalTitleAdd}>New word</h2>
                
        <div className={styles.phoneticWrapper}>
          {text.trim() && (
            <div className={styles.phoneticBlock}>
              {phonetic && <span className={styles.phonetic}>/{phonetic}/</span>}
              {audioUrl && (
                <button
                  className={styles.audioBtn}
                  onClick={() => new Audio(audioUrl).play()}
                  aria-label="Play pronunciation"
                >
                  <span className={styles.audioEmoji}>🕪</span>
                </button>
              )}
            </div>
          )}
        </div>


        <input
          className={styles.inputAdd}
          value={text}
          onChange={(e) => {
            const value = e.target.value;
            setText(value);

            if (!value.trim()) {
              setTranslation('');
              setTranslationHint(null);
              setPhonetic('');
              setPartOfSpeech('');
              setDefHints([]);
              setExHints([]);
              setAudioUrl('');
              setWasHintUsed(false);
            }
          }}
          placeholder="Word"
        />



      <input
        className={styles.inputAdd}
        value={translation}
        onChange={(e) => {
          setTranslation(e.target.value);
          setWasHintUsed(false); 
        }}
        
        placeholder="Translation"
      />

      {translationHint && !wasHintUsed && (
        <div className={styles.hintsBlock}>
          <div className={styles.hintsRow}>
            <div
              className={styles.hintCard}
              onClick={() => {
                setTranslation(translationHint);
                setWasHintUsed(true);
              }}
            >
              {translationHint}
            </div>
          </div>
        </div>
      )}




        <input
          className={styles.inputAdd}
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          placeholder="Definition"
        />

        {defHints.length > 0 && (
          <div className={styles.hintsBlock}>
            <div className={styles.hintsRow}>
              {defHints.map((def, idx) => (
                <div
                  key={idx}
                  className={styles.hintCard}
                  onClick={() => setDefinition(def)}
                >
                  {def}
                </div>
              ))}
            </div>
          </div>
        )}

        <input
          className={styles.inputAdd}
          value={example}
          onChange={(e) => setExample(e.target.value)}
          placeholder="Example"
        />

        {exHints.length > 0 && (
          <div className={styles.hintsBlock}>
            <div className={styles.hintsRow}>
              {exHints.map((ex, idx) => (
                <div
                  key={idx}
                  className={styles.hintCard}
                  onClick={() => setExample(ex)}
                >
                  {ex}
                </div>
              ))}
            </div>
          </div>
        )}


        <button onClick={handleSubmit} className={styles.buttonAddLexeme}>
          Save
        </button>
      </div>
    </div>
  );
};

export default LexemeAdd;
