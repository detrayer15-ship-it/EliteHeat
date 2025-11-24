import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export const Header = () => {
    const navigate = useNavigate()

    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                <div className="lg:hidden">
                    <h1 className="text-xl font-bold text-primary">EliteHeat</h1>
                </div>

                <div className="ml-auto flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                        Войти
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                        Регистрация
                    </Button>
                </div>
            </div>
        </header>
    )
}
