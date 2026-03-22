import { useEffect, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ToastProvider } from './components/ui/Toast'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { useSettingsStore } from './store/settingsStore'
import { useAuthStore } from './store/authStore'

// Centralized Route Imports
import * as P from './config/routes'

// Loading component for Suspense
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        <div className="flex flex-col items-center gap-5">
            <div className="relative">
                <div className="w-14 h-14 border-[3px] border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-14 h-14 border-[3px] border-transparent border-b-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="text-slate-400 animate-pulse font-medium text-sm tracking-wide">Загрузка...</p>
        </div>
    </div>
)

// Helper component for protected routes with layout
const ProtectedPage = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => (
    <ProtectedRoute allowedRoles={allowedRoles}>
        <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
)

function App() {
    const loadUser = useAuthStore((state) => state.loadUser)
    const theme = useSettingsStore((state) => state.theme)

    useEffect(() => {
        loadUser()

        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [loadUser, theme])

    return (
        <ErrorBoundary>
            <ToastProvider>
                <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            {/* Public routes */}
                            <Route path="/" element={<P.LandingPage />} />
                            <Route path="/login" element={<P.LoginPage />} />
                            <Route path="/select-role" element={<P.SelectRolePage />} />
                            <Route path="/choose-direction" element={<P.ChooseDirectionPage />} />
                            <Route path="/register" element={<P.RegisterPage />} />
                            <Route path="/become-teacher" element={<P.BecomeTeacherPage />} />
                            <Route path="/dev-setup" element={<P.DeveloperSetupPage />} />
                            <Route path="/subscription" element={<P.SubscriptionPage />} />

                            {/* Protected routes */}
                            <Route path="/dashboard" element={<ProtectedPage><P.Dashboard /></ProtectedPage>} />
                            <Route path="/tasks" element={<ProtectedPage><P.TasksPage /></ProtectedPage>} />

                            <Route path="/progress" element={<ProtectedPage><P.ProgressTrackerPage /></ProtectedPage>} />

                            <Route path="/locations" element={<ProtectedPage><P.LocationsPage /></ProtectedPage>} />
                            <Route path="/payment" element={<ProtectedPage><P.PaymentPage /></ProtectedPage>} />
                            <Route path="/settings" element={<ProtectedPage><P.SettingsPage /></ProtectedPage>} />
                            <Route path="/profile/edit" element={<ProtectedPage><P.ProfileEditPage /></ProtectedPage>} />
                            <Route path="/about" element={<ProtectedPage><P.AboutPage /></ProtectedPage>} />


                            {/* Lesson routes */}
                            <Route path="/python-tasks/:lessonId" element={<ProtectedPage><P.PythonLessonPage /></ProtectedPage>} />
                            <Route path="/figma-tasks/:lessonId" element={<ProtectedPage><P.FigmaLessonPage /></ProtectedPage>} />
                            <Route path="/direction-lesson/:lessonId" element={<ProtectedPage><P.DirectionLessonPage /></ProtectedPage>} />

                            {/* Developer routes */}
                            <Route path="/developer/panel" element={<ProtectedPage><P.DeveloperPanel /></ProtectedPage>} />
                            <Route path="/developer/feature-flags" element={<ProtectedPage><P.FeatureFlagsPage /></ProtectedPage>} />
                            <Route path="/developer/modules" element={<ProtectedPage><P.ModulesPage /></ProtectedPage>} />
                            <Route path="/developer/live-activity" element={<ProtectedPage><P.LiveActivityPage /></ProtectedPage>} />
                            <Route path="/developer/maintenance" element={<ProtectedPage><P.MaintenancePage /></ProtectedPage>} />
                            <Route path="/developer/blocks" element={<ProtectedPage><P.BlocksPage /></ProtectedPage>} />
                            <Route path="/developer/access-matrix" element={<ProtectedPage><P.AccessMatrixPage /></ProtectedPage>} />

                            <Route path="/developer/test-data" element={<ProtectedPage><P.TestDataPage /></ProtectedPage>} />
                            <Route path="/developer/error-monitor" element={<ProtectedPage><P.ErrorMonitorPage /></ProtectedPage>} />
                            <Route path="/developer/export" element={<ProtectedPage><P.ExportPage /></ProtectedPage>} />
                            <Route path="/developer/import" element={<ProtectedPage><P.ImportPage /></ProtectedPage>} />
                            <Route path="/developer/performance" element={<ProtectedPage><P.PerformancePage /></ProtectedPage>} />
                            <Route path="/developer/api-test" element={<ProtectedPage><P.APITestPage /></ProtectedPage>} />

                            {/* Admin routes */}
                            <Route path="/admin" element={<ProtectedPage><P.AdminDashboardPage /></ProtectedPage>} />
                            <Route path="/admin/student-monitoring" element={<ProtectedPage><P.StudentMonitoringPage /></ProtectedPage>} />
                            <Route path="/admin/enhanced-review" element={<ProtectedPage><P.EnhancedReviewPage /></ProtectedPage>} />
                            <Route path="/admin/analytics" element={<ProtectedPage><P.AnalyticsPage /></ProtectedPage>} />
                            <Route path="/admin/enhanced-chat" element={<ProtectedPage><P.EnhancedChatPage /></ProtectedPage>} />
                            <Route path="/admin/ops-chat" element={<ProtectedPage><P.AdminOpsChat /></ProtectedPage>} />

                            <Route path="/admin/appeals" element={<ProtectedPage><P.AppealsPage /></ProtectedPage>} />
                            <Route path="/admin/tasks" element={<ProtectedPage><P.TaskReviewPage /></ProtectedPage>} />
                            <Route path="/admin/group-chat" element={<ProtectedPage><P.AdminGroupChatPage /></ProtectedPage>} />
                            <Route path="/admin/review" element={<ProtectedPage><P.ReviewAssignmentsPage /></ProtectedPage>} />
                            <Route path="/admin/users" element={<ProtectedPage><P.AdminUsersPage /></ProtectedPage>} />
                            <Route path="/admin/support-chats" element={<ProtectedPage><P.SupportChatsPage /></ProtectedPage>} />
                            <Route path="/admin/teacher-applications" element={<ProtectedPage><P.AdminTeacherApplicationsPage /></ProtectedPage>} />

                            {/* Student routes */}
                            <Route path="/student/schedule" element={<ProtectedPage allowedRoles={['student', 'admin', 'developer']}><P.StudentSchedulePage /></ProtectedPage>} />
                            <Route path="/support" element={<ProtectedPage><P.SupportPage /></ProtectedPage>} />

                            {/* Teacher routes */}
                            <Route path="/teacher/dashboard" element={<ProtectedPage allowedRoles={['teacher', 'admin', 'developer']}><P.TeacherDashboard /></ProtectedPage>} />
                            <Route path="/teacher/monitoring" element={<ProtectedPage allowedRoles={['teacher', 'admin', 'developer']}><P.MonitoringCenterPage /></ProtectedPage>} />
                            <Route path="/teacher/groups" element={<ProtectedPage allowedRoles={['teacher', 'admin', 'developer']}><P.GroupsManagementPage /></ProtectedPage>} />
                            <Route path="/teacher/schedule" element={<ProtectedPage allowedRoles={['teacher', 'admin', 'developer']}><P.TeacherSchedulePage /></ProtectedPage>} />

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

