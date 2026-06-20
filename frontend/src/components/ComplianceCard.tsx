'use client';

interface ComplianceCardProps {
  analysis: any;
}

export default function ComplianceCard({ analysis }: ComplianceCardProps) {
  const compliance = analysis.compliance_status || {};
  const violations = analysis.compliance_violations || [];
  const recommendations = analysis.compliance_recommendations || [];

  const getStatusColor = (status: string) => {
    const lower = status?.toLowerCase() || '';
    if (lower.includes('compliant') || lower === 'pass') return 'bg-green-100 text-green-900';
    if (lower.includes('partial')) return 'bg-yellow-100 text-yellow-900';
    return 'bg-red-100 text-red-900';
  };

  return (
    <div className="space-y-6">
      {/* Compliance Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(compliance).map(([regulation, status]: [string, any]) => (
          <div
            key={regulation}
            className={`rounded-lg p-4 text-center ${getStatusColor(status)}`}
          >
            <p className="font-bold text-lg">{regulation}</p>
            <p className="text-sm">{status}</p>
          </div>
        ))}
      </div>

      {/* Violations */}
      {violations.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded">
          <h3 className="font-bold text-red-900 mb-3 text-lg">Compliance Violations</h3>
          <ul className="space-y-2">
            {violations.map((violation: any, idx: number) => (
              <li key={idx} className="text-red-800 text-sm">
                <span className="font-semibold">•</span> {typeof violation === 'string' ? violation : violation.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
          <h3 className="font-bold text-blue-900 mb-3 text-lg">Recommendations</h3>
          <ul className="space-y-2">
            {recommendations.map((rec: string, idx: number) => (
              <li key={idx} className="text-blue-800 text-sm">
                <span className="font-semibold">✓</span> {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
