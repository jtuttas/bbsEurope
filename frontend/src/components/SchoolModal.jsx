import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { getCountryByName } from '../constants';

export default function SchoolModal({ school, onClose, onEdit, onDelete }) {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!school) return null;

  const country = getCountryByName(school.country);
  const flag = country?.flag || '🏳️';
  const canEdit =
    user && (user.isAdmin || user.id === school.createdByUserId);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 overlay-enter"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{flag}</span>
            <div>
              <h2 className="text-xl font-bold text-primary">{school.name}</h2>
              <p className="text-secondary text-sm">
                {school.city}, {school.country}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-primary text-2xl leading-none"
            aria-label={t('close')}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {school.website && (
            <div>
              <h4 className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">
                {t('website')}
              </h4>
              <a
                href={school.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline text-sm break-all"
              >
                {school.website}
              </a>
            </div>
          )}

          <div>
            <h4 className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">
              {t('fields')}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {school.fields.map((f) => (
                <span
                  key={f}
                  className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {school.languages.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">
                {t('languages')}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {school.languages.map((l) => (
                  <span
                    key={l}
                    className="bg-accent/20 text-primary text-xs px-2 py-1 rounded-full"
                  >
                    {l}
                  </span>
                ))}
              </div>
            </div>
          )}

          {school.description && (
            <div>
              <h4 className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">
                {t('description')}
              </h4>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {school.description}
              </p>
            </div>
          )}

          <div className="flex gap-8 text-xs text-secondary pt-2 border-t">
            <span>
              {t('createdAt')}:{' '}
              {school.createdAt
                ? new Date(school.createdAt).toLocaleDateString('de-DE')
                : '—'}
            </span>
            <span>
              {t('createdBy')}: {school.createdBy || '—'}
            </span>
          </div>
        </div>

        {/* Actions */}
        {canEdit && (
          <div className="flex gap-3 p-6 pt-0">
            <button
              onClick={() => onEdit(school)}
              className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition text-sm font-medium"
            >
              {t('edit')}
            </button>
            <button
              onClick={() => {
                if (window.confirm(t('confirmDelete'))) {
                  onDelete(school.id);
                }
              }}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition text-sm font-medium"
            >
              {t('delete')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
