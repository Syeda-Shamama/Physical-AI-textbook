import React, { useState } from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './auth.module.css';

const API_URL = 'https://syeda-shamama-physical-ai-backend.hf.space';

export default function Signup(): JSX.Element {
  const [form, setForm] = useState({
    email: '',
    password: '',
    software_background: '',
    hardware_background: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const homeUrl = useBaseUrl('/');
  const loginUrl = useBaseUrl('/login');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      let data: any = {};
      try { data = await res.json(); } catch { /* non-JSON response */ }
      if (!res.ok) throw new Error(data.detail || `Server error (${res.status}). Please try again later.`);
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userEmail', form.email);
      localStorage.setItem('swBg', form.software_background);
      localStorage.setItem('hwBg', form.hardware_background);
      setSuccess('Account created! Redirecting...');
      setTimeout(() => { window.location.href = homeUrl; }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Sign Up" description="Create your account">
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Create Account</h2>
          <p className={styles.subtitle}>
            Tell us about your background so we can personalize your learning experience.
          </p>

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
              minLength={6}
              placeholder="Minimum 6 characters"
            />

            <label className={styles.label}>
              Software Background
              <span className={styles.hint}> — e.g. "Python developer, 2 years of ML experience"</span>
            </label>
            <textarea
              className={styles.textarea}
              name="software_background"
              value={form.software_background}
              onChange={handleChange}
              rows={3}
              placeholder="Describe your programming and software experience..."
            />

            <label className={styles.label}>
              Hardware Background
              <span className={styles.hint}> — e.g. "Built Arduino projects, familiar with Raspberry Pi"</span>
            </label>
            <textarea
              className={styles.textarea}
              name="hardware_background"
              value={form.hardware_background}
              onChange={handleChange}
              rows={3}
              placeholder="Describe your hardware and electronics experience..."
            />

            {error && <div className={styles.error}>{error}</div>}
            {success && <div className={styles.success}>{success}</div>}

            <button className={styles.btn} type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className={styles.switchLink}>
            Already have an account? <a href={loginUrl}>Sign In</a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
