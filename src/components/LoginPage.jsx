import React, { useState } from 'react';
import './LoginPage.scss';

const LoginPage = ({ onLogin, envConfigured, onBackHome }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!envConfigured) {
      setError('Login is not configured');
      return;
    }

    const ok = onLogin(username.trim(), password);
    if (!ok) {
      setError('Invalid username or password.');
      return;
    }

    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>StockWhisperAI</h1>
        <p>Invite-only access. Sign in to continue to the dashboard.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="login-username">Username</label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            placeholder="Enter username"
          />

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Enter password"
          />

          {error && <div className="login-error">{error}</div>}

          <button type="submit">Login</button>

          {onBackHome && (
            <button type="button" className="secondary" onClick={onBackHome}>
              Back to Home
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;