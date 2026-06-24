'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useDocumentStore } from '@/utils/store';
import Header from '@/components/Header';
import AnalysisReport from '@/components/AnalysisReport';
import { apiClient } from '@/utils/api';

function UploadZone({ onUpload }: { onUpload: (file: File, title: string) => void }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f); setTitle(f.name.replace(/\.[^/.]+$/, '')); }
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setTitle(f.name.replace(/\.[^/.]+$/, '')); }
  };

  const handleSubmit = async () => {
    if (!file || !title.trim()) return;
    setUploading(true);
    try {
      await onUpload(file, title.trim());
      setFile(null);
      setTitle('');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card p-6">
      <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm">📤</span>
        Upload Document
      </h2>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${dragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input id="fileInput" type="file" className="hidden" accept=".pdf,.docx,.doc,.txt" onChange={handleFile} />
        {file ? (
          <div>
            <div className="text-3xl mb-2">📄</div>
            <p className="font-semibold text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <>
            <div className="text-4xl mb-3">☁️</div>
            <p className="font-semibold text-gray-700">Drop your document here</p>
            <p className="text-sm text-gray-400 mt-1">PDF, DOCX, TXT supported</p>
          </>
        )}
      </div>
      {file && (
        <div className="mt-4 space-y-3">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Document title..."
            className="input text-sm"
          />
          <button onClick={handleSubmit} disabled={uploading || !title.trim()} className="btn-primary w-full disabled:opacity-50">
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Uploading...
              </span>
            ) : '📤 Upload & Analyze'}
          </button>
        </div>
      )}
    </div>
  );
}

function DocRow({ doc, selected, onClick }: { doc: any; selected: boolean; onClick: () => void }) {
  const statusColor: Record<string, string> = {
    analyzed: 'bg-emerald-50 text-emerald-700', processing: 'bg-amber-50 text-amber-700',
    uploaded: 'bg-blue-50 text-blue-700', failed: 'bg-red-50 text-red-700',
  };
  return (
    <button onClick={onClick} className={`w-full text-left px-4 py-3.5 transition-all border-b border-gray-50 hover:bg-blue-50/40 ${selected ? 'bg-blue-50 border-l-2 border-l-blue-600' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
          {doc.file_type?.toUpperCase()?.slice(0, 3) || 'DOC'}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 text-sm truncate">{doc.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[doc.status] || 'bg-gray-100 text-gray-600'}`}>{doc.status}</span>
            {doc.risk_score != null && <span className="text-xs text-gray-400">Risk: {Math.round(doc.risk_score)}</span>}
          </div>
        </div>
      </div>
    </button>
  );
}

export default function Documents() {
  const router = useRouter();
  const { documents, isLoading, fetchDocuments, uploadDocument, deleteDocument } = useDocumentStore();
  const [selected, setSelected] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [tab, setTab] = useState<'overview' | 'analysis' | 'chat'>('overview');
  const [chatMsg, setChatMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    const { id } = router.query;
    if (id && documents.length > 0) {
      const doc = documents.find(d => d.id === id);
      if (doc) handleSelect(doc);
    }
  }, [router.query.id, documents]);

  const handleSelect = async (doc: any) => {
    setSelected(doc);
    setTab('overview');
    setAnalysis(null);
    if (doc.status === 'analyzed') {
      try {
        const res = await apiClient.getAnalysis(doc.id);
        setAnalysis(res.data);
      } catch (e) {}
    }
  };

  const handleUpload = async (file: File, title: string) => {
    try {
      const doc = await uploadDocument(file, title);
      handleSelect(doc);
    } catch (e: any) {
      alert(e.message || 'Upload failed');
    }
  };

  const handleAnalyze = async () => {
    if (!selected) return;
    setAnalyzing(true);
    try {
      await apiClient.analyzeDocument(selected.id);
      // Poll for completion
      let retries = 0;
      const poll = setInterval(async () => {
        retries++;
        await fetchDocuments();
        try {
          const res = await apiClient.getAnalysis(selected.id);
          if (res.data) {
            setAnalysis(res.data);
            setTab('analysis');
            clearInterval(poll);
            setAnalyzing(false);
          }
        } catch (e) {}
        if (retries > 20) { clearInterval(poll); setAnalyzing(false); }
      }, 3000);
    } catch (e: any) {
      alert(e.response?.data?.detail || 'Analysis failed');
      setAnalyzing(false);
    }
  };

  const handleChat = async () => {
    if (!chatMsg.trim()) return;
    const msg = chatMsg.trim();
    setChatMsg('');
    setChatHistory(h => [...h, { role: 'user', content: msg }]);
    setChatLoading(true);
    try {
      const res = await apiClient.askQuestion(msg, selected?.id);
      setChatHistory(h => [...h, { role: 'assistant', content: res.data.response || res.data.answer || 'No response' }]);
    } catch (e) {
      setChatHistory(h => [...h, { role: 'assistant', content: 'Failed to get response. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document?')) return;
    await deleteDocument(id);
    setSelected(null);
    setAnalysis(null);
  };

  const filtered = documents.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) || d.file_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Documents</h1>
              <p className="text-gray-500 text-sm mt-0.5">{documents.length} document{documents.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-[340px,1fr] gap-6">
            {/* Left: Upload + List */}
            <div className="space-y-5">
              <UploadZone onUpload={handleUpload} />

              {/* Search + List */}
              <div className="card overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="🔍 Search documents..."
                    className="input text-sm"
                  />
                </div>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="py-10 text-center text-gray-400 text-sm">No documents found</div>
                ) : (
                  <div className="max-h-[420px] overflow-y-auto">
                    {filtered.map(doc => (
                      <DocRow key={doc.id} doc={doc} selected={selected?.id === doc.id} onClick={() => handleSelect(doc)} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Document Detail */}
            {!selected ? (
              <div className="card flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <p className="text-gray-900 font-semibold text-lg">Select a document</p>
                  <p className="text-gray-400 text-sm mt-1">Choose from the list or upload a new document</p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Doc header */}
                <div className="card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 font-black text-sm">
                        {selected.file_type?.toUpperCase()?.slice(0, 3) || 'DOC'}
                      </div>
                      <div>
                        <h2 className="font-bold text-gray-900 text-xl">{selected.title}</h2>
                        <p className="text-gray-400 text-sm">{selected.file_name} · {selected.file_size ? `${(selected.file_size / 1024).toFixed(0)} KB` : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {selected.status !== 'analyzed' && !analyzing && (
                        <button onClick={handleAnalyze} className="btn-primary text-sm px-5 py-2">
                          🤖 Analyze with AI
                        </button>
                      )}
                      {analyzing && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                          <span className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></span>
                          Analyzing...
                        </div>
                      )}
                      <button onClick={() => handleDelete(selected.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-1 mt-5 bg-gray-100 rounded-xl p-1">
                    {(['overview', 'analysis', 'chat'] as const).map(t => (
                      <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-lg text-sm font-semibold transition capitalize ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        {t === 'overview' ? '📋 Overview' : t === 'analysis' ? '🔍 Analysis' : '💬 Chat'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab content */}
                {tab === 'overview' && (
                  <div className="card p-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { label: 'Status', value: selected.status, badge: true },
                        { label: 'File Type', value: selected.file_type?.toUpperCase() || '—' },
                        { label: 'Uploaded', value: new Date(selected.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                        { label: 'File Size', value: selected.file_size ? `${(selected.file_size / 1024).toFixed(1)} KB` : '—' },
                      ].map(item => (
                        <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{item.label}</p>
                          <p className="font-semibold text-gray-900 capitalize">{item.value}</p>
                        </div>
                      ))}
                    </div>
                    {selected.status !== 'analyzed' && !analyzing && (
                      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-5 text-center">
                        <p className="text-blue-800 font-semibold mb-3">Ready to analyze this document?</p>
                        <button onClick={handleAnalyze} className="btn-primary">🤖 Start AI Analysis</button>
                      </div>
                    )}
                    {analyzing && (
                      <div className="mt-6 bg-amber-50 border border-amber-100 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="w-5 h-5 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin"></span>
                          <p className="text-amber-800 font-semibold">AI agents are analyzing your document...</p>
                        </div>
                        <div className="space-y-2">
                          {['Document Analyzer', 'Case Researcher', 'Risk Detector', 'Compliance Checker'].map((agent, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm">
                              <span className="w-4 h-4 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin" style={{ animationDelay: `${i * 0.2}s` }}></span>
                              <span className="text-amber-700">{agent}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {tab === 'analysis' && (
                  <div className="card p-6">
                    {!analysis ? (
                      <div className="text-center py-10">
                        <p className="text-gray-500">No analysis available yet.</p>
                        <button onClick={handleAnalyze} className="btn-primary mt-4">Run Analysis</button>
                      </div>
                    ) : (
                      <AnalysisReport analysis={analysis} />
                    )}
                  </div>
                )}

                {tab === 'chat' && (
                  <div className="card flex flex-col" style={{ minHeight: 480 }}>
                    <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-80">
                      {chatHistory.length === 0 && (
                        <div className="text-center py-10 text-gray-400 text-sm">
                          <div className="text-4xl mb-3">💬</div>
                          <p>Ask anything about this document</p>
                          <div className="flex flex-wrap gap-2 justify-center mt-4">
                            {['What are the termination terms?', 'Who is liable?', 'What are the payment terms?'].map(q => (
                              <button key={q} onClick={() => setChatMsg(q)} className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100 hover:bg-blue-100 transition">{q}</button>
                            ))}
                          </div>
                        </div>
                      )}
                      {chatHistory.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="flex gap-1 items-center text-gray-400 text-sm pl-2">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 border-t border-gray-100 flex gap-2">
                      <input
                        value={chatMsg}
                        onChange={e => setChatMsg(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleChat()}
                        placeholder="Ask about this document..."
                        className="input text-sm flex-1"
                        disabled={chatLoading}
                      />
                      <button onClick={handleChat} disabled={!chatMsg.trim() || chatLoading} className="btn-primary px-4 disabled:opacity-50">
                        →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
