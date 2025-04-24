import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '@/styles/Hubs.module.css';
import Navbar from './components/navigation';
import { Poppins } from 'next/font/google';
import { Caveat } from 'next/font/google';

const caveat = Caveat({ subsets: ['latin'], weight: ['500'], variable: '--font-caveat' });
const poppins = Poppins({ weight: ['400', '600'], subsets: ['latin'], variable: '--font-poppins' });

type LanguageLevel =
  | 'beginner'
  | 'elementary'
  | 'pre-intermediate'
  | 'intermediate'
  | 'upper-intermediate'
  | 'advanced'
  | 'proficient';

  

interface Hub {
  id: string;
  targetLanguage: {
    name: string;
  };
  languageLevel: LanguageLevel;
  is_default: boolean;
}

export default function Hubs() {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) return;
    setUserId(storedUserId);

    const fetchHubs = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/hub/user/${storedUserId}`);
        setHubs(res.data);
      } catch (err) {
        console.error('Error loading hubs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHubs();
  }, []);

  const handleSetAsDefault = async (hubId: string) => {
    try {
      await axios.patch(`http://localhost:3000/hub/${hubId}/make-default`);
      const res = await axios.get(`http://localhost:3000/hub/${hubId}`);
      console.log('Hub with relations:', res.data); 
      localStorage.setItem('hub', JSON.stringify(res.data)); // сохраняю полноценный хаб с targetLanguage
 
      const updated = hubs.map((h) => ({
        ...h,
        isDefault: h.id === hubId,
      }));
      setHubs(updated);
    } catch (error) {
      console.error('Failed to set default hub:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <div className={`${styles.page} ${poppins.variable} ${caveat.variable}`}>
      <Navbar />
      <main className={styles.container}>
        <h1 className={styles.title}>Every Hub is dedicated to a particular language</h1>
        <button className={styles.createButton} onClick={() => router.push('/hub-create')}>
           Create New Hub
        </button>

        {loading ? (
          <p>Loading...</p>
        ) : hubs.length === 0 ? (
          <p>No hubs yet. Create one to get started.</p>
        ) : (
          <ul className={styles.hubList}>
            {hubs.map((hub) => (
              <li key={hub.id} className={styles.hubItem}>
                <div className={styles.hubInfo}>
                    <strong>{hub.targetLanguage.name}</strong>

                    <label className={styles.levelLabel}>
                        Level:
                        <select
                        className={styles.levelSelect}
                        value={hub.languageLevel}
                        onChange={async (e) => {
                            const newLevel = e.target.value;
                            try {
                            await axios.patch(`http://localhost:3000/hub/${hub.id}/update-level`, {
                                level: newLevel,
                            });
                            const updated = hubs.map((h) =>
                                h.id === hub.id ? { ...h, languageLevel: newLevel as LanguageLevel } : h
                            );
                            setHubs(updated);
                            } catch (err) {
                            console.error('Error updating level:', err);
                            alert('Failed to update level');
                            }
                        }}
                        >
                        <option value="beginner">beginner</option>
                        <option value="elementary">elementary</option>
                        <option value="pre-intermediate">pre-intermediate</option>
                        <option value="intermediate">intermediate</option>
                        <option value="upper-intermediate">upper-intermediate</option>
                        <option value="advanced">advanced</option>
                        <option value="proficient">proficient</option>
                        </select>
                    </label>

                    {hub.is_default && <span className={styles.defaultLabel}>Current</span>}
                    </div>

                {!hub.is_default && (
                  <button
                    className={styles.useButton}
                    onClick={() => handleSetAsDefault(hub.id)}
                  >
                    Use this Hub
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
