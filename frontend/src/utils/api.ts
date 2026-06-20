import axios, { AxiosInstance } from 'axios';

class ApiClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Add auth token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }
  
  // Auth endpoints
  async register(data: any) {
    return this.client.post('/auth/register', data);
  }
  
  async login(email: string, password: string) {
    return this.client.post('/auth/login', { email, password });
  }
  
  // Document endpoints
  async getDocuments() {
    return this.client.get('/documents/');
  }
  
  async uploadDocument(formData: FormData) {
    return this.client.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
  
  async getDocument(id: string) {
    return this.client.get(`/documents/${id}`);
  }
  
  async deleteDocument(id: string) {
    return this.client.delete(`/documents/${id}`);
  }
  
  async getAnalysis(id: string) {
    return this.client.get(`/documents/${id}/analysis`);
  }
  
  // Analysis endpoints
  async analyzeDocument(docId: string, type: string = 'full') {
    return this.client.post(`/analysis/analyze/${docId}?analysis_type=${type}`);
  }
  
  async getAnalysisStatus(docId: string) {
    return this.client.get(`/analysis/status/${docId}`);
  }
  
  // Chat endpoints
  async askQuestion(query: string, docId?: string) {
    return this.client.post('/chat/ask', {
      query,
      document_id: docId,
    });
  }
  
  // Report endpoints
  async generateReport(docId: string, options: any = {}) {
    return this.client.post(`/reports/generate/${docId}`, options);
  }
  
  async downloadReport(docId: string) {
    return this.client.get(`/reports/download/${docId}`);
  }
}

export const apiClient = new ApiClient();
