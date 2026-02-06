import { lazy } from 'react';

// Lazy load all pages for better performance
export const LandingPage = lazy(() => import('../pages/LandingPage').then(m => ({ default: m.LandingPage })));
export const Dashboard = lazy(() => import('../pages/Dashboard').then(m => ({ default: m.Dashboard })));
export const ProjectsPage = lazy(() => import('../pages/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
export const TasksPage = lazy(() => import('../pages/TasksPage').then(m => ({ default: m.TasksPage })));
export const ProgressTrackerPage = lazy(() => import('../pages/ProgressTrackerPage').then(m => ({ default: m.ProgressTrackerPage })));
export const AIReviewPage = lazy(() => import('../pages/AnalyzerPage').then(m => ({ default: m.AIReviewPage })));
export const AIAssistantPage = lazy(() => import('../pages/AIAssistantPage').then(m => ({ default: m.AIAssistantPage })));
export const LoginPage = lazy(() => import('../pages/LoginPage').then(m => ({ default: m.LoginPage })));
export const RegisterPage = lazy(() => import('../pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
export const SettingsPage = lazy(() => import('../pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
export const ProfileEditPage = lazy(() => import('../pages/ProfileEditPage').then(m => ({ default: m.ProfileEditPage })));
export const SubscriptionPage = lazy(() => import('../pages/SubscriptionPage').then(m => ({ default: m.SubscriptionPage })));
export const AboutPage = lazy(() => import('../pages/AboutPage').then(m => ({ default: m.AboutPage })));
export const LocationsPage = lazy(() => import('../pages/LocationsPage').then(m => ({ default: m.LocationsPage })));
export const PaymentPage = lazy(() => import('../pages/PaymentPage').then(m => ({ default: m.PaymentPage })));
export const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
export const TaskReviewPage = lazy(() => import('../pages/TaskReviewPage').then(m => ({ default: m.TaskReviewPage })));
export const SubmissionsPage = lazy(() => import('../pages/SubmissionsPage').then(m => ({ default: m.SubmissionsPage })));
export const FamilySubscriptionPage = lazy(() => import('../pages/FamilySubscriptionPage').then(m => ({ default: m.FamilySubscriptionPage })));
export const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
export const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })));
export const AdminUserEditPage = lazy(() => import('../pages/AdminUserEditPage').then(m => ({ default: m.AdminUserEditPage })));
export const AdminGroupsPage = lazy(() => import('../pages/AdminGroupsPage').then(m => ({ default: m.AdminGroupsPage })));
export const MyAssignmentsPage = lazy(() => import('../pages/MyAssignmentsPage').then(m => ({ default: m.MyAssignmentsPage })));
export const AdminChatPage = lazy(() => import('../pages/AdminChatPage').then(m => ({ default: m.AdminChatPage })));
export const AdminGroupChatPage = lazy(() => import('../pages/AdminGroupChatPage').then(m => ({ default: m.AdminGroupChatPage })));
export const StudentChatPage = lazy(() => import('../pages/StudentChatPage').then(m => ({ default: m.StudentChatPage })));
export const DeveloperSetupPage = lazy(() => import('../pages/DeveloperSetupPage').then(m => ({ default: m.DeveloperSetupPage })));
export const DeveloperPanel = lazy(() => import('../pages/DeveloperPanel').then(m => ({ default: m.DeveloperPanel })));
export const AdminRanksPage = lazy(() => import('../pages/admin/AdminRanksPage').then(m => ({ default: m.AdminRanksPage })));
export const PythonLessonPage = lazy(() => import('../pages/PythonLessonPage').then(m => ({ default: m.PythonLessonPage })));
export const FigmaLessonPage = lazy(() => import('../pages/FigmaLessonPage').then(m => ({ default: m.FigmaLessonPage })));
export const ProjectDetailPage = lazy(() => import('../pages/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage })));
export const SubmitAssignmentPage = lazy(() => import('../pages/SubmitAssignmentPage').then(m => ({ default: m.SubmitAssignmentPage })));
export const ReviewAssignmentsPage = lazy(() => import('../pages/ReviewAssignmentsPage').then(m => ({ default: m.ReviewAssignmentsPage })));
export const PublicPortfolioPage = lazy(() => import('../pages/PublicPortfolioPage').then(m => ({ default: m.PublicPortfolioPage })));

// Developer pages
export const FeatureFlagsPage = lazy(() => import('../pages/developer/FeatureFlagsPage').then(m => ({ default: m.FeatureFlagsPage })));
export const ModulesPage = lazy(() => import('../pages/developer/ModulesPage').then(m => ({ default: m.ModulesPage })));
export const LiveActivityPage = lazy(() => import('../pages/developer/LiveActivityPage').then(m => ({ default: m.LiveActivityPage })));
export const MaintenancePage = lazy(() => import('../pages/developer/MaintenancePage').then(m => ({ default: m.MaintenancePage })));
export const BlocksPage = lazy(() => import('../pages/developer/BlocksPage').then(m => ({ default: m.BlocksPage })));
export const AccessMatrixPage = lazy(() => import('../pages/developer/AccessMatrixPage').then(m => ({ default: m.AccessMatrixPage })));
export const AIControlPage = lazy(() => import('../pages/developer/AIControlPage').then(m => ({ default: m.AIControlPage })));
export const AIStatsPage = lazy(() => import('../pages/developer/AIStatsPage').then(m => ({ default: m.AIStatsPage })));
export const TestDataPage = lazy(() => import('../pages/developer/TestDataPage').then(m => ({ default: m.TestDataPage })));
export const ErrorMonitorPage = lazy(() => import('../pages/developer/ErrorMonitorPage').then(m => ({ default: m.ErrorMonitorPage })));
export const ExportPage = lazy(() => import('../pages/developer/ExportPage').then(m => ({ default: m.ExportPage })));
export const ImportPage = lazy(() => import('../pages/developer/ImportPage').then(m => ({ default: m.ImportPage })));
export const PerformancePage = lazy(() => import('../pages/developer/PerformancePage').then(m => ({ default: m.PerformancePage })));
export const APITestPage = lazy(() => import('../pages/developer/APITestPage'));

// Admin pages
export const StudentMonitoringPage = lazy(() => import('../pages/admin/StudentMonitoringPage').then(m => ({ default: m.StudentMonitoringPage })));
export const EnhancedReviewPage = lazy(() => import('../pages/admin/EnhancedReviewPage').then(m => ({ default: m.EnhancedReviewPage })));
export const EnhancedGroupsPage = lazy(() => import('../pages/admin/EnhancedGroupsPage').then(m => ({ default: m.EnhancedGroupsPage })));
export const AnalyticsPage = lazy(() => import('../pages/admin/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
export const EnhancedChatPage = lazy(() => import('../pages/admin/EnhancedChatPage').then(m => ({ default: m.EnhancedChatPage })));
export const AdminOpsChat = lazy(() => import('../pages/admin/AdminOpsChat').then(m => ({ default: m.AdminOpsChat })));
export const AIActivityMonitorPage = lazy(() => import('../pages/admin/AIActivityMonitorPage').then(m => ({ default: m.AIActivityMonitorPage })));
export const AppealsPage = lazy(() => import('../pages/admin/AppealsPage').then(m => ({ default: m.AppealsPage })));
export const SupportChatsPage = lazy(() => import('../pages/admin/SupportChatsPage').then(m => ({ default: m.SupportChatsPage })));

// Student & Teacher pages
export const StudentChatsPage = lazy(() => import('../pages/student/StudentChatsPage').then(m => ({ default: m.StudentChatsPage })));
export const AchievementsPage = lazy(() => import('../pages/student/AchievementsPage'));
export const SupportPage = lazy(() => import('../pages/student/SupportPage').then(m => ({ default: m.SupportPage })));
export const TeacherDashboard = lazy(() => import('../pages/teacher/TeacherDashboard').then(m => ({ default: m.TeacherDashboard })));
