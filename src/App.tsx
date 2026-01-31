import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ToastProvider } from './components/ui/Toast'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { useProjectStore } from './store/projectStore'
import { useTaskStore } from './store/taskStore'
import { useSettingsStore } from './store/settingsStore'
import { useAuthStore } from './store/authStore'
import { AchievementNotifier } from './components/gamification/AchievementNotifier'

// Loading component for Suspense
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 animate-pulse">Загрузка...</p>
        </div>
    </div>
)

// Lazy load all pages for better performance
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })))
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then(m => ({ default: m.ProjectsPage })))
const TasksPage = lazy(() => import('./pages/TasksPage').then(m => ({ default: m.TasksPage })))
const ProgressTrackerPage = lazy(() => import('./pages/ProgressTrackerPage').then(m => ({ default: m.ProgressTrackerPage })))
const AIReviewPage = lazy(() => import('./pages/AnalyzerPage').then(m => ({ default: m.AIReviewPage })))
const AIAssistantPage = lazy(() => import('./pages/AIAssistantPage').then(m => ({ default: m.AIAssistantPage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })))
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })))
const ProfileEditPage = lazy(() => import('./pages/ProfileEditPage').then(m => ({ default: m.ProfileEditPage })))
const SubscriptionPage = lazy(() => import('./pages/SubscriptionPage').then(m => ({ default: m.SubscriptionPage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })))
const LocationsPage = lazy(() => import('./pages/LocationsPage').then(m => ({ default: m.LocationsPage })))
const PaymentPage = lazy(() => import('./pages/PaymentPage').then(m => ({ default: m.PaymentPage })))
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })))
const TaskReviewPage = lazy(() => import('./pages/TaskReviewPage').then(m => ({ default: m.TaskReviewPage })))
const SubmissionsPage = lazy(() => import('./pages/SubmissionsPage').then(m => ({ default: m.SubmissionsPage })))
const FamilySubscriptionPage = lazy(() => import('./pages/FamilySubscriptionPage').then(m => ({ default: m.FamilySubscriptionPage })))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })))
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })))
const AdminUserEditPage = lazy(() => import('./pages/AdminUserEditPage').then(m => ({ default: m.AdminUserEditPage })))
const AdminGroupsPage = lazy(() => import('./pages/AdminGroupsPage').then(m => ({ default: m.AdminGroupsPage })))
const MyAssignmentsPage = lazy(() => import('./pages/MyAssignmentsPage').then(m => ({ default: m.MyAssignmentsPage })))
const AdminChatPage = lazy(() => import('./pages/AdminChatPage').then(m => ({ default: m.AdminChatPage })))
const AdminGroupChatPage = lazy(() => import('./pages/AdminGroupChatPage').then(m => ({ default: m.AdminGroupChatPage })))
const StudentChatPage = lazy(() => import('./pages/StudentChatPage').then(m => ({ default: m.StudentChatPage })))
const DeveloperSetupPage = lazy(() => import('./pages/DeveloperSetupPage').then(m => ({ default: m.DeveloperSetupPage })))
const DeveloperPanel = lazy(() => import('./pages/DeveloperPanel').then(m => ({ default: m.DeveloperPanel })))
const AdminRanksPage = lazy(() => import('./pages/admin/AdminRanksPage').then(m => ({ default: m.AdminRanksPage })))
const PythonLessonPage = lazy(() => import('./pages/PythonLessonPage').then(m => ({ default: m.PythonLessonPage })))
const FigmaLessonPage = lazy(() => import('./pages/FigmaLessonPage').then(m => ({ default: m.FigmaLessonPage })))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage })))
const SubmitAssignmentPage = lazy(() => import('./pages/SubmitAssignmentPage').then(m => ({ default: m.SubmitAssignmentPage })))
const ReviewAssignmentsPage = lazy(() => import('./pages/ReviewAssignmentsPage').then(m => ({ default: m.ReviewAssignmentsPage })))
const PublicPortfolioPage = lazy(() => import('./pages/PublicPortfolioPage').then(m => ({ default: m.PublicPortfolioPage })))

// Developer pages
const FeatureFlagsPage = lazy(() => import('./pages/developer/FeatureFlagsPage').then(m => ({ default: m.FeatureFlagsPage })))
const ModulesPage = lazy(() => import('./pages/developer/ModulesPage').then(m => ({ default: m.ModulesPage })))
const LiveActivityPage = lazy(() => import('./pages/developer/LiveActivityPage').then(m => ({ default: m.LiveActivityPage })))
const MaintenancePage = lazy(() => import('./pages/developer/MaintenancePage').then(m => ({ default: m.MaintenancePage })))
const BlocksPage = lazy(() => import('./pages/developer/BlocksPage').then(m => ({ default: m.BlocksPage })))
const AccessMatrixPage = lazy(() => import('./pages/developer/AccessMatrixPage').then(m => ({ default: m.AccessMatrixPage })))
const AIControlPage = lazy(() => import('./pages/developer/AIControlPage').then(m => ({ default: m.AIControlPage })))
const AIStatsPage = lazy(() => import('./pages/developer/AIStatsPage').then(m => ({ default: m.AIStatsPage })))
const TestDataPage = lazy(() => import('./pages/developer/TestDataPage').then(m => ({ default: m.TestDataPage })))
const ErrorMonitorPage = lazy(() => import('./pages/developer/ErrorMonitorPage').then(m => ({ default: m.ErrorMonitorPage })))
const ExportPage = lazy(() => import('./pages/developer/ExportPage').then(m => ({ default: m.ExportPage })))
const ImportPage = lazy(() => import('./pages/developer/ImportPage').then(m => ({ default: m.ImportPage })))
const PerformancePage = lazy(() => import('./pages/developer/PerformancePage').then(m => ({ default: m.PerformancePage })))
const APITestPage = lazy(() => import('./pages/developer/APITestPage'))

// Admin pages
const StudentMonitoringPage = lazy(() => import('./pages/admin/StudentMonitoringPage').then(m => ({ default: m.StudentMonitoringPage })))
const EnhancedReviewPage = lazy(() => import('./pages/admin/EnhancedReviewPage').then(m => ({ default: m.EnhancedReviewPage })))
const EnhancedGroupsPage = lazy(() => import('./pages/admin/EnhancedGroupsPage').then(m => ({ default: m.EnhancedGroupsPage })))
const AnalyticsPage = lazy(() => import('./pages/admin/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })))
const EnhancedChatPage = lazy(() => import('./pages/admin/EnhancedChatPage').then(m => ({ default: m.EnhancedChatPage })))
const AdminOpsChat = lazy(() => import('./pages/admin/AdminOpsChat').then(m => ({ default: m.AdminOpsChat })))
const AIActivityMonitorPage = lazy(() => import('./pages/admin/AIActivityMonitorPage').then(m => ({ default: m.AIActivityMonitorPage })))
const AppealsPage = lazy(() => import('./pages/admin/AppealsPage').then(m => ({ default: m.AppealsPage })))
const SupportChatsPage = lazy(() => import('./pages/admin/SupportChatsPage').then(m => ({ default: m.SupportChatsPage })))

// Student & Teacher pages
const StudentChatsPage = lazy(() => import('./pages/student/StudentChatsPage').then(m => ({ default: m.StudentChatsPage })))
const AchievementsPage = lazy(() => import('./pages/student/AchievementsPage'))
const SupportPage = lazy(() => import('./pages/student/SupportPage').then(m => ({ default: m.SupportPage })))
const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard').then(m => ({ default: m.TeacherDashboard })))

// Helper component for protected routes with layout
const ProtectedPage = ({ children }: { children: React.ReactNode }) => (
    <ProtectedRoute>
        <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
)

function App() {
    const loadProjects = useProjectStore((state) => state.loadProjects)
    const loadTasks = useTaskStore((state) => state.loadTasks)
    const theme = useSettingsStore((state) => state.theme)
    const loadUser = useAuthStore((state) => state.loadUser)

    useEffect(() => {
        loadProjects()
        loadTasks()
        loadUser()

        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [loadProjects, loadTasks, loadUser, theme])

    return (
        <ErrorBoundary>
            <ToastProvider>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <AchievementNotifier />
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            {/* Public routes */}
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/dev-setup" element={<DeveloperSetupPage />} />
                            <Route path="/subscription" element={<SubscriptionPage />} />

                            {/* Protected routes */}
                            <Route path="/dashboard" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
                            <Route path="/projects" element={<ProtectedPage><ProjectsPage /></ProtectedPage>} />
                            <Route path="/projects/:id" element={<ProtectedPage><ProjectDetailPage /></ProtectedPage>} />
                            <Route path="/tasks" element={<ProtectedPage><TasksPage /></ProtectedPage>} />
                            <Route path="/submit-assignment" element={<ProtectedPage><SubmitAssignmentPage /></ProtectedPage>} />
                            <Route path="/my-assignments" element={<ProtectedPage><MyAssignmentsPage /></ProtectedPage>} />
                            <Route path="/progress" element={<ProtectedPage><ProgressTrackerPage /></ProtectedPage>} />
                            <Route path="/analyzer" element={<ProtectedPage><AIReviewPage /></ProtectedPage>} />
                            <Route path="/ai-assistant" element={<ProtectedPage><AIAssistantPage /></ProtectedPage>} />
                            <Route path="/locations" element={<ProtectedPage><LocationsPage /></ProtectedPage>} />
                            <Route path="/family-subscription" element={<ProtectedPage><FamilySubscriptionPage /></ProtectedPage>} />
                            <Route path="/payment" element={<ProtectedPage><PaymentPage /></ProtectedPage>} />
                            <Route path="/settings" element={<ProtectedPage><SettingsPage /></ProtectedPage>} />
                            <Route path="/profile/edit" element={<ProtectedPage><ProfileEditPage /></ProtectedPage>} />
                            <Route path="/about" element={<ProtectedPage><AboutPage /></ProtectedPage>} />
                            <Route path="/portfolio" element={<ProtectedPage><PublicPortfolioPage /></ProtectedPage>} />
                            <Route path="/chat" element={<ProtectedPage><StudentChatPage /></ProtectedPage>} />
                            <Route path="/submissions" element={<ProtectedPage><SubmissionsPage /></ProtectedPage>} />

                            {/* Lesson routes */}
                            <Route path="/python-tasks/:lessonId" element={<ProtectedPage><PythonLessonPage /></ProtectedPage>} />
                            <Route path="/figma-tasks/:lessonId" element={<ProtectedPage><FigmaLessonPage /></ProtectedPage>} />

                            {/* Developer routes */}
                            <Route path="/developer/panel" element={<ProtectedPage><DeveloperPanel /></ProtectedPage>} />
                            <Route path="/developer/feature-flags" element={<ProtectedPage><FeatureFlagsPage /></ProtectedPage>} />
                            <Route path="/developer/modules" element={<ProtectedPage><ModulesPage /></ProtectedPage>} />
                            <Route path="/developer/live-activity" element={<ProtectedPage><LiveActivityPage /></ProtectedPage>} />
                            <Route path="/developer/maintenance" element={<ProtectedPage><MaintenancePage /></ProtectedPage>} />
                            <Route path="/developer/blocks" element={<ProtectedPage><BlocksPage /></ProtectedPage>} />
                            <Route path="/developer/access-matrix" element={<ProtectedPage><AccessMatrixPage /></ProtectedPage>} />
                            <Route path="/developer/ai-control" element={<ProtectedPage><AIControlPage /></ProtectedPage>} />
                            <Route path="/developer/ai-stats" element={<ProtectedPage><AIStatsPage /></ProtectedPage>} />
                            <Route path="/developer/test-data" element={<ProtectedPage><TestDataPage /></ProtectedPage>} />
                            <Route path="/developer/error-monitor" element={<ProtectedPage><ErrorMonitorPage /></ProtectedPage>} />
                            <Route path="/developer/export" element={<ProtectedPage><ExportPage /></ProtectedPage>} />
                            <Route path="/developer/import" element={<ProtectedPage><ImportPage /></ProtectedPage>} />
                            <Route path="/developer/performance" element={<ProtectedPage><PerformancePage /></ProtectedPage>} />
                            <Route path="/developer/api-test" element={<ProtectedPage><APITestPage /></ProtectedPage>} />

                            {/* Admin routes */}
                            <Route path="/admin" element={<ProtectedPage><AdminDashboardPage /></ProtectedPage>} />
                            <Route path="/admin/ranks" element={<ProtectedPage><AdminRanksPage /></ProtectedPage>} />
                            <Route path="/admin/student-monitoring" element={<ProtectedPage><StudentMonitoringPage /></ProtectedPage>} />
                            <Route path="/admin/enhanced-review" element={<ProtectedPage><EnhancedReviewPage /></ProtectedPage>} />
                            <Route path="/admin/enhanced-groups" element={<ProtectedPage><EnhancedGroupsPage /></ProtectedPage>} />
                            <Route path="/admin/analytics" element={<ProtectedPage><AnalyticsPage /></ProtectedPage>} />
                            <Route path="/admin/enhanced-chat" element={<ProtectedPage><EnhancedChatPage /></ProtectedPage>} />
                            <Route path="/admin/ops-chat" element={<ProtectedPage><AdminOpsChat /></ProtectedPage>} />
                            <Route path="/admin/ai-activity" element={<ProtectedPage><AIActivityMonitorPage /></ProtectedPage>} />
                            <Route path="/admin/appeals" element={<ProtectedPage><AppealsPage /></ProtectedPage>} />
                            <Route path="/admin/tasks" element={<ProtectedPage><TaskReviewPage /></ProtectedPage>} />
                            <Route path="/admin/chat" element={<ProtectedPage><AdminChatPage /></ProtectedPage>} />
                            <Route path="/admin/group-chat" element={<ProtectedPage><AdminGroupChatPage /></ProtectedPage>} />
                            <Route path="/admin/review" element={<ProtectedPage><ReviewAssignmentsPage /></ProtectedPage>} />
                            <Route path="/admin/users" element={<ProtectedPage><AdminUsersPage /></ProtectedPage>} />
                            <Route path="/admin/groups" element={<ProtectedPage><AdminGroupsPage /></ProtectedPage>} />
                            <Route path="/admin/support-chats" element={<ProtectedPage><SupportChatsPage /></ProtectedPage>} />

                            {/* Student routes */}
                            <Route path="/student/chats" element={<ProtectedPage><StudentChatsPage /></ProtectedPage>} />
                            <Route path="/student/achievements" element={<ProtectedPage><AchievementsPage /></ProtectedPage>} />
                            <Route path="/support" element={<ProtectedPage><SupportPage /></ProtectedPage>} />

                            {/* Teacher routes */}
                            <Route path="/teacher/dashboard" element={<ProtectedPage><TeacherDashboard /></ProtectedPage>} />

                            {/* 404 Route */}
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </ToastProvider>
        </ErrorBoundary>
    )
}

export default App
