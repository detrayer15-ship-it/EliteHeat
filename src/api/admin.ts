import apiClient from './client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  city: string;
  createdAt?: string;
}

export interface AdminResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * Получить всех пользователей (только для админов)
 */
export const getAllUsers = async (): Promise<AdminResponse<User[]>> => {
  try {
    const response = await apiClient.get<AdminResponse<User[]>>('/api/admin/users');
    return response.data;
  } catch (error: any) {
    console.error('Get all users error:', error);
    throw error.response?.data || { success: false, message: 'Failed to get users' };
  }
};

/**
 * Получить пользователя по ID
 */
export const getUserById = async (userId: string): Promise<AdminResponse<User>> => {
  try {
    const response = await apiClient.get<AdminResponse<User>>(`/api/admin/users/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Get user by ID error:', error);
    throw error.response?.data || { success: false, message: 'Failed to get user' };
  }
};

/**
 * Обновить пользователя
 */
export const updateUser = async (userId: string, data: Partial<User>): Promise<AdminResponse<User>> => {
  try {
    const response = await apiClient.put<AdminResponse<User>>(`/api/admin/users/${userId}`, data);
    return response.data;
  } catch (error: any) {
    console.error('Update user error:', error);
    throw error.response?.data || { success: false, message: 'Failed to update user' };
  }
};

/**
 * Удалить пользователя
 */
export const deleteUser = async (userId: string): Promise<AdminResponse> => {
  try {
    const response = await apiClient.delete<AdminResponse>(`/api/admin/users/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Delete user error:', error);
    throw error.response?.data || { success: false, message: 'Failed to delete user' };
  }
};

/**
 * Получить статистику платформы
 */
export const getPlatformStats = async (): Promise<AdminResponse> => {
  try {
    const response = await apiClient.get<AdminResponse>('/api/admin/stats');
    return response.data;
  } catch (error: any) {
    console.error('Get platform stats error:', error);
    throw error.response?.data || { success: false, message: 'Failed to get stats' };
  }
};
