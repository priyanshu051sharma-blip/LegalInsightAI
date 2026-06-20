'use client';

import { useState } from 'react';
import RiskCard from './RiskCard';
import ComplianceCard from './ComplianceCard';

interface AnalysisReportProps {
  analysis: any;
  loading?: boolean;
}

export default function AnalysisReport({ analysis, loading = false }: AnalysisReportProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-legal-blue"></div>
        <span className="ml-4 text-lg text-gray-600">Analyzing document...</span>
      </div>
    );
  }

  if (!analysis) {
    return <div className="text-center py-8 text-gray-500">No analysis available</div>;
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="bg-legal-blue text-white rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
        <p className="text-base leading-relaxed">
          {analysis.executive_summary || 'No summary available'}
        </p>
      </div>

      {/* Risk Assessment */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Risk Assessment</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <RiskCard
            title="High Risk"
            score={analysis.risk_score || 0}
            count={analysis.high_risk_clauses?.length || 0}
            color="#dc2626"
            items={analysis.high_risk_clauses || []}
          />
          <RiskCard
            title="Medium Risk"
            score={Math.max(0, (analysis.risk_score || 0) - 30)}
            count={analysis.medium_risk_clauses?.length || 0}
            color="#ea580c"
            items={analysis.medium_risk_clauses || []}
          />
          <RiskCard
            title="Low Risk"
            score={Math.max(0, (analysis.risk_score || 0) - 50)}
            count={analysis.low_risk_clauses?.length || 0}
            color="#f59e0b"
            items={analysis.low_risk_clauses || []}
          />
        </div>

        {analysis.missing_protections && analysis.missing_protections.length > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
            <h3 className="font-semibold text-amber-900 mb-2">Missing Protections</h3>
            <ul className="space-y-1">
              {analysis.missing_protections.map((item: string, idx: number) => (
                <li key={idx} className="text-sm text-amber-800">• {item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Key Terms & Obligations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Key Terms</h3>
          <ul className="space-y-2">
            {analysis.key_terms?.slice(0, 5).map((term: string, idx: number) => (
              <li key={idx} className="text-sm text-gray-700">
                <span className="font-semibold">•</span> {term}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Key Obligations</h3>
          <ul className="space-y-2">
            {analysis.obligations?.slice(0, 5).map((obligation: any, idx: number) => (
              <li key={idx} className="text-sm text-gray-700">
                <span className="font-semibold">•</span> {typeof obligation === 'string' ? obligation : obligation.description}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Deadlines */}
      {analysis.deadlines && analysis.deadlines.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Important Deadlines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.deadlines.map((deadline: any, idx: number) => (
              <div key={idx} className="bg-white p-3 rounded border-l-4 border-blue-500">
                <p className="font-semibold text-blue-900">{deadline.date || deadline}</p>
                {deadline.description && <p className="text-sm text-gray-600">{deadline.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compliance */}
      {analysis.compliance_status && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Compliance Status</h2>
          <ComplianceCard analysis={analysis} />
        </div>
      )}
    </div>
  );
}
