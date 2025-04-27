'use client';
import React from 'react';
import styles from '@/styles/About.module.css';
import Link from 'next/link';

const About = () => {
  return (
    
    <section className={styles.aboutSection}>
      <div className={styles.aboutLinkContainer}>
              <Link href="/profile" className={styles.aboutLink}>
              ⬅ GO BACK
              </Link>
    </div>
    
      <h2 className={styles.aboutTitle}>How Spaced Repetition works in AnyRay</h2>
      <p className={styles.aboutText}>
       🟣 Customized spaced repetition system is used in AnyRay to help you master new words efficiently.<br />
       🟣 When you answer correctly, the next review is scheduled after a longer interval.<br />
       🟣 After 3 consecutive correct answers, the interval is boosted by 1.5<br />
      </p>

      <div className={styles.tableContainer}>
        <table className={styles.aboutTable}>
          <thead>
            <tr>
              <th>Correct Streak</th>
              <th>Base Interval</th>
              <th>Boost</th>
              <th>Final Interval</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>0–1</td><td>1 day</td><td>No</td><td>1 day</td></tr>
            <tr><td>2</td><td>2 days</td><td>No</td><td>2 days</td></tr>
            <tr><td>3</td><td>4 days</td><td>Yes</td><td>6 days</td></tr>
            <tr><td>4</td><td>7 days</td><td>Yes</td><td>10–11 days</td></tr>
            <tr><td>5</td><td>14 days</td><td>Yes</td><td>21 days</td></tr>
            <tr><td>6</td><td>30 days</td><td>Yes</td><td>45 days</td></tr>
            <tr><td>7</td><td>60 days</td><td>Yes</td><td>90 days</td></tr>
            <tr><td>8</td><td>120 days</td><td>Yes</td><td>180 days</td></tr>
            <tr><td>9+</td><td>180 days</td><td>Yes</td><td>270 days</td></tr>
          </tbody>
        </table>
      </div>

      <p className={styles.aboutTip}>
        ❗ If you make a mistake, the next review will be scheduled for tomorrow, and the ease factor will slightly decrease to help reinforce the word.
      </p>
    </section>
  );
};

export default About;
