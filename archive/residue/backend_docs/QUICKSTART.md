# 🚀 Быстрый запуск Backend

## Текущий статус
✅ Зависимости установлены (165 packages)
❌ Нужно настроить MongoDB

## Вариант 1: MongoDB Atlas (Рекомендуется)

### 1. Регистрация
- Зайти на https://www.mongodb.com/cloud/atlas/register
- Зарегистрироваться (можно через Google)

### 2. Создать кластер
- Выбрать FREE tier (M0) - бесплатно
- Регион: ближайший
- Нажать "Create Deployment"

### 3. Создать пользователя
- Username: `eliteheat`
- Password: придумайте надёжный пароль
- Сохраните пароль!

### 4. Настроить доступ
- Network Access → Add IP Address
- Выбрать "Allow Access from Anywhere" (0.0.0.0/0)

### 5. Получить connection string
- Database → Connect → Drivers
- Скопировать строку:
```
mongodb+srv://eliteheat:<password>@cluster0.xxxxx.mongodb.net/eliteheat
```
- Заменить `<password>` на ваш пароль

### 6. Обновить .env
Открыть файл `backend/.env` и заменить строку:
```env
MONGODB_URI=mongodb+srv://eliteheat:ВАШ_ПАРОЛЬ@cluster0.xxxxx.mongodb.net/eliteheat
```

### 7. Запустить сервер
```bash
cd backend
npm run dev
```

---

## Вариант 2: Локальный MongoDB

### Windows
1. Скачать: https://www.mongodb.com/try/download/community
2. Установить MongoDB Community Server
3. Запустить MongoDB:
```bash
mongod
```
4. В другом терминале:
```bash
cd backend
npm run dev
```

### Mac
```bash
brew install mongodb-community
brew services start mongodb-community
cd backend
npm run dev
```

### Linux
```bash
sudo apt install mongodb
sudo systemctl start mongodb
cd backend
npm run dev
```

---

## После запуска

Сервер будет доступен на `http://localhost:3000`

Проверить работу:
```
GET http://localhost:3000/api/health
```

Должен вернуть:
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## Создание первого админа

1. Зарегистрироваться через API:
```bash
POST http://localhost:3000/api/auth/register
{
  "email": "admin@example.com",
  "password": "admin123",
  "name": "Admin",
  "city": "Алматы"
}
```

2. Сделать пользователя админом через MongoDB Compass:
- Подключиться к БД
- Найти коллекцию `users`
- Найти своего пользователя
- Изменить `role: "student"` на `role: "admin"`

Или через mongo shell:
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

---

## Troubleshooting

**Ошибка: "MongoNetworkError"**
- Проверьте connection string в .env
- Проверьте интернет соединение
- Убедитесь что IP разрешён в MongoDB Atlas

**Ошибка: "Port 3000 already in use"**
- Измените PORT в .env на другой (например, 3001)

**Ошибка: "Cannot find module"**
- Запустите `npm install` ещё раз
