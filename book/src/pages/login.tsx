import React, { useState } from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './auth.module.css';

const API_URL = 'http://localhost:8000';

export default function Login(): JSX.Element {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const homeUrl = useBaseUrl('/');
  const signupUrl = useBaseUrl('/signup');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Login failed');
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userEmail', form.email);

      // Fetch user background for personalization
      const meRes = await fetch(`${API_URL}/auth/me?email=${encodeURIComponent(form.email)}`);
      if (meRes.ok) {
        const me = await meRes.json();
        localStorage.setItem('swBg', me.software_background || '');
        localStorage.setItem('hwBg', me.hardware_background || '');
      }

      window.location.href = homeUrl;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Sign In" description="Sign in to your account">
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Sign In</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <label className={styles.label}>Email</label>
            <input
              className={styles.input}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
            />

            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Your password"
            />

            {error && <div className={styles.error}>{error}</div>}

            <button className={styles.btn} type="submit" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className={styles.switchLink}>
            New here? <a href={signupUrl}>Create an account</a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
