'use client';

interface RiskCardProps {
  title: string;
  score: number;
  count: number;
  color: string;
  items: string[];
}

export default function RiskCard({ title, score, count, color, items }: RiskCardProps) {
  const getScoreColor = () => {
    if (score >= 70) return 'bg-red-100 text-red-900';
    if (score >= 40) return 'bg-yellow-100 text-yellow-900';
    return 'bg-green-100 text-green-900';
  };

  return (
    <div className="card p-6 border-l-4" style={{ borderColor: color }}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className={`text-xl font-bold ${getScoreColor()} px-3 py-1 rounded-md`}>{score}/100</span>
      </div>

      <div className="mb-4">
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div className="h-2 rounded-full transition-all duration-300" style={{ width: `${score}%`, backgroundColor: color }} />
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-3">{count} {title.toLowerCase()} found</div>

      {items.length > 0 && (
        <ul className="space-y-2">
          {items.slice(0, 3).map((item, idx) => (
            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>{item}</span>
            </li>
          ))}
          {items.length > 3 && <li className="text-sm text-gray-500 italic">+{items.length - 3} more</li>}
        </ul>
      )}
    </div>
  );
}
