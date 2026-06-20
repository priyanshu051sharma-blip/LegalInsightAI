'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDocumentStore } from '@/utils/store';
import Header from '@/components/Header';
import { apiClient } from '@/utils/api';

export default function Documents() {
  const router = useRouter();
  const { documents, currentDocument, isLoading, fetchDocuments, setCurrentDocument, deleteDocument } = useDocumentStore();
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [tab, setTab] = useState<'list' | 'analysis'>('list');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleAnalyze = async (docId: string) => {
    setAnalyzing(true);
    try {
      const response = await apiClient.analyzeDocument(docId);
      const analysisData = await apiClient.getAnalysis(docId);
      setAnalysis(analysisData.data);
      setTab('analysis');
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(docId);
      setSelectedDoc(null);
      setAnalysis(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      uploaded: 'bg-blue-100 text-blue-800',
      processing: 'bg-yellow-100 text-yellow-800',
      analyzed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-legal-gray">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-legal-blue mb-8">Your Documents</h1>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-legal-blue"></div>
            </div>
          ) : documents.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">No documents yet</p>
              <button
                onClick={() => router.push('/upload')}
                className="bg-legal-blue text-white px-6 py-2 rounded-lg hover:opacity-90"
              >
                Upload First Document
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Document List */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow">
                  <div className="p-4 border-b flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search documents..."
                      className="flex-1 px-3 py-2 border rounded text-sm outline-none focus:border-legal-blue"
                    />
                  </div>
                  <div className="divide-y">
                    {documents.map((doc) => (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className={`w-full text-left p-4 hover:bg-legal-gray transition ${
                          selectedDoc?.id === doc.id ? 'bg-blue-50 border-l-4 border-legal-blue' : ''
                        }`}
                      >
                        <h3 className="font-semibold text-gray-800 truncate">{doc.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{doc.file_name}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(doc.status)}`}>
                            {doc.status}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Document Details */}
              {selectedDoc && (
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b">
                      <h2 className="text-2xl font-bold text-gray-800">{selectedDoc.title}</h2>
                      <p className="text-gray-500 text-sm mt-1">{selectedDoc.file_name}</p>
                      <div className="flex gap-4 mt-4">
                        {selectedDoc.status !== 'analyzed' && (
                          <button
                            onClick={() => handleAnalyze(selectedDoc.id)}
                            disabled={analyzing}
                            className="bg-legal-blue text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
                          >
                            {analyzing ? 'Analyzing...' : 'Start Analysis'}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(selectedDoc.id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:opacity-90"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Analysis Results */}
                    {analysis && tab === 'analysis' && (
                      <div className="p-6">
                        <div className="mb-6 p-4 bg-legal-blue text-white rounded-lg">
                          <p className="text-lg font-semibold">Risk Score: {analysis.risk_score}/100</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                          <div className="p-4 bg-red-50 rounded-lg">
                            <p className="text-sm text-gray-600">High Risk</p>
                            <p className="text-2xl font-bold text-red-600">{analysis.high_risk_clauses?.length || 0}</p>
                          </div>
                          <div className="p-4 bg-yellow-50 rounded-lg">
                            <p className="text-sm text-gray-600">Medium Risk</p>
                            <p className="text-2xl font-bold text-yellow-600">{analysis.medium_risk_clauses?.length || 0}</p>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-600">Key Terms</p>
                            <p className="text-2xl font-bold text-blue-600">{analysis.key_terms?.length || 0}</p>
                          </div>
                        </div>

                        {analysis.executive_summary && (
                          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-bold text-gray-800 mb-2">Summary</h3>
                            <p className="text-gray-700 text-sm leading-relaxed">{analysis.executive_summary}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
