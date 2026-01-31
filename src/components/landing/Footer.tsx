export const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
            <div className="container mx-auto px-4 text-center">
                <div className="text-3xl font-bold mb-4 flex items-center justify-center">
                    <span className="text-orange-500">ELITE</span>
                    <span className="text-blue-500 ml-1">HEAT</span>
                </div>
                <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                    Образовательная платформа для изучения программирования и дизайна.
                    Развивайте навыки с лучшими онлайн-курсами и AI-помощником.
                </p>
                <div className="flex gap-6 justify-center text-sm text-gray-400 mb-6">
                    <a href="#" className="hover:text-white transition-smooth">О нас</a>
                    <a href="#" className="hover:text-white transition-smooth">Курсы</a>
                    <a href="#" className="hover:text-white transition-smooth">Контакты</a>
                    <a href="#" className="hover:text-white transition-smooth">Поддержка</a>
                </div>
                <div className="text-sm text-gray-500">
                    © 2025 EliteHeat. Все права защищены.
                </div>
            </div>
        </footer>
    )
}
