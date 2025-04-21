import Head from 'next/head';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import styles from '@/styles/Signup.module.css'; 

type Language = {
  id: string;
  name: string;
};

export default function Signup() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios.get('http://localhost:3000/languages').then((res) => {
      setLanguages(res.data);
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      translationLanguageId: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(6, 'Minimum 6 characters').required('Required'),
      translationLanguageId: Yup.string().required('Select a language'),
    }),
    onSubmit: async (values) => {
      try {
        const res = await axios.post('http://localhost:3000/auth/signup', values);
        const userId = res.data.id;
        
        localStorage.setItem('userId', userId); // Сохраняем ID
        router.push('/hub-create');             // Переходим БЕЗ query
        
      } catch (error: any) {
        alert(error.response?.data?.message || 'Registration failed');
      }
    },
  });

  return (
    <>
      <Head>
        <title>Sign Up | AnyRay</title>
      </Head>
      <div className={styles.page}>
        <div className={styles.formBox}>
          <h2 className={styles.heading}>Sign Up</h2>
          <form onSubmit={formik.handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.touched.email && formik.errors.email && (
                <div className={styles.error}>{formik.errors.email}</div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              {formik.touched.password && formik.errors.password && (
                <div className={styles.error}>{formik.errors.password}</div>
              )}
            </div>

            <div className={styles.inputGroup}>
              <label>Translation</label>
              <select
                name="translationLanguageId"
                value={formik.values.translationLanguageId}
                onChange={formik.handleChange}
              >
                <option value="">Select a language</option>
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
              {formik.touched.translationLanguageId && formik.errors.translationLanguageId && (
                <div className={styles.error}>{formik.errors.translationLanguageId}</div>
              )}
            </div>

            <button type="submit" className={styles.button}>Register</button>
          </form>
        </div>
      </div>
    </>
  );
}
