import { useTranslation } from 'react-i18next';
import { COUNTRIES, FIELDS, LANGUAGES } from '../constants';

export default function FilterBar({
  search,
  onSearchChange,
  country,
  onCountryChange,
  field,
  onFieldChange,
  language,
  onLanguageChange,
  onReset,
  availableCountries,
}) {
  const { t } = useTranslation();

  const countryOptions = COUNTRIES.filter((c) =>
    availableCountries.includes(c.name)
  );

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('search')}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
        />

        {/* Country Filter */}
        <select
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-white"
        >
          <option value="">{t('filterCountry')}</option>
          {countryOptions.map((c) => (
            <option key={c.code} value={c.name}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>

        {/* Field Filter */}
        <select
          value={field}
          onChange={(e) => onFieldChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-white"
        >
          <option value="">{t('filterField')}</option>
          {FIELDS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        {/* Language Filter */}
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent bg-white"
        >
          <option value="">{t('filterLanguage')}</option>
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        {/* Reset */}
        <button
          onClick={onReset}
          className="text-sm text-secondary hover:text-primary border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition whitespace-nowrap"
        >
          {t('resetFilters')}
        </button>
      </div>
    </div>
  );
}
