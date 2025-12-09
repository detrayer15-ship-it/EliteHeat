import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { LandingPage } from './pages/LandingPage'
import { Dashboard } from './pages/Dashboard'
import { ProjectsPage } from './pages/ProjectsPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { TasksPage } from './pages/TasksPage'
import { ProgressTrackerPage } from './pages/ProgressTrackerPage'
import { AIReviewPage } from './pages/AnalyzerPage'
import { AIAssistantPage } from './pages/AIAssistantPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { SettingsPage } from './pages/SettingsPage'
import { ProfileEditPage } from './pages/ProfileEditPage'
import { SubscriptionPage } from './pages/SubscriptionPage'
import { PaymentPage } from './pages/PaymentPage'
import { AdminPage } from './pages/AdminPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { TaskReviewPage } from './pages/TaskReviewPage'
import { UsersPage } from './pages/UsersPage'
import { SubmissionsPage } from './pages/SubmissionsPage'
import { FamilySubscriptionPage } from './pages/FamilySubscriptionPage'
import { ChatPage } from './pages/ChatPage'
import { AdminUsersPage } from './pages/AdminUsersPage'
import { MyAssignmentsPage } from './pages/MyAssignmentsPage'
import { AdminChatPage } from './pages/AdminChatPage'
import { StudentChatPage } from './pages/StudentChatPage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { useProjectStore } from './store/projectStore'
import { useTaskStore } from './store/taskStore'
import { useSettingsStore } from './store/settingsStore'
import { useAuthStore } from './store/authStore'

function App() {
    const loadProjects = useProjectStore((state) => state.loadProjects)
    const loadTasks = useTaskStore((state) => state.loadTasks)
    const theme = useSettingsStore((state) => state.theme)
    const loadUser = useAuthStore((state) => state.loadUser)

    useEffect(() => {
        loadProjects()
        loadTasks()
        loadUser() // Load user from token on app start

        // Apply saved theme on load
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [loadProjects, loadTasks, loadUser, theme])

    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes - без AppLayout */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes - с AppLayout */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <Dashboard />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/projects"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <ProjectsPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/projects/:id"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <ProjectDetailPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tasks"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <TasksPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-assignments"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <MyAssignmentsPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/progress"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <ProgressTrackerPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/analyzer"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AIReviewPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/ai-assistant"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AIAssistantPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/subscription"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <SubscriptionPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/family-subscription"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <FamilySubscriptionPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/payment"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <PaymentPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <SettingsPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile/edit"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <ProfileEditPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <UsersPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/submissions"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <SubmissionsPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AdminDashboardPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/tasks"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <TaskReviewPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/chat"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AdminChatPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <StudentChatPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AdminUsersPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App
