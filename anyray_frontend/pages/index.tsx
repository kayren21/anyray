import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { Poppins } from 'next/font/google';
import { Caveat } from 'next/font/google';

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['500'], 
  variable: '--font-caveat',
});

const poppins = Poppins({
  weight: ['400', '600'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export default function Home() {
  return (
    <>
      <Head>
        <title>AnyRay</title>
        <meta name="description" content="Language learning platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={`${styles.page} ${poppins.variable} ${caveat.variable}`}>
        <header className={styles.header}>
          <Link href="/login" className={styles.loginButton}>Log in</Link>
        </header>

        <main className={styles.main}>
          <div className={styles.logoWrapper}>
          <h1 className={styles.handwritten}>AnyRay</h1>
          <img src="/img/logo_no_bg.png" alt="AnyRay Logo" className={styles.logoImage} />
          </div>
          <p className={styles.tagline}>Lights the path to language fluency</p>
          <p className={styles.description}>
            A personalized platform that helps you learn languages through real-life content consumption
          </p>
          <Link href="/signup" className={styles.signupButton}>Get Started</Link>
        </main>
      </div>
    </>
  );
}
