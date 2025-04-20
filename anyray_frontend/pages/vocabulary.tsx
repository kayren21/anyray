import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import styles from '@/styles/Vocabulary.module.css';
import { Poppins } from 'next/font/google';
import { Caveat } from 'next/font/google';
import LexemeView from './components/lexeme-view';


const caveat = Caveat({ subsets: ['latin'], weight: ['500'], variable: '--font-caveat' });
const poppins = Poppins({ weight: ['400', '600'], subsets: ['latin'], variable: '--font-poppins' });


interface Lexeme {
  id: string;
  lexeme: string;
  created_at: string;
}

interface GroupedLexemes {
  [date: string]: Lexeme[];
}

const VocabularyPage = () => {
  const [groupedLexemes, setGroupedLexemes] = useState<GroupedLexemes>({});
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null); 
  const [selectedLexemeId, setSelectedLexemeId] = useState<string | null>(null);
  const [selectedLexemeText, setSelectedLexemeText] = useState<string | null>(null);


  // opening and closing delete menu on click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.wordCard}`)) {
        setOpenMenuId(null); 
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const fetchData = async () => {
      try {
        // getting current user hub
        const hubRes = await axios.get(`http://localhost:3000/hub/default?userId=${userId}`);
        const hubId = hubRes.data.id;

        // getting lexemes from this hub
        const lexemesRes = await axios.get(`http://localhost:3000/lexeme/hub/${hubId}`);
        const data: Lexeme[] = lexemesRes.data;

        // group by date
        const grouped = data.reduce((acc, item) => {
          const date = new Date(item.created_at).toLocaleDateString();
          if (!acc[date]) acc[date] = [];
          acc[date].push(item);
          return acc;
        }, {} as GroupedLexemes);

        setGroupedLexemes(grouped);
      } catch (err) {
        console.error('Error loading:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (lexeme: Lexeme, date: string) => {
    try {
      await axios.delete(`http://localhost:3000/lexeme/${lexeme.id}`);
      const updated = { ...groupedLexemes };
      updated[date] = updated[date].filter((l) => l.id !== lexeme.id);
      setGroupedLexemes(updated);
      setOpenMenuId(null); // closing delete menu
    } catch (error) {
      console.error('Ошибка при удалении:', error);
    }
  };

  return (
    <div className={`${styles.page} ${poppins.variable} ${caveat.variable}`}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logoText}>Any<span className={styles.ray}>Ray</span></Link>
        <Link href="/vocabulary" className={styles.active}>Vocabulary</Link>
        <Link href="/materials">Materials</Link>
        <Link href="/exercises">Exercises</Link>
        <Link href="/profile">Profile</Link>
      </nav>

      <main className={styles.content}>
        <div className={styles.header}>
          <h1>Saved words</h1>
          <button className={styles.addButton}>+ Add Word</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : Object.keys(groupedLexemes).length === 0 ? (
          <p>No words yet. Start adding!</p>
        ) : (
          Object.entries(groupedLexemes)
                .filter(([_, lexemes]) => lexemes.length > 0) // showing dates with lexemes only
                .map(([date, lexemes]) => (
            <div key={date} className={styles.section}>
              <h2 className={styles.date}>{date}</h2>
              <ul className={styles.wordList}>
                {lexemes.map((lexeme) => (
                  <li
                     key={lexeme.id}
                     className={styles.wordCard}
                     onClick={(e) => { //allows to open lexeme view on click without triggering delete menu
                       const target = e.target as HTMLElement;
                       if (target.closest(`.${styles.menuWrapper}`)) return;
                       setSelectedLexemeId(lexeme.id);
                       setSelectedLexemeText(lexeme.lexeme);
                    }}
                   >
                    <div className={styles.wordText}>{lexeme.lexeme}</div>
                    <div className={styles.menuWrapper}>
                      <button
                        className={styles.menuButton}
                        onClick={(e) => {
                          e.stopPropagation(); 
                          setOpenMenuId((prev) => (prev === lexeme.id ? null : lexeme.id));
                        }}
                      >
                        ⋮
                      </button>
                      {openMenuId === lexeme.id && (
                        <div className={styles.menuOptions}>
                          <button onClick={() => handleDelete(lexeme, date)}>Delete</button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}

        {/* LexemeView component for showing lexeme details */}
        {selectedLexemeId && selectedLexemeText && (
          <LexemeView
            lexemeId={selectedLexemeId}
            lexemeText={selectedLexemeText}
            onClose={() => {
              setSelectedLexemeId(null);
              setSelectedLexemeText(null);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default VocabularyPage;
