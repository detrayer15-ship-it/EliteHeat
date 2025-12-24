/**
 * React Hooks для работы с API
 * Используйте эти хуки в компонентах для удобной работы с API
 */

import { useState, useEffect, useCallback } from 'react';
import * as api from './index';

/**
 * Хук для работы с асинхронными API запросами
 */
export function useAPI<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction();
        if (mounted) {
          setData(result);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'An error occurred');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, dependencies);

  return { data, loading, error };
}

/**
 * Хук для отправки сообщений в Gemini AI
 */
export function useGeminiChat() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.sendTextMessage(message);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { sendMessage, loading, error };
}

/**
 * Хук для работы с submissions
 */
export function useSubmissions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (data: api.SubmitAssignmentData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.submitAssignment(data);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to submit assignment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMySubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getMySubmissions();
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to get submissions');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, getMySubmissions, loading, error };
}

/**
 * Хук для работы с чатом
 */
export function useChat(chatId?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!chatId) {
      throw new Error('Chat ID is required');
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.sendMessage(chatId, { content });
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  const getChat = useCallback(async () => {
    if (!chatId) {
      throw new Error('Chat ID is required');
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.getChatById(chatId);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to get chat');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  return { sendMessage, getChat, loading, error };
}

/**
 * Хук для работы с курсами
 */
export function useCourses() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAllCourses();
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to get courses');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCourse = useCallback(async (courseId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getCourseById(courseId);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to get course');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const enrollCourse = useCallback(async (courseId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.enrollCourse(courseId);
      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to enroll in course');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getAllCourses, getCourse, enrollCourse, loading, error };
}
