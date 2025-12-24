# 🤖 Подключение Gemini AI API

## ✅ Статус: ГОТОВО!

Gemini AI API успешно подключен к вашему сайту EliteHeat!

---

## 📋 Что было сделано:

### 1. ✅ Настроены переменные окружения
Файл: `.env.local`
```env
# Backend API URL
VITE_API_URL=http://localhost:3000

# Google Gemini AI API Key
VITE_GEMINI_API_KEY=AIzaSyCk7v9spUdCGeT9P1Blfopia1_Brc9lb08
```

### 2. ✅ Обновлен API клиент
Файл: `src/api/gemini.ts`
- ✅ API ключ теперь берется из переменных окружения (безопасно!)
- ✅ Добавлены проверки на наличие API ключа
- ✅ Fallback режим если API недоступен
- ✅ Исправлены все TypeScript ошибки

### 3. ✅ Доступные функции:

#### **sendTextMessage(message: string)**
Отправка текстового запроса к Gemini AI
```typescript
import { sendTextMessage } from '@/api/gemini'

const response = await sendTextMessage('Объясни циклы в Python')
console.log(response)
```

#### **sendImageMessage(message: string, imageBase64: string)**
Анализ изображений с помощью Gemini Vision
```typescript
import { sendImageMessage } from '@/api/gemini'

const response = await sendImageMessage(
  'Найди ошибки в этом коде',
  'data:image/jpeg;base64,...'
)
```

#### **checkCode(code: string, language: string)**
Проверка кода на ошибки
```typescript
import { checkCode } from '@/api/gemini'

const response = await checkCode(`
def hello():
  print("Hello World"
`, 'python')
```

#### **helpWithPresentation(topic: string, details: string)**
Помощь с презентациями
```typescript
import { helpWithPresentation } from '@/api/gemini'

const response = await helpWithPresentation(
  'Искусственный интеллект',
  'Презентация для школьников, 10 слайдов'
)
```

#### **checkAPIStatus()**
Проверка доступности API
```typescript
import { checkAPIStatus } from '@/api/gemini'

const isAvailable = await checkAPIStatus()
console.log('API доступен:', isAvailable)
```

---

## 🚀 Как использовать в компонентах:

### Пример 1: Простой чат с AI
```tsx
import { useState } from 'react'
import { sendTextMessage } from '@/api/gemini'

function AIChat() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    setLoading(true)
    try {
      const aiResponse = await sendTextMessage(message)
      setResponse(aiResponse)
    } catch (error) {
      console.error('Ошибка:', error)
      setResponse('Произошла ошибка. Попробуйте еще раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <input 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Задайте вопрос AI..."
      />
      <button onClick={handleSend} disabled={loading}>
        {loading ? 'Думаю...' : 'Отправить'}
      </button>
      {response && <div>{response}</div>}
    </div>
  )
}
```

### Пример 2: Проверка кода
```tsx
import { checkCode } from '@/api/gemini'

async function analyzeCode() {
  const code = `
    function sum(a, b) {
      return a + b
    }
  `
  
  const analysis = await checkCode(code, 'javascript')
  console.log(analysis)
}
```

---

## 🔧 Где используется Gemini AI на сайте:

1. **AI Чат** - Помощник для студентов
2. **Проверка кода** - Анализ заданий
3. **Помощь с презентациями** - Генерация идей
4. **Анализ изображений** - Проверка скриншотов кода

---

## ⚙️ Настройки модели:

Текущая модель: **gemini-1.5-flash**
- ✅ Быстрая
- ✅ Поддерживает текст и изображения
- ✅ Хорошее качество ответов

Если нужна более мощная модель, измените в `src/api/gemini.ts`:
```typescript
const WORKING_MODEL = 'gemini-1.5-pro' // Более мощная, но медленнее
```

---

## 🛡️ Безопасность:

✅ API ключ в `.env.local` (не в коде!)
✅ `.env.local` в `.gitignore` (не попадет в Git)
✅ Проверки на наличие ключа
✅ Fallback режим если API недоступен

---

## 🔄 Перезапуск сервера:

**ВАЖНО!** После изменения `.env.local` нужно перезапустить dev сервер:

1. Остановите сервер (Ctrl+C)
2. Запустите снова: `npm run dev`

---

## 📊 Тестирование:

### Проверка что API работает:
```typescript
import { checkAPIStatus } from '@/api/gemini'

const isWorking = await checkAPIStatus()
console.log('Gemini API работает:', isWorking)
```

### Тест в консоли браузера (F12):
```javascript
// Откройте консоль на сайте и выполните:
import { sendTextMessage } from '@/api/gemini'
const response = await sendTextMessage('Привет!')
console.log(response)
```

---

## ❓ Troubleshooting:

### Проблема: "API ключ не найден"
**Решение:**
1. Проверьте что `.env.local` существует
2. Проверьте что в нем есть `VITE_GEMINI_API_KEY=...`
3. Перезапустите dev сервер

### Проблема: "403 Forbidden"
**Решение:**
1. Проверьте что API ключ правильный
2. Убедитесь что API включен в Google Cloud Console
3. Проверьте квоты API

### Проблема: "429 Too Many Requests"
**Решение:**
- Превышен лимит запросов
- Подождите немного
- Или увеличьте квоту в Google Cloud Console

---

## 🎯 Готово!

Gemini AI полностью подключен и готов к использованию! 🚀

**Что дальше:**
1. Перезапустите dev сервер
2. Откройте сайт
3. Попробуйте AI чат или другие функции
4. Наслаждайтесь! 🎉
