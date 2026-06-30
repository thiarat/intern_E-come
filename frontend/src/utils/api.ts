const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
  
  // Do not override Content-Type if it is FormData (like slip uploading)
  const isFormData = options.body instanceof FormData;
  
  // Check if token exists in localStorage (client-side only)
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
  }
  
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  return fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Enable HttpOnly cookies for cross-origin requests
  });
};
