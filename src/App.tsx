import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { doc, updateDoc } from 'firebase/firestore'
import { db, auth } from './config/firebase'
import { AppLayout } from './components/layout/AppLayout'

import { LandingPage } from './pages/LandingPage'
import { Dashboard } from './pages/Dashboard'
import { ProjectsPage } from './pages/ProjectsPage'

import { TasksPage } from './pages/TasksPage'
import { ProgressTrackerPage } from './pages/ProgressTrackerPage'
import { AIReviewPage } from './pages/AnalyzerPage'
import { AIAssistantPage } from './pages/AIAssistantPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { SettingsPage } from './pages/SettingsPage'
import { ProfileEditPage } from './pages/ProfileEditPage'
import { SubscriptionPage } from './pages/SubscriptionPage'
import { AboutPage } from './pages/AboutPage'
import { LocationsPage } from './pages/LocationsPage'
import { PaymentPage } from './pages/PaymentPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { TaskReviewPage } from './pages/TaskReviewPage'
import { SubmissionsPage } from './pages/SubmissionsPage'
import { FamilySubscriptionPage } from './pages/FamilySubscriptionPage'

import { AdminUsersPage } from './pages/AdminUsersPage'
import { AdminUserEditPage } from './pages/AdminUserEditPage'
import { AdminGroupsPage } from './pages/AdminGroupsPage'
import { MyAssignmentsPage } from './pages/MyAssignmentsPage'
import { AdminChatPage } from './pages/AdminChatPage'
import { AdminGroupChatPage } from './pages/AdminGroupChatPage'
import { StudentChatPage } from './pages/StudentChatPage'
import { DeveloperSetupPage } from './pages/DeveloperSetupPage'
import { DeveloperPanel } from './pages/DeveloperPanel'
import { AssignRankPage } from './pages/AssignRankPage'
import { ViewRanksPage } from './pages/ViewRanksPage'
import { PythonLessonPage } from './pages/PythonLessonPage'
import { FigmaLessonPage } from './pages/FigmaLessonPage'
import { FeatureFlagsPage } from './pages/developer/FeatureFlagsPage'
import { ModulesPage } from './pages/developer/ModulesPage'
import { LiveActivityPage } from './pages/developer/LiveActivityPage'
import { MaintenancePage } from './pages/developer/MaintenancePage'
import { BlocksPage } from './pages/developer/BlocksPage'
import { AccessMatrixPage } from './pages/developer/AccessMatrixPage'
import { AIControlPage } from './pages/developer/AIControlPage'
import { AIStatsPage } from './pages/developer/AIStatsPage'
import { TestDataPage } from './pages/developer/TestDataPage'
import { ErrorMonitorPage } from './pages/developer/ErrorMonitorPage'
import { ExportPage } from './pages/developer/ExportPage'
import { ImportPage } from './pages/developer/ImportPage'
import { PerformancePage } from './pages/developer/PerformancePage'
import { EnhancedUsersPage } from './pages/admin/EnhancedUsersPage'
import { StudentMonitoringPage } from './pages/admin/StudentMonitoringPage'
import { EnhancedReviewPage } from './pages/admin/EnhancedReviewPage'
import { EnhancedGroupsPage } from './pages/admin/EnhancedGroupsPage'
import { LiveRanksPage } from './pages/admin/LiveRanksPage'
import { AnalyticsPage } from './pages/admin/AnalyticsPage'
import { EnhancedChatPage } from './pages/admin/EnhancedChatPage'
import { AdminOpsChat } from './pages/admin/AdminOpsChat'
import { AIActivityMonitorPage } from './pages/admin/AIActivityMonitorPage'
import { StudentChatsPage } from './pages/student/StudentChatsPage'
import { SkillTreePage } from './pages/SkillTreePage'
import AchievementsPage from './pages/student/AchievementsPage'
import APITestPage from './pages/developer/APITestPage'
import { TeacherDashboard } from './pages/teacher/TeacherDashboard'
import { AppealsPage } from './pages/admin/AppealsPage'

import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { SubmitAssignmentPage } from './pages/SubmitAssignmentPage'
import { ReviewAssignmentsPage } from './pages/ReviewAssignmentsPage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { useProjectStore } from './store/projectStore'
import { useTaskStore } from './store/taskStore'
import { useSettingsStore } from './store/settingsStore'
import { useAuthStore } from './store/authStore'
import { AchievementNotifier } from './components/gamification/AchievementNotifier'

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

    // Ctrl+Shift для роли Developer - ПРОСТАЯ ВЕРСИЯ
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey) {
                console.log('🔑 Ctrl+Shift нажато!')

                // Получаем пользователя из Firebase Auth напрямую
                const firebaseUser = auth.currentUser

                if (!firebaseUser) {
                    console.log('❌ Пользователь не авторизован в Firebase')
                    return
                }

                console.log('👤 Firebase пользователь:', firebaseUser.email)

                // Обновляем роль в Firestore
                updateDoc(doc(db, 'users', firebaseUser.uid), {
                    role: 'developer',
                    adminPoints: 9999
                }).then(() => {
                    console.log('✅ Роль обновлена!')
                    window.location.reload()
                }).catch((error) => {
                    console.error('❌ Ошибка:', error)
                })
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [])

    return (
        <BrowserRouter future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
        }}>
            <AchievementNotifier />
            <Routes>
                {/* Public routes - без AppLayout */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dev-setup" element={<DeveloperSetupPage />} />

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
                    path="/submit-assignment"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <SubmitAssignmentPage />
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
                    path="/skill-tree"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <SkillTreePage />
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
                    element={<SubscriptionPage />}
                />
                <Route
                    path="/locations"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <LocationsPage />
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
                    path="/about"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AboutPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/developer/panel"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <DeveloperPanel />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/developer/assign-rank"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AssignRankPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/developer/feature-flags"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <FeatureFlagsPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/developer/modules"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <ModulesPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/developer/live-activity"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <LiveActivityPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/developer/maintenance"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <MaintenancePage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route path="/developer/blocks" element={<ProtectedRoute><AppLayout><BlocksPage /></AppLayout></ProtectedRoute>} />
                <Route path="/developer/access-matrix" element={<ProtectedRoute><AppLayout><AccessMatrixPage /></AppLayout></ProtectedRoute>} />
                <Route path="/developer/ai-control" element={<ProtectedRoute><AppLayout><AIControlPage /></AppLayout></ProtectedRoute>} />
                <Route path="/developer/ai-stats" element={<ProtectedRoute><AppLayout><AIStatsPage /></AppLayout></ProtectedRoute>} />
                <Route path="/developer/test-data" element={<ProtectedRoute><AppLayout><TestDataPage /></AppLayout></ProtectedRoute>} />
                <Route path="/developer/error-monitor" element={<ProtectedRoute><AppLayout><ErrorMonitorPage /></AppLayout></ProtectedRoute>} />
                <Route path="/developer/export" element={<ProtectedRoute><AppLayout><ExportPage /></AppLayout></ProtectedRoute>} />
                <Route path="/developer/import" element={<ProtectedRoute><AppLayout><ImportPage /></AppLayout></ProtectedRoute>} />
                <Route path="/developer/performance" element={<ProtectedRoute><AppLayout><PerformancePage /></AppLayout></ProtectedRoute>} />
                <Route path="/developer/api-test" element={<ProtectedRoute><AppLayout><APITestPage /></AppLayout></ProtectedRoute>} />


                <Route
                    path="/admin/ranks"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <ViewRanksPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/enhanced-users"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <EnhancedUsersPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/student-monitoring"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <StudentMonitoringPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/enhanced-review"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <EnhancedReviewPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/enhanced-groups"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <EnhancedGroupsPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/live-ranks"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <LiveRanksPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/analytics"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AnalyticsPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/enhanced-chat"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <EnhancedChatPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/chats"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <StudentChatsPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/student/achievements"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AchievementsPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/ops-chat"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AdminOpsChat />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/ai-activity"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AIActivityMonitorPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/appeals"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AppealsPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/teacher/dashboard"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <TeacherDashboard />
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
                    path="/python-tasks/:lessonId"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <PythonLessonPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/figma-tasks/:lessonId"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <FigmaLessonPage />
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
                    path="/admin/group-chat"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AdminGroupChatPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/review"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <ReviewAssignmentsPage />
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
                <Route
                    path="/admin/groups"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <AdminGroupsPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App
