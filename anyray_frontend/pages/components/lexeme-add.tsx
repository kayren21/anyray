import React, { useState } from 'react';
import styles from '@/styles/LexemeView.module.css';
import axios from 'axios';

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

  const handleSubmit = async () => {
    try {
      if (!text.trim()) {
        alert('Word cannot be empty');
        return;
      }

      // Создание лексемы (важно: поле называется lexeme, не text)
      const lexemeRes = await axios.post('http://localhost:3000/lexeme', {
        hubId,
        lexeme: text,
      });

      const lexemeId = lexemeRes.data.id;

      // Добавляем перевод, определение, пример если есть
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

      onLexemeAdded(lexemeRes.data); // передаём новое слово
      onClose(); // закрываем окно
    } catch (error) {
      console.error('Error creating lexeme:', error);
      alert('Something went wrong while saving the word.');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitleAdd}>New word</h2>

        <input
          className={styles.inputAdd}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Word"
        />
        <input
          className={styles.inputAdd}
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          placeholder="Translation"
        />
        <input
          className={styles.inputAdd}
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          placeholder="Definition"
        />
        <input
          className={styles.inputAdd}
          value={example}
          onChange={(e) => setExample(e.target.value)}
          placeholder="Example"
        />

        <button onClick={handleSubmit} className={styles.buttonAddLexeme}>
          Save
        </button>
      </div>
    </div>
  );
};

export default LexemeAdd;
