import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../../styles/LexemeView.module.css';

interface Props {
  lexemeId: string;
  lexemeText: string;
  onClose: () => void;
}

type Item = {
  id: string;
  value: string;
};

const LexemeView: React.FC<Props> = ({ lexemeId, lexemeText, onClose }) => {
  const [definitions, setDefinitions] = useState<Item[]>([]);
  const [examples, setExamples] = useState<Item[]>([]);
  const [translations, setTranslations] = useState<Item[]>([]);

  const [newDef, setNewDef] = useState('');
  const [newEx, setNewEx] = useState('');
  const [newTr, setNewTr] = useState('');

  const [editingType, setEditingType] = useState<null | 'translation' | 'definition' | 'example'>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const [showTrInput, setShowTrInput] = useState(false);
  const [showDefInput, setShowDefInput] = useState(false);
  const [showExInput, setShowExInput] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [defRes, exRes, trRes] = await Promise.all([
        axios.get(`http://localhost:3000/definition/lexeme/${lexemeId}`),
        axios.get(`http://localhost:3000/example/lexeme/${lexemeId}`),
        axios.get(`http://localhost:3000/translation/lexeme/${lexemeId}`)
      ]);
      setDefinitions(defRes.data.map((d: any) => ({ id: d.id, value: d.definition })));
      setExamples(exRes.data.map((e: any) => ({ id: e.id, value: e.example })));
      setTranslations(trRes.data.map((t: any) => ({ id: t.id, value: t.translation })));
    };
    fetchData();
  }, [lexemeId]);

  const startEdit = (type: 'translation' | 'definition' | 'example', value: string, index: number) => {
    setEditingType(type);
    setEditingIndex(index);
    setEditValue(value);
  };

  const saveEdit = async (id: string) => {
    if (!editValue.trim() || editingType === null) {
      cancelEdit();
      return;
    }

    let payload: any = {};
    let endpoint = '';

    if (editingType === 'translation') {
      payload = { translation: editValue };
      endpoint = 'translation';
      setTranslations(translations.map((t) => t.id === id ? { ...t, value: editValue } : t));
    }

    if (editingType === 'definition') {
      payload = { definition: editValue };
      endpoint = 'definition';
      setDefinitions(definitions.map((d) => d.id === id ? { ...d, value: editValue } : d));
    }

    if (editingType === 'example') {
      payload = { example: editValue };
      endpoint = 'example';
      setExamples(examples.map((e) => e.id === id ? { ...e, value: editValue } : e));
    }

    await axios.put(`http://localhost:3000/${endpoint}/${id}`, payload);
    cancelEdit();
  };

  const deleteItem = async (type: 'translation' | 'definition' | 'example', id: string) => {
    await axios.delete(`http://localhost:3000/${type}/${id}`);

    if (type === 'translation') {
      setTranslations(translations.filter(t => t.id !== id));
    }
    if (type === 'definition') {
      setDefinitions(definitions.filter(d => d.id !== id));
    }
    if (type === 'example') {
      setExamples(examples.filter(e => e.id !== id));
    }
  };

  const cancelEdit = () => {
    setEditingType(null);
    setEditingIndex(null);
    setEditValue('');
  };

  const addField = async (type: 'definition' | 'example' | 'translation') => {
    const payload: any = { lexemeId };
    if (type === 'definition' && newDef) {
      payload.definition = newDef;
      const res = await axios.post('http://localhost:3000/definition', payload);
      setDefinitions(prev => [...prev, { id: res.data.id, value: newDef }]);
      setNewDef('');
      setShowDefInput(false);
    }
    if (type === 'example' && newEx) {
      payload.example = newEx;
      const res = await axios.post('http://localhost:3000/example', payload);
      setExamples(prev => [...prev, { id: res.data.id, value: newEx }]);
      setNewEx('');
      setShowExInput(false);
    }
    if (type === 'translation' && newTr) {
      payload.translation = newTr;
      const res = await axios.post('http://localhost:3000/translation', payload);
      setTranslations(prev => [...prev, { id: res.data.id, value: newTr }]);
      setNewTr('');
      setShowTrInput(false);
    }
  };

  const renderSection = (
    title: string,
    type: 'translation' | 'definition' | 'example',
    items: Item[],
    showInput: boolean,
    setShowInput: React.Dispatch<React.SetStateAction<boolean>>,
    newValue: string,
    setNewValue: React.Dispatch<React.SetStateAction<string>>
  ) => (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>{title}</h3>
        <button className={styles.addButton} onClick={() => setShowInput(true)}>Add</button>
      </div>

      {showInput && (
        <input
          className={styles.input}
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={`New ${title.toLowerCase()}`}
          autoFocus
          onBlur={() => {
            if (newValue.trim()) {
              addField(type);
            } else {
              setShowInput(false);
            }
          }}
        />
      )}

      <ul className={styles.list}>
        {items.map((item, i) => (
          <li key={item.id} className={styles.listItem}>
            {editingType === type && editingIndex === i ? (
              <input
                className={styles.inlineInput}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => saveEdit(item.id)}
                autoFocus
              />
            ) : (
              <>
                <span>{item.value}</span>
                <div className={styles.itemActions}>
                  <button onClick={() => startEdit(type, item.value, i)} className={styles.iconBtn}>✎</button>
                  <button onClick={() => deleteItem(type, item.id)} className={styles.iconBtn}>✖</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.mainWord}>{lexemeText}</h2>

        {renderSection('Translation', 'translation', translations, showTrInput, setShowTrInput, newTr, setNewTr)}
        {renderSection('Definition', 'definition', definitions, showDefInput, setShowDefInput, newDef, setNewDef)}
        {renderSection('Example', 'example', examples, showExInput, setShowExInput, newEx, setNewEx)}
      </div>
    </div>
  );
};

export default LexemeView;
