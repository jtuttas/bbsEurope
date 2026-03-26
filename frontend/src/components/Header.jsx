import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function Header({ onAddSchool, onLogin, onAdmin }) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();

  function changeLanguage(lng) {
    i18n.changeLanguage(lng);
    document.cookie = `lang=${lng};path=/;max-age=31536000`;
  }

  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            <span className="text-accent">★</span> {t('appTitle')}
          </h1>
          <p className="text-sm text-gray-300">{t('appSubtitle')}</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Language Switcher */}
          <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="bg-primary border border-gray-500 text-white text-sm rounded px-2 py-1 focus:outline-none focus:border-accent"
          >
            <option value="de">🇩🇪 DE</option>
            <option value="en">🇬🇧 EN</option>
            <option value="fr">🇫🇷 FR</option>
            <option value="es">🇪🇸 ES</option>
          </select>

          {user ? (
            <>
              {user.isAdmin && (
                <button
                  onClick={onAdmin}
                  className="text-sm px-3 py-1.5 border border-gray-400 rounded hover:bg-white/10 transition"
                >
                  {t('admin')}
                </button>
              )}
              <button
                onClick={onAddSchool}
                className="bg-accent text-primary font-semibold text-sm px-4 py-1.5 rounded hover:bg-yellow-400 transition"
              >
                {t('addSchool')}
              </button>
              <span className="text-sm text-gray-300 hidden sm:inline">
                {user.displayName}
              </span>
              <button
                onClick={logout}
                className="text-sm px-3 py-1.5 border border-gray-400 rounded hover:bg-white/10 transition"
              >
                {t('logout')}
              </button>
            </>
          ) : (
            <button
              onClick={onLogin}
              className="bg-accent text-primary font-semibold text-sm px-4 py-1.5 rounded hover:bg-yellow-400 transition"
            >
              {t('login')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
