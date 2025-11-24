import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
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
import { SubscriptionPage } from './pages/SubscriptionPage'
import { PaymentPage } from './pages/PaymentPage'
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
            <AppLayout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/projects/:id" element={<ProjectDetailPage />} />
                    <Route path="/tasks" element={<TasksPage />} />
                    <Route path="/progress" element={<ProgressTrackerPage />} />
                    <Route path="/analyzer" element={<AnalyzerPage />} />
                    <Route path="/ai-assistant" element={<AIAssistantPage />} />
                    <Route path="/subscription" element={<SubscriptionPage />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Routes>
            </AppLayout>
        </BrowserRouter>
    )
}

export default App
