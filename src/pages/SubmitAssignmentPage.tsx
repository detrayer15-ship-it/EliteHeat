import { useState } from 'react'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { Send, FileText, CheckCircle } from 'lucide-react'

export const SubmitAssignmentPage = () => {
    const navigate = useNavigate()
    const currentUser = useAuthStore((state) => state.user)
    const [taskTitle, setTaskTitle] = useState('')
    const [answer, setAnswer] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async () => {
        if (!taskTitle.trim() || !answer.trim()) {
            alert('Заполните все поля')
            return
        }

        setLoading(true)

        try {
            await addDoc(collection(db, 'submissions'), {
                studentId: currentUser?.id,
                studentName: currentUser?.name,
                studentEmail: currentUser?.email,
                taskTitle: taskTitle.trim(),
                answer: answer.trim(),
                status: 'pending',
                grade: null,
                feedback: '',
                submittedAt: Timestamp.now(),
                reviewedAt: null,
                reviewedBy: null
            })

            setSuccess(true)
            setTimeout(() => {
                navigate('/tasks')
            }, 2000)
        } catch (error) {
            console.error('Error submitting assignment:', error)
            alert('Ошибка при отправке задания')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="text-center bg-white p-12 rounded-2xl shadow-2xl max-w-md">
                    <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Задание отправлено!</h1>
                    <p className="text-gray-600 mb-6">
                        Ваше задание отправлено на проверку. Ожидайте результатов.
                    </p>
                    <div className="text-sm text-gray-500">
                        Перенаправление на страницу курсов...
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/tasks')}
                        className="text-blue-600 hover:text-blue-700 mb-4"
                    >
                        ← Назад к курсам
                    </button>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Отправить задание
                            </h1>
                            <p className="text-gray-600">Отправьте выполненное задание на проверку</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="space-y-6">
                        {/* Task Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Название задания
                            </label>
                            <input
                                type="text"
                                value={taskTitle}
                                onChange={(e) => setTaskTitle(e.target.value)}
                                placeholder="Например: Задание 1 - Основы JavaScript"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {/* Answer */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ваш ответ
                            </label>
                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Введите ваш ответ или вставьте ссылку на GitHub..."
                                rows={12}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Вы можете вставить код, ссылку на GitHub или описание решения
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !taskTitle.trim() || !answer.trim()}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Отправка...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Отправить на проверку
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Info */}
                <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Информация
                    </h3>
                    <ul className="space-y-2 text-sm text-blue-800">
                        <li>• Ваше задание будет отправлено на проверку администраторам</li>
                        <li>• Вы получите оценку и обратную связь после проверки</li>
                        <li>• Можете отправлять ссылки на GitHub, CodePen или другие платформы</li>
                        <li>• Старайтесь писать чистый и понятный код</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
