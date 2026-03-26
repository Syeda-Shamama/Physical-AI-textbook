import React, { useState, useRef, useEffect } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const API_URL = 'http://localhost:8000';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export default function Chatbot(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Assalam-o-Alaikum! Ask me anything about this textbook.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [personalize, setPersonalize] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const swBg = typeof window !== 'undefined' ? localStorage.getItem('swBg') || '' : '';
  const hwBg = typeof window !== 'undefined' ? localStorage.getItem('hwBg') || '' : '';
  const isLoggedIn = swBg || hwBg;
  const userBackground = `Software: ${swBg}. Hardware: ${hwBg}`;
  const signupUrl = useBaseUrl('/signup');

  useEffect(() => {
    const handleSelection = () => {
      const sel = window.getSelection()?.toString().trim();
      if (sel && sel.length > 10) setSelectedText(sel);
    };
    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    const question = input.trim();
    if (!question || loading) return;

    setMessages(prev => [...prev, { role: 'user', text: question }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          selected_text: selectedText,
          user_background: personalize ? userBackground : '',
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.answer }]);
      setSelectedText('');
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: 'Backend se connection nahi ho saka. Please check if the server is running.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <button
        className={styles.fab}
        onClick={() => setOpen(o => !o)}
        title="Ask AI Tutor"
        aria-label="Open AI Chatbot"
      >
        {open ? '✕' : '🤖'}
      </button>

      {open && (
        <div className={styles.window}>
          <div className={styles.header}>
            <span>AI Tutor — Physical AI Textbook</span>
            {selectedText && <span className={styles.badge}>Text selected ✓</span>}
          </div>

          <div className={styles.messages}>
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? styles.userMsg : styles.botMsg}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className={styles.botMsg}>
                <span className={styles.typing}>Thinking...</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className={styles.personalizeRow}>
            <label className={styles.personalizeLabel}>
              <input
                type="checkbox"
                checked={personalize}
                onChange={e => {
                  if (e.target.checked && !isLoggedIn) {
                    window.location.href = signupUrl;
                    return;
                  }
                  setPersonalize(e.target.checked);
                }}
              />
              🎯 Personalize based on my background
              {!isLoggedIn && (
                <span className={styles.signupHint}>
                  — <a href={signupUrl}>Sign up</a> to enable
                </span>
              )}
            </label>
          </div>

          <div className={styles.inputRow}>
            <textarea
              className={styles.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={selectedText ? 'Ask about selected text...' : 'Ask a question about the book...'}
              rows={2}
            />
            <button
              className={styles.sendBtn}
              onClick={send}
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
