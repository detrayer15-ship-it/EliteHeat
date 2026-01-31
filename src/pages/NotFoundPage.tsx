import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export const NotFoundPage = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="text-center max-w-md mx-auto">
                {/* Simple 404 Text */}
                <h1 className="text-8xl font-black text-slate-200 mb-4">404</h1>

                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                    Страница не найдена
                </h2>

                <p className="text-slate-500 mb-8">
                    К сожалению, запрашиваемая страница не существует или была перемещена.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Назад
                    </button>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-medium transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        На главную
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NotFoundPage
