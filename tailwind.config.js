/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            // ============================================
            // ЦВЕТОВАЯ ПАЛИТРА (EliteHeat Design System)
            // ============================================
            colors: {
                // Основной цвет - Индиго
                primary: {
                    50: '#EEF2FF',
                    100: '#E0E7FF',
                    200: '#C7D2FE',
                    300: '#A5B4FC',
                    400: '#818CF8',
                    500: '#6366F1',
                    600: '#4F46E5',
                    700: '#4338CA',
                    800: '#3730A3',
                    900: '#312E81',
                    DEFAULT: '#6366F1',
                },
                // Успех/Прогресс - Зелёный
                success: {
                    50: '#F0FDF4',
                    100: '#DCFCE7',
                    200: '#BBF7D0',
                    300: '#86EFAC',
                    400: '#4ADE80',
                    500: '#22C55E',
                    600: '#16A34A',
                    700: '#15803D',
                    800: '#166534',
                    900: '#14532D',
                    DEFAULT: '#22C55E',
                },
                // Внимание - Янтарный
                warning: {
                    50: '#FFFBEB',
                    100: '#FEF3C7',
                    200: '#FDE68A',
                    300: '#FCD34D',
                    400: '#FBBF24',
                    500: '#F59E0B',
                    600: '#D97706',
                    700: '#B45309',
                    800: '#92400E',
                    900: '#78350F',
                    DEFAULT: '#F59E0B',
                },
                // Ошибка - Красный
                error: {
                    50: '#FEF2F2',
                    100: '#FEE2E2',
                    200: '#FECACA',
                    300: '#FCA5A5',
                    400: '#F87171',
                    500: '#EF4444',
                    600: '#DC2626',
                    700: '#B91C1C',
                    800: '#991B1B',
                    900: '#7F1D1D',
                    DEFAULT: '#EF4444',
                },
                // Нейтральные - Серый
                neutral: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                },
                // Legacy colors (для обратной совместимости)
                'primary-dark': '#4338CA',
                background: '#F9FAFB',
                text: '#111827',
                'ai-blue': '#6366F1',
            },

            // ============================================
            // ТИПОГРАФИКА
            // ============================================
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1.5' }],
                'sm': ['0.875rem', { lineHeight: '1.5' }],
                'base': ['1rem', { lineHeight: '1.5' }],
                'lg': ['1.125rem', { lineHeight: '1.75' }],
                'xl': ['1.25rem', { lineHeight: '1.5' }],
                '2xl': ['1.5rem', { lineHeight: '1.4' }],
                '3xl': ['1.875rem', { lineHeight: '1.3' }],
                '4xl': ['2.25rem', { lineHeight: '1.2' }],
                '5xl': ['3rem', { lineHeight: '1.2' }],
                '6xl': ['3.75rem', { lineHeight: '1.2' }],
            },

            // ============================================
            // SPACING
            // ============================================
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },

            // ============================================
            // SHADOWS
            // ============================================
            boxShadow: {
                'glow': '0 0 20px rgba(99, 102, 241, 0.3), 0 0 40px rgba(99, 102, 241, 0.1)',
                'glow-success': '0 0 20px rgba(34, 197, 94, 0.4), 0 0 40px rgba(34, 197, 94, 0.2)',
                'glow-warning': '0 0 20px rgba(245, 158, 11, 0.4), 0 0 40px rgba(245, 158, 11, 0.2)',
            },

            // ============================================
            // BORDER RADIUS
            // ============================================
            borderRadius: {
                '4xl': '2rem',
                '5xl': '3rem',
            },

            // ============================================
            // ANIMATIONS
            // ============================================
            keyframes: {
                'level-up': {
                    '0%': { transform: 'scale(1)', opacity: '1' },
                    '50%': { transform: 'scale(1.2)', opacity: '0.8' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'achievement-unlock': {
                    '0%': { transform: 'scale(0) rotate(-180deg)', opacity: '0' },
                    '50%': { transform: 'scale(1.1) rotate(10deg)', opacity: '1' },
                    '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
                },
                'progress-fill': {
                    '0%': { width: '0%' },
                    '100%': { width: '100%' },
                },
                'badge-glow': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)' },
                },
            },
            animation: {
                'level-up': 'level-up 0.6s ease-out',
                'achievement-unlock': 'achievement-unlock 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'progress-fill': 'progress-fill 1s ease-out',
                'badge-glow': 'badge-glow 2s ease-in-out infinite',
            },
        },
    },
    plugins: [],
}
