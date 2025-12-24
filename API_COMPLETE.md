# 🚀 API Полностью Подключено!

## ✅ Статус: ВСЕ ГОТОВО!

Все API модули созданы и готовы к использованию на платформе EliteHeat!

---

## 📦 Созданные API Модули:

### 1. ✅ **client.ts** - Базовый API клиент
- Axios клиент с настройками
- Автоматическое добавление токенов
- Обработка ошибок
- Логирование запросов

### 2. ✅ **auth.ts** - Аутентификация
- `register()` - Регистрация
- `login()` - Вход
- `logout()` - Выход
- `getCurrentUser()` - Получить текущего пользователя

### 3. ✅ **admin.ts** - Админ панель
- `getAllUsers()` - Все пользователи
- `getUserById()` - Пользователь по ID
- `updateUser()` - Обновить пользователя
- `deleteUser()` - Удалить пользователя
- `getPlatformStats()` - Статистика платформы

### 4. ✅ **submissions.ts** - Задания
- `submitAssignment()` - Отправить задание
- `getAllSubmissions()` - Все submissions (админ)
- `getMySubmissions()` - Мои submissions (студент)
- `reviewSubmission()` - Проверить задание (учитель)
- `getSubmissionById()` - Submission по ID

### 5. ✅ **chats.ts** - Чат
- `getMyChat()` - Мой чат (студент)
- `getChatById()` - Чат по ID (админ)
- `sendMessage()` - Отправить сообщение
- `markAsRead()` - Отметить как прочитанное
- `getAllChats()` - Все чаты (админ)

### 6. ✅ **courses.ts** - Курсы
- `getAllCourses()` - Все курсы
- `getCourseById()` - Курс по ID
- `createCourse()` - Создать курс (админ)
- `updateCourse()` - Обновить курс (админ)
- `deleteCourse()` - Удалить курс (админ)
- `enrollCourse()` - Записаться на курс
- `getCourseLessons()` - Уроки курса
- `getCourseAssignments()` - Задания курса

### 7. ✅ **gemini.ts** - Gemini AI
- `sendTextMessage()` - Текстовый запрос к AI
- `sendImageMessage()` - Анализ изображений
- `checkCode()` - Проверка кода
- `helpWithPresentation()` - Помощь с презентациями
- `checkAPIStatus()` - Проверка доступности API

### 8. ✅ **index.ts** - Центральный экспорт
- Все функции в одном месте
- Удобный импорт

### 9. ✅ **hooks.ts** - React Hooks
- `useAPI()` - Универсальный хук для API
- `useGeminiChat()` - Хук для Gemini AI
- `useSubmissions()` - Хук для submissions
- `useChat()` - Хук для чата
- `useCourses()` - Хук для курсов

---

## 🎯 Как использовать:

### Вариант 1: Прямой импорт функций
```typescript
import { login, register, getAllCourses } from '@/api';

// Вход
const response = await login({
  email: 'test@test.com',
  password: 'test123'
});

// Получить курсы
const courses = await getAllCourses();
```

### Вариант 2: Использование React Hooks (РЕКОМЕНДУЕТСЯ)
```typescript
import { useGeminiChat, useCourses, useSubmissions } from '@/api/hooks';

function MyComponent() {
  const { sendMessage, loading, error } = useGeminiChat();
  const { getAllCourses } = useCourses();
  const { submit } = useSubmissions();

  const handleSend = async () => {
    const response = await sendMessage('Привет!');
    console.log(response);
  };

  return (
    <button onClick={handleSend} disabled={loading}>
      {loading ? 'Загрузка...' : 'Отправить'}
    </button>
  );
}
```

---

## 💡 Примеры использования:

### 1. Регистрация и вход
```typescript
import { register, login } from '@/api';

// Регистрация
const registerUser = async () => {
  try {
    const response = await register({
      name: 'Иван Иванов',
      email: 'ivan@example.com',
      password: 'secure123',
      city: 'Алматы',
      role: 'student'
    });
    
    console.log('Успешно!', response.user);
    console.log('Токен:', response.token);
  } catch (error) {
    console.error('Ошибка:', error);
  }
};

// Вход
const loginUser = async () => {
  try {
    const response = await login({
      email: 'ivan@example.com',
      password: 'secure123'
    });
    
    console.log('Вход выполнен!', response.user);
  } catch (error) {
    console.error('Ошибка входа:', error);
  }
};
```

### 2. Работа с заданиями
```typescript
import { submitAssignment, getMySubmissions, reviewSubmission } from '@/api';

// Отправить задание (студент)
const submitWork = async () => {
  const response = await submitAssignment({
    assignmentId: 'assignment-123',
    content: 'Мой ответ на задание...',
    fileUrl: 'https://example.com/file.pdf'
  });
  
  console.log('Задание отправлено!', response.data);
};

// Получить мои задания (студент)
const getMyWork = async () => {
  const response = await getMySubmissions();
  console.log('Мои задания:', response.data);
};

// Проверить задание (учитель)
const reviewWork = async () => {
  const response = await reviewSubmission('submission-123', {
    status: 'approved',
    grade: 95,
    feedback: 'Отличная работа!'
  });
  
  console.log('Проверено!', response.data);
};
```

### 3. Работа с чатом
```typescript
import { getMyChat, sendMessage, getChatById } from '@/api';

// Получить мой чат (студент)
const loadChat = async () => {
  const response = await getMyChat();
  console.log('Мой чат:', response.data);
};

// Отправить сообщение
const sendMsg = async () => {
  const response = await sendMessage('chat-123', {
    content: 'Здравствуйте! У меня вопрос...'
  });
  
  console.log('Сообщение отправлено!', response.data);
};

// Получить чат студента (админ/учитель)
const loadStudentChat = async () => {
  const response = await getChatById('chat-123');
  console.log('Чат студента:', response.data);
};
```

### 4. Работа с курсами
```typescript
import { getAllCourses, getCourseById, enrollCourse } from '@/api';

// Получить все курсы
const loadCourses = async () => {
  const response = await getAllCourses();
  console.log('Курсы:', response.data);
};

// Получить курс по ID
const loadCourse = async () => {
  const response = await getCourseById('course-123');
  console.log('Курс:', response.data);
};

// Записаться на курс
const enroll = async () => {
  const response = await enrollCourse('course-123');
  console.log('Записан на курс!', response);
};
```

### 5. Работа с Gemini AI
```typescript
import { sendTextMessage, sendImageMessage, checkCode } from '@/api';

// Текстовый запрос
const askAI = async () => {
  const response = await sendTextMessage('Объясни что такое React hooks');
  console.log('AI ответ:', response);
};

// Анализ изображения
const analyzeImage = async (imageBase64: string) => {
  const response = await sendImageMessage(
    'Найди ошибки в этом коде',
    imageBase64
  );
  console.log('Анализ:', response);
};

// Проверка кода
const checkMyCode = async () => {
  const response = await checkCode(`
    function sum(a, b) {
      return a + b;
    }
  `, 'javascript');
  
  console.log('Проверка кода:', response);
};
```

---

## 🎨 Использование с React Hooks:

### Пример: AI Чат компонент
```tsx
import { useGeminiChat } from '@/api/hooks';
import { useState } from 'react';

function AIChatComponent() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const { sendMessage, loading, error } = useGeminiChat();

  const handleSend = async () => {
    try {
      const aiResponse = await sendMessage(message);
      setResponse(aiResponse);
      setMessage('');
    } catch (err) {
      console.error('Ошибка:', err);
    }
  };

  return (
    <div className="ai-chat">
      <div className="messages">
        {response && (
          <div className="ai-message">{response}</div>
        )}
      </div>
      
      <div className="input-area">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Задайте вопрос AI..."
          disabled={loading}
        />
        <button onClick={handleSend} disabled={loading || !message}>
          {loading ? '⏳ Думаю...' : '📤 Отправить'}
        </button>
      </div>
      
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

### Пример: Список курсов
```tsx
import { useCourses } from '@/api/hooks';
import { useEffect, useState } from 'react';

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const { getAllCourses, loading, error } = useCourses();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await getAllCourses();
      setCourses(response.data || []);
    } catch (err) {
      console.error('Ошибка загрузки курсов:', err);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div className="courses-grid">
      {courses.map(course => (
        <div key={course.id} className="course-card">
          <h3>{course.title}</h3>
          <p>{course.description}</p>
          <button>Записаться</button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔐 Аутентификация:

Токен автоматически:
- ✅ Сохраняется в `localStorage` при входе
- ✅ Добавляется ко всем запросам
- ✅ Удаляется при выходе
- ✅ Проверяется на каждый запрос

```typescript
// Токен добавляется автоматически!
const response = await getAllCourses(); // Токен уже в заголовках
```

---

## 📡 Backend Endpoints:

### Auth
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Текущий пользователь
- `POST /api/auth/logout` - Выход

### Admin
- `GET /api/admin/users` - Все пользователи
- `GET /api/admin/users/:id` - Пользователь по ID
- `PUT /api/admin/users/:id` - Обновить пользователя
- `DELETE /api/admin/users/:id` - Удалить пользователя
- `GET /api/admin/stats` - Статистика

### Submissions
- `POST /api/submissions` - Отправить задание
- `GET /api/submissions` - Все submissions
- `GET /api/submissions/my` - Мои submissions
- `PUT /api/submissions/:id/review` - Проверить

### Chats
- `GET /api/chats/my` - Мой чат
- `GET /api/chats/:id` - Чат по ID
- `POST /api/chats/:id/message` - Отправить сообщение
- `PUT /api/chats/:id/read` - Отметить прочитанным

---

## 🎯 Следующие шаги:

1. ✅ Перезапустите dev сервер (если не перезапустили после .env.local)
2. ✅ Проверьте что backend запущен (`npm run dev:memory` в папке backend)
3. ✅ Откройте сайт и протестируйте функции
4. ✅ Используйте API в ваших компонентах

---

## 🚀 Готово!

Все API модули созданы и готовы к использованию! 🎉

**Файлы созданы:**
- ✅ `src/api/client.ts` - Базовый клиент
- ✅ `src/api/auth.ts` - Аутентификация
- ✅ `src/api/admin.ts` - Админ панель
- ✅ `src/api/submissions.ts` - Задания
- ✅ `src/api/chats.ts` - Чат
- ✅ `src/api/courses.ts` - Курсы
- ✅ `src/api/gemini.ts` - Gemini AI (обновлен)
- ✅ `src/api/index.ts` - Центральный экспорт
- ✅ `src/api/hooks.ts` - React Hooks

**Переменные окружения:**
- ✅ `.env.local` обновлен с Gemini API ключом

Начинайте использовать! 🚀
