'use client';

import Link from 'next/link';
import { useAuthStore } from '@/utils/store';

export default function Home() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-legal">
      {/* Navigation */}
      <header className="bg-opacity-90 backdrop-blur-md bg-legal-blue text-white py-4 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="text-2xl font-bold">⚖️ Legal Assistant</div>
          <nav className="flex gap-6">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="hover:text-legal-gold transition">Dashboard</Link>
                <Link href="/documents" className="hover:text-legal-gold transition">Documents</Link>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-legal-gold transition">Login</Link>
                <Link href="/register" className="bg-legal-gold text-legal-blue px-4 py-2 rounded hover:opacity-90">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Intelligent Legal Document Analysis
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            AI-powered platform for analyzing contracts, identifying risks, and ensuring compliance
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="bg-legal-gold text-legal-blue px-8 py-3 rounded-lg font-bold text-lg hover:opacity-90 transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="bg-legal-gold text-legal-blue px-8 py-3 rounded-lg font-bold text-lg hover:opacity-90 transition"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/login"
                  className="bg-white text-legal-blue px-8 py-3 rounded-lg font-bold text-lg hover:opacity-90 transition"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Powered by AI Agents
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              icon: '📄',
              title: 'Document Analysis',
              desc: 'Extract key terms, obligations, and deadlines automatically'
            },
            {
              icon: '⚖️',
              title: 'Case Research',
              desc: 'Find relevant case laws and legal precedents instantly'
            },
            {
              icon: '⚠️',
              title: 'Risk Detection',
              desc: 'Identify high-risk clauses and missing protections'
            },
            {
              icon: '✅',
              title: 'Compliance Check',
              desc: 'Verify GDPR, HIPAA, CCPA and other regulations'
            },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-legal-blue mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-20 px-4 mt-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-legal-blue mb-6">
            Ready to Transform Your Legal Process?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of legal professionals using AI to work smarter
          </p>
          {!isAuthenticated && (
            <Link
              href="/register"
              className="inline-block bg-legal-blue text-white px-8 py-3 rounded-lg font-bold text-lg hover:opacity-90 transition"
            >
              Start Free Trial
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
