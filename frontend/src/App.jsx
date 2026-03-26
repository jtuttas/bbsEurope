import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import SchoolCard from './components/SchoolCard';
import SchoolModal from './components/SchoolModal';
import SchoolForm from './components/SchoolForm';
import LoginForm from './components/LoginForm';
import AdminPanel from './components/AdminPanel';

function LoginPage({ onSuccess }) {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSuccess(username, password);
    } catch {
      setError(t('loginError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-primary mb-1">{t('username')}</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} autoFocus required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary mb-1">{t('password')}</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-transparent" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-accent text-primary font-semibold py-2 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50">
          {loading ? '…' : t('loginButton')}
        </button>
      </form>
    </div>
  );
}

export default function App() {
  const { t, i18n } = useTranslation();
  const { user, loading, login } = useAuth();
  const { showToast } = useToast();

  const [schools, setSchools] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterField, setFilterField] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');

  const [selectedSchool, setSelectedSchool] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSchool, setEditingSchool] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    if (user) loadSchools();
  }, [user]);

  async function loadSchools() {
    try {
      const res = await fetch('/api/schools');
      if (res.ok) setSchools(await res.json());
    } catch {
      /* ignore */
    }
  }

  // Client-side filtering
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return schools.filter((s) => {
      if (q) {
        const haystack = `${s.name} ${s.city} ${s.country}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filterCountry && s.country !== filterCountry) return false;
      if (filterField && !s.fields.includes(filterField)) return false;
      if (filterLanguage && !s.languages.includes(filterLanguage)) return false;
      return true;
    });
  }, [schools, search, filterCountry, filterField, filterLanguage]);

  const availableCountries = useMemo(
    () => [...new Set(schools.map((s) => s.country))].sort(),
    [schools]
  );

  function resetFilters() {
    setSearch('');
    setFilterCountry('');
    setFilterField('');
    setFilterLanguage('');
  }

  function handleCardClick(school) {
    setSelectedSchool(school);
  }

  function handleEdit(school) {
    setSelectedSchool(null);
    setEditingSchool(school);
    setShowForm(true);
  }

  async function handleDelete(id) {
    const res = await fetch(`/api/schools/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (res.ok) {
      showToast(t('schoolDeleted'));
      setSelectedSchool(null);
      loadSchools();
    }
  }

  async function handleSaveSchool(data) {
    const url = editingSchool
      ? `/api/schools/${editingSchool.id}`
      : '/api/schools';
    const method = editingSchool ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (res.ok) {
      showToast(editingSchool ? t('schoolUpdated') : t('schoolCreated'));
      setShowForm(false);
      setEditingSchool(null);
      loadSchools();
    }
  }

  function handleAddSchool() {
    setEditingSchool(null);
    setShowForm(true);
  }

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <select
            value={i18n.language}
            onChange={(e) => {
              i18n.changeLanguage(e.target.value);
              document.cookie = `lang=${e.target.value};path=/;max-age=31536000`;
            }}
            className="border border-gray-300 text-sm rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="de">🇩🇪 DE</option>
            <option value="en">🇬🇧 EN</option>
            <option value="fr">🇫🇷 FR</option>
            <option value="es">🇪🇸 ES</option>
          </select>
        </div>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">🇪🇺 Network BBS Europe</h1>
          <p className="text-secondary">{t('loginRequired')}</p>
        </div>
        <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-primary text-center">{t('login')}</h2>
          </div>
          <LoginPage onSuccess={login} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onAddSchool={handleAddSchool}
        onLogin={() => setShowLogin(true)}
        onAdmin={() => setShowAdmin(true)}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          country={filterCountry}
          onCountryChange={setFilterCountry}
          field={filterField}
          onFieldChange={setFilterField}
          language={filterLanguage}
          onLanguageChange={setFilterLanguage}
          onReset={resetFilters}
          availableCountries={availableCountries}
        />

        <p className="text-secondary text-sm mb-4">
          {t('showingXofY', { shown: filtered.length, total: schools.length })}
        </p>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-secondary">
            <p className="text-lg">{t('noSchools')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
                onClick={handleCardClick}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedSchool && (
        <SchoolModal
          school={selectedSchool}
          onClose={() => setSelectedSchool(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showForm && (
        <SchoolForm
          school={editingSchool}
          onSave={handleSaveSchool}
          onClose={() => {
            setShowForm(false);
            setEditingSchool(null);
          }}
        />
      )}

      {showLogin && (
        <LoginForm
          onClose={() => setShowLogin(false)}
          onSuccess={login}
        />
      )}

      {showAdmin && <AdminPanel onClose={() => setShowAdmin(false)} />}
    </div>
  );
}
