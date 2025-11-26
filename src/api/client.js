import axios from 'axios';

const baseURL =
  import.meta.env?.VITE_API_BASE_URL?.trim() ||
  (typeof window !== 'undefined' && window.__API_BASE_URL__) ||
  'http://localhost:3000';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

apiClient.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const { token } = JSON.parse(stored);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // ignore storage errors
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // optional: auto sign-out behavior can be added here
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  try {
    const prev = JSON.parse(localStorage.getItem('auth') || '{}');
    localStorage.setItem('auth', JSON.stringify({ ...prev, token }));
  } catch {
    // ignore storage errors
  }
};

export const clearAuthToken = () => {
  try {
    const prev = JSON.parse(localStorage.getItem('auth') || '{}');
    const { token: _omit, ...rest } = prev || {};
    localStorage.setItem('auth', JSON.stringify(rest));
  } catch {
    // ignore storage errors
  }
};

export default apiClient;


