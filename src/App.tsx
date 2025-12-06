import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { LandingPage } from './pages/LandingPage'
import { Dashboard } from './pages/Dashboard'
import { ProjectsPage } from './pages/ProjectsPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { TasksPage } from './pages/TasksPage'
import { ProgressTrackerPage } from './pages/ProgressTrackerPage'
import { AnalyzerPage } from './pages/AnalyzerPage'
import { AIAssistantPage } from './pages/AIAssistantPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { SettingsPage } from './pages/SettingsPage'
import { ProfileEditPage } from './pages/ProfileEditPage'
import { SubscriptionPage } from './pages/SubscriptionPage'
import { PaymentPage } from './pages/PaymentPage'
import { AdminPage } from './pages/AdminPage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { useProjectStore } from './store/projectStore'
import { useTaskStore } from './store/taskStore'
import { useSettingsStore } from './store/settingsStore'

function App() {
    const loadProjects = useProjectStore((state) => state.loadProjects)
    const loadTasks = useTaskStore((state) => state.loadTasks)
    const theme = useSettingsStore((state) => state.theme)

    useEffect(() => {
        loadProjects()
        loadTasks()

        // Apply saved theme on load
        if (theme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [loadProjects, loadTasks, theme])

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
                                <AnalyzerPage />
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
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AdminPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App
