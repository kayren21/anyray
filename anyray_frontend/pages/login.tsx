import Head from "next/head";
import styles from "@/styles/Login.module.css";
import Link from "next/link";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-poppins",
});

export default function Login() {
  const router = useRouter();
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Required"),
  });

  const handleSubmit = async (values: typeof initialValues) => {
    setLoading(true);
    setLoginError("");

    try {
      const response = await axios.post("http://localhost:3000/auth/login", values);

      console.log("Login successful:", response.data);
      router.push("/vocabulary"); // перенаправляем после логина
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      setLoginError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | AnyRay</title>
      </Head>

      <div className={`${styles.page} ${poppins.variable}`}>
        <div className={styles.loginContainer}>
          <h2 className={styles.loginTitle}>Login</h2>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className={styles.loginForm}>
              <div className={styles.formControl}>
                <label htmlFor="email">Email</label>
                <Field type="email" id="email" name="email" />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={styles.error}
                />
              </div>

              <div className={styles.formControl}>
                <label htmlFor="password">Password</label>
                <Field type="password" id="password" name="password" />
                <ErrorMessage
                  name="password"
                  component="div"
                  className={styles.error}
                />
              </div>

              {loginError && (
                <div className={styles.error}>{loginError}</div>
              )}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Submit"}
              </button>

              <div className={styles.loginFooter}>
                <span>Don&apos;t have an account?</span>
                <Link href="/signup" className={styles.signupLink}>
                  Sign up
                </Link>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
}
