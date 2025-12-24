import apiClient from './client';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  city: string;
  role?: 'student' | 'teacher' | 'admin';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    city: string;
  };
}

/**
 * Регистрация нового пользователя
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
    
    // Сохраняем токен если он есть
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Registration error:', error);
    throw error.response?.data || { success: false, message: 'Registration failed' };
  }
};

/**
 * Вход пользователя
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
    
    // Сохраняем токен если он есть
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw error.response?.data || { success: false, message: 'Login failed' };
  }
};

/**
 * Выход пользователя
 */
export const logout = async (): Promise<void> => {
  try {
    await apiClient.post('/api/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Всегда удаляем токен
    localStorage.removeItem('authToken');
  }
};

/**
 * Получение текущего пользователя
 */
export const getCurrentUser = async (): Promise<AuthResponse> => {
  try {
    const response = await apiClient.get<AuthResponse>('/api/auth/me');
    return response.data;
  } catch (error: any) {
    console.error('Get current user error:', error);
    throw error.response?.data || { success: false, message: 'Failed to get user' };
  }
};
