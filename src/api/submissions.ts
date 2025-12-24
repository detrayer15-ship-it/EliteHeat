import apiClient from './client';

export interface Submission {
  id: string;
  studentId: string;
  studentName?: string;
  assignmentId: string;
  assignmentTitle?: string;
  content: string;
  fileUrl?: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  grade?: number;
  feedback?: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface SubmitAssignmentData {
  assignmentId: string;
  content: string;
  fileUrl?: string;
}

export interface ReviewSubmissionData {
  status: 'approved' | 'rejected';
  grade?: number;
  feedback?: string;
}

export interface SubmissionsResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * Отправить задание (студент)
 */
export const submitAssignment = async (data: SubmitAssignmentData): Promise<SubmissionsResponse<Submission>> => {
  try {
    const response = await apiClient.post<SubmissionsResponse<Submission>>('/api/submissions', data);
    return response.data;
  } catch (error: any) {
    console.error('Submit assignment error:', error);
    throw error.response?.data || { success: false, message: 'Failed to submit assignment' };
  }
};

/**
 * Получить все submissions (админ/учитель)
 */
export const getAllSubmissions = async (): Promise<SubmissionsResponse<Submission[]>> => {
  try {
    const response = await apiClient.get<SubmissionsResponse<Submission[]>>('/api/submissions');
    return response.data;
  } catch (error: any) {
    console.error('Get all submissions error:', error);
    throw error.response?.data || { success: false, message: 'Failed to get submissions' };
  }
};

/**
 * Получить мои submissions (студент)
 */
export const getMySubmissions = async (): Promise<SubmissionsResponse<Submission[]>> => {
  try {
    const response = await apiClient.get<SubmissionsResponse<Submission[]>>('/api/submissions/my');
    return response.data;
  } catch (error: any) {
    console.error('Get my submissions error:', error);
    throw error.response?.data || { success: false, message: 'Failed to get your submissions' };
  }
};

/**
 * Проверить submission (админ/учитель)
 */
export const reviewSubmission = async (
  submissionId: string,
  data: ReviewSubmissionData
): Promise<SubmissionsResponse<Submission>> => {
  try {
    const response = await apiClient.put<SubmissionsResponse<Submission>>(
      `/api/submissions/${submissionId}/review`,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error('Review submission error:', error);
    throw error.response?.data || { success: false, message: 'Failed to review submission' };
  }
};

/**
 * Получить submission по ID
 */
export const getSubmissionById = async (submissionId: string): Promise<SubmissionsResponse<Submission>> => {
  try {
    const response = await apiClient.get<SubmissionsResponse<Submission>>(`/api/submissions/${submissionId}`);
    return response.data;
  } catch (error: any) {
    console.error('Get submission by ID error:', error);
    throw error.response?.data || { success: false, message: 'Failed to get submission' };
  }
};
