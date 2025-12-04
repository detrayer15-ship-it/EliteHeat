export const translations = {
    ru: {
        // Навигация
        nav: {
            dashboard: 'Главная',
            projects: 'Проекты',
            tasks: 'Задачи',
            progress: 'Трекер Прогресса',
            python: 'Python',
            figma: 'Figma',
            aiAssistant: 'AI Помощник',
            analyzer: 'AI Конструктор',
            settings: 'Настройки',
            logout: 'Выйти',
        },
        // Настройки
        settings: {
            title: 'Настройки',
            profile: 'Профиль',
            editProfile: 'Редактировать профиль',
            language: 'Язык',
            languageDesc: 'Выберите язык интерфейса',
            russian: 'Русский',
            english: 'English',
            theme: 'Тема',
            themeDesc: 'Выберите тему оформления',
            light: 'Светлая',
            dark: 'Тёмная',
            subscription: 'Подписка',
            currentPlan: 'Текущий тариф',
        },
        // Общие
        common: {
            save: 'Сохранить',
            cancel: 'Отмена',
            delete: 'Удалить',
            edit: 'Редактировать',
            create: 'Создать',
            submit: 'Отправить',
            loading: 'Загрузка...',
            search: 'Поиск',
        },
    },
    en: {
        // Navigation
        nav: {
            dashboard: 'Dashboard',
            projects: 'Projects',
            tasks: 'Tasks',
            progress: 'Progress Tracker',
            python: 'Python',
            figma: 'Figma',
            aiAssistant: 'AI Assistant',
            analyzer: 'AI Constructor',
            settings: 'Settings',
            logout: 'Logout',
        },
        // Settings
        settings: {
            title: 'Settings',
            profile: 'Profile',
            editProfile: 'Edit Profile',
            language: 'Language',
            languageDesc: 'Choose interface language',
            russian: 'Русский',
            english: 'English',
            theme: 'Theme',
            themeDesc: 'Choose color theme',
            light: 'Light',
            dark: 'Dark',
            subscription: 'Subscription',
            currentPlan: 'Current Plan',
        },
        // Common
        common: {
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            create: 'Create',
            submit: 'Submit',
            loading: 'Loading...',
            search: 'Search',
        },
    },
}

export type TranslationKey = keyof typeof translations.ru
