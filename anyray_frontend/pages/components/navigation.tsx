import styles from '@/styles/Navbar.module.css';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { Caveat } from 'next/font/google';
import { useRouter } from 'next/router';


const caveat = Caveat({ subsets: ['latin'], weight: ['500'], variable: '--font-caveat' });
const poppins = Poppins({ weight: ['400', '600'], subsets: ['latin'], variable: '--font-poppins' });


const Navbar = () => {
  
  const router = useRouter();
    return (
      <nav className={styles.nav}>
        <Link href="/" className={styles.logoText}>
          Any<span className={styles.ray}>Ray</span>
        </Link>
        <Link href="/vocabulary" className={router.pathname === '/vocabulary' ? styles.active : ''}>Vocabulary</Link>
        <Link href="/materials"  className={router.pathname === '/materials' ? styles.active : ''}>Materials</Link>
        <Link href="/exercises"  className={router.pathname === '/exercises' ? styles.active : ''}>Exercises</Link>
        <Link href="/hubs" className={router.pathname === '/hubs' ? styles.active : ''}>Hubs</Link>
        <Link href="/profile" className={router.pathname === '/profile' ? styles.active : ''}>Profile</Link>
      </nav>
    );
};

export default Navbar;