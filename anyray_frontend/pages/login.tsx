import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from 'axios';
import { useRouter } from "next/router";
import { useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Login() {
  const router = useRouter();
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Required'),
    password: Yup.string().min(6, 'Minimum 6 characters').required('Required'),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    setLoading(true);
    setLoginError('');

    try {
      const response = await axios.post('http://localhost:3000/users', {...values,firstName:'karina', lastName:'kar', gender:'female',  homeLandId:'2da5c877-055a-4141-a530-755eff5f18d4', translationLanguageId:'774e9523-72f5-472e-a555-40208f588ea9', dob: '2025-10-01', registeredDate: '2005-52-12'});
      console.log('Login successful:', response.data);
      
      // Redirect to homepage or dashboard
      router.push('/');
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      setLoginError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="login-form">
          <div className="form-control">
            <label htmlFor="email">Email</label>
            <Field type="email" id="email" name="email" />
            <ErrorMessage name="email" component="div" className="error" />
          </div>

          <div className="form-control">
            <label htmlFor="password">Password</label>
            <Field type="password" id="password" name="password" />
            <ErrorMessage name="password" component="div" className="error" />
          </div>

          {loginError && <div className="error">{loginError}</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Submit'}
          </button>
        </Form>
      </Formik>
    </div>
  );
}
