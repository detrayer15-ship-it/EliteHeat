"""
Mita AI Service - Python Edition
Надёжный AI-ассистент с локальной базой знаний
"""

import os
import re
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "https://eliteheat-2ee0b.web.app",
    "https://eliteheat-2ee0b.firebaseapp.com"
])

# ============================================
# ЛОКАЛЬНАЯ БАЗА ЗНАНИЙ - Работает ВСЕГДА
# ============================================

KNOWLEDGE_BASE = {
    # Приветствия
    "greetings": {
        "keywords": ["привет", "здравствуй", "хай", "hello", "hi", "салам"],
        "response": """👋 **Привет!** Я Мита — твой AI-помощник.

Я могу помочь тебе с:
- 🐍 **Python** — код, ошибки, концепции
- 🎨 **Figma** — дизайн, UI/UX, макеты
- 💻 **Программирование** — любые вопросы

Просто напиши свой вопрос!"""
    },
    
    # О себе
    "about_me": {
        "keywords": ["кто ты", "что ты", "расскажи о себе", "who are you"],
        "response": """Я **Мита** — умный AI-помощник платформы EliteHeat.

Меня создал **Даниял** для помощи в обучении программированию и дизайну.

Я могу помочь с Python, Figma и многим другим! 🚀"""
    },
    
    # Создатель
    "creator": {
        "keywords": ["кто создал", "создатель", "кто тебя сделал", "автор"],
        "response": "Меня создал **Даниял** — разработчик платформы EliteHeat. 👨‍💻"
    },
    
    # Python основы
    "python_basics": {
        "keywords": ["python", "питон", "пайтон"],
        "response": """🐍 **Python — отличный выбор для начинающих!**

**Основы Python:**

1. **Переменные:**
```python
name = "Мита"
age = 25
is_ai = True
```

2. **Типы данных:**
- `str` — строки: `"Привет"`
- `int` — целые числа: `42`
- `float` — дробные: `3.14`
- `list` — списки: `[1, 2, 3]`
- `dict` — словари: `{"key": "value"}`

3. **Условия:**
```python
if age >= 18:
    print("Взрослый")
else:
    print("Ребёнок")
```

4. **Циклы:**
```python
for i in range(5):
    print(i)
```

Что конкретно хочешь узнать о Python? 🤔"""
    },
    
    # Python функции
    "python_functions": {
        "keywords": ["функция", "def", "function", "метод"],
        "response": """🔧 **Функции в Python:**

**Создание функции:**
```python
def greet(name):
    return f"Привет, {name}!"

# Вызов
message = greet("Даниял")
print(message)  # Привет, Даниял!
```

**С default параметрами:**
```python
def power(base, exp=2):
    return base ** exp

print(power(3))      # 9
print(power(3, 3))   # 27
```

**Lambda функции:**
```python
square = lambda x: x ** 2
print(square(5))  # 25
```

Нужны примеры посложнее? 💪"""
    },
    
    # Python списки
    "python_lists": {
        "keywords": ["список", "list", "массив", "array"],
        "response": """📋 **Списки (Lists) в Python:**

**Создание:**
```python
fruits = ["яблоко", "банан", "апельсин"]
numbers = [1, 2, 3, 4, 5]
```

**Операции:**
```python
# Добавить элемент
fruits.append("груша")

# Удалить элемент
fruits.remove("банан")

# Получить элемент по индексу
first = fruits[0]

# Срезы
first_two = fruits[:2]

# Длина списка
length = len(fruits)
```

**Полезные методы:**
- `sort()` — сортировка
- `reverse()` — разворот
- `pop()` — удалить последний
- `insert(i, x)` — вставить на позицию

Нужно что-то ещё? 🤔"""
    },
    
    # Figma
    "figma_basics": {
        "keywords": ["figma", "фигма", "дизайн", "ui", "ux", "макет"],
        "response": """🎨 **Figma — мощный инструмент для дизайна!**

**Основные возможности:**

1. **Фреймы (Frames)** — контейнеры для дизайна
   - F — создать фрейм
   
2. **Фигуры:**
   - R — прямоугольник
   - O — овал
   - L — линия

3. **Текст:** T — текстовый инструмент

4. **Auto Layout:**
   - Shift + A — включить
   - Автоматическое выравнивание элементов

5. **Компоненты:**
   - Ctrl/Cmd + Alt + K — создать компонент
   - Переиспользуемые элементы

**Горячие клавиши:**
- Ctrl + D — дублировать
- Ctrl + G — группировать
- Ctrl + Shift + G — разгруппировать

Что конкретно хочешь узнать о Figma? 🖌️"""
    },
    
    # HTML
    "html_basics": {
        "keywords": ["html", "хтмл", "тег", "страница"],
        "response": """🌐 **HTML — основа веб-страниц!**

**Базовая структура:**
```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Моя страница</title>
</head>
<body>
    <h1>Заголовок</h1>
    <p>Параграф текста</p>
</body>
</html>
```

**Основные теги:**
- `<h1>` - `<h6>` — заголовки
- `<p>` — параграф
- `<a href="">` — ссылка
- `<img src="">` — изображение
- `<div>` — контейнер
- `<span>` — inline контейнер

Нужны примеры? 🤔"""
    },
    
    # CSS
    "css_basics": {
        "keywords": ["css", "стиль", "цвет", "оформление"],
        "response": """🎨 **CSS — стилизация веб-страниц!**

**Синтаксис:**
```css
селектор {
    свойство: значение;
}
```

**Примеры:**
```css
/* По тегу */
h1 {
    color: blue;
    font-size: 24px;
}

/* По классу */
.button {
    background: #007bff;
    padding: 10px 20px;
    border-radius: 5px;
}

/* По ID */
#header {
    background: linear-gradient(45deg, #667eea, #764ba2);
}
```

**Flexbox:**
```css
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}
```

Что ещё показать? 🖌️"""
    },
    
    # JavaScript
    "javascript_basics": {
        "keywords": ["javascript", "js", "джаваскрипт"],
        "response": """⚡ **JavaScript — язык веб-разработки!**

**Переменные:**
```javascript
let name = "Мита";
const age = 25;
```

**Функции:**
```javascript
const greet = (name) => `Привет, {name}!`;
```

Нужно больше примеров? 💻"""
    },
    
    # C++
    "cpp_basics": {
        "keywords": ["c++", "си плюс плюс", "cpp"],
        "response": """🚀 **C++ — мощный язык системного программирования!**

**Базовая программа:**
```cpp
#include <iostream>

int main() {
    std::cout << "Привет от Миты!" << std::endl;
    return 0;
}
```

**Основные концепции:**
1. **Типизация:** `int`, `double`, `char`, `bool`.
2. **Указатели:** `int* ptr = &var;`
3. **ООП:** Классы, наследование, полиморфизм.

C++ — это база для игр и производительного софта! Что хочешь разобрать? ⚙️"""
    },
    
    # Java
    "java_basics": {
        "keywords": ["java", "джава", "ява"],
        "response": """☕ **Java — надёжный язык для крупных проектов и Android!**

**Пример кода:**
```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Привет, это Мита!");
    }
}
```

**Особенности:**
- Строгая типизация
- "Написано однажды, работает везде" (JVM)
- Исключительно объектно-ориентированный стиль

Хочешь узнать про Spring или разработку на Android? 📱"""
    },
    
    # Unity / GameDev
    "unity_basics": {
        "keywords": ["unity", "юнити", "разработка игр", "gamedev"],
        "response": """🎮 **Unity — самый популярный движок для создания игр!**

**Как начать:**
1. Скачать **Unity Hub**
2. Выбрать версию редактора
3. Изучать **C#** (основной язык Unity)

**Пример простого скрипта (C#):**
```csharp
using UnityEngine;

public class PlayerMove : MonoBehaviour {
    void Update() {
        float x = Input.GetAxis("Horizontal");
        transform.Translate(x * Time.deltaTime, 0, 0);
    }
}
```

Хочешь создать свою первую игру? Я помогу! 🕹️"""
    },
    
    # Благодарность
    "thanks": {
        "keywords": ["спасибо", "благодарю", "thanks", "thank you"],
        "response": "Пожалуйста! 🌟 Рада была помочь. Если будут ещё вопросы — обращайся!"
    },
    
    # Прощание
    "goodbye": {
        "keywords": ["пока", "до свидания", "bye", "goodbye"],
        "response": "До встречи! 👋 Удачи в обучении! Возвращайся, если понадобится помощь."
    },
    
    # Как дела
    "how_are_you": {
        "keywords": ["как дела", "как ты", "как поживаешь"],
        "response": "У меня всё отлично! 😊 Готова помогать тебе с Python, Figma и программированием. Что тебя интересует?"
    },
}

# ============================================
# Gemini API (резервный вариант)
# ============================================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
gemini_model = None

def init_gemini():
    """Инициализация Gemini API"""
    global gemini_model
    if GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=GEMINI_API_KEY)
            gemini_model = genai.GenerativeModel('gemini-1.5-flash')
            print("✅ Gemini API инициализирован")
            return True
        except Exception as e:
            print(f"⚠️ Gemini API недоступен: {e}")
    return False

def ask_gemini(message, history=[]):
    """Запрос к Gemini API"""
    if not gemini_model:
        return None
    
    try:
        system_prompt = """Ты — Mita (Мита), умный AI-помощник образовательной платформы EliteHeat.
        
ТВОЯ ЛИЧНОСТЬ:
- Ты дружелюбная, умная и полезная
- Отвечаешь на РУССКОМ языке
- Используешь эмодзи умеренно для дружелюбности
- Твой создатель — Даниял

СПЕЦИАЛИЗАЦИЯ:
- Python (программирование)
- Figma (дизайн интерфейсов)
- Веб-разработка (HTML, CSS, JavaScript)

СТИЛЬ ОТВЕТОВ:
1. Отвечай полно и информативно
2. Используй примеры кода когда уместно
3. Объясняй простым языком
4. Структурируй ответы с маркерами и заголовками"""

        chat = gemini_model.start_chat(history=[
            {"role": "user", "parts": [system_prompt]},
            {"role": "model", "parts": ["Понял! Я Мита, готова помогать! 🚀"]}
        ])
        
        response = chat.send_message(message)
        return response.text
    except Exception as e:
        print(f"⚠️ Gemini ошибка: {e}")
        return None

# ============================================
# Поиск в базе знаний
# ============================================

def find_in_knowledge_base(message):
    """Поиск ответа в локальной базе знаний"""
    message_lower = message.lower()
    
    best_match = None
    best_score = 0
    
    for category, data in KNOWLEDGE_BASE.items():
        for keyword in data["keywords"]:
            if keyword in message_lower:
                # Чем больше совпадений, тем выше приоритет
                score = len(keyword)
                if score > best_score:
                    best_score = score
                    best_match = data["response"]
    
    return best_match

def generate_smart_response(message):
    """Генерация умного ответа на основе ключевых слов"""
    message_lower = message.lower()
    
    # Проверяем специфичные паттерны
    patterns = {
        r"как\s+(написать|сделать|создать).*функци": KNOWLEDGE_BASE["python_functions"]["response"],
        r"как\s+(написать|сделать|создать).*список": KNOWLEDGE_BASE["python_lists"]["response"],
        r"что\s+такое\s+python": KNOWLEDGE_BASE["python_basics"]["response"],
        r"как\s+начать.*python": KNOWLEDGE_BASE["python_basics"]["response"],
        r"научи.*python": KNOWLEDGE_BASE["python_basics"]["response"],
    }
    
    for pattern, response in patterns.items():
        if re.search(pattern, message_lower):
            return response
    
    return None

# ============================================
# API Endpoints
# ============================================

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "success": True,
        "service": "Mita AI Python",
        "version": "2.0.0",
        "gemini_available": gemini_model is not None
    })

@app.route('/api/ai/chat', methods=['POST'])
def chat():
    """Main chat endpoint"""
    try:
        data = request.json or {}
        message = data.get('message', '').strip()
        history = data.get('history', [])
        
        if not message:
            return jsonify({
                "success": False,
                "error": "Сообщение не может быть пустым"
            }), 400
        
        start_time = time.time()
        
        # 1. Сначала ищем в локальной базе знаний
        local_response = find_in_knowledge_base(message)
        
        if local_response:
            return jsonify({
                "success": True,
                "reply": local_response,
                "source": "knowledge_base",
                "cached": False,
                "usage": {
                    "model": "local-knowledge-base",
                    "latencyMs": int((time.time() - start_time) * 1000)
                }
            })
        
        # 2. Проверяем паттерны
        pattern_response = generate_smart_response(message)
        if pattern_response:
            return jsonify({
                "success": True,
                "reply": pattern_response,
                "source": "pattern_matching",
                "cached": False,
                "usage": {
                    "model": "pattern-engine",
                    "latencyMs": int((time.time() - start_time) * 1000)
                }
            })
        
        # 3. Используем Gemini API
        gemini_response = ask_gemini(message, history)
        
        if gemini_response:
            return jsonify({
                "success": True,
                "reply": gemini_response,
                "source": "gemini",
                "cached": False,
                "usage": {
                    "model": "gemini-1.5-flash",
                    "latencyMs": int((time.time() - start_time) * 1000)
                }
            })
        
        # 4. Универсальный fallback
        return jsonify({
            "success": True,
            "reply": f"""🤔 Интересный вопрос!

К сожалению, я не нашла точного ответа на **"{message[:50]}..."** в своей базе знаний.

**Попробуй:**
1. Сформулировать вопрос конкретнее
2. Упомянуть тему (Python, Figma, HTML, CSS, JavaScript)
3. Спросить что-то из этих тем:
   - 🐍 Python (основы, функции, списки)
   - 🎨 Figma (дизайн, UI/UX)
   - 🌐 Веб (HTML, CSS, JavaScript)

Я постараюсь помочь! 💪""",
            "source": "fallback",
            "cached": False,
            "usage": {
                "model": "fallback",
                "latencyMs": int((time.time() - start_time) * 1000)
            }
        })
        
    except Exception as e:
        print(f"❌ Chat error: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/ai/status', methods=['GET'])
def status():
    """AI status endpoint"""
    return jsonify({
        "success": True,
        "status": "online",
        "available": True,
        "gemini_available": gemini_model is not None,
        "knowledge_base_size": len(KNOWLEDGE_BASE)
    })

# ============================================
# Main
# ============================================

if __name__ == '__main__':
    print("""
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🤖 Mita AI Python Service v2.0                     ║
║                                                       ║
║   📚 Knowledge Base: """ + str(len(KNOWLEDGE_BASE)) + """ topics                        ║
║   🔌 Port: """ + str(os.getenv('PYTHON_AI_PORT', 3001)) + """                                       ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
    """)
    
    # Пробуем инициализировать Gemini
    init_gemini()
    
    port = int(os.getenv('PYTHON_AI_PORT', 3001))
    app.run(host='0.0.0.0', port=port, debug=True)
