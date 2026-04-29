export interface Lesson {
    id: string
    moduleIndex: number
    lessonIndex: number
    title: string
    description: string
    duration: string
    type: 'theory' | 'practice' | 'project'
    // Rich content fields
    fullExplanation?: string
    codeExample?: string
    codeLanguage?: string
    steps?: string[]
    flowchart?: string // Mermaid diagram definition
    practiceTask?: string
}

export interface Module {
    id: string
    index: number
    title: string
    lessons: Lesson[]
}

export interface DirectionCurriculum {
    id: string
    title: string
    modules: Module[]
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Helpers
// ─────────────────────────────────────────────────────────────────────────────

interface LessonData {
    description?: string
    fullExplanation?: string
    codeExample?: string
    codeLanguage?: string
    steps?: string[]
    flowchart?: string
    practiceTask?: string
}

const lesson = (
    dirId: string,
    moduleIdx: number,
    lessonIdx: number,
    title: string,
    type: 'theory' | 'practice' | 'project' = 'theory',
    data?: string | LessonData
): Lesson => {
    const isBasicString = typeof data === 'string'
    const payload = isBasicString ? { description: data } : (data || {})

    return {
        id: `${dirId}-m${moduleIdx}-l${lessonIdx}`,
        moduleIndex: moduleIdx,
        lessonIndex: lessonIdx,
        title,
        description: payload.description || `Урок ${lessonIdx} модуля ${moduleIdx}`,
        duration: type === 'practice' ? '60 мин' : type === 'project' ? '120 мин' : '30 мин',
        type,
        fullExplanation: payload.fullExplanation,
        codeExample: payload.codeExample,
        codeLanguage: payload.codeLanguage,
        steps: payload.steps,
        flowchart: payload.flowchart,
        practiceTask: payload.practiceTask,
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Веб-разработчик
// ─────────────────────────────────────────────────────────────────────────────
const webModules: Module[] = [
    {
        id: 'web-m1', index: 1, title: 'Основы веба и верстки',
        lessons: [
            lesson('web', 1, 1, 'Как работает интернет', 'theory', 'Разбор протоколов, серверной и клиентской части.'),
            lesson('web', 1, 2, 'HTML5: Структура и семантика', 'theory', 'Создание правильного каркаса сайта с использованием современных тегов.'),
            lesson('web', 1, 3, 'Формы и мультимедиа', 'practice', 'Создание интерактивных форм, вставка видео и аудио.'),
            lesson('web', 1, 4, 'CSS3: Основы стилизации', 'theory', 'Цвета, шрифты, фоновые изображения и границы.'),
            lesson('web', 1, 5, 'Блочная модель (Box Model)', 'theory', 'Отступы (margin, padding), границы и размеры элементов.'),
            lesson('web', 1, 6, 'CSS Позиционирование', 'practice', 'Работа с position: absolute, relative, fixed и sticky.'),
            lesson('web', 1, 7, 'Flexbox: Современное выравнивание', 'practice', 'Создание гибких макетов и центрирование элементов.'),
            lesson('web', 1, 8, 'Практика: Первая веб-страница', 'practice', 'Создание персональной страницы-визитки.'),
        ]
    },
    {
        id: 'web-m2', index: 2, title: 'Профессиональная адаптивность и Git',
        lessons: [
            lesson('web', 2, 1, 'CSS Grid Layout', 'theory', 'Создание сложных сеток и композиций сайта.'),
            lesson('web', 2, 2, 'Адаптивность и подбор разрешений', 'theory', 'Viewport, медиа-запросы и основы кроссбраузерности.'),
            lesson('web', 2, 3, 'Принцип Mobile-First', 'practice', 'Почему важно начинать верстку с мобильной версии.'),
            lesson('web', 2, 4, 'Основы Git: Установка и Init', 'theory', 'Что такое контроль версий и зачем он нужен разработчику.'),
            lesson('web', 2, 5, 'Git: Commit и Branching', 'practice', 'Работа с ветками, сохранение изменений и откат правок.'),
            lesson('web', 2, 6, 'GitHub: Работа с удаленным репозиторием', 'practice', 'Как отправлять код в облако (push) и забирать изменения (pull).'),
            lesson('web', 2, 7, 'Работа с Figma для разработчика', 'theory', 'Экспорт ресурсов, измерение отступов и чтение макетов.'),
            lesson('web', 2, 8, 'Методология БЭМ', 'theory', 'Правильное именование классов для больших проектов.'),
            lesson('web', 2, 9, 'CSS переменные и современный CSS', 'practice', 'Использование кастомных свойств и функций calc().'),
            lesson('web', 2, 10, 'Практика: Адаптивный лендинг', 'project', 'Создание полноценного сайта, работающего на всех устройствах.'),
        ]
    },
    {
        id: 'web-m3', index: 3, title: 'JavaScript Основы',
        lessons: [
            lesson('web', 3, 1, 'Введение в JavaScript', 'theory', 'История языка, способы подключения и первые команды.'),
            lesson('web', 3, 2, 'Переменные и типы данных', 'theory', 'Различия let, const, var. Типы: string, number, boolean, null, undefined.'),
            lesson('web', 3, 3, 'Функции и область видимости', 'practice', 'Объявление функций, параметры и возвращаемое значение.'),
            lesson('web', 3, 4, 'Логика и условия', 'theory', 'If-else конструкции, тернарный оператор и switch-case.'),
            lesson('web', 3, 5, 'Циклы и итерации', 'practice', 'Организация повторений: for, while, do-while.'),
            lesson('web', 3, 6, 'Массивы и их методы', 'theory', 'Работа со списками данных: push, pop, slice, splice.'),
            lesson('web', 3, 7, 'Современные методы перебора', 'practice', 'ES6 методы: forEach, map, filter, reduce.'),
            lesson('web', 3, 8, 'Объекты и деструктуризация', 'theory', 'Хранение данных в объектах, методы объектов и современный синтаксис.'),
            lesson('web', 3, 9, 'Работа с DOM', 'practice', 'Поиск элементов, изменение текста, стилей и атрибутов.'),
            lesson('web', 3, 10, 'Обработка событий', 'practice', 'Клики, ввод данных, отправка форм и перемещение мыши.'),
        ]
    },
    {
        id: 'web-m4', index: 4, title: 'Работа с API и асинхронностью',
        lessons: [
            lesson('web', 4, 1, 'Объекты JSON', 'theory', 'Формат обмена данными в современном вебе.'),
            lesson('web', 4, 2, 'Асинхронный JS: Промисы', 'theory', 'Как работает асинхронность и зачем нужны Promises.'),
            lesson('web', 4, 3, 'Async/Await синтаксис', 'theory', 'Современный способ написания асинхронного кода.'),
            lesson('web', 4, 4, 'Fetch API: Запросы за данными', 'practice', 'Получение данных с реальных серверов.'),
            lesson('web', 4, 5, 'Локальное хранилище (LocalStorage)', 'practice', 'Сохранение данных в браузере пользователя.'),
            lesson('web', 4, 6, 'Практика: Приложение Погода', 'project', 'Создание сервиса с использованием OpenWeatherMap API.'),
            lesson('web', 4, 7, 'Практика: Поиск фильмов', 'project', 'Работа с кино-API (IMDB/OMDB) и отображение результатов.'),
            lesson('web', 4, 8, 'Обработка ошибок и Loading states', 'practice', 'Как сделать интерфейс отзывчивым при медленном интернете.'),
        ]
    },
    {
        id: 'web-m5', index: 5, title: 'Основы Backend и Node.js',
        lessons: [
            lesson('web', 5, 1, 'Введение в серверную разработку', 'theory', 'Что такое Node.js и зачем фронтенд-разработчику знать бэкенд.'),
            lesson('web', 5, 2, 'Установка Node.js и npm', 'theory', 'Работа с терминалом и менеджером пакетов.'),
            lesson('web', 5, 3, 'Фреймворк Express', 'practice', 'Создание первого сервера и обработка HTTP-запросов.'),
            lesson('web', 5, 4, 'Маршрутизация (Routing)', 'theory', 'Создание путей (Endpoints) для вашего API.'),
            lesson('web', 5, 5, 'Работа с параметрами запроса', 'practice', 'Получение данных из URL и тела запроса.'),
            lesson('web', 5, 6, 'Middleware: Промежуточное ПО', 'theory', 'Логирование, CORS и парсинг данных.'),
            lesson('web', 5, 7, 'REST API: Стандарты разработки', 'theory', 'Как правильно проектировать структуру запросов.'),
            lesson('web', 5, 8, 'Практика: API для списка задач', 'project', 'Создание собственного бэкенда для Todo-приложения.'),
        ]
    },
    {
        id: 'web-m6', index: 6, title: 'Инструменты и Деплой',
        lessons: [
            lesson('web', 6, 1, 'Процесс сборки и оптимизация', 'theory', 'Минификация кода, оптимизация картинок для быстрой загрузки.'),
            lesson('web', 6, 2, 'GitHub Pages: Простой деплой', 'practice', 'Публикация статических сайтов бесплатно за клик.'),
            lesson('web', 6, 3, 'Деплой на Vercel и Netlify', 'practice', 'Современные платформы для деплоя с CI/CD.'),
            lesson('web', 6, 4, 'Переменные окружения (env)', 'theory', 'Безопасное хранение ключей API при деплое.'),
            lesson('web', 6, 5, 'Домены и HTTPS', 'theory', 'Как работает привязка своего имени сайта.'),
            lesson('web', 6, 6, 'Финальный аккорд: Публикация портфолио', 'project', 'Все наработки в одном месте для работодателя.'),
        ]
    },
    {
        id: 'web-m7', index: 7, title: 'Финальный проект',
        lessons: [
            lesson('web', 7, 1, 'Идея и планирование архитектуры', 'project', 'Выбор стека и проектирование базы данных.'),
            lesson('web', 7, 2, 'Прототипирование и дизайн', 'project', 'Создание макета в Figma или на бумаге.'),
            lesson('web', 7, 3, 'Верстка основной структуры (Grid/Mobile-First)', 'project', 'Адаптивный каркас приложения.'),
            lesson('web', 7, 4, 'Разработка Backend части (Node.js)', 'project', 'Серверная логика и хранение данных.'),
            lesson('web', 7, 5, 'Интеграция API и Frontend', 'project', 'Связь сервера с клиентской частью через Fetch.'),
            lesson('web', 7, 6, 'Регистрация и Авторизация (база)', 'project', 'Изучение того, как пользователи входят в систему.'),
            lesson('web', 7, 7, 'Анимации и микро-взаимодействия', 'project', 'Добавление "лоска" приложению.'),
            lesson('web', 7, 8, 'Тестирование на реальных устройствах', 'project', 'Поиск багов и исправление ошибок.'),
            lesson('web', 7, 9, 'Финальный деплой на Vercel', 'project', 'Запуск проекта в продакшн.'),
            lesson('web', 7, 10, 'Защита и презентация', 'project', 'Как рассказать о своей работе и коде.'),
        ]
    },
]

// ─────────────────────────────────────────────────────────────────────────────
// 3. Roblox-разработка
// ─────────────────────────────────────────────────────────────────────────────
const gameModules: Module[] = [
    {
        id: 'game-m1', index: 1, title: 'Основы Lua и Roblox Studio',
        lessons: [
            lesson('game', 1, 1, 'Введение в курс', 'theory', 'Знакомство с курсом: что ты узнаешь, как устроено обучение и зачем изучать разработку на Roblox.'),
            lesson('game', 1, 2, 'Понимание работы Roblox Studio', 'theory', 'Как установить и настроить Roblox Studio. Изучаем интерфейс.'),
            lesson('game', 1, 3, 'Переменные и типы данных', 'theory', 'Что такое переменные в Lua и зачем они нужны. Типы данных.'),
            lesson('game', 1, 4, 'Строки и числа', 'theory', 'Работа со строками, конкатенация и математические операции.'),
            lesson('game', 1, 5, 'Таблицы: массивы и словари', 'theory', 'Таблицы — главная структура данных в Lua.'),
            lesson('game', 1, 6, 'Функции и параметры', 'theory', 'Зачем нужны функции и как их объявлять.'),
            lesson('game', 1, 7, 'Условные операторы', 'theory', 'Как принимать решения в коде: if, elseif, else.'),
            lesson('game', 1, 8, 'Циклы', 'theory', 'Числовой for-цикл, while и repeat-until.'),
            lesson('game', 1, 9, 'Основы отладки', 'theory', 'Как использовать print() и Output для поиска ошибок.'),
            lesson('game', 1, 10, 'Организация кода', 'theory', 'Правила именования и чистый код.'),
        ]
    },
    {
        id: 'game-m2', index: 2, title: 'Структура Roblox и скрипты',
        lessons: [
            lesson('game', 2, 1, 'Иерархия объектов', 'theory', 'Разбор Workspace, ReplicatedStorage и ServerScriptService.'),
            lesson('game', 2, 2, 'Parts и свойства', 'theory', 'Workspace, части и программное изменение свойств.'),
            lesson('game', 2, 3, 'Физика', 'theory', 'Анкоринг, столкновения и физические свойства.'),
            lesson('game', 2, 4, 'Персонажи и Humanoid', 'theory', 'Ключевые свойства персонажа игрока.'),
            lesson('game', 2, 5, 'Сервис игроков', 'theory', 'События PlayerAdded и PlayerRemoving.'),
            lesson('game', 2, 6, 'Starter-сервисы', 'theory', 'StarterPlayer, StarterPack и StarterGui.'),
            lesson('game', 2, 7, 'Типы скриптов', 'theory', 'Scripts vs LocalScripts vs ModuleScripts.'),
            lesson('game', 2, 8, 'Сервер и клиент', 'theory', 'Разделение логики между сервером и клиентом.'),
            lesson('game', 2, 9, 'ModuleScripts', 'theory', 'Использование модулей для повторного кода.'),
            lesson('game', 2, 10, 'Организация проекта', 'theory', 'Структура папок в больших проектах.'),
        ]
    },
    {
        id: 'game-m3', index: 3, title: 'События, GUI и ввод',
        lessons: [
            lesson('game', 3, 1, 'События', 'theory', 'Подписка на события и использование Connect.'),
            lesson('game', 3, 2, 'RemoteEvents (C->S)', 'theory', 'Отправка данных с клиента на сервер.'),
            lesson('game', 3, 3, 'RemoteEvents (S->C)', 'theory', 'Отправка данных с сервера клиентам.'),
            lesson('game', 3, 4, 'RemoteFunctions', 'theory', 'Запросы с ожиданием ответа.'),
            lesson('game', 3, 5, 'Система GUI', 'theory', 'Экраны, фреймы и позиционирование UDim2.'),
            lesson('game', 3, 6, 'HUD и меню', 'theory', 'Создание интерфейса игрока и главного меню.'),
            lesson('game', 3, 7, 'Интерактив в GUI', 'theory', 'Кнопки и события мыши.'),
            lesson('game', 3, 8, 'Связь GUI с данными', 'theory', 'Отображение статистики игрока в интерфейсе.'),
            lesson('game', 3, 9, 'TweenService', 'theory', 'Анимация элементов интерфейса.'),
            lesson('game', 3, 10, 'Обработка ввода', 'theory', 'UserInputService для управления клавиатурой.'),
        ]
    },
    {
        id: 'game-m4', index: 4, title: 'Геймплей и сохранение данных',
        lessons: [
            lesson('game', 4, 1, 'Leaderstats', 'theory', 'Создание лидербордов и статистики.'),
            lesson('game', 4, 2, 'Валюта и награды', 'theory', 'Система экономики в игре.'),
            lesson('game', 4, 3, 'Здоровье и урон', 'theory', 'Механики нанесения урона и исцеления.'),
            lesson('game', 4, 4, 'Инструменты', 'theory', 'Создание мечей и других предметов.'),
            lesson('game', 4, 5, 'Raycasting', 'theory', 'Механика стрельбы лучом.'),
            lesson('game', 4, 6, 'Простой AI', 'theory', 'Движение NPC и патрулирование.'),
            lesson('game', 4, 7, 'DataStore: Запись', 'theory', 'Сохранение прогресса игрока.'),
            lesson('game', 4, 8, 'DataStore: Чтение', 'theory', 'Загрузка данных при входе в игру.'),
            lesson('game', 4, 9, 'Защита DataStore', 'theory', 'Безопасная обработка ошибок сохранения.'),
            lesson('game', 4, 10, 'Практика: Прогресс', 'practice', 'Полная система прогресса с сохранением.'),
        ]
    },
    {
        id: 'game-m5', index: 5, title: 'Безопасность и оптимизация',
        lessons: [
            lesson('game', 5, 1, 'Архитектура безопасности', 'theory', 'Почему важна проверка на сервере.'),
            lesson('game', 5, 2, 'Валидация', 'theory', 'Проверка данных на стороне сервера.'),
            lesson('game', 5, 3, 'Защита RemoteEvents', 'theory', 'Rate limiting и проверка аргументов.'),
            lesson('game', 5, 4, 'Античит: Скорость', 'theory', 'Предотвращение спидхаков и телепортов.'),
            lesson('game', 5, 5, 'Система киков', 'theory', 'Логика наказания эксплойтеров.'),
            lesson('game', 5, 6, 'Оптимизация', 'theory', 'Снижение лагов и оптимизация скриптов.'),
            lesson('game', 5, 7, 'Отладка систем', 'theory', 'Инструменты для поиска багов в больших проектах.'),
            lesson('game', 5, 8, 'Модульная архитектура', 'theory', 'Разделение ответственности между модулями.'),
            lesson('game', 5, 9, 'Подготовка к релизу', 'theory', 'Чеклист перед запуском игры.'),
            lesson('game', 5, 10, 'Практика: Оптимизация', 'practice', 'Профилирование и ускорение проекта.'),
        ]
    },
    {
        id: 'game-m6', index: 6, title: 'Пост-курс: запуск игры',
        lessons: [
            lesson('game', 6, 1, 'Концепция и план', 'project', 'Геймдизайн-документ и планирование.'),
            lesson('game', 6, 2, 'Маркетинг', 'project', 'Как набрать первых игроков.'),
            lesson('game', 6, 3, 'Дизайн карты', 'project', 'Левел-дизайн и атмосфера.'),
            lesson('game', 6, 4, 'Точки интереса', 'project', 'Балансировка спавнов и потока игроков.'),
            lesson('game', 6, 5, 'Финализация GUI', 'project', 'Полировка всех интерфейсов.'),
            lesson('game', 6, 6, 'Баланс механик', 'project', 'Настройка оружия и кулдаунов.'),
            lesson('game', 6, 7, 'NPC Мира', 'project', 'Расстановка врагов и квестодателей.'),
            lesson('game', 6, 8, 'Монетизация', 'project', 'Game Passes и Developer Products.'),
            lesson('game', 6, 9, 'Тестирование', 'project', 'Финальные тесты и сбор фидбека.'),
            lesson('game', 6, 10, 'Публикация', 'project', 'Релиз игры и стратегия обновлений.'),
        ]
    },
]

// ─────────────────────────────────────────────────────────────────────────────
// 6. Python-разработка (Оптимизированный курс - 50 уроков)
// ─────────────────────────────────────────────────────────────────────────────
const pythonModules: Module[] = [
    {
        id: 'python-m1', index: 1, title: 'Введение',
        lessons: [
            lesson('python', 1, 1, 'Что такое Python', 'theory', {
                description: 'Знакомство с языком, его историей и сферами применения.',
                fullExplanation: 'Python — это высокоуровневый язык программирования с простым и читаемым синтаксисом. Его часто называют "идеальным первым языком" из-за его схожести с обычным английским.',
                codeExample: 'print("Привет, мир!")',
                steps: [
                    'Установка интерпретатора Python',
                    'Настройка редактора кода VS Code',
                    'Создание первого файла .py',
                    'Запуск программы в терминале'
                ],
                flowchart: 'Start -> [Write Code] -> [Run by Interpreter] -> Output -> End',
                practiceTask: 'Установите Python на свой компьютер и напишите программу, которая выводит ваше имя.'
            }),
            lesson('python', 1, 2, 'Установка Python и IDE', 'theory', {
                description: 'Настройка рабочего окружения и установка VS Code.',
                fullExplanation: 'Для работы нам понадобятся два инструмента: сам язык Python и редактор кода VS Code, где мы будем писать наши программы.',
                steps: [
                    'Скачивание установщика с python.org',
                    'Обязательная галочка "Add Python to PATH"',
                    'Установка VS Code',
                    'Добавление расширения Python в VS Code'
                ],
                practiceTask: 'Сделайте скриншот установленного VS Code с открытым пустым файлом.'
            }),
            lesson('python', 1, 3, 'Первая программа', 'practice', {
                description: 'Пишем и запускаем классический "Hello World".',
                fullExplanation: 'Команда print() — это самый простой способ заставить компьютер с вами общаться. Все, что вы поместите в скобки в кавычках, будет выведено на экран.',
                codeExample: 'name = "Анна"\nprint("Привет, " + name)',
                steps: [
                    'Использование функции print',
                    'Работа с кавычками (строками)',
                    'Запуск кода горячей клавишей F5 или через терминал'
                ],
                practiceTask: 'Измените код так, чтобы программа приветствовала не только вас, но и EliteHeat.'
            }),
            lesson('python', 1, 4, 'Переменные', 'theory', {
                description: 'Как хранить данные в памяти и правила именования.',
                fullExplanation: 'Переменная — это именованная ячейка памяти. Представьте это как коробку с этикеткой, в которую можно положить какое-то значение.',
                codeExample: 'age = 15\nheight = 1.75\nname = "Elite Student"',
                steps: [
                    'Присваивание значения оператором "="',
                    'Выбор понятного имени (snake_case)',
                    'Изменение значения переменной в процессе выполнения'
                ],
                flowchart: 'Input -> [Variable x = 10] -> [Apply Formula] -> [Result y = x * 2] -> Output',
                practiceTask: 'Создайте три переменные для описания игрока: никнейм, уровень и количество здоровья.'
            }),
            lesson('python', 1, 5, 'Типы данных', 'theory', {
                description: 'Разбор основных типов: int, float, str, bool.',
                fullExplanation: 'В Python все данные делятся на типы. Это помогает компьютеру понять, можно ли складывать значения или работать с ними как с текстом.',
                codeExample: 'a = 10     # int (целое)\nb = 5.5    # float (дробное)\nc = "Hi"   # str (строка)\nd = True   # bool (логическое)',
                steps: [
                    'Проверка типа функцией type()',
                    'Преобразование типов (cast)',
                    'Особенности динамической типизации'
                ]
            }),
            lesson('python', 1, 6, 'Ввод/вывод', 'practice', 'Использование функций print() и input() для взаимодействия.'),
            lesson('python', 1, 7, 'Операции', 'theory', 'Арифметические и логические операции в коде.'),
            lesson('python', 1, 8, 'Мини-практика', 'practice', 'Закрепляем основы на простых задачах.'),
        ]
    },
    {
        id: 'python-m2', index: 2, title: 'База программирования',
        lessons: [
            lesson('python', 2, 1, 'Условия (if, else)', 'theory', {
                description: 'Управление потоком программы с помощью условий.',
                fullExplanation: 'Условия позволяют программе выбирать путь выполнения кода. Если условие истинно (True), выполняется один блок, иначе — другой.',
                codeExample: 'if score > 50:\n    print("Победа!")\nelse:\n    print("Попробуй еще раз")',
                steps: [
                    'Проверка логического выражения',
                    'Использование двоеточия ":"',
                    'Важность отступов (4 пробела)',
                    'Добавление elif для множественного выбора'
                ],
                flowchart: 'Start -> [Check score > 50] --(Yes)--> [Print Win] -> End\nCheck score > 50 --(No)--> [Print Lose] -> End',
                practiceTask: 'Напишите программу, которая проверяет возраст пользователя и сообщает, может ли он играть в игру (12+).'
            }),
            lesson('python', 2, 2, 'Логические операторы', 'theory', 'Сложные проверки с использованием and, or, not.'),
            lesson('python', 2, 3, 'Цикл while', 'theory', 'Организация повторений до выполнения условия.'),
            lesson('python', 2, 4, 'Цикл for', 'theory', 'Перебор элементов и использование функции range.'),
            lesson('python', 2, 5, 'Списки', 'theory', 'Работа с динамическими массивами данных.'),
            lesson('python', 2, 6, 'Кортежи', 'theory', 'Неизменяемые коллекции данных.'),
            lesson('python', 2, 7, 'Словари', 'theory', 'Хранение данных в формате ключ-значение.'),
            lesson('python', 2, 8, 'Множества', 'theory', 'Работа с уникальными элементами и их операциями.'),
            lesson('python', 2, 9, 'Вложенные структуры', 'theory', 'Списки списков, словари в списках и их обход.'),
            lesson('python', 2, 10, 'Практика', 'practice', 'Решение алгоритмических задач на циклы и коллекции.'),
        ]
    },
    {
        id: 'python-m3', index: 3, title: 'Функции и модули',
        lessons: [
            lesson('python', 3, 1, 'Функции', 'theory', 'Создание переиспользуемых блоков кода.'),
            lesson('python', 3, 2, 'Параметры', 'theory', 'Передача аргументов, позиционные и именованные вызовы.'),
            lesson('python', 3, 3, 'return', 'practice', 'Возврат результатов работы функции.'),
            lesson('python', 3, 4, 'Область видимости', 'theory', 'Глобальные и локальные переменные (scope).'),
            lesson('python', 3, 5, 'Модули', 'theory', 'Подключение библиотек и импорт функций из других файлов.'),
            lesson('python', 3, 6, 'Практика', 'practice', 'Создание функциональной базы для приложения.'),
        ]
    },
    {
        id: 'python-m4', index: 4, title: 'Работа с файлами и ошибками',
        lessons: [
            lesson('python', 4, 1, 'Файлы (txt)', 'theory', 'Открытие и закрытие файлов в разных режимах.'),
            lesson('python', 4, 2, 'Чтение/запись', 'practice', 'Как программно изменять текстовые документы.'),
            lesson('python', 4, 3, 'JSON', 'theory', 'Работа с форматом обмена данными.'),
            lesson('python', 4, 4, 'Ошибки (try/except)', 'theory', 'Перехват и обработка исключений в приложении.'),
            lesson('python', 4, 5, 'Практика', 'practice', 'Создание системы сохранения данных в файл.'),
        ]
    },
    {
        id: 'python-m5', index: 5, title: 'Работа с данными',
        lessons: [
            lesson('python', 5, 1, 'Введение в данные', 'theory', 'Основы Data Science и анализ структур.'),
            lesson('python', 5, 2, 'CSV', 'theory', 'Работа с табличными данными в формате CSV.'),
            lesson('python', 5, 3, 'pandas', 'theory', 'Библиотека №1 для анализа данных: Series и DataFrame.'),
            lesson('python', 5, 4, 'Фильтрация', 'practice', 'Выборка нужных данных по условиям.'),
            lesson('python', 5, 5, 'Визуализация', 'theory', 'Построение простых графиков для отчетов.'),
            lesson('python', 5, 6, 'Мини-проект', 'project', 'Анализ реального датасета и вывод статистики.'),
        ]
    },
    {
        id: 'python-m6', index: 6, title: 'Pygame (игры)',
        lessons: [
            lesson('python', 6, 1, 'Введение в Pygame', 'theory', 'Настройка игрового движка и создание окна.'),
            lesson('python', 6, 2, 'Движение', 'practice', 'Как заставить объекты перемещаться по экрану.'),
            lesson('python', 6, 3, 'Управление', 'practice', 'Обработка клавиатуры и мыши в реальном времени.'),
            lesson('python', 6, 4, 'Коллизии', 'theory', 'Проверка столкновений объектов.'),
            lesson('python', 6, 5, 'Мини-игра', 'project', 'Создание простой аркадной игры.'),
        ]
    },
    {
        id: 'python-m7', index: 7, title: 'Django + API',
        lessons: [
            lesson('python', 7, 1, 'Введение в Django', 'theory', 'Архитектура веб-приложений и основы фреймворка.'),
            lesson('python', 7, 2, 'Модели', 'theory', 'Проектирование базы данных через классы Python.'),
            lesson('python', 7, 3, 'Views', 'practice', 'Обработка запросов и вывод шаблонов.'),
            lesson('python', 7, 4, 'API', 'theory', 'Создание интерфейса взаимодействия для других программ.'),
            lesson('python', 7, 5, 'CRUD', 'practice', 'Создание, чтение, обновление и удаление данных.'),
            lesson('python', 7, 6, 'Мини-проект', 'project', 'Вев-сервис с базой данных и API.'),
        ]
    },
    {
        id: 'python-m8', index: 8, title: 'Проектирование',
        lessons: [
            lesson('python', 8, 1, 'ООП', 'theory', 'Объектно-ориентированное программирование: классы и объекты.'),
            lesson('python', 8, 2, 'Архитектура', 'theory', 'Как правильно структурировать большие проекты.'),
            lesson('python', 8, 3, 'Git', 'theory', 'Контроль версий и совместная разработка.'),
            lesson('python', 8, 4, 'Финальный проект', 'project', 'Разработка комплексного приложения с Git и ООП.'),
        ]
    },
]

// ─────────────────────────────────────────────────────────────────────────────
// Direction map (title -> curriculum)
// ─────────────────────────────────────────────────────────────────────────────
const directionLabel: Record<string, string> = {
    web: 'веб-разработке',
    game: 'Roblox-разработке',
    python: 'Python',
}

const includesAny = (text: string, words: string[]) => {
    const normalized = text.toLowerCase()
    return words.some(word => normalized.includes(word.toLowerCase()))
}

const buildTheory = (directionId: string, moduleTitle: string, currentLesson: Lesson) => {
    const area = directionLabel[directionId] || 'проектной работе'
    const resultName = currentLesson.type === 'project' ? 'мини-проект' : currentLesson.type === 'practice' ? 'практическую работу' : 'понятный пример'

    return `В этом уроке ты изучаешь тему «${currentLesson.title}» в направлении ${area}. Сначала разберись, какую проблему решает эта тема, потом повтори пример и только после этого сделай свое задание. Урок относится к модулю «${moduleTitle}», поэтому в конце у тебя должен получиться ${resultName}, который можно добавить в портфолио или использовать в финальном проекте.`
}

const buildSteps = (currentLesson: Lesson) => [
    `Прочитай объяснение темы «${currentLesson.title}» и выпиши 2-3 главные идеи.`,
    'Повтори пример кода без копирования: набери его сам и проверь результат.',
    'Измени в примере минимум 3 детали: текст, цвет, число, условие или название.',
    'Сделай практическое задание и проверь, что оно работает без ошибок.',
    'Коротко напиши, что получилось, что было сложным и что можно улучшить.',
]

const buildPracticeTask = (moduleTitle: string, currentLesson: Lesson) => {
    if (currentLesson.type === 'project') {
        return `Собери мини-проект по теме «${currentLesson.title}»: сделай рабочий результат, добавь понятное название, 3 основные функции и короткое описание, как им пользоваться.`
    }

    if (currentLesson.type === 'practice') {
        return `Выполни практику по теме «${currentLesson.title}»: повтори пример, измени его под свою идею и добавь один дополнительный элемент сверх примера.`
    }

    return `Сделай задание по модулю «${moduleTitle}»: объясни тему «${currentLesson.title}» своими словами и создай маленький пример, который показывает, как это работает.`
}

const buildFlowchart = () => 'Старт -> Изучить тему -> Повторить пример -> Сделать свою версию -> Проверить ошибки -> Готово'

const webCodeExample = (title: string) => {
    if (includesAny(title, ['css', 'style', 'grid', 'flex', 'адаптив', 'стил'])) {
        return {
            codeLanguage: 'css',
            codeExample: `.project-card {
  max-width: 420px;
  padding: 24px;
  border-radius: 16px;
  background: white;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
}

.project-card h2 {
  color: #2563eb;
  margin-bottom: 8px;
}`,
        }
    }

    if (includesAny(title, ['javascript', 'dom', 'событ', 'цикл', 'массив', 'api', 'fetch', 'json'])) {
        return {
            codeLanguage: 'javascript',
            codeExample: `const ideas = ['AI помощник', 'трекер задач', 'презентация'];

ideas.forEach((idea, index) => {
  console.log(\`\${index + 1}. \${idea}\`);
});

function showProgress(done, total) {
  return Math.round((done / total) * 100);
}`,
        }
    }

    if (includesAny(title, ['node', 'express', 'backend', 'сервер'])) {
        return {
            codeLanguage: 'javascript',
            codeExample: `import express from 'express';

const app = express();

app.get('/api/projects', (req, res) => {
  res.json({ title: 'Мой проект', status: 'in-progress' });
});

app.listen(3000, () => console.log('Server started'));`,
        }
    }

    return {
        codeLanguage: 'html',
        codeExample: `<section class="project-card">
  <h2>Моя идея</h2>
  <p>Опиши проблему, решение и пользу для людей.</p>
  <button>Начать проект</button>
</section>`,
    }
}

const gameCodeExample = (title: string) => {
    if (includesAny(title, ['leaderstats', 'балл', 'очки', 'score'])) {
        return {
            codeLanguage: 'lua',
            codeExample: `game.Players.PlayerAdded:Connect(function(player)
  local leaderstats = Instance.new("Folder")
  leaderstats.Name = "leaderstats"
  leaderstats.Parent = player

  local coins = Instance.new("IntValue")
  coins.Name = "Coins"
  coins.Value = 0
  coins.Parent = leaderstats
end)`,
        }
    }

    return {
        codeLanguage: 'lua',
        codeExample: `local part = script.Parent

part.Touched:Connect(function(hit)
  local player = game.Players:GetPlayerFromCharacter(hit.Parent)
  if player then
    print(player.Name .. " дошел до точки!")
  end
end)`,
    }
}

const pythonCodeExample = (title: string) => {
    if (includesAny(title, ['django', 'api', 'views', 'crud'])) {
        return {
            codeLanguage: 'python',
            codeExample: `from django.http import JsonResponse

def project_status(request):
    return JsonResponse({
        "title": "Мой проект",
        "status": "in-progress"
    })`,
        }
    }

    if (includesAny(title, ['pygame', 'игр', 'коллиз', 'анимац'])) {
        return {
            codeLanguage: 'python',
            codeExample: `import pygame

pygame.init()
screen = pygame.display.set_mode((600, 400))
running = True

while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    screen.fill((37, 99, 235))
    pygame.display.flip()`,
        }
    }

    if (includesAny(title, ['функ', 'ооп', 'класс', 'архитект'])) {
        return {
            codeLanguage: 'python',
            codeExample: `class Project:
    def __init__(self, title, tasks_done, total_tasks):
        self.title = title
        self.tasks_done = tasks_done
        self.total_tasks = total_tasks

    def progress(self):
        return round(self.tasks_done / self.total_tasks * 100)

project = Project("AI помощник", 3, 5)
print(project.progress())`,
        }
    }

    return {
        codeLanguage: 'python',
        codeExample: `idea = input("Напиши идею проекта: ")
problem = input("Какую проблему решает идея? ")

print("Проект:")
print(f"Идея: {idea}")
print(f"Проблема: {problem}")`,
    }
}

const buildCodeExample = (directionId: string, title: string) => {
    if (directionId === 'web') return webCodeExample(title)
    if (directionId === 'game') return gameCodeExample(title)
    return pythonCodeExample(title)
}

const enrichLesson = (directionId: string, moduleTitle: string, currentLesson: Lesson): Lesson => {
    const code = buildCodeExample(directionId, currentLesson.title)

    return {
        ...currentLesson,
        fullExplanation: currentLesson.fullExplanation || buildTheory(directionId, moduleTitle, currentLesson),
        steps: currentLesson.steps || buildSteps(currentLesson),
        flowchart: currentLesson.flowchart || buildFlowchart(),
        practiceTask: currentLesson.practiceTask || buildPracticeTask(moduleTitle, currentLesson),
        codeExample: currentLesson.codeExample || code.codeExample,
        codeLanguage: currentLesson.codeLanguage || code.codeLanguage,
    }
}

const enrichModules = (directionId: string, modules: Module[]) => modules.map(module => ({
    ...module,
    lessons: module.lessons.map(currentLesson => enrichLesson(directionId, module.title, currentLesson)),
}))

export const CURRICULA: DirectionCurriculum[] = [
    { id: 'web', title: 'Веб разработчик', modules: enrichModules('web', webModules) },
    { id: 'game', title: 'Roblox', modules: enrichModules('game', gameModules) },
    { id: 'python', title: 'Python', modules: enrichModules('python', pythonModules) },
]

export const getCurriculumByDirection = (direction: string): DirectionCurriculum | null => {
    return CURRICULA.find(c =>
        c.title.toLowerCase() === direction.toLowerCase() ||
        direction.toLowerCase().includes(c.id.toLowerCase())
    ) || CURRICULA[0]
}
