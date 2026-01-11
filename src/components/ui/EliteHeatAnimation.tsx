import { useEffect, useState } from 'react'

export const EliteHeatAnimation = () => {
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false)
            setTimeout(() => setVisible(true), 1000) // Исчезает на 1 сек
        }, 5000) // Повторяется каждые 5 секунд

        return () => clearInterval(interval)
    }, [])

    return (
        <div className={`fixed top-4 right-4 z-50 transition-all duration-1000 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-full shadow-2xl animate-pulse">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-blue-200">Elite</span>
                    <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">Heat</span>
                </h2>
            </div>
        </div>
    )
}
