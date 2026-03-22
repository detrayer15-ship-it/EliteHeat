import { lazy } from 'react';

// Lazy load all pages for better performance
export const LandingPage = lazy(() => import('../pages/LandingPage').then(m => ({ default: m.LandingPage })));
export const Dashboard = lazy(() => import('../pages/Dashboard').then(m => ({ default: m.Dashboard })));

export const TasksPage = lazy(() => import('../pages/TasksPage').then(m => ({ default: m.TasksPage })));
export const ProgressTrackerPage = lazy(() => import('../pages/ProgressTrackerPage').then(m => ({ default: m.ProgressTrackerPage })));

export const LoginPage = lazy(() => import('../pages/LoginPage').then(m => ({ default: m.LoginPage })));
export const RegisterPage = lazy(() => import('../pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
export const ChooseDirectionPage = lazy(() => import('../pages/ChooseDirectionPage').then(m => ({ default: m.ChooseDirectionPage })));
export const SelectRolePage = lazy(() => import('../pages/SelectRolePage').then(m => ({ default: m.SelectRolePage })));
export const BecomeTeacherPage = lazy(() => import('../pages/BecomeTeacherPage').then(m => ({ default: m.BecomeTeacherPage })));
export const SettingsPage = lazy(() => import('../pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
export const ProfileEditPage = lazy(() => import('../pages/ProfileEditPage').then(m => ({ default: m.ProfileEditPage })));
export const SubscriptionPage = lazy(() => import('../pages/SubscriptionPage').then(m => ({ default: m.SubscriptionPage })));
export const AboutPage = lazy(() => import('../pages/AboutPage').then(m => ({ default: m.AboutPage })));
export const LocationsPage = lazy(() => import('../pages/LocationsPage').then(m => ({ default: m.LocationsPage })));
export const PaymentPage = lazy(() => import('../pages/PaymentPage').then(m => ({ default: m.PaymentPage })));
export const AdminDashboardPage = lazy(() => import('../pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
export const TaskReviewPage = lazy(() => import('../pages/TaskReviewPage').then(m => ({ default: m.TaskReviewPage })));
export const SubmissionsPage = lazy(() => import('../pages/SubmissionsPage').then(m => ({ default: m.SubmissionsPage })));
export const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
export const AdminUsersPage = lazy(() => import('../pages/admin/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })));
export const AdminUserEditPage = lazy(() => import('../pages/AdminUserEditPage').then(m => ({ default: m.AdminUserEditPage })));

export const AdminGroupChatPage = lazy(() => import('../pages/AdminGroupChatPage').then(m => ({ default: m.AdminGroupChatPage })));
export const DeveloperSetupPage = lazy(() => import('../pages/DeveloperSetupPage').then(m => ({ default: m.DeveloperSetupPage })));
export const DeveloperPanel = lazy(() => import('../pages/DeveloperPanel').then(m => ({ default: m.DeveloperPanel })));
export const PythonLessonPage = lazy(() => import('../pages/PythonLessonPage').then(m => ({ default: m.PythonLessonPage })));
export const FigmaLessonPage = lazy(() => import('../pages/FigmaLessonPage').then(m => ({ default: m.FigmaLessonPage })));
export const DirectionLessonPage = lazy(() => import('../pages/DirectionLessonPage').then(m => ({ default: m.DirectionLessonPage })));


export const ReviewAssignmentsPage = lazy(() => import('../pages/ReviewAssignmentsPage').then(m => ({ default: m.ReviewAssignmentsPage })));

// Developer pages
export const FeatureFlagsPage = lazy(() => import('../pages/developer/FeatureFlagsPage').then(m => ({ default: m.FeatureFlagsPage })));
export const ModulesPage = lazy(() => import('../pages/developer/ModulesPage').then(m => ({ default: m.ModulesPage })));
export const LiveActivityPage = lazy(() => import('../pages/developer/LiveActivityPage').then(m => ({ default: m.LiveActivityPage })));
export const MaintenancePage = lazy(() => import('../pages/developer/MaintenancePage').then(m => ({ default: m.MaintenancePage })));
export const BlocksPage = lazy(() => import('../pages/developer/BlocksPage').then(m => ({ default: m.BlocksPage })));
export const AccessMatrixPage = lazy(() => import('../pages/developer/AccessMatrixPage').then(m => ({ default: m.AccessMatrixPage })));

export const TestDataPage = lazy(() => import('../pages/developer/TestDataPage').then(m => ({ default: m.TestDataPage })));
export const ErrorMonitorPage = lazy(() => import('../pages/developer/ErrorMonitorPage').then(m => ({ default: m.ErrorMonitorPage })));
export const ExportPage = lazy(() => import('../pages/developer/ExportPage').then(m => ({ default: m.ExportPage })));
export const ImportPage = lazy(() => import('../pages/developer/ImportPage').then(m => ({ default: m.ImportPage })));
export const PerformancePage = lazy(() => import('../pages/developer/PerformancePage').then(m => ({ default: m.PerformancePage })));
export const APITestPage = lazy(() => import('../pages/developer/APITestPage'));

// Admin pages
export const StudentMonitoringPage = lazy(() => import('../pages/admin/StudentMonitoringPage').then(m => ({ default: m.StudentMonitoringPage })));
export const EnhancedReviewPage = lazy(() => import('../pages/admin/EnhancedReviewPage').then(m => ({ default: m.EnhancedReviewPage })));
export const AnalyticsPage = lazy(() => import('../pages/admin/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
export const EnhancedChatPage = lazy(() => import('../pages/admin/EnhancedChatPage').then(m => ({ default: m.EnhancedChatPage })));
export const AdminOpsChat = lazy(() => import('../pages/admin/AdminOpsChat').then(m => ({ default: m.AdminOpsChat })));

export const AppealsPage = lazy(() => import('../pages/admin/AppealsPage').then(m => ({ default: m.AppealsPage })));
export const SupportChatsPage = lazy(() => import('../pages/admin/SupportChatsPage').then(m => ({ default: m.SupportChatsPage })));
export const AdminTeacherApplicationsPage = lazy(() => import('../pages/admin/AdminTeacherApplicationsPage').then(m => ({ default: m.AdminTeacherApplicationsPage })));

// Student & Teacher pages
export const SupportPage = lazy(() => import('../pages/student/SupportPage').then(m => ({ default: m.SupportPage })));
export const TeacherDashboard = lazy(() => import('../pages/teacher/TeacherDashboard').then(m => ({ default: m.TeacherDashboard })));
export const MonitoringCenterPage = lazy(() => import('../pages/teacher/MonitoringCenterPage').then(m => ({ default: m.MonitoringCenterPage })));
export const GroupsManagementPage = lazy(() => import('../pages/teacher/GroupsManagementPage').then(m => ({ default: m.GroupsManagementPage })));

export const StudentSchedulePage = lazy(() => import('../pages/StudentSchedulePage').then(m => ({ default: m.StudentSchedulePage })));
export const TeacherSchedulePage = lazy(() => import('../pages/TeacherSchedulePage').then(m => ({ default: m.TeacherSchedulePage })));
