import apiClient from './client';

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName?: string;
  senderRole?: 'student' | 'teacher' | 'admin';
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Chat {
  id: string;
  studentId: string;
  studentName?: string;
  messages: ChatMessage[];
  unreadCount: number;
  lastMessage?: ChatMessage;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageData {
  content: string;
}

export interface ChatResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * Получить мой чат (студент)
 */
export const getMyChat = async (): Promise<ChatResponse<Chat>> => {
  try {
    const response = await apiClient.get<ChatResponse<Chat>>('/api/chats/my');
    return response.data;
  } catch (error: any) {
    console.error('Get my chat error:', error);
    throw error.response?.data || { success: false, message: 'Failed to get chat' };
  }
};

/**
 * Получить чат по ID (админ/учитель)
 */
export const getChatById = async (chatId: string): Promise<ChatResponse<Chat>> => {
  try {
    const response = await apiClient.get<ChatResponse<Chat>>(`/api/chats/${chatId}`);
    return response.data;
  } catch (error: any) {
    console.error('Get chat by ID error:', error);
    throw error.response?.data || { success: false, message: 'Failed to get chat' };
  }
};

/**
 * Отправить сообщение в чат
 */
export const sendMessage = async (
  chatId: string,
  data: SendMessageData
): Promise<ChatResponse<ChatMessage>> => {
  try {
    const response = await apiClient.post<ChatResponse<ChatMessage>>(
      `/api/chats/${chatId}/message`,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error('Send message error:', error);
    throw error.response?.data || { success: false, message: 'Failed to send message' };
  }
};

/**
 * Отметить сообщения как прочитанные (админ/учитель)
 */
export const markAsRead = async (chatId: string): Promise<ChatResponse> => {
  try {
    const response = await apiClient.put<ChatResponse>(`/api/chats/${chatId}/read`);
    return response.data;
  } catch (error: any) {
    console.error('Mark as read error:', error);
    throw error.response?.data || { success: false, message: 'Failed to mark as read' };
  }
};

/**
 * Получить все чаты (админ/учитель)
 */
export const getAllChats = async (): Promise<ChatResponse<Chat[]>> => {
  try {
    const response = await apiClient.get<ChatResponse<Chat[]>>('/api/chats');
    return response.data;
  } catch (error: any) {
    console.error('Get all chats error:', error);
    throw error.response?.data || { success: false, message: 'Failed to get chats' };
  }
};
