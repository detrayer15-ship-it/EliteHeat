import { useEffect, Suspense } from 'react'
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

// Centralized Route Imports
import * as P from './config/routes'

// Loading component for Suspense
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 animate-pulse">Загрузка...</p>
        </div>
    </div>
)

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
                            <Route path="/" element={<P.LandingPage />} />
                            <Route path="/login" element={<P.LoginPage />} />
                            <Route path="/register" element={<P.RegisterPage />} />
                            <Route path="/dev-setup" element={<P.DeveloperSetupPage />} />
                            <Route path="/subscription" element={<P.SubscriptionPage />} />

                            {/* Protected routes */}
                            <Route path="/dashboard" element={<ProtectedPage><P.Dashboard /></ProtectedPage>} />
                            <Route path="/projects" element={<ProtectedPage><P.ProjectsPage /></ProtectedPage>} />
                            <Route path="/projects/:id" element={<ProtectedPage><P.ProjectDetailPage /></ProtectedPage>} />
                            <Route path="/tasks" element={<ProtectedPage><P.TasksPage /></ProtectedPage>} />
                            <Route path="/submit-assignment" element={<ProtectedPage><P.SubmitAssignmentPage /></ProtectedPage>} />
                            <Route path="/my-assignments" element={<ProtectedPage><P.MyAssignmentsPage /></ProtectedPage>} />
                            <Route path="/progress" element={<ProtectedPage><P.ProgressTrackerPage /></ProtectedPage>} />
                            <Route path="/analyzer" element={<ProtectedPage><ErrorBoundary><P.AIReviewPage /></ErrorBoundary></ProtectedPage>} />
                            <Route path="/ai-assistant" element={<ProtectedPage><ErrorBoundary><P.AIAssistantPage /></ErrorBoundary></ProtectedPage>} />
                            <Route path="/locations" element={<ProtectedPage><P.LocationsPage /></ProtectedPage>} />
                            <Route path="/family-subscription" element={<ProtectedPage><P.FamilySubscriptionPage /></ProtectedPage>} />
                            <Route path="/payment" element={<ProtectedPage><P.PaymentPage /></ProtectedPage>} />
                            <Route path="/settings" element={<ProtectedPage><P.SettingsPage /></ProtectedPage>} />
                            <Route path="/profile/edit" element={<ProtectedPage><P.ProfileEditPage /></ProtectedPage>} />
                            <Route path="/about" element={<ProtectedPage><P.AboutPage /></ProtectedPage>} />
                            <Route path="/portfolio" element={<ProtectedPage><P.PublicPortfolioPage /></ProtectedPage>} />
                            <Route path="/chat" element={<ProtectedPage><P.StudentChatPage /></ProtectedPage>} />
                            <Route path="/submissions" element={<ProtectedPage><P.SubmissionsPage /></ProtectedPage>} />

                            {/* Lesson routes */}
                            <Route path="/python-tasks/:lessonId" element={<ProtectedPage><P.PythonLessonPage /></ProtectedPage>} />
                            <Route path="/figma-tasks/:lessonId" element={<ProtectedPage><P.FigmaLessonPage /></ProtectedPage>} />

                            {/* Developer routes */}
                            <Route path="/developer/panel" element={<ProtectedPage><P.DeveloperPanel /></ProtectedPage>} />
                            <Route path="/developer/feature-flags" element={<ProtectedPage><P.FeatureFlagsPage /></ProtectedPage>} />
                            <Route path="/developer/modules" element={<ProtectedPage><P.ModulesPage /></ProtectedPage>} />
                            <Route path="/developer/live-activity" element={<ProtectedPage><P.LiveActivityPage /></ProtectedPage>} />
                            <Route path="/developer/maintenance" element={<ProtectedPage><P.MaintenancePage /></ProtectedPage>} />
                            <Route path="/developer/blocks" element={<ProtectedPage><P.BlocksPage /></ProtectedPage>} />
                            <Route path="/developer/access-matrix" element={<ProtectedPage><P.AccessMatrixPage /></ProtectedPage>} />
                            <Route path="/developer/ai-control" element={<ProtectedPage><P.AIControlPage /></ProtectedPage>} />
                            <Route path="/developer/ai-stats" element={<ProtectedPage><P.AIStatsPage /></ProtectedPage>} />
                            <Route path="/developer/test-data" element={<ProtectedPage><P.TestDataPage /></ProtectedPage>} />
                            <Route path="/developer/error-monitor" element={<ProtectedPage><P.ErrorMonitorPage /></ProtectedPage>} />
                            <Route path="/developer/export" element={<ProtectedPage><P.ExportPage /></ProtectedPage>} />
                            <Route path="/developer/import" element={<ProtectedPage><P.ImportPage /></ProtectedPage>} />
                            <Route path="/developer/performance" element={<ProtectedPage><P.PerformancePage /></ProtectedPage>} />
                            <Route path="/developer/api-test" element={<ProtectedPage><P.APITestPage /></ProtectedPage>} />

                            {/* Admin routes */}
                            <Route path="/admin" element={<ProtectedPage><P.AdminDashboardPage /></ProtectedPage>} />
                            <Route path="/admin/ranks" element={<ProtectedPage><P.AdminRanksPage /></ProtectedPage>} />
                            <Route path="/admin/student-monitoring" element={<ProtectedPage><P.StudentMonitoringPage /></ProtectedPage>} />
                            <Route path="/admin/enhanced-review" element={<ProtectedPage><P.EnhancedReviewPage /></ProtectedPage>} />
                            <Route path="/admin/analytics" element={<ProtectedPage><P.AnalyticsPage /></ProtectedPage>} />
                            <Route path="/admin/enhanced-chat" element={<ProtectedPage><P.EnhancedChatPage /></ProtectedPage>} />
                            <Route path="/admin/ops-chat" element={<ProtectedPage><P.AdminOpsChat /></ProtectedPage>} />
                            <Route path="/admin/ai-activity" element={<ProtectedPage><P.AIActivityMonitorPage /></ProtectedPage>} />
                            <Route path="/admin/appeals" element={<ProtectedPage><P.AppealsPage /></ProtectedPage>} />
                            <Route path="/admin/tasks" element={<ProtectedPage><P.TaskReviewPage /></ProtectedPage>} />
                            <Route path="/admin/chat" element={<ProtectedPage><P.AdminChatPage /></ProtectedPage>} />
                            <Route path="/admin/group-chat" element={<ProtectedPage><P.AdminGroupChatPage /></ProtectedPage>} />
                            <Route path="/admin/review" element={<ProtectedPage><P.ReviewAssignmentsPage /></ProtectedPage>} />
                            <Route path="/admin/users" element={<ProtectedPage><P.AdminUsersPage /></ProtectedPage>} />
                            <Route path="/admin/support-chats" element={<ProtectedPage><P.SupportChatsPage /></ProtectedPage>} />

                            {/* Student routes */}
                            <Route path="/student/chats" element={<ProtectedPage><P.StudentChatsPage /></ProtectedPage>} />
                            <Route path="/student/achievements" element={<ProtectedPage><P.AchievementsPage /></ProtectedPage>} />
                            <Route path="/support" element={<ProtectedPage><P.SupportPage /></ProtectedPage>} />

                            {/* Teacher routes */}
                            <Route path="/teacher/dashboard" element={<ProtectedPage><P.AdminDashboardPage /></ProtectedPage>} />

                            {/* 404 Route */}
                            <Route path="*" element={<P.NotFoundPage />} />
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </ToastProvider>
        </ErrorBoundary>
    )
}

export default App

