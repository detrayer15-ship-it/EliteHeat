export const EliteHeatLogo = ({ className = "w-10 h-10" }: { className?: string }) => {
    return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Book */}
            <path
                d="M20 70 L20 30 C20 25 25 20 30 20 L70 20 C75 20 80 25 80 30 L80 70 C80 75 75 80 70 80 L30 80 C25 80 20 75 20 70 Z"
                fill="#1e3a8a"
                stroke="#1e3a8a"
                strokeWidth="2"
            />
            <path
                d="M50 20 L50 80"
                stroke="#0f172a"
                strokeWidth="2"
            />
            <path
                d="M30 35 L45 35 M30 45 L45 45 M30 55 L45 55"
                stroke="#60a5fa"
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Flame */}
            <path
                d="M50 15 C45 25, 40 30, 45 40 C42 35, 40 32, 42 28 C38 32, 35 38, 38 45 C35 42, 33 38, 35 33 C30 38, 28 48, 35 58 C40 65, 50 68, 60 65 C67 62, 70 55, 68 48 C66 40, 60 35, 58 30 C60 35, 62 38, 60 42 C65 38, 68 32, 65 25 C63 30, 60 33, 58 28 C62 22, 63 15, 60 10 C57 5, 52 8, 50 15 Z"
                fill="url(#flameGradient)"
            />

            <defs>
                <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#dc2626" />
                    <stop offset="50%" stopColor="#ea580c" />
                    <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
            </defs>
        </svg>
    )
}
