'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useAuthStore } from '@/utils/store';
import { apiClient } from '@/utils/api';
import AnalysisReport from '@/components/AnalysisReport';

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [stats, setStats] = useState({
    totalDocuments: 0,
    analysisCompleted: 0,
    highRiskCount: 0,
    averageRiskScore: 0,
  });
  const [recentDocs, setRecentDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadDashboard();
  }, [isAuthenticated]);

  const loadDashboard = async () => {
    try {
      const response = await apiClient.getDocuments();
      const docs = response.data || [];
      
      const riskScores = docs.filter((d: any) => d.risk_score).map((d: any) => d.risk_score);
      
      setStats({
        totalDocuments: docs.length,
        analysisCompleted: docs.filter((d: any) => d.status === 'analyzed').length,
        highRiskCount: docs.filter((d: any) => d.risk_score > 70).length,
        averageRiskScore: riskScores.length > 0 ? Math.round(riskScores.reduce((a, b) => a + b, 0) / riskScores.length) : 0,
      });

      setRecentDocs(docs.slice(0, 5));
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'analyzed':
        return 'bg-emerald-100 text-emerald-700 border border-emerald-300';
      case 'processing':
        return 'bg-amber-100 text-amber-700 border border-amber-300';
      case 'pending':
        return 'bg-blue-100 text-blue-700 border border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            <p className="text-gray-600 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl shadow-lg p-8 sm:p-12 mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold mb-3">Welcome back, {user?.full_name || 'User'}!</h1>
                <p className="text-blue-100 text-lg">
                  Analyze legal documents with AI-powered insights
                </p>
              </div>
              <button
                onClick={() => router.push('/documents')}
                className="px-8 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition transform hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap"
              >
                + Upload Document
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Documents */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 font-semibold text-sm">Total Documents</h3>
                <span className="text-2xl">📄</span>
              </div>
              <p className="text-4xl font-bold text-blue-600">{stats.totalDocuments}</p>
              <p className="text-xs text-gray-500 mt-2">All time uploads</p>
            </div>

            {/* Analysis Completed */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 font-semibold text-sm">Analyzed</h3>
                <span className="text-2xl">✅</span>
              </div>
              <p className="text-4xl font-bold text-emerald-600">{stats.analysisCompleted}</p>
              <p className="text-xs text-gray-500 mt-2">Completed analysis</p>
            </div>

            {/* High Risk Count */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 font-semibold text-sm">High Risk</h3>
                <span className="text-2xl">⚠️</span>
              </div>
              <p className="text-4xl font-bold text-red-600">{stats.highRiskCount}</p>
              <p className="text-xs text-gray-500 mt-2">Flagged documents</p>
            </div>

            {/* Average Risk Score */}
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-600 font-semibold text-sm">Avg. Risk Score</h3>
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-4xl font-bold text-amber-600">{stats.averageRiskScore}%</p>
              <p className="text-xs text-gray-500 mt-2">Risk assessment</p>
            </div>
          </div>

          {/* Recent Documents */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Documents</h2>
            </div>
            
            {recentDocs.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📁</div>
                <p className="text-gray-500 text-lg mb-4">No documents yet</p>
                <p className="text-gray-400 mb-6">Upload a legal document to get started with AI analysis</p>
                <button
                  onClick={() => router.push('/documents')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-lg"
                >
                  <span>📤</span> Upload Now
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 font-bold text-gray-700 text-sm">Document</th>
                      <th className="text-left py-4 px-6 font-bold text-gray-700 text-sm">Status</th>
                      <th className="text-left py-4 px-6 font-bold text-gray-700 text-sm">Type</th>
                      <th className="text-left py-4 px-6 font-bold text-gray-700 text-sm">Uploaded</th>
                      <th className="text-left py-4 px-6 font-bold text-gray-700 text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDocs.map((doc: any, index: number) => (
                      <tr key={doc.id} className="border-b border-gray-100 hover:bg-blue-50 transition">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">📄</span>
                            <div>
                              <p className="font-semibold text-gray-900 truncate max-w-xs">{doc.title}</p>
                              <p className="text-xs text-gray-500">{doc.file_size || '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${getStatusBadgeColor(doc.status)}`}>
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-medium text-gray-700">{doc.file_type?.toUpperCase() || 'PDF'}</p>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="py-4 px-6">
                          <button
                            onClick={() => router.push(`/documents?docId=${doc.id}`)}
                            className="inline-flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-100 rounded-lg font-semibold transition text-sm"
                          >
                            View
                            <span>→</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
