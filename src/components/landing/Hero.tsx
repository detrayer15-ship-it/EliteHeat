import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Typewriter } from '@/components/Typewriter'

export const Hero = () => {
    const navigate = useNavigate()

    return (
        <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-20">
            <div className="max-w-4xl mx-auto">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 mb-8 animate-fade-in">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    <span className="text-xs font-bold tracking-widest text-orange-700/60 uppercase">
                        Новая эра образования
                    </span>
                </div>

                {/* Hero Title */}
                <div className="relative mb-6">
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-2 leading-none flex items-center justify-center gap-4">
                        <span className="text-orange-500">Elite</span>
                        <span className="text-blue-500">Heat</span>
                    </h1>
                    <div className="text-4xl md:text-6xl font-bold italic text-orange-500 h-[1.2em]">
                        <Typewriter
                            texts={['Создание программирования', 'Создание дизайна', 'Разработка ИИ']}
                            pauseTime={3000}
                        />
                    </div>
                </div>

                {/* Description */}
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
                    Профессиональное обучение программированию и дизайну
                    с использованием технологий искусственного интеллекта.
                    Ваш путь в IT начинается здесь.
                </p>

                {/* CTA Section */}
                <div className="flex flex-col items-center gap-6">
                    <Button
                        size="lg"
                        onClick={() => navigate('/subscription')}
                        className="h-16 px-12 text-lg font-bold bg-orange-600 text-white hover:bg-orange-700 transition-all rounded-full shadow-lg transform hover:scale-105"
                    >
                        Начать обучение
                    </Button>

                    <div className="flex items-center gap-8 text-gray-400 text-sm font-medium">
                        <span className="flex items-center gap-2">✓ Python</span>
                        <span className="flex items-center gap-2">✓ Figma</span>
                        <span className="flex items-center gap-2">✓ AI-Assistant</span>
                    </div>
                </div>
            </div>
        </main>
    )
}
