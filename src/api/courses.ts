import apiClient from './client';

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  instructor?: string;
  thumbnail?: string;
  price?: number;
  enrolled?: number;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  duration?: string;
  order: number;
  completed?: boolean;
}

export interface Assignment {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  description: string;
  dueDate?: string;
  maxScore?: number;
  attachments?: string[];
  createdAt?: string;
}

export interface CourseResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * Получить все курсы
 */
export const getAllCourses = async (): Promise<CourseResponse<Course[]>> => {
  try {
    const response = await apiClient.get<CourseResponse<Course[]>>('/api/courses');
    return response.data;
  } catch (error: any) {
    console.error('Get all courses error:', error);
    throw error.response?.data || { success: false, message: 'Failed to get courses' };
  }
};

/**
 * Получить курс по ID
 */
export const getCourseById = async (courseId: string): Promise<CourseResponse<Course>> => {
  try {
    const response = await apiClient.get<CourseResponse<Course>>(`/api/courses/${courseId}`);
    return response.data;
  } catch (error: any) {
    console.error('Get course by ID error:', error);
    throw error.response?.data || { success: false, message: 'Failed to get course' };
  }
};

/**
 * Создать курс (админ/учитель)
 */
export const createCourse = async (data: Partial<Course>): Promise<CourseResponse<Course>> => {
  try {
    const response = await apiClient.post<CourseResponse<Course>>('/api/courses', data);
    return response.data;
  } catch (error: any) {
    console.error('Create course error:', error);
    throw error.response?.data || { success: false, message: 'Failed to create course' };
  }
};

/**
 * Обновить курс (админ/учитель)
 */
export const updateCourse = async (
  courseId: string,
  data: Partial<Course>
): Promise<CourseResponse<Course>> => {
  try {
    const response = await apiClient.put<CourseResponse<Course>>(`/api/courses/${courseId}`, data);
    return response.data;
  } catch (error: any) {
    console.error('Update course error:', error);
    throw error.response?.data || { success: false, message: 'Failed to update course' };
  }
};

/**
 * Удалить курс (админ)
 */
export const deleteCourse = async (courseId: string): Promise<CourseResponse> => {
  try {
    const response = await apiClient.delete<CourseResponse>(`/api/courses/${courseId}`);
    return response.data;
  } catch (error: any) {
    console.error('Delete course error:', error);
    throw error.response?.data || { success: false, message: 'Failed to delete course' };
  }
};

/**
 * Записаться на курс (студент)
 */
export const enrollCourse = async (courseId: string): Promise<CourseResponse> => {
  try {
    const response = await apiClient.post<CourseResponse>(`/api/courses/${courseId}/enroll`);
    return response.data;
  } catch (error: any) {
    console.error('Enroll course error:', error);
    throw error.response?.data || { success: false, message: 'Failed to enroll in course' };
  }
};

/**
 * Получить уроки курса
 */
export const getCourseLessons = async (courseId: string): Promise<CourseResponse<Lesson[]>> => {
  try {
    const response = await apiClient.get<CourseResponse<Lesson[]>>(`/api/courses/${courseId}/lessons`);
    return response.data;
  } catch (error: any) {
    console.error('Get course lessons error:', error);
    throw error.response?.data || { success: false, message: 'Failed to get lessons' };
  }
};

/**
 * Получить задания курса
 */
export const getCourseAssignments = async (courseId: string): Promise<CourseResponse<Assignment[]>> => {
  try {
    const response = await apiClient.get<CourseResponse<Assignment[]>>(`/api/courses/${courseId}/assignments`);
    return response.data;
  } catch (error: any) {
    console.error('Get course assignments error:', error);
    throw error.response?.data || { success: false, message: 'Failed to get assignments' };
  }
};
