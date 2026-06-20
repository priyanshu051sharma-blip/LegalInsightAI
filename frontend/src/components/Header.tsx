'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/utils/store';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-bold text-xl">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg text-white shadow-lg">
              ⚖️
            </div>
            <span className="text-gray-900">Legal Assistant</span>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            <>
              <nav className="hidden md:flex items-center gap-8">
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition relative group">
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/documents" className="text-gray-700 hover:text-blue-600 font-medium transition relative group">
                  Documents
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/team" className="text-gray-700 hover:text-blue-600 font-medium transition relative group">
                  Team
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                {user?.role === 'SUPER_ADMIN' && (
                  <Link href="/admin" className="text-gray-700 hover:text-blue-600 font-medium transition relative group">
                    Admin
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
              </nav>

              {/* User Menu */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">{user?.full_name || user?.username}</p>
                    <p className="text-gray-500 text-xs">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-700 hover:bg-red-50 rounded-lg font-medium transition border border-gray-200 hover:border-red-200"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition">
                Sign In
              </Link>
              <Link href="/register" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-lg">
                Get Started
              </Link>
            </nav>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 space-y-2">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition">
                  Dashboard
                </Link>
                <Link href="/documents" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition">
                  Documents
                </Link>
                <Link href="/team" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition">
                  Team
                </Link>
                {user?.role === 'SUPER_ADMIN' && (
                  <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg transition">
                  Sign In
                </Link>
                <Link href="/register" className="block px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold transition">
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
