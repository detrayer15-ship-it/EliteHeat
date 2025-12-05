import { Task } from '@/types/project'

export type ProjectTemplateId = 'fullstack-app' | 'online-python' | 'replit' | 'programiz' | 'w3schools' | 'custom'

export interface ProjectTemplate {
    id: ProjectTemplateId
    title: string
    icon: string
    description: string
    url?: string
    fields: {
        problem: string
        solution: string
        audience: string
    }
    tasks: Omit<Task, 'id' | 'projectId'>[]
}

export const projectTemplates: Record<ProjectTemplateId, ProjectTemplate> = {
    'fullstack-app': {
        id: 'fullstack-app',
        title: '🚀 Полноценное приложение',
        icon: '🚀',
        description: 'Создание полноценного приложения с backend и frontend',
        fields: {
            problem: 'Создание реального веб-приложения',
            solution: 'Полный стек разработки с базой данных и авторизацией',
            audience: 'Разработчики, изучающие fullstack',
        },
        tasks: [
            // Backend и авторизация
            {
                title: 'Сделай регистрацию и вход',
                completed: false,
                category: '🔧 Backend',
            },
            {
                title: 'Сделай сохранение данных в базе',
                completed: false,
                category: '🔧 Backend',
            },
            {
                title: 'Добавь проверку пользователя',
                completed: false,
                category: '🔧 Backend',
            },
            {
                title: 'Добавь личный кабинет',
                completed: false,
                category: '🔧 Backend',
            },
            {
                title: 'Добавь админ-доступ',
                completed: false,
                category: '🔧 Backend',
            },
            {
                title: 'Добавь уникальную функцию',
                completed: false,
                category: '🔧 Backend',
            },
            {
                title: 'Добавь монетизацию (платные функции)',
                completed: false,
                category: '🔧 Backend',
            },
            // UX/UI
            {
                title: 'Адаптив под телефон',
                completed: false,
                category: '✅ UX/UI',
            },
            {
                title: 'Анимации кнопок',
                completed: false,
                category: '✅ UX/UI',
            },
            {
                title: 'Загрузка (loader)',
                completed: false,
                category: '✅ UX/UI',
            },
            {
                title: 'Ошибки: "Неверный пароль", "Нет интернета" и т.п.',
                completed: false,
                category: '✅ UX/UI',
            },
            {
                title: 'Понятные подсказки',
                completed: false,
                category: '✅ UX/UI',
            },
            {
                title: 'Уведомления об успехе/ошибке',
                completed: false,
                category: '✅ UX/UI',
            },
            {
                title: 'Подтверждение действий (удалить? выйти?)',
                completed: false,
                category: '✅ UX/UI',
            },
            // Логика проекта
            {
                title: 'Проверка, что пользователь вошёл',
                completed: false,
                category: '🔹 Логика',
            },
            {
                title: 'Защита страниц от гостей',
                completed: false,
                category: '🔹 Логика',
            },
            {
                title: 'Автовыход при ошибке',
                completed: false,
                category: '🔹 Логика',
            },
            // Дополнительные функции
            {
                title: 'Тёмная тема',
                completed: false,
                category: '⭐ Доп. функции',
            },
            {
                title: 'Избранное',
                completed: false,
                category: '⭐ Доп. функции',
            },
            {
                title: 'Поиск',
                completed: false,
                category: '⭐ Доп. функции',
            },
            {
                title: 'Фильтры',
                completed: false,
                category: '⭐ Доп. функции',
            },
            {
                title: 'История действий',
                completed: false,
                category: '⭐ Доп. функции',
            },
        ],
    },
    'online-python': {
        id: 'online-python',
        title: '🐍 Online Python IDE',
        icon: '🐍',
        description: 'Онлайн Python IDE для написания и запуска кода',
        url: 'https://www.online-python.com/',
        fields: {
            problem: 'Нужна среда для написания Python кода',
            solution: 'Online Python IDE - бесплатный онлайн редактор',
            audience: 'Ученики, изучающие Python',
        },
        tasks: [
            {
                title: 'Открыть Online Python IDE',
                completed: false,
                category: 'Настройка',
            },
            {
                title: 'Написать первую программу',
                completed: false,
                category: 'Практика',
            },
            {
                title: 'Запустить и протестировать код',
                completed: false,
                category: 'Тестирование',
            },
        ],
    },
    replit: {
        id: 'replit',
        title: '🔧 Replit',
        icon: '🔧',
        description: 'Универсальная онлайн среда для разработки',
        url: 'https://replit.com/languages/python3',
        fields: {
            problem: 'Нужна мощная среда разработки',
            solution: 'Replit - поддержка множества языков программирования',
            audience: 'Разработчики всех уровней',
        },
        tasks: [
            {
                title: 'Создать аккаунт на Replit',
                completed: false,
                category: 'Регистрация',
            },
            {
                title: 'Создать новый проект',
                completed: false,
                category: 'Настройка',
            },
            {
                title: 'Написать и запустить код',
                completed: false,
                category: 'Разработка',
            },
        ],
    },
    programiz: {
        id: 'programiz',
        title: '💻 Programiz Online Compiler',
        icon: '💻',
        description: 'Онлайн компилятор Python и других языков',
        url: 'https://www.programiz.com/python-programming/online-compiler/',
        fields: {
            problem: 'Быстрый запуск кода без установки',
            solution: 'Programiz - простой онлайн компилятор',
            audience: 'Начинающие программисты',
        },
        tasks: [
            {
                title: 'Открыть Programiz Compiler',
                completed: false,
                category: 'Начало работы',
            },
            {
                title: 'Выбрать язык программирования',
                completed: false,
                category: 'Настройка',
            },
            {
                title: 'Написать и выполнить код',
                completed: false,
                category: 'Практика',
            },
        ],
    },
    w3schools: {
        id: 'w3schools',
        title: '🌐 W3Schools Code Editor',
        icon: '🌐',
        description: 'Онлайн редактор HTML/CSS/JS и бэкенд',
        url: 'https://www.w3schools.com/tryit/',
        fields: {
            problem: 'Нужен редактор для веб-разработки',
            solution: 'W3Schools - интерактивные примеры и редактор',
            audience: 'Веб-разработчики',
        },
        tasks: [
            {
                title: 'Открыть W3Schools Editor',
                completed: false,
                category: 'Начало',
            },
            {
                title: 'Создать HTML страницу',
                completed: false,
                category: 'HTML',
            },
            {
                title: 'Добавить стили CSS',
                completed: false,
                category: 'CSS',
            },
            {
                title: 'Добавить интерактивность с JavaScript',
                completed: false,
                category: 'JavaScript',
            },
        ],
    },
    custom: {
        id: 'custom',
        title: '📋 Свой проект',
        icon: '📋',
        description: 'Создать проект с нуля',
        fields: {
            problem: 'Опишите проблему, которую решает ваш проект',
            solution: 'Опишите ваше решение',
            audience: 'Для кого этот проект?',
        },
        tasks: [
            {
                title: 'Определить цели проекта',
                completed: false,
                category: 'Планирование',
            },
            {
                title: 'Провести исследование',
                completed: false,
                category: 'Исследование',
            },
            {
                title: 'Создать прототип решения',
                completed: false,
                category: 'Разработка',
            },
        ],
    },
}

export const getTemplateById = (id: ProjectTemplateId): ProjectTemplate => {
    return projectTemplates[id] || projectTemplates.custom
}
