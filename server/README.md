# Backend Server

## Установка зависимостей

```bash
cd server
npm install
```

## Настройка MongoDB

### Вариант 1: Локальный MongoDB
1. Установите MongoDB: https://www.mongodb.com/try/download/community
2. Запустите MongoDB:
   ```bash
   mongod
   ```

### Вариант 2: MongoDB Atlas (облачный, бесплатно)
1. Создайте аккаунт на https://www.mongodb.com/cloud/atlas
2. Создайте бесплатный кластер
3. Получите строку подключения
4. Замените в `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eliteheat
   ```

## Запуск сервера

### Разработка (с автоперезагрузкой)
```bash
npm run dev
```

### Продакшн
```bash
npm start
```

Сервер запустится на http://localhost:4000

## API Endpoints

### Авторизация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Получить профиль
- `PUT /api/auth/profile` - Обновить профиль

### Прогресс
- `POST /api/progress` - Сохранить прогресс
- `GET /api/progress` - Получить весь прогресс
- `GET /api/progress/:courseId` - Прогресс по курсу

### Проекты
- `GET /api/projects` - Получить проекты
- `POST /api/projects` - Создать проект
- `PUT /api/projects/:id` - Обновить проект
- `DELETE /api/projects/:id` - Удалить проект

### Геймификация
- `POST /api/gamification/points` - Начислить очки
- `POST /api/gamification/achievement` - Получить достижение
- `GET /api/gamification/leaderboard` - Рейтинг

### Админ
- `GET /api/admin/users` - Все пользователи
- `PUT /api/admin/users/:id/role` - Изменить роль

## Тестирование

### Проверка работы сервера
```bash
curl http://localhost:4000/api/health
```

### Регистрация пользователя
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```
