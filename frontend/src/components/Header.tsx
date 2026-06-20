'use client';

import Link from 'next/link';
import { useAuthStore } from '@/utils/store';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-gradient-legal text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          ⚖️ Legal Assistant
        </Link>
        
        <nav className="flex gap-6 items-center">
          {isAuthenticated ? (
            <>
              <Link href="/dashboard" className="hover:text-legal-gold transition">
                Dashboard
              </Link>
              <Link href="/documents" className="hover:text-legal-gold transition">
                Documents
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-legal-gold transition">
                Login
              </Link>
              <Link href="/register" className="bg-legal-gold text-legal-blue px-4 py-2 rounded hover:opacity-90 transition">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
