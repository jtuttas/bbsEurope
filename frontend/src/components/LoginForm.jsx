import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function LoginForm({ onClose, onSuccess }) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' | 'reset-request' | 'reset'
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSuccess(username, password);
      onClose();
    } catch {
      setError(t('loginError'));
    } finally {
      setLoading(false);
    }
  }

  async function handleResetRequest(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || t('resetEmailSent'));
    } catch {
      setError('Fehler');
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        setMessage(t('resetSuccess'));
        setTimeout(() => setMode('login'), 2000);
      }
    } catch {
      setError('Fehler');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 overlay-enter"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-sm w-full modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-primary">
            {mode === 'login' && t('login')}
            {mode === 'reset-request' && t('resetPassword')}
            {mode === 'reset' && t('resetPassword')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-primary text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {message && (
            <div className="bg-green-50 text-green-700 text-sm rounded-lg p-3 mb-4">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">
              {error}
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  {t('username')}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoFocus
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  {t('password')}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-primary font-semibold py-2 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
              >
                {loading ? '…' : t('loginButton')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('reset-request');
                  setError('');
                  setMessage('');
                }}
                className="w-full text-sm text-secondary hover:text-primary transition"
              >
                {t('forgotPassword')}
              </button>
            </form>
          )}

          {mode === 'reset-request' && (
            <form onSubmit={handleResetRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  {t('email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-primary font-semibold py-2 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
              >
                {loading ? '…' : t('resetPassword')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  setMessage('');
                }}
                className="w-full text-sm text-secondary hover:text-primary transition"
              >
                {t('backToLogin')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
