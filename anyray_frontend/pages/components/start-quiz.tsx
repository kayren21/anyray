import React, { useState } from 'react';
import styles from '@/styles/StartQuiz.module.css';
import { QuestionType } from '../exercises'; // импорт интерфейса
import axios from 'axios';  

interface Props {
  isOpen: boolean;
  onClose: () => void;
  questions: (QuestionType & { lexemeId: string })[];
  errorMessage?: string | null;
  refetchTodayExercises: () => void;
}
// functional components takes props (isOppen, onClose и тд) as an argument and returns a React element
const StartQuiz: React.FC<Props> = ({ isOpen, onClose, questions, errorMessage, refetchTodayExercises }) => {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answerTime, setAnswerTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);

  const handleAnswer = (option: string) => {
    if (selectedOption) return; // Не даём выбрать второй раз
    const now = Date.now();
    setAnswerTime(now - startTime); // считаем сколько времени заняло
    setSelectedOption(option);
    setIsCorrect(option === questions[currentQuestion].correctAnswer);
  };

  const handleNext = async () => {
    if (!selectedOption) return;

    const question = questions[currentQuestion];
    let quality = 1; // неправильный

    if (selectedOption === question.correctAnswer) {
      quality = answerTime <=  120000 ? 5 : 3; // если за 2 минуты = 120000 миллисекунд ответил, считаем 5
    }

    try {
      await axios.patch(`http://localhost:3000/lexeme/${question.lexemeId}/review`, {
        quality,
      });
    } catch (error) {
      console.error('Failed to update lexeme after answer', error);
    }

    setSelectedOption(null);
    setIsCorrect(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setStartTime(Date.now()); // новое время начала ответа
    } else {
      setFinished(true);
    }
  };


  if (!isOpen) return null;


  const handleStart = () => {
    setStarted(true);
    setStartTime(Date.now());
  };

  const handleClose = () => {
    setStarted(false);
    setCurrentQuestion(0);
    setFinished(false);
    onClose();
    refetchTodayExercises();
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {!started && !finished && (
          <>
            <h2>Ready to start your Daily Quiz?</h2>
            {errorMessage ? (
              <p className={styles.errorMessage}>{errorMessage}</p>
            ) : (
              <button className={styles.startButton} onClick={handleStart}>
                Start Quiz
              </button>
            )}
          </>
        )}

        {started && !finished && (
          <>
            <h2>Question {currentQuestion + 1}</h2>
            <p className={styles.questionText}>
            {questions[currentQuestion].question}
            </p>

            <div className={styles.options}>
              {questions[currentQuestion].options.map((option, idx) => {
                let optionClass = styles.optionButton;
                if (selectedOption) {
                  if (option === selectedOption) {
                    optionClass = isCorrect ? styles.optionButtonCorrect : styles.optionButtonWrong;
                  } else if (option === questions[currentQuestion].correctAnswer) {
                    optionClass = styles.optionButtonCorrect;
                  }
                }

                return (
                  <button
                    key={idx}
                    className={optionClass}
                    onClick={() => handleAnswer(option)}
                    disabled={!!selectedOption}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <button
              className={styles.nextButton}
              onClick={handleNext}
              disabled={!selectedOption}
            >
              Next
            </button>
          </>
        )}

        {finished && (
           <div className={styles.finishedMessage}>
            <p>Great job!</p>
            <button className={styles.startButton} onClick={handleClose}>
              Close
            </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default StartQuiz;