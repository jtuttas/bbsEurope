import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../context/ToastContext';

export default function AdminPanel({ onClose }) {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ username: '', displayName: '', email: '', password: '' });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const res = await fetch('/api/users', { credentials: 'include' });
    if (res.ok) setUsers(await res.json());
  }

  function openNew() {
    setForm({ username: '', displayName: '', email: '', password: '' });
    setEditingUser(null);
    setShowForm(true);
  }

  function openEdit(user) {
    setForm({
      username: user.username,
      displayName: user.displayName,
      email: user.email || '',
      password: '',
    });
    setEditingUser(user);
    setShowForm(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (editingUser) {
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showToast(t('userUpdated'));
        setShowForm(false);
        loadUsers();
      }
    } else {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showToast(t('userCreated'));
        setShowForm(false);
        loadUsers();
      }
    }
  }

  async function handleDelete(user) {
    if (!window.confirm(t('confirmDeleteUser'))) return;
    const res = await fetch(`/api/users/${user.id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      showToast(t('userDeleted'));
      loadUsers();
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 overlay-enter"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-primary">{t('users')}</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={openNew}
              className="bg-accent text-primary font-semibold text-sm px-4 py-1.5 rounded hover:bg-yellow-400 transition"
            >
              {t('addUser')}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-primary text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {showForm && (
            <form onSubmit={handleSave} className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">
                    {t('username')} *
                  </label>
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  {t('displayName')} *
                </label>
                <input
                  type="text"
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  {t('email')}
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">
                  {t('password')} {editingUser ? '' : '*'}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editingUser}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-accent text-primary font-semibold text-sm px-4 py-2 rounded-lg hover:bg-yellow-400 transition"
                >
                  {t('save')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-sm text-secondary px-4 py-2"
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          )}

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-secondary">
                <th className="pb-2">{t('username')}</th>
                <th className="pb-2">{t('displayName')}</th>
                <th className="pb-2">{t('email')}</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="py-2 font-medium">{u.username}</td>
                  <td className="py-2">{u.displayName}</td>
                  <td className="py-2 text-secondary">{u.email || '—'}</td>
                  <td className="py-2 text-right">
                    {u.username !== 'admin' && (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => openEdit(u)}
                          className="text-primary hover:text-accent text-xs"
                        >
                          {t('edit')}
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          {t('delete')}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
