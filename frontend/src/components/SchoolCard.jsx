import { getCountryByName } from '../constants';

export default function SchoolCard({ school, onClick }) {
  const country = getCountryByName(school.country);
  const flag = country?.flag || '🏳️';

  return (
    <div
      onClick={() => onClick(school)}
      className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer group border-t-4 border-transparent hover:border-accent overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl">{flag}</span>
          <div className="min-w-0">
            <h3 className="font-bold text-primary text-lg leading-tight group-hover:text-accent transition-colors truncate">
              {school.name}
            </h3>
            <p className="text-secondary text-sm">
              {school.city}, {school.country}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {school.fields.map((f) => (
            <span
              key={f}
              className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium"
            >
              {f}
            </span>
          ))}
        </div>

        {school.languages.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {school.languages.slice(0, 2).map((l) => (
              <span
                key={l}
                className="bg-accent/20 text-primary text-xs px-2 py-0.5 rounded-full"
              >
                {l}
              </span>
            ))}
            {school.languages.length > 2 && (
              <span className="text-secondary text-xs">
                +{school.languages.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
