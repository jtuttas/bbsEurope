import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { COUNTRIES, FIELDS, LANGUAGES } from '../constants';

export default function SchoolForm({ school, onSave, onClose }) {
  const { t } = useTranslation();
  const isEdit = !!school;

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (school) {
      setName(school.name || '');
      setCity(school.city || '');
      setCountry(school.country || '');
      setWebsite(school.website || '');
      setDescription(school.description || '');
      setFields(school.fields || []);
      setLanguages(school.languages || []);
    }
  }, [school]);

  function toggleItem(list, setList, item) {
    setList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  }

  function validate() {
    const errs = {};
    if (!name.trim()) errs.name = t('required');
    if (!city.trim()) errs.city = t('required');
    if (!country) errs.country = t('required');
    if (fields.length === 0) errs.fields = t('minOneField');
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        city: city.trim(),
        country,
        website: website.trim(),
        description: description.trim(),
        fields,
        languages,
      });
    } finally {
      setSaving(false);
    }
  }

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
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-primary">
            {isEdit ? t('editSchool') : t('newSchool')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-primary text-2xl"
            aria-label={t('close')}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Schulname */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              {t('schoolName')} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Stadt */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              {t('city')} *
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">{errors.city}</p>
            )}
          </div>

          {/* Land */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              {t('country')} *
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent bg-white"
            >
              <option value="">— {t('country')} —</option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="text-red-500 text-xs mt-1">{errors.country}</p>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              {t('website')}
            </label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Fachrichtungen */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              {t('fields')} *
            </label>
            <div className="flex flex-wrap gap-2">
              {FIELDS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleItem(fields, setFields, f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                    fields.includes(f)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-primary border-gray-300 hover:border-primary'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            {errors.fields && (
              <p className="text-red-500 text-xs mt-1">{errors.fields}</p>
            )}
          </div>

          {/* Sprachen */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              {t('languages')}
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => toggleItem(languages, setLanguages, l)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                    languages.includes(l)
                      ? 'bg-accent text-primary border-accent'
                      : 'bg-white text-primary border-gray-300 hover:border-accent'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Beschreibung */}
          <div>
            <label className="block text-sm font-medium text-primary mb-1">
              {t('description')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-accent focus:border-transparent resize-y"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-accent text-primary font-semibold py-2 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
            >
              {saving ? '…' : t('save')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-secondary py-2 rounded-lg hover:bg-gray-50 transition"
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
