import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Создаем базовый API клиент
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Для работы с cookies/sessions
});

// Интерцептор для добавления токена к запросам
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Получаем токен из localStorage
    const token = localStorage.getItem('authToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ответов
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.status);
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ Response Error:', error.response?.status, error.message);
    
    // Обработка ошибок авторизации
    if (error.response?.status === 401) {
      console.warn('⚠️ Unauthorized - redirecting to login');
      localStorage.removeItem('authToken');
      // Можно добавить редирект на страницу логина
      // window.location.href = '/login';
    }
    
    // Обработка ошибок сервера
    if (error.response?.status === 500) {
      console.error('🔥 Server Error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
