/**
 * EliteHeat Design System Tokens
 * Централизованная система дизайн-токенов для консистентного UI
 */

export const designTokens = {
    // ============================================
    // ЦВЕТОВАЯ ПАЛИТРА
    // ============================================
    colors: {
        // Основной цвет (Primary) - Индиго
        primary: {
            50: '#EEF2FF',
            100: '#E0E7FF',
            200: '#C7D2FE',
            300: '#A5B4FC',
            400: '#818CF8',
            500: '#6366F1', // Основной
            600: '#4F46E5',
            700: '#4338CA',
            800: '#3730A3',
            900: '#312E81',
        },

        // Успех/Прогресс - Зелёный
        success: {
            50: '#F0FDF4',
            100: '#DCFCE7',
            200: '#BBF7D0',
            300: '#86EFAC',
            400: '#4ADE80',
            500: '#22C55E', // Основной
            600: '#16A34A',
            700: '#15803D',
            800: '#166534',
            900: '#14532D',
        },

        // Внимание - Янтарный
        warning: {
            50: '#FFFBEB',
            100: '#FEF3C7',
            200: '#FDE68A',
            300: '#FCD34D',
            400: '#FBBF24',
            500: '#F59E0B', // Основной
            600: '#D97706',
            700: '#B45309',
            800: '#92400E',
            900: '#78350F',
        },

        // Ошибка - Красный
        error: {
            50: '#FEF2F2',
            100: '#FEE2E2',
            200: '#FECACA',
            300: '#FCA5A5',
            400: '#F87171',
            500: '#EF4444', // Основной
            600: '#DC2626',
            700: '#B91C1C',
            800: '#991B1B',
            900: '#7F1D1D',
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

        // Специальные цвета
        background: '#F9FAFB',
        surface: '#FFFFFF',
        text: {
            primary: '#111827',
            secondary: '#6B7280',
            tertiary: '#9CA3AF',
            inverse: '#FFFFFF',
        },
    },

    // ============================================
    // ТИПОГРАФИКА
    // ============================================
    typography: {
        // Размеры шрифтов
        fontSize: {
            xs: '0.75rem',     // 12px
            sm: '0.875rem',    // 14px
            base: '1rem',      // 16px
            lg: '1.125rem',    // 18px
            xl: '1.25rem',     // 20px
            '2xl': '1.5rem',   // 24px
            '3xl': '1.875rem', // 30px
            '4xl': '2.25rem',  // 36px
            '5xl': '3rem',     // 48px
            '6xl': '3.75rem',  // 60px
        },

        // Веса шрифтов
        fontWeight: {
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
            black: '900',
        },

        // Высота строки
        lineHeight: {
            tight: '1.2',
            normal: '1.5',
            relaxed: '1.75',
        },

        // Стили заголовков
        headings: {
            h1: {
                fontSize: '2.25rem',  // 36px
                fontWeight: '900',
                lineHeight: '1.2',
                letterSpacing: '-0.02em',
            },
            h2: {
                fontSize: '1.875rem', // 30px
                fontWeight: '700',
                lineHeight: '1.3',
                letterSpacing: '-0.01em',
            },
            h3: {
                fontSize: '1.5rem',   // 24px
                fontWeight: '600',
                lineHeight: '1.4',
            },
            h4: {
                fontSize: '1.25rem',  // 20px
                fontWeight: '600',
                lineHeight: '1.5',
            },
        },

        // Стили текста
        body: {
            large: {
                fontSize: '1.125rem', // 18px
                lineHeight: '1.75',
            },
            base: {
                fontSize: '1rem',     // 16px
                lineHeight: '1.5',
            },
            small: {
                fontSize: '0.875rem', // 14px
                lineHeight: '1.5',
            },
            tiny: {
                fontSize: '0.75rem',  // 12px
                lineHeight: '1.5',
            },
        },
    },

    // ============================================
    // SPACING (4px grid system)
    // ============================================
    spacing: {
        0: '0',
        1: '0.25rem',   // 4px
        2: '0.5rem',    // 8px
        3: '0.75rem',   // 12px
        4: '1rem',      // 16px
        5: '1.25rem',   // 20px
        6: '1.5rem',    // 24px
        8: '2rem',      // 32px
        10: '2.5rem',   // 40px
        12: '3rem',     // 48px
        16: '4rem',     // 64px
        20: '5rem',     // 80px
        24: '6rem',     // 96px
    },

    // ============================================
    // SHADOWS
    // ============================================
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        glow: '0 0 20px rgba(99, 102, 241, 0.3), 0 0 40px rgba(99, 102, 241, 0.1)',
        glowSuccess: '0 0 20px rgba(34, 197, 94, 0.4), 0 0 40px rgba(34, 197, 94, 0.2)',
    },

    // ============================================
    // BORDER RADIUS
    // ============================================
    borderRadius: {
        none: '0',
        sm: '0.375rem',   // 6px
        base: '0.5rem',   // 8px
        md: '0.75rem',    // 12px
        lg: '1rem',       // 16px
        xl: '1.5rem',     // 24px
        '2xl': '2rem',    // 32px
        '3xl': '3rem',    // 48px
        full: '9999px',
    },

    // ============================================
    // TRANSITIONS
    // ============================================
    transitions: {
        fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
        base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
        slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },

    // ============================================
    // Z-INDEX
    // ============================================
    zIndex: {
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modalBackdrop: 1040,
        modal: 1050,
        popover: 1060,
        tooltip: 1070,
    },
}

// Экспорт для удобного использования
export const { colors, typography, spacing, shadows, borderRadius, transitions, zIndex } = designTokens

export default designTokens
