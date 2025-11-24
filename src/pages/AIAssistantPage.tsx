import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

interface ProjectData {
    name: string
    description: string
    problem: string
    solution: string
    audience: string
}

const SAMPLE_QUESTIONS = [
    '🐍 Как создать список в Python?',
    '🔄 Объясни, что такое цикл for',
    '🎨 Как создать компонент в Figma?',
    '🖼 Что такое Auto Layout в Figma?',
    '🐛 Помоги исправить ошибку в коде',
    '💡 Дай идею для проекта',
]

const AI_RESPONSES: Record<string, string> = {
    'список': `Список в Python создаётся с помощью квадратных скобок []:

\`\`\`python
# Пустой список
my_list = []

# Список с элементами
fruits = ['яблоко', 'банан', 'апельсин']

# Добавление элемента
fruits.append('груша')

# Доступ к элементу
print(fruits[0])  # яблоко
\`\`\``,

    'цикл': `Цикл for используется для повторения действий:

\`\`\`python
# Цикл по списку
fruits = ['яблоко', 'банан', 'апельсин']
for fruit in fruits:
    print(fruit)

# Цикл с числами
for i in range(5):
    print(i)  # Выведет 0, 1, 2, 3, 4

# Цикл с шагом
for i in range(0, 10, 2):
    print(i)  # Выведет 0, 2, 4, 6, 8
\`\`\``,

    'ошибка': `Давай разберём частые ошибки в Python:

**1. IndentationError** - неправильные отступы
\`\`\`python
# ❌ Неправильно
if x > 0:
print(x)

# ✅ Правильно
if x > 0:
    print(x)
\`\`\`

**2. NameError** - переменная не определена
\`\`\`python
# ❌ Неправильно
print(name)

# ✅ Правильно
name = "Иван"
print(name)
\`\`\`

**3. TypeError** - неправильный тип данных
\`\`\`python
# ❌ Неправильно
age = "20"
result = age + 5

# ✅ Правильно
age = 20
result = age + 5
\`\`\`

Покажи мне свой код, и я помогу найти ошибку!`,

    'проект': `Вот несколько идей для проектов:

🎮 **Игры:**
- Угадай число
- Камень-ножницы-бумага
- Крестики-нолики

📊 **Полезные программы:**
- Калькулятор
- Конвертер валют
- Список дел (To-Do List)

🎨 **Творческие проекты:**
- Генератор паролей
- Викторина
- Простой чат-бот

Выбери что-то интересное и начни с простой версии!`,

    'компонент': `Компонент в Figma — это переиспользуемый элемент интерфейса.

**Как создать компонент:**

1️⃣ Выдели объект (кнопку, иконку, карточку)
2️⃣ Нажми **Ctrl + Alt + K** (или ПКМ → Create Component)
3️⃣ Компонент появится в панели Assets

**Зачем нужны компоненты:**
✅ Переиспользование — создал один раз, используй везде
✅ Синхронизация — изменения применяются ко всем копиям
✅ Варианты — можно создать разные состояния (hover, active)

**Пример:**
Создай кнопку → сделай компонент → используй её на всех экранах!`,

    'auto layout': `Auto Layout — это умная система расположения элементов в Figma.

**Что делает Auto Layout:**
🔹 Автоматически выстраивает элементы
🔹 Подстраивается под размер контента
🔹 Упрощает создание адаптивных интерфейсов

**Как использовать:**
1️⃣ Выдели несколько объектов
2️⃣ Нажми **Shift + A**
3️⃣ Настрой отступы (padding) и расстояние (gap)

**Направления:**
📐 Horizontal — элементы в ряд
📐 Vertical — элементы в столбик

**Пример:**
Создай карточку с текстом → примени Auto Layout → текст изменится, карточка подстроится!`,

    'frame': `Frame (фрейм) — это контейнер для дизайна в Figma.

**Как создать Frame:**
1️⃣ Нажми **F** или выбери Frame Tool
2️⃣ Выбери размер (iPhone, Desktop, Custom)
3️⃣ Начни рисовать внутри

**Популярные размеры:**
📱 iPhone 14: 390 × 844
💻 Desktop: 1440 × 1024
📱 Android: 360 × 800

**Зачем нужны фреймы:**
✅ Создание экранов приложений
✅ Организация макетов
✅ Прототипирование переходов`,

    'прототип': `Прототип в Figma — это интерактивная версия дизайна.

**Как создать прототип:**
1️⃣ Создай несколько экранов (фреймов)
2️⃣ Открой вкладку **Prototype**
3️⃣ Выдели кнопку → потяни стрелку на другой экран
4️⃣ Настрой анимацию (Instant, Dissolve, Smart Animate)

**Типы переходов:**
🔹 On Click — при клике
🔹 On Hover — при наведении
🔹 After Delay — через время

**Запуск прототипа:**
▶️ Нажми кнопку Play в правом верхнем углу

Прототипы помогают показать, как будет работать приложение!`,

    'цвет': `Работа с цветом в Figma:

**Как применить цвет:**
1️⃣ Выдели объект
2️⃣ В панели Design → Fill
3️⃣ Выбери цвет или введи HEX-код

**Color Styles:**
Создай стиль цвета, чтобы использовать его везде:
1️⃣ Выбери цвет
2️⃣ Нажми на иконку "+" рядом с Fill
3️⃣ Создай стиль (например, "Primary Blue")

**Градиенты:**
🎨 Linear — прямой переход
🎨 Radial — круговой переход
🎨 Angular — угловой переход

Используй Color Styles для единого дизайна!`,
}

export const AIAssistantPage = () => {
    const [activeTab, setActiveTab] = useState<'chat' | 'constructor'>('chat')
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: 'Привет! 👋 Я твой AI помощник. Задавай любые вопросы о Python и Figma, и я помогу тебе разобраться!',
            timestamp: new Date(),
        },
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Project Constructor State
    const [step, setStep] = useState(0)
    const [projectData, setProjectData] = useState<ProjectData>({
        name: '',
        description: '',
        problem: '',
        solution: '',
        audience: '',
    })

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const getAIResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase()

        // Python вопросы
        if (lowerMessage.includes('список') || lowerMessage.includes('list')) {
            return AI_RESPONSES['список']
        }
        if (lowerMessage.includes('цикл') || lowerMessage.includes('for') || lowerMessage.includes('while')) {
            return AI_RESPONSES['цикл']
        }
        if (lowerMessage.includes('ошибк') || lowerMessage.includes('error') || lowerMessage.includes('исправ')) {
            return AI_RESPONSES['ошибка']
        }
        if (lowerMessage.includes('проект') || lowerMessage.includes('идея') || lowerMessage.includes('что создать')) {
            return AI_RESPONSES['проект']
        }

        // Figma вопросы
        if (lowerMessage.includes('компонент') || lowerMessage.includes('component')) {
            return AI_RESPONSES['компонент']
        }
        if (lowerMessage.includes('auto layout') || lowerMessage.includes('автолейаут') || lowerMessage.includes('автоматическ')) {
            return AI_RESPONSES['auto layout']
        }
        if (lowerMessage.includes('frame') || lowerMessage.includes('фрейм') || lowerMessage.includes('экран')) {
            return AI_RESPONSES['frame']
        }
        if (lowerMessage.includes('прототип') || lowerMessage.includes('prototype') || lowerMessage.includes('переход')) {
            return AI_RESPONSES['прототип']
        }
        if (lowerMessage.includes('цвет') || lowerMessage.includes('color') || lowerMessage.includes('градиент')) {
            return AI_RESPONSES['цвет']
        }

        // Общие вопросы
        if (lowerMessage.includes('привет') || lowerMessage.includes('здравствуй')) {
            return 'Привет! Рад помочь тебе с программированием и дизайном. Могу ответить на вопросы по Python и Figma. Что тебя интересует?'
        }
        if (lowerMessage.includes('спасибо')) {
            return 'Пожалуйста! Обращайся, если будут ещё вопросы. Удачи в обучении! 🚀'
        }
        if (lowerMessage.includes('figma') || lowerMessage.includes('фигма') || lowerMessage.includes('дизайн')) {
            return `Отлично! Я могу помочь с Figma. Вот что я знаю:

🎨 **Основы:**
- Компоненты и их создание
- Auto Layout для адаптивных элементов
- Фреймы и экраны

🖼 **Дизайн:**
- Работа с цветом и градиентами
- Прототипирование и переходы
- Создание UI Kit

Задай конкретный вопрос, и я помогу!`
        }

        return `Интересный вопрос! Вот что я могу тебе посоветовать:

1. **Разбей задачу на части** - начни с простого
2. **Используй примеры** - посмотри похожие решения
3. **Экспериментируй** - пробуй разные варианты
4. **Проверяй результат** - тестируй свою работу

Можешь задать более конкретный вопрос о:

**Python:**
- Списках и функциях
- Циклах и условиях
- Ошибках в коде
- Идеях для проектов

**Figma:**
- Компонентах и Auto Layout
- Фреймах и прототипах
- Цветах и стилях
- Дизайн-системах`
    }

    const handleSend = () => {
        if (!input.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        }

        setMessages([...messages, userMessage])
        setInput('')
        setIsTyping(true)

        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: getAIResponse(input),
                timestamp: new Date(),
            }
            setMessages((prev) => [...prev, aiResponse])
            setIsTyping(false)
        }, 1000)
    }

    const handleQuickQuestion = (question: string) => {
        setInput(question.replace(/^[🐍🔄🎨🖼🐛💡]\s/, ''))
    }

    const handleNextStep = () => {
        if (step < 4) {
            setStep(step + 1)
        }
    }

    const handlePrevStep = () => {
        if (step > 0) {
            setStep(step - 1)
        }
    }

    const handleFinish = () => {
        alert(`Проект "${projectData.name}" создан! Данные сохранены.`)
        // Здесь можно добавить логику сохранения проекта
        setStep(0)
        setProjectData({
            name: '',
            description: '',
            problem: '',
            solution: '',
            audience: '',
        })
    }

    const renderConstructorStep = () => {
        switch (step) {
            case 0:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-text">Шаг 1: Название проекта</h3>
                        <p className="text-gray-600">Как будет называться ваш стартап?</p>
                        <input
                            type="text"
                            value={projectData.name}
                            onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                            placeholder="Например: EduTech Platform"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <div className="bg-primary/5 p-4 rounded-lg">
                            <p className="text-sm text-gray-700">
                                💡 <strong>Совет:</strong> Выберите короткое и запоминающееся название, которое отражает суть вашего проекта.
                            </p>
                        </div>
                    </div>
                )
            case 1:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-text">Шаг 2: Описание проекта</h3>
                        <p className="text-gray-600">Кратко опишите ваш проект в 2-3 предложениях</p>
                        <textarea
                            value={projectData.description}
                            onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                            placeholder="Например: Образовательная платформа для изучения программирования и дизайна с AI-помощником и интерактивными уроками."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            rows={4}
                        />
                        <div className="bg-primary/5 p-4 rounded-lg">
                            <p className="text-sm text-gray-700">
                                💡 <strong>Совет:</strong> Опишите, что делает ваш проект и какую ценность он приносит пользователям.
                            </p>
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-text">Шаг 3: Проблема</h3>
                        <p className="text-gray-600">Какую проблему решает ваш проект?</p>
                        <textarea
                            value={projectData.problem}
                            onChange={(e) => setProjectData({ ...projectData, problem: e.target.value })}
                            placeholder="Например: Студентам сложно найти качественные и доступные курсы по программированию на русском языке."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            rows={4}
                        />
                        <div className="bg-primary/5 p-4 rounded-lg">
                            <p className="text-sm text-gray-700">
                                💡 <strong>Совет:</strong> Четко сформулируйте проблему, с которой сталкиваются ваши потенциальные пользователи.
                            </p>
                        </div>
                    </div>
                )
            case 3:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-text">Шаг 4: Решение</h3>
                        <p className="text-gray-600">Как ваш проект решает эту проблему?</p>
                        <textarea
                            value={projectData.solution}
                            onChange={(e) => setProjectData({ ...projectData, solution: e.target.value })}
                            placeholder="Например: Предоставляем структурированные уроки с практическими заданиями, AI-помощником и трекером прогресса."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            rows={4}
                        />
                        <div className="bg-primary/5 p-4 rounded-lg">
                            <p className="text-sm text-gray-700">
                                💡 <strong>Совет:</strong> Опишите уникальные особенности вашего решения и почему оно лучше альтернатив.
                            </p>
                        </div>
                    </div>
                )
            case 4:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-text">Шаг 5: Целевая аудитория</h3>
                        <p className="text-gray-600">Кто ваши основные пользователи?</p>
                        <textarea
                            value={projectData.audience}
                            onChange={(e) => setProjectData({ ...projectData, audience: e.target.value })}
                            placeholder="Например: Студенты 16-25 лет, начинающие программисты и дизайнеры, желающие освоить новые навыки."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                            rows={4}
                        />
                        <div className="bg-primary/5 p-4 rounded-lg">
                            <p className="text-sm text-gray-700">
                                💡 <strong>Совет:</strong> Будьте конкретны: возраст, интересы, потребности вашей аудитории.
                            </p>
                        </div>

                        <div className="bg-success/10 border border-success/20 rounded-lg p-6 mt-6">
                            <h4 className="font-semibold text-text mb-3">📋 Итоговая информация о проекте:</h4>
                            <div className="space-y-2 text-sm">
                                <p><strong>Название:</strong> {projectData.name || '—'}</p>
                                <p><strong>Описание:</strong> {projectData.description || '—'}</p>
                                <p><strong>Проблема:</strong> {projectData.problem || '—'}</p>
                                <p><strong>Решение:</strong> {projectData.solution || '—'}</p>
                                <p><strong>Аудитория:</strong> {projectData.audience || '—'}</p>
                            </div>
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-4">
                <h1 className="text-3xl font-bold text-text mb-2">🤖 AI Помощник</h1>
                <p className="text-gray-600">Твой персональный помощник по программированию и созданию проектов</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-6 py-3 font-semibold transition-smooth ${activeTab === 'chat'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-600 hover:text-primary'
                        }`}
                >
                    💬 Вопросы и ответы
                </button>
                <button
                    onClick={() => setActiveTab('constructor')}
                    className={`px-6 py-3 font-semibold transition-smooth ${activeTab === 'constructor'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-gray-600 hover:text-primary'
                        }`}
                >
                    🚀 AI-Конструктор проекта
                </button>
            </div>

            {/* Chat Tab */}
            {activeTab === 'chat' && (
                <Card className="flex-1 flex flex-col overflow-hidden">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user'
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-2xl">🤖</span>
                                            <Badge variant="default">AI</Badge>
                                        </div>
                                    )}
                                    <div className="whitespace-pre-wrap">{message.content}</div>
                                    <div className="text-xs opacity-70 mt-2">
                                        {message.timestamp.toLocaleTimeString('ru-RU', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-lg p-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">🤖</span>
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Questions */}
                    <div className="border-t border-gray-200 p-4">
                        <p className="text-sm text-gray-600 mb-2">Быстрые вопросы:</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {SAMPLE_QUESTIONS.map((question, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuickQuestion(question)}
                                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-smooth"
                                >
                                    {question}
                                </button>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Задай вопрос, и я отвечу..."
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
                                Отправить
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Constructor Tab */}
            {activeTab === 'constructor' && (
                <Card className="flex-1 flex flex-col">
                    <div className="p-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-text mb-2">🚀 AI-Конструктор проекта</h2>
                            <p className="text-gray-600">
                                Создайте мини-стартап из своей идеи за 5 простых шагов
                            </p>
                        </div>

                        {/* Progress */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600">Шаг {step + 1} из 5</span>
                                <span className="text-sm text-gray-600">{Math.round(((step + 1) / 5) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full transition-all"
                                    style={{ width: `${((step + 1) / 5) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Step Content */}
                        <div className="mb-6">
                            {renderConstructorStep()}
                        </div>

                        {/* Navigation */}
                        <div className="flex gap-3 justify-between">
                            <Button
                                variant="secondary"
                                onClick={handlePrevStep}
                                disabled={step === 0}
                            >
                                ← Назад
                            </Button>
                            {step < 4 ? (
                                <Button
                                    onClick={handleNextStep}
                                    disabled={
                                        (step === 0 && !projectData.name) ||
                                        (step === 1 && !projectData.description) ||
                                        (step === 2 && !projectData.problem) ||
                                        (step === 3 && !projectData.solution)
                                    }
                                >
                                    Далее →
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleFinish}
                                    disabled={!projectData.audience}
                                >
                                    ✓ Завершить
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>
            )}
        </div>
    )
}
