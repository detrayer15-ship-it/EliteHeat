import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export const Header = () => {
    const navigate = useNavigate()

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-6 py-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="text-2xl font-black tracking-tighter flex items-center">
                            <span className="text-orange-500">ELITE</span>
                            <span className="text-blue-500 ml-1">HEAT</span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/login')}
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 px-6"
                    >
                        Войти
                    </Button>
                </div>
            </div>
        </header>
    )
}
