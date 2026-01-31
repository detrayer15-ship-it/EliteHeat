# 🚀 EliteHeat API - Быстрый старт

## ⚡ За 3 минуты до работающего API

### Шаг 1: Проверьте `.env.local`
```bash
# Файл должен содержать:
VITE_API_URL=http://localhost:3000
VITE_GEMINI_API_KEY=AIzaSyCk7v9spUdCGeT9P1Blfopia1_Brc9lb08
```

### Шаг 2: Запустите backend
```bash
cd backend
npm run dev:memory
```

### Шаг 3: Запустите frontend
```bash
npm run dev
```

### Шаг 4: Откройте тестовую страницу
```
http://localhost:5173/developer/api-test
```

---

## 💡 Использование в коде

### Вариант 1: React Hooks (Рекомендуется)
```typescript
import { useGeminiChat } from '@/api/hooks';

function MyComponent() {
  const { sendMessage, loading } = useGeminiChat();

  const handleClick = async () => {
    const response = await sendMessage('Привет!');
    console.log(response);
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      Отправить
    </button>
  );
}
```

### Вариант 2: Прямой импорт
```typescript
import { login, sendTextMessage, getAllCourses } from '@/api';

// Вход
await login({ email: 'test@test.com', password: 'test123' });

// AI запрос
const aiResponse = await sendTextMessage('Объясни React');

// Получить курсы
const courses = await getAllCourses();
```

---

## 📚 Доступные функции

### 🔐 Аутентификация
```typescript
import { register, login, logout, getCurrentUser } from '@/api';
```

### 👥 Админ панель
```typescript
import { getAllUsers, getUserById, updateUser, deleteUser } from '@/api';
```

### 📝 Задания
```typescript
import { submitAssignment, getMySubmissions, reviewSubmission } from '@/api';
```

### 💬 Чат
```typescript
import { getMyChat, sendMessage, markAsRead } from '@/api';
```

### 📚 Курсы
```typescript
import { getAllCourses, getCourseById, enrollCourse } from '@/api';
```

### 🤖 Gemini AI
```typescript
import { sendTextMessage, sendImageMessage, checkCode } from '@/api';
```

---

## 🎯 Примеры

### Регистрация и вход
```typescript
// Регистрация
await register({
  name: 'Иван',
  email: 'ivan@test.com',
  password: 'test123',
  city: 'Алматы'
});

// Вход
await login({
  email: 'ivan@test.com',
  password: 'test123'
});
```

### AI запрос
```typescript
const response = await sendTextMessage('Объясни что такое React hooks');
console.log(response);
```

### Отправить задание
```typescript
await submitAssignment({
  assignmentId: '123',
  content: 'Мой ответ на задание',
  fileUrl: 'https://...'
});
```

---

## 📖 Полная документация

- **API_COMPLETE.md** - Полное руководство
- **GEMINI_API_READY.md** - Gemini AI
- **API_ARCHITECTURE.md** - Архитектура
- **API_WORK_SUMMARY.md** - Что было сделано

---

## ✅ Готово!

Начинайте использовать API прямо сейчас! 🎉
