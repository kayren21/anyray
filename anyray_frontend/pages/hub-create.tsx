import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '@/styles/HubCreate.module.css';

type Language = {
  id: string;
  name: string;
};

const levels = [
  'beginner',
  'elementary',
  'pre-intermediate',
  'intermediate',
  'upper-intermediate',
  'advanced',
  'proficient',
];

export default function CreateHub() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [targetLanguage, setTargetLanguage] = useState('');
  const [level, setLevel] = useState('');
  const router = useRouter();
  const userId = router.query.user as string;

  useEffect(() => {
    axios.get('http://localhost:3000/languages').then((res) => {
      setLanguages(res.data);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await axios.post('http://localhost:3000/hub', {
      user_id: userId,
      target_language: targetLanguage,
      language_level: level,
    });

    router.push('/vocabulary');
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formBox}>
        <h2 className={styles.heading}>Create Hub</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Target Language</label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              required
              className={styles.select}
            >
              <option value="">Select a language</option>
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Language Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
              className={styles.select}
            >
              <option value="">Select a level</option>
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className={styles.button}>Start Learning</button>
        </form>
        <p className={styles.loginFooter}>
         You’ll be able to manage and add more hubs later
        </p>

      </div>
    </div>
  );
}
