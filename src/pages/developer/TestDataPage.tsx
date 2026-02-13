import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Users, FileText, Trash2, CheckCircle2 } from 'lucide-react'
import { db } from '@/config/firebase'
import { doc, setDoc, collection, getDocs, deleteDoc, query, where } from 'firebase/firestore'

export const TestDataPage = () => {
    const navigate = useNavigate()
    const [generating, setGenerating] = useState(false)
    const [status, setStatus] = useState('')

    const generateUsers = async () => {
        setGenerating(true)
        setStatus('Создание учеников...')
        try {
            const mockUsers = [
                { name: 'Александр Иванов', email: 'alex@test.com', role: 'student', progress: 45, xp: 1200, points: 1200, completedTasks: 12, city: 'Алматы', createdAt: new Date() },
                { name: 'Мария Смирнова', email: 'maria@test.com', role: 'student', progress: 12, xp: 350, points: 350, completedTasks: 3, city: 'Астана', createdAt: new Date() },
                { name: 'Дмитрий Кузнецов', email: 'dima@test.com', role: 'student', progress: 88, xp: 2400, points: 2400, completedTasks: 25, city: 'Шымкент', createdAt: new Date() },
                { name: 'Елена Попова', email: 'elena@test.com', role: 'student', progress: 5, xp: 100, points: 100, completedTasks: 1, city: 'Алматы', createdAt: new Date() },
                { name: 'Артем Соколов', email: 'artem@test.com', role: 'student', progress: 67, xp: 1800, points: 1800, completedTasks: 18, city: 'Караганда', createdAt: new Date() },
                { name: 'Анна Васильева', email: 'anna@test.com', role: 'student', progress: 30, xp: 900, points: 900, completedTasks: 9, city: 'Павлодар', createdAt: new Date() },
                { name: 'Игорь Петров', email: 'igor@test.com', role: 'student', progress: 2, xp: 50, points: 50, completedTasks: 0, city: 'Алматы', createdAt: new Date() },
                { name: 'Ольга Михайлова', email: 'olga@test.com', role: 'student', progress: 95, xp: 3000, points: 3000, completedTasks: 32, city: 'Атырау', createdAt: new Date() },
                { name: 'Сергей Федоров', email: 'sergey@test.com', role: 'student', progress: 15, xp: 400, points: 400, completedTasks: 4, city: 'Уральск', createdAt: new Date() },
                { name: 'Юлия Морозова', email: 'yulia@test.com', role: 'student', progress: 52, xp: 1450, points: 1450, completedTasks: 14, city: 'Тараз', createdAt: new Date() },
            ]

            for (const user of mockUsers) {
                const userRef = doc(collection(db, 'users'))
                await setDoc(userRef, { ...user, id: userRef.id })
            }
            setStatus('Успешно создано 10 учеников!')
        } catch (error) {
            console.error(error)
            setStatus('Ошибка при генерации')
        } finally {
            setGenerating(false)
        }
    }

    const generateTasks = async () => {
        setGenerating(true)
        setStatus('Создание заданий...')
        try {
            const mockTasks = [
                { title: 'Основы Python', category: 'Python', difficulty: 'Beginner', xp: 100, createdAt: new Date() },
                { title: 'Работа с Figma', category: 'Design', difficulty: 'Beginner', xp: 150, createdAt: new Date() },
                { title: 'Логические операторы', category: 'Python', difficulty: 'Intermediate', xp: 200, createdAt: new Date() },
                { title: 'Прототипирование', category: 'Design', difficulty: 'Intermediate', xp: 250, createdAt: new Date() },
                { title: 'Циклы for и while', category: 'Python', difficulty: 'Beginner', xp: 120, createdAt: new Date() },
            ]

            for (const task of mockTasks) {
                const taskRef = doc(collection(db, 'tasks'))
                await setDoc(taskRef, { ...task, id: taskRef.id })
            }
            setStatus('Успешно создано 5 заданий!')
        } catch (error) {
            console.error(error)
            setStatus('Ошибка при генерации')
        } finally {
            setGenerating(false)
        }
    }

    const clearTestData = async () => {
        if (!confirm('Удалить ТОЛЬКО ТЕСТОВЫХ пользователей (с пометкой @test.com)?')) return
        setGenerating(true)
        setStatus('Очистка...')
        try {
            const q = query(collection(db, 'users'), where('email', '>=', ''), where('email', '<=', '\uf8ff'))
            const snapshot = await getDocs(q)
            let count = 0
            for (const d of snapshot.docs) {
                if (d.data().email?.includes('@test.com')) {
                    await deleteDoc(doc(db, 'users', d.id))
                    count++
                }
            }
            setStatus(`Удалено ${count} тестовых записей`)
        } catch (error) {
            console.error(error)
            setStatus('Ошибка при очистке')
        } finally {
            setGenerating(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#08090a] text-white p-6">
            <div className="max-w-7xl mx-auto">
                <Button variant="ghost" onClick={() => navigate('/developer/panel')} className="mb-8 text-white/50 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />Назад
                </Button>

                <div className="flex items-center gap-4 mb-12">
                    <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter">📦 Тестовые данные</h1>
                        <p className="text-white/40 text-sm font-medium">Управление наполнением базы для отладки и тестов</p>
                    </div>
                </div>

                {status && (
                    <div className="mb-8 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center gap-3 animate-fade-in">
                        <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                        <span className="text-sm font-bold text-indigo-100">{status}</span>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="p-8 bg-white/[0.02] border-white/5 backdrop-blur-xl rounded-[2.5rem] group hover:bg-white/[0.04] transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                            <Users className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black mb-2">Генерация учеников</h2>
                        <p className="text-white/40 text-sm mb-8 leading-relaxed">Создает 10 реалистичных профилей студентов с разными показателями прогресса, XP и городов для проверки работы Базы Учеников.</p>
                        <Button onClick={generateUsers} disabled={generating} className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                            {generating ? 'Генерация...' : 'Создать 10 учеников'}
                        </Button>
                    </Card>

                    <Card className="p-8 bg-white/[0.02] border-white/5 backdrop-blur-xl rounded-[2.5rem] group hover:bg-white/[0.04] transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black mb-2">Генерация заданий</h2>
                        <p className="text-white/40 text-sm mb-8 leading-relaxed">Наполняет список заданий (tasks) базовым набором уроков по Python и Figma для тестирования образовательных модулей.</p>
                        <Button onClick={generateTasks} disabled={generating} className="w-full h-14 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
                            {generating ? 'Генерация...' : 'Создать 5 заданий'}
                        </Button>
                    </Card>

                    <Card className="p-8 md:col-span-2 bg-red-500/5 border border-red-500/20 rounded-[2.5rem] group hover:bg-red-500/10 transition-all">
                        <div className="flex items-center justify-between gap-8">
                            <div>
                                <h2 className="text-2xl font-black mb-2 text-red-500 flex items-center gap-2">
                                    <Trash2 className="w-6 h-6" />
                                    Опасная зона
                                </h2>
                                <p className="text-red-500/60 text-sm font-medium">Внимание: вы можете удалить всех тестовых пользователей. Это не затронет основные учетные записи.</p>
                            </div>
                            <Button onClick={clearTestData} disabled={generating} className="bg-red-600 hover:bg-red-700 h-14 px-8 rounded-2xl text-xs font-black uppercase tracking-widest shrink-0 transition-all">
                                Очистить систему
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
