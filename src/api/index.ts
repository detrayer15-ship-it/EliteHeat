/**
 * Центральный модуль для всех API функций
 * Используйте этот файл для импорта любых API функций
 */

// API Client
export { default as apiClient } from './client';

// Authentication API
export * from './auth';
export type { RegisterData, LoginData, AuthResponse } from './auth';

// Admin API
export * from './admin';
export type { User, AdminResponse } from './admin';

// Submissions API
export * from './submissions';
export type {
  Submission,
  SubmitAssignmentData,
  ReviewSubmissionData,
  SubmissionsResponse,
} from './submissions';

// Chat API
export * from './chats';
export type {
  Chat,
  ChatMessage,
  SendMessageData,
  ChatResponse,
} from './chats';

// Courses API
export * from './courses';
export type {
  Course,
  Lesson,
  Assignment,
  CourseResponse,
} from './courses';

// Gemini AI API
export * from './gemini';
export {
  sendTextMessage,
  sendImageMessage,
  checkCode,
  helpWithPresentation,
  checkAPIStatus,
} from './gemini';
