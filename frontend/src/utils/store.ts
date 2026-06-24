import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  username: string;
  full_name?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error('Invalid credentials');
        }

        const data = await response.json();
        set({
          user: data.user || null,
          accessToken: data.access_token,
          isAuthenticated: true,
        });
        localStorage.setItem('accessToken', data.access_token);
        if (data.refresh_token) localStorage.setItem('refreshToken', data.refresh_token);
      },

      register: async (userData: any) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });

        if (!response.ok) {
          const err = await response.json();
          throw { response: { data: err } };
        }
      },

      logout: () => {
        set({ user: null, accessToken: null, isAuthenticated: false });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ accessToken, isAuthenticated: true });
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      },
    }),
    { name: 'auth-storage' }
  )
);


interface Document {
  id: string;
  title: string;
  file_name: string;
  file_type: string;
  status: string;
  created_at: string;
}

interface DocumentState {
  documents: Document[];
  currentDocument: Document | null;
  isLoading: boolean;
  fetchDocuments: () => Promise<void>;
  uploadDocument: (file: File, title: string) => Promise<Document>;
  setCurrentDocument: (doc: Document | null) => void;
  deleteDocument: (docId: string) => Promise<void>;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  currentDocument: null,
  isLoading: false,
  
  fetchDocuments: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        set({ documents: data });
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  uploadDocument: async (file: File, title: string) => {
    const token = localStorage.getItem('accessToken');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });
    
    if (response.ok) {
      const doc = await response.json();
      set({ documents: [doc, ...get().documents] });
      return doc;
    }
    throw new Error('Upload failed');
  },
  
  setCurrentDocument: (doc: Document | null) => {
    set({ currentDocument: doc });
  },
  
  deleteDocument: async (docId: string) => {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/documents/${docId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (response.ok) {
      set({
        documents: get().documents.filter(d => d.id !== docId),
        currentDocument: null,
      });
    }
  },
}));
