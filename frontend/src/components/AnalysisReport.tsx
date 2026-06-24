'use client';
import { useState } from 'react';

interface Props { analysis: any; loading?: boolean; }

function Section({ title, icon, children, defaultOpen = false }: { title: string; icon: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 bg-gray-50 hover:bg-gray-100 transition">
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <span className="font-bold text-gray-900 text-sm">{title}</span>
        </div>
        <span className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && <div className="p-5">{children}</div>}
    </div>
  );
}

export default function AnalysisReport({ analysis, loading = false }: Props) {
  if (loading) return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium">Analyzing document...</p>
    </div>
  );

  if (!analysis) return (
    <div className="text-center py-12 text-gray-400">No analysis available</div>
  );

  const riskScore = analysis.risk_score || 0;
  const riskLevel = riskScore >= 70 ? 'High' : riskScore >= 40 ? 'Medium' : 'Low';
  const riskColor = riskScore >= 70 ? 'text-red-600' : riskScore >= 40 ? 'text-amber-600' : 'text-emerald-600';
  const riskBg = riskScore >= 70 ? 'bg-red-50 border-red-200' : riskScore >= 40 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200';
  const barColor = riskScore >= 70 ? 'bg-red-500' : riskScore >= 40 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="space-y-4 animate-fadeIn">

      {/* Summary banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-2">Executive Summary</p>
        <p className="text-sm leading-relaxed opacity-90">{analysis.executive_summary || 'No summary available.'}</p>
      </div>

      {/* Risk Score */}
      <div className={`rounded-xl border p-5 ${riskBg}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Overall Risk Score</p>
            <p className={`text-4xl font-black mt-0.5 ${riskColor}`}>{Math.round(riskScore)}<span className="text-lg font-normal">/100</span></p>
          </div>
          <div className={`text-center px-4 py-2 rounded-lg border ${riskBg}`}>
            <p className={`font-black text-2xl ${riskColor}`}>{riskLevel}</p>
            <p className="text-xs text-gray-500">Risk Level</p>
          </div>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${riskScore}%` }}></div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'High Risk', count: analysis.high_risk_clauses?.length || 0, color: 'text-red-600 bg-red-50' },
            { label: 'Medium Risk', count: analysis.medium_risk_clauses?.length || 0, color: 'text-amber-600 bg-amber-50' },
            { label: 'Low Risk', count: analysis.low_risk_clauses?.length || 0, color: 'text-emerald-600 bg-emerald-50' },
          ].map(item => (
            <div key={item.label} className={`rounded-lg p-3 text-center ${item.color}`}>
              <p className="text-2xl font-black">{item.count}</p>
              <p className="text-xs font-semibold mt-0.5">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Clauses */}
      {analysis.high_risk_clauses?.length > 0 && (
        <Section title={`High Risk Clauses (${analysis.high_risk_clauses.length})`} icon="⚠️" defaultOpen={true}>
          <div className="space-y-3">
            {analysis.high_risk_clauses.map((item: any, i: number) => (
              <div key={i} className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-sm text-red-800 font-semibold">{typeof item === 'string' ? item : item.clause || item.description || JSON.stringify(item)}</p>
                {item.recommendation && <p className="text-xs text-red-600 mt-1.5 bg-white rounded-lg p-2 border border-red-100">💡 {item.recommendation}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {analysis.medium_risk_clauses?.length > 0 && (
        <Section title={`Medium Risk Clauses (${analysis.medium_risk_clauses.length})`} icon="⚡">
          <div className="space-y-2">
            {analysis.medium_risk_clauses.map((item: any, i: number) => (
              <div key={i} className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-sm text-amber-800">{typeof item === 'string' ? item : item.clause || item.description || JSON.stringify(item)}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Compliance */}
      {analysis.compliance_status && Object.keys(analysis.compliance_status).length > 0 && (
        <Section title="Compliance Status" icon="✅" defaultOpen={true}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {Object.entries(analysis.compliance_status).map(([reg, status]: [string, any]) => {
              const isCompliant = String(status).toLowerCase().includes('compliant') || String(status).toLowerCase() === 'pass';
              const isPartial = String(status).toLowerCase().includes('partial');
              return (
                <div key={reg} className={`rounded-xl p-4 text-center border ${isCompliant ? 'bg-emerald-50 border-emerald-200' : isPartial ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
                  <p className="font-black text-gray-900">{reg}</p>
                  <p className={`text-xs font-semibold mt-1 ${isCompliant ? 'text-emerald-600' : isPartial ? 'text-amber-600' : 'text-red-600'}`}>{String(status)}</p>
                </div>
              );
            })}
          </div>
          {analysis.compliance_violations?.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-3">
              <p className="font-bold text-red-800 mb-2 text-sm">Violations ({analysis.compliance_violations.length})</p>
              <ul className="space-y-1.5">
                {analysis.compliance_violations.map((v: any, i: number) => (
                  <li key={i} className="text-xs text-red-700 flex items-start gap-1.5">
                    <span className="mt-0.5">•</span>
                    {typeof v === 'string' ? v : v.description || JSON.stringify(v)}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {analysis.compliance_recommendations?.length > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="font-bold text-blue-800 mb-2 text-sm">Recommendations</p>
              <ul className="space-y-1.5">
                {analysis.compliance_recommendations.map((r: string, i: number) => (
                  <li key={i} className="text-xs text-blue-700 flex items-start gap-1.5">
                    <span className="mt-0.5 text-blue-500">✓</span> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>
      )}

      {/* Key Terms */}
      {analysis.key_terms?.length > 0 && (
        <Section title={`Key Terms (${analysis.key_terms.length})`} icon="📝">
          <div className="flex flex-wrap gap-2">
            {analysis.key_terms.map((term: string, i: number) => (
              <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-semibold">{term}</span>
            ))}
          </div>
        </Section>
      )}

      {/* Obligations */}
      {analysis.obligations?.length > 0 && (
        <Section title={`Obligations (${analysis.obligations.length})`} icon="📋">
          <ul className="space-y-2">
            {analysis.obligations.map((ob: any, i: number) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                {typeof ob === 'string' ? ob : ob.description || JSON.stringify(ob)}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Deadlines */}
      {analysis.deadlines?.length > 0 && (
        <Section title={`Key Deadlines (${analysis.deadlines.length})`} icon="📅">
          <div className="grid sm:grid-cols-2 gap-3">
            {analysis.deadlines.map((d: any, i: number) => (
              <div key={i} className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="font-bold text-blue-900 text-sm">{typeof d === 'string' ? d : d.date || d.title || d.deadline}</p>
                {d.description && <p className="text-xs text-blue-600 mt-1">{d.description}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Missing Protections */}
      {analysis.missing_protections?.length > 0 && (
        <Section title={`Missing Protections (${analysis.missing_protections.length})`} icon="🔒">
          <ul className="space-y-2">
            {analysis.missing_protections.map((p: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-red-500 mt-0.5 flex-shrink-0">⚠</span>
                <span className="text-gray-700">{p}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Case Research */}
      {analysis.relevant_cases?.length > 0 && (
        <Section title={`Relevant Cases (${analysis.relevant_cases.length})`} icon="⚖️">
          <div className="space-y-3">
            {analysis.relevant_cases.slice(0, 5).map((c: any, i: number) => (
              <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <p className="font-bold text-gray-900 text-sm">{typeof c === 'string' ? c : c.title || c.case_name || JSON.stringify(c)}</p>
                {c.summary && <p className="text-xs text-gray-500 mt-1">{c.summary}</p>}
                {c.citation && <p className="text-xs text-blue-600 mt-1 font-mono">{c.citation}</p>}
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}
