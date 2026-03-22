/**
 * Мок-сервис для имитации ответов ИИ
 */

interface AIResponse {
    message: string;
    suggestions?: string[];
}

export const mockAIResponse = async (userMessage: string, tab: string = 'general'): Promise<AIResponse> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            let message = '';
            let suggestions: string[] = [];

            const text = userMessage.toLowerCase();

            if (tab === 'roadmap') {
                message = 'Отличный план! Для этого этапа я рекомендую сначала проработать архитектуру данных, а затем приступать к реализации логики.';
                suggestions = ['Как проработать архитектуру?', 'Давай перейдем к следующему шагу', 'Создать roadmap для БД'];
            } else if (tab === 'prompts') {
                message = 'Для вашего стека промпты должны быть максимально конкретными. Я подготовил шаблон, который поможет вам получить более качественный код.';
                suggestions = ['Дай шаблон для Python', 'Как оптимизировать запрос?', 'Сгенерируй код для API'];
            } else if (tab === 'storyboard') {
                message = 'Ваша презентация выглядит убедительно. Обратите внимание на 3-й слайд — там можно добавить больше инфографики.';
                suggestions = ['Как улучшить слайд 1?', 'Симуляция защиты', 'Структура презентации'];
            } else {
                message = 'Я помогу вам с проектом! Задайте любой вопрос по разработке или дизайну.';
                suggestions = ['Как начать?', 'Какой стек выбрать?', 'Анализ проекта'];
            }

            resolve({ message, suggestions });
        }, 1000);
    });
};
