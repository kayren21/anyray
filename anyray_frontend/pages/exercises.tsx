import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/navigation';
import styles from '@/styles/Exercises.module.css';
import { Poppins } from 'next/font/google';
import { Caveat } from 'next/font/google';
import {  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, } from 'recharts';
import StartQuiz from './components/start-quiz';

const caveat = Caveat({ subsets: ['latin'], weight: ['500'], variable: '--font-caveat' });
const poppins = Poppins({ weight: ['400', '600'], subsets: ['latin'], variable: '--font-poppins' });



export enum ExerciseType {
    TRANSLATION = 'translation',
    MULTIPLE_CHOICE = 'multiple_choice',
    FILL_IN_THE_BLANK = 'fill_in_the_blank',
    SENTENCE = 'sentence',
    MATCHING = 'matching',
  }

  export enum ExerciseStatus {
    NEW = 'new',
    LEARNING = 'learning',
    REVIEW = 'review',
    MASTERED = 'mastered',
  }

  interface Lexeme {
    id: string;
    lexeme: string;
    created_at: string;
  }
  

  interface Exercise {
    id: string;
    type: ExerciseType;
    status: ExerciseStatus;
    repetitionCount: number;
    correctStreak: number;
    easeFactor: number;
    lastReview: string | null;
    nextReview: string | null;
    masteredAt: string | null;
    createdAt: string;
    lexeme: Lexeme;
  }
  
  interface MasteredStats {
    totalMastered: number;
    averageDaysToMaster: number | null;
    masteredWordsByWeek: {
      week: string;
      count: number;
    }[];
  }

  export interface QuestionType {
    question: string;
    options: string[];
    correctAnswer: string;
    lexemeId: string;
  }
  

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'white', border: '1px solid #ccc', padding: '5px', fontSize: '12px' }}>
          <p style={{ margin: 0}}>{label}</p>
          <p style={{ margin: 0, color: '#36dafd', fontWeight: 'bold' }}>
            words: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  export default function ExercisesPage() {
    const [stats, setStats] = useState<MasteredStats | null>(null);
    const [todayExercises, setTodayExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);

    const [quizQuestions, setQuizQuestions] = useState<QuestionType[]>([]);
    const [quizError, setQuizError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loadingQuiz, setLoadingQuiz] = useState(false);


  
    const getHub = () => {
      try {
        const hubRaw = localStorage.getItem('hub');
        return hubRaw ? JSON.parse(hubRaw) : null;
      } catch {
        return null;
      }
    };

    const handleStartQuiz = async () => {
        try {
          setLoadingQuiz(true);
          const hub = getHub();
          if (!hub?.id) {
            setQuizError('Hub not found.');
            setLoadingQuiz(false);
            return;
          }
      
          const reviewRes = await axios.get(`http://localhost:3000/lexeme/${hub.id}/today-review`);
          const exercises = reviewRes.data;
      
          if (!exercises.length) {
            setQuizError('No exercises scheduled for today.');
            setLoadingQuiz(false);
            return;
          }
      
          const questions: QuestionType[] = [];
      
          for (const exercise of exercises) {
            try {
              const res = await axios.get(`http://localhost:3000/exercises/quiz-by-lexeme/${exercise.id}`);
              res.data.forEach((question: QuestionType) => {
                questions.push({ ...question, lexemeId: exercise.id });
              }); // добавляем id лексемы в каждый вопрос
            } catch (err) {
              console.error(`Error loading question for exercise ${exercise.id}`, err);
            }
          }
      
          if (!questions.length) {
            setQuizError('Failed to generate quiz.');
            setLoadingQuiz(false);
            return;
          }
      
          setQuizQuestions(questions);
          setQuizError(null);
          setIsModalOpen(true);
        } catch (error: any) {
          setQuizError('Unexpected error.');
        } finally {
          setLoadingQuiz(false);
        }
      };
  
    useEffect(() => {
      const hub = getHub();
      if (!hub?.id) return;
  
      const fetchData = async () => {
        try {
          const [statsRes, reviewRes] = await Promise.all([
            axios.get(`http://localhost:3000/lexeme/${hub.id}/mastered-stats`),
            axios.get(`http://localhost:3000/lexeme/${hub.id}/today-review`),
          ]);
         
  
          setStats(statsRes.data);
          setTodayExercises(reviewRes.data);
        } catch (err) {
          console.error('Error loading exercises', err);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();

      
    }, []);

    const refetchTodayExercises = async () => {
        const hub = getHub();
        if (!hub?.id) return;
        const reviewRes = await axios.get(`http://localhost:3000/lexeme/${hub.id}/today-review`);
        setTodayExercises(reviewRes.data);
      };
  
    if (loading) return <div className="page">Loading...</div>;
  
    const hub = getHub();
    if (!hub?.id) return <div className="page error">Error: hub is not found</div>;
  
    return (
      <div className={`${styles.page} ${poppins.variable} ${caveat.variable}`}>
        <Navbar />
        <main className={styles.content}>
          
          {stats && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Your Progress Overview</h2>
  
              <p className={styles.statItem}>
              ✔ Total mastered words and expressions: <strong>{stats.totalMastered}</strong>
              </p>
              <p className={styles.statItem}>
                ⏱ Average time spent to master a word: <strong>{stats.averageDaysToMaster ?? '—'} days</strong>
              </p>
  
              {stats.masteredWordsByWeek?.length > 0 ? (
                <div style={{ width: '90%', margin: '0 auto', marginTop: '20px' }}>
                  <p className={styles.chartTitle}>
                    WEEKLY OVERVIEW OF MASTERED WORDS
                  </p>
                  <ResponsiveContainer width="100%" height={250} >
                  <LineChart 
                            data={stats.masteredWordsByWeek}
                             margin={{ top: 10, right: 30, left: 30, bottom: 20 }} 
                  >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="week" 
                        label={{ value: 'weeks', position: 'insideBottom', offset: -5 }}
                        tick={{ fontSize: 12, fill: '#444', dy: 10}}
                        height={70}
                        padding={{ right: 30 }}
                      />
                      <YAxis 
                        allowDecimals={false}
                        label={{
                          value: 'words',
                          angle: -90,
                          position: 'insideLeft',
                          style: { textAnchor: 'middle', fontSize: 14 }
                        }}
                        tick={{ fontSize: 12, fill: '#444' }}
                    
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone"
                        dataKey="count"
                        stroke="#36dafd"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
              <p className={styles.statItemNote}>
                💡 The quality of your exercises depends on the completeness of examples and definitions you provide for each word
              </p>
                </div>
              ) : (
                <div className={styles.noData}>
                  <p>✨ No mastered words yet.</p>
                  <p className={styles.statTip}>
                    Start adding words and complete their definitions and examples to unlock exercise generation!
                  </p>
                </div>
              )}
            </div> 
          )}

        <StartQuiz
        isOpen={isModalOpen}
        onClose={() => {
            setIsModalOpen(false);
            setQuizQuestions([]);
            setQuizError(null);
        }}
        questions={quizQuestions}
        errorMessage={quizError}
        refetchTodayExercises={refetchTodayExercises} 
        />
  
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>🚀 Daily Practice</h2>
            <p className={styles.statItem}>
              Words scheduled for review today: <strong>{todayExercises.length}</strong>
            </p>

            <button
              className={styles.quizButton}
              disabled={todayExercises.length === 0}
              onClick={handleStartQuiz}
            >
              Take Daily Quiz
            </button>
          </div>
  
        </main>
      </div>
    );
  }
  