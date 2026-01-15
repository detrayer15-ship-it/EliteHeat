import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

const WORKING_MODEL = 'gemini-1.5-flash';

// ... (existing code)

/**
 * Generate AI-powered learning task
 */
export const generateTask = async (req, res) => {
    try {
        const { subject, difficulty, userLevel, completedTopics } = req.body;

        // Validation
        if (!subject || !['python', 'figma'].includes(subject)) {
            return res.status(400).json({
                success: false,
                error: 'subject должен быть "python" или "figma"'
            });
        }

        if (!difficulty || !['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
            return res.status(400).json({
                success: false,
                error: 'difficulty должен быть "beginner", "intermediate" или "advanced"'
            });
        }

        // Check if API is available
        if (!genAI) {
            console.warn('⚠️ Gemini API недоступен, используем fallback');
            return res.json({
                success: true,
                task: getFallbackTask(subject, difficulty)
            });
        }

        // Build prompt for task generation
        const prompt = buildTaskGenerationPrompt(subject, difficulty, userLevel, completedTopics);

        // Generate task with AI
        const startTime = Date.now();
        const model = genAI.getGenerativeModel({
            model: WORKING_MODEL,
            generationConfig: {
                temperature: 0.8,
                topP: 0.9,
                topK: 40,
                maxOutputTokens: 1000,
            },
        });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiText = response.text();
        const latencyMs = Date.now() - startTime;

        // Parse JSON response
        const jsonMatch = aiText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.warn('AI не вернул JSON, используем fallback');
            return res.json({
                success: true,
                task: getFallbackTask(subject, difficulty)
            });
        }

        const task = JSON.parse(jsonMatch[0]);

        // Log request
        console.log({
            endpoint: '/api/ai/generate-task',
            subject,
            difficulty,
            model: WORKING_MODEL,
            latencyMs
        });

        res.json({
            success: true,
            task: {
                title: task.title,
                description: task.description,
                difficulty,
                subject,
                hints: task.hints || [],
                estimatedTime: task.estimatedTime || 60
            }
        });

    } catch (error) {
        console.error('Task Generation Error:', error);

        // Fallback response
        res.json({
            success: true,
            task: getFallbackTask(req.body.subject, req.body.difficulty)
        });
    }
};

/**
 * Build prompt for task generation
 */
function buildTaskGenerationPrompt(subject, difficulty, userLevel, completedTopics) {
    const difficultyDesc = {
        beginner: 'начинающего уровня (базовые концепции)',
        intermediate: 'среднего уровня (практическое применение)',
        advanced: 'продвинутого уровня (сложные задачи)'
    };

    const subjectDesc = {
        python: 'программирования на Python',
        figma: 'UI/UX дизайна в Figma'
    };

    return `Сгенерируй учебную задачу по ${subjectDesc[subject]} для ${difficultyDesc[difficulty]}.

Верни ответ СТРОГО В ФОРМАТЕ JSON (без markdown):
{
  "title": "Название задачи (краткое, до 60 символов)",
  "description": "Подробное описание задачи (что нужно сделать, 2-3 предложения)",
  "hints": ["Подсказка 1", "Подсказка 2", "Подсказка 3"],
  "estimatedTime": 45
}

Требования:
- Задача должна быть практической и интересной
- Описание должно быть четким и понятным
- Подсказки должны помогать, но не давать готовое решение
- estimatedTime - примерное время в минутах (15-120)
${completedTopics && completedTopics.length > 0 ? `- Избегай тем: ${completedTopics.join(', ')}` : ''}

Верни ТОЛЬКО JSON, без дополнительного текста.`;
}

/**
 * Fallback task generation
 */
function getFallbackTask(subject, difficulty) {
    const pythonTasks = {
        beginner: {
            title: 'Калькулятор базовых операций',
            description: 'Создай программу-калькулятор, которая умеет складывать, вычитать, умножать и делить два числа. Программа должна запрашивать у пользователя числа и операцию.',
            hints: [
                'Используй функцию input() для получения данных от пользователя',
                'Преобразуй строки в числа с помощью int() или float()',
                'Используй условные операторы if/elif/else для выбора операции'
            ],
            estimatedTime: 30
        },
        intermediate: {
            title: 'Анализатор текста',
            description: 'Напиши программу, которая анализирует текст: подсчитывает количество слов, символов, предложений и находит самое длинное слово.',
            hints: [
                'Используй метод split() для разделения текста на слова',
                'Метод len() поможет подсчитать длину',
                'Для поиска самого длинного слова используй функцию max() с параметром key'
            ],
            estimatedTime: 45
        },
        advanced: {
            title: 'Менеджер задач с JSON',
            description: 'Создай консольное приложение для управления задачами с сохранением в JSON файл. Функции: добавление, удаление, просмотр, отметка выполненных задач.',
            hints: [
                'Используй модуль json для работы с файлами',
                'Создай класс Task для представления задачи',
                'Реализуй функции CRUD (Create, Read, Update, Delete)'
            ],
            estimatedTime: 90
        }
    };

    const figmaTasks = {
        beginner: {
            title: 'Дизайн визитной карточки',
            description: 'Создай дизайн современной визитной карточки размером 90x50мм. Используй Auto Layout для правильного расположения элементов.',
            hints: [
                'Начни с создания Frame нужного размера',
                'Используй Auto Layout для выравнивания текста',
                'Добавь контрастные цвета для читаемости'
            ],
            estimatedTime: 40
        },
        intermediate: {
            title: 'Мобильное приложение - Экран входа',
            description: 'Спроектируй экран входа для мобильного приложения с полями email/пароль, кнопкой входа и ссылкой на регистрацию. Размер: 375x812px (iPhone).',
            hints: [
                'Используй компоненты для повторяющихся элементов',
                'Примени constraints для адаптивности',
                'Добавь состояния для кнопки (normal, hover, pressed)'
            ],
            estimatedTime: 60
        },
        advanced: {
            title: 'Дизайн-система для веб-приложения',
            description: 'Создай базовую дизайн-систему: цветовая палитра, типографика, компоненты кнопок (3 варианта), поля ввода, карточки.',
            hints: [
                'Создай отдельную страницу для стилей',
                'Используй Styles для цветов и текста',
                'Все компоненты должны быть вариантами (Variants)'
            ],
            estimatedTime: 120
        }
    };

    const tasks = subject === 'python' ? pythonTasks : figmaTasks;
    const task = tasks[difficulty];

    return {
        ...task,
        difficulty,
        subject
    };
}
