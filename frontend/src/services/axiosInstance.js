import axios from 'axios';

const normalizeApiUrl = (url) => url?.replace(/\/+$/, '');

const getApiBaseUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_MOCK_URL;
  if (configuredUrl) {
    return normalizeApiUrl(configuredUrl);
  }

  const hostname = window.location.hostname;
  if (import.meta.env.DEV || hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  }

  return '/api';
};

const axiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
});

export default axiosInstance;
