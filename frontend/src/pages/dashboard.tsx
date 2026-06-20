'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useAuthStore } from '@/utils/store';
import { apiClient } from '@/utils/api';
import AnalysisReport from '@/components/AnalysisReport';

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState({
    totalDocuments: 0,
    analysisCompleted: 0,
    highRiskCount: 0,
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
      
      setStats({
        totalDocuments: docs.length,
        analysisCompleted: docs.filter((d: any) => d.status === 'analyzed').length,
        highRiskCount: docs.filter((d: any) => d.risk_score > 70).length,
      });

      setRecentDocs(docs.slice(0, 5));
    } catch (error) {
      console.error('Dashboard load error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-legal-blue"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-legal-gray">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="bg-gradient-legal text-white rounded-lg shadow-lg p-8 mb-8">
            <h1 className="text-4xl font-bold mb-4">Welcome to Legal Assistant</h1>
            <p className="text-lg opacity-90">
              Your AI-powered legal document analysis platform
            </p>
            <button
              onClick={() => router.push('/upload')}
              className="mt-6 bg-legal-gold text-legal-blue px-6 py-3 rounded-lg font-semibold hover:opacity-90"
            >
              Upload Document
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Documents</p>
                  <p className="text-3xl font-bold text-legal-blue mt-2">{stats.totalDocuments}</p>
                </div>
                <div className="text-4xl">📄</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Analysis Completed</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.analysisCompleted}</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">High Risk Items</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">{stats.highRiskCount}</p>
                </div>
                <div className="text-4xl">⚠️</div>
              </div>
            </div>
          </div>

          {/* Recent Documents */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Documents</h2>
            {recentDocs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No documents yet. Upload one to get started!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Document</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDocs.map((doc: any) => (
                      <tr key={doc.id} className="border-b hover:bg-legal-gray">
                        <td className="py-3 px-4 text-gray-800">{doc.title}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs px-2 py-1 rounded ${
                            doc.status === 'analyzed' ? 'bg-green-100 text-green-800' :
                            doc.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">{doc.file_type.toUpperCase()}</td>
                        <td className="py-3 px-4 text-gray-600 text-sm">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => router.push(`/documents?docId=${doc.id}`)}
                            className="text-legal-blue hover:underline font-semibold"
                          >
                            View
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
