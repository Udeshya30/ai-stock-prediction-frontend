import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Lock,
  Newspaper,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import './HomePage.scss';
import { apiUrl } from '../config/api';

const featureCards = [
  {
    title: 'Live Market Pulse',
    desc: 'Track ticker movement, sector alignment and volatility without tab switching.',
    icon: Activity,
  },
  {
    title: 'Signal + Pattern Engine',
    desc: 'Short and long-term targets with explained technical pattern context.',
    icon: TrendingUp,
  },
  {
    title: 'Macro + Money Flow',
    desc: 'RBI, crude, USD/INR, FII-DII sentiment layered into one interpretable panel.',
    icon: BarChart3,
  },
  {
    title: 'News Intelligence',
    desc: 'Stock-specific and global feeds with sentiment tags for faster decision framing.',
    icon: Newspaper,
  },
];

const defaultForm = {
  full_name: '',
  email: '',
  message: '',
};

const HomePage = ({ onLoginClick }) => {
  const [formData, setFormData] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ type: '', message: '' });
    setSubmitting(true);

    try {
      const res = await fetch(apiUrl('/api/access-request'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || 'Unable to submit request right now.');
      }

      setFormStatus({
        type: 'success',
        message: 'Request submitted successfully. We will review and reach out soon.',
      });
      setFormData(defaultForm);
    } catch (err) {
      setFormStatus({ type: 'error', message: err.message || 'Request failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="home-page">
      <div className="home-shell">
        <header className="landing-nav">
          <div className="landing-brand">
            <Sparkles size={14} />
            <span>StockWhisperAI</span>
          </div>

          <nav>
            <a href="#home-features">Features</a>
            <a href="#guided-access">Guided Access</a>
            <a href="#request-access">Request Access</a>
          </nav>

          <button type="button" className="login-btn" onClick={onLoginClick}>Login</button>
        </header>

        <section className="hero-layout">
          <div className="hero-copy">
            <div className="home-badge">
              <Lock size={12} />
              <span>Invite-only Platform</span>
            </div>
            <h1>Research faster. Decide with conviction. Execute with clarity.</h1>
            <p>
              A market cockpit for serious NSE-focused analysis combining signals, sector strength,
              macro pressure, and sentiment in one crisp workflow.
            </p>

            <div className="hero-actions">
              <button type="button" className="primary" onClick={onLoginClick}>
                Go to Login
                <ArrowRight size={15} />
              </button>
              <a href="#request-access" className="secondary-link">Request Invite</a>
            </div>

            <div className="hero-meta">
              <span><CheckCircle2 size={13} />Invite-only onboarding</span>
              <span><Clock3 size={13} />Request review in one place</span>
              <span><ShieldCheck size={13} />No public sign-up</span>
            </div>
          </div>

          <div className="hero-visual">
            <img src="/hero-dashboard.svg" alt="Dashboard preview" />
          </div>
        </section>

        <section className="feature-section" id="home-features">
          <h2>Everything important, in one operating view</h2>
          <p className="section-subtext">
            Built for people who want fewer tabs, better context, and faster signal recognition.
          </p>

          <div className="feature-grid">
            {featureCards.map(({ title, desc, icon: Icon }) => (
              <article className="feature-card" key={title}>
                <span className="feature-icon"><Icon size={16} /></span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="workflow-section" id="guided-access">
          <div className="workflow-image">
            <img src="/invite-workflow.svg" alt="Access workflow" />
          </div>
          <div className="workflow-copy">
            <h2>Guided access for focused users</h2>
            <p>
              Access is curated to keep the platform signal-focused. Share a few details,
              and we will follow up after review.
            </p>
          </div>
        </section>

        <section className="request-section" id="request-access">
          <div className="request-copy">
            <h2>Request access</h2>
            <p>
              Tell us who you are, and optionally add a short note on your use case.
            </p>
          </div>

          <form className="request-form" onSubmit={handleSubmit}>
            <label htmlFor="full_name">Full Name</label>
            <input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required />

            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />

            <label htmlFor="message">Message (optional)</label>
            <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange} />

            {formStatus.message && (
              <div className={`form-status ${formStatus.type}`}>{formStatus.message}</div>
            )}

            <button type="submit" disabled={submitting}>
              <Send size={14} />
              {submitting ? 'Submitting...' : 'Submit Access Request'}
            </button>
          </form>
        </section>

        <footer className="landing-footer">
          <div>
            <strong>StockWhisperAI</strong>
            <p>Private market intelligence platform for focused decision-making.</p>
          </div>
          <div className="footer-links">
            <a href="#home-features">Features</a>
            <a href="#request-access">Request Access</a>
            <button type="button" onClick={onLoginClick}>Login</button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
