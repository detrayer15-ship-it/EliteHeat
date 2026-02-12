import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Send } from 'lucide-react'

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

                    <div className="flex items-center gap-6">
                        {/* Социальные сети */}
                        <div className="hidden md:flex items-center gap-5 mr-2">
                            <a
                                href="https://t.me/eliteheat"
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-400 hover:text-[#229ED9] transition-all duration-300 hover:scale-110"
                                title="Telegram"
                            >
                                <Send className="w-5 h-5" />
                            </a>
                            <a
                                href="https://vk.com/eliteheat"
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-400 hover:text-[#4C75A3] transition-all duration-300 hover:scale-110"
                                title="ВКонтакте"
                            >
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M13.162 18.994c-6.028 0-9.441-4.133-9.588-11.012h3.01c.105 5.05 2.327 7.185 4.088 7.625v-7.625h2.841v4.357c1.741-.188 3.568-2.147 4.183-4.357h2.841a10.05 10.05 0 01-3.834 6.06c1.116.516 2.54 2.246 3.01 4.952h-3.15c-.371-2.585-1.89-4.577-3.251-4.717v4.717h-2.14z" />
                                </svg>
                            </a>
                        </div>

                        <Button
                            variant="ghost"
                            onClick={() => navigate('/login')}
                            className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 px-6 rounded-xl"
                        >
                            Войти
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}
