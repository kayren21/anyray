import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/navigation';
import styles from '@/styles/Materials.module.css';
import { Poppins } from 'next/font/google';
import { Caveat } from 'next/font/google';
import { getTargetLanguageId } from '../utils/get-target-language'; 

const caveat = Caveat({ subsets: ['latin'], weight: ['500'], variable: '--font-caveat' });
const poppins = Poppins({ weight: ['400', '600'], subsets: ['latin'], variable: '--font-poppins' });

interface Material {
  id: string;
  link: string;
  description: string;
  material_type: string;
  language_level: string;
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filtered, setFiltered] = useState<Material[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  useEffect(() => {
    const fetchMaterials = async () => {
      const langId = await getTargetLanguageId();
      if (!langId) return;

      try {
        const res = await axios.get(`http://localhost:3000/materials/by-language/${langId}`);
        setMaterials(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error('Error fetching materials:', err);
      }
    };

    fetchMaterials();
  }, []);

  useEffect(() => {
    if (selectedLevel === 'all') {
      setFiltered(materials);
    } else {
      setFiltered(materials.filter((m) => m.language_level === selectedLevel));
    }
  }, [selectedLevel, materials]);

  return (
    <div className={`${styles.page} ${poppins.variable} ${caveat.variable}`}>
      <Navbar />
      <main className={styles.content}>
        <h1 className={styles.title}>Carefully selected resources to improve your language skills from Daily English to IELTS certification</h1>

        <div className={styles.filter}>
          <label>Select level</label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="all">All</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div className={styles.cards}>
          {filtered.map((material) => (
            <a
              key={material.id}
              href={material.link}
              target="_blank"
              rel="noreferrer"
              className={styles.card}
            >
              
              <p>{material.description}</p>
              <p><strong>{material.material_type.toUpperCase()}</strong></p>
              <span className={styles.level}>{material.language_level}</span>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
