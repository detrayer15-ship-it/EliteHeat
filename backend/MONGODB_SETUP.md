# ❌ ОШИБКА: MongoDB не настроен

## Проблема
Backend не может подключиться к базе данных, потому что файл `.env` не создан.

## Решение

### Вариант 1: MongoDB Atlas (РЕКОМЕНДУЕТСЯ, бесплатно)

1. **Зарегистрироваться:**
   - Зайти на https://www.mongodb.com/cloud/atlas/register
   - Можно через Google

2. **Создать кластер:**
   - Выбрать FREE tier (M0)
   - Регион: ближайший
   - Нажать "Create Deployment"

3. **Создать пользователя:**
   - Username: `eliteheat`
   - Password: придумайте надёжный
   - **СОХРАНИТЕ ПАРОЛЬ!**

4. **Разрешить доступ:**
   - Network Access → Add IP Address
   - Выбрать "Allow Access from Anywhere" (0.0.0.0/0)

5. **Получить connection string:**
   - Database → Connect → Drivers
   - Скопировать строку типа:
   ```
   mongodb+srv://eliteheat:<password>@cluster0.xxxxx.mongodb.net/eliteheat
   ```
   - Заменить `<password>` на ваш пароль

6. **Создать .env файл:**
   ```bash
   cd backend
   copy .env.example .env
   ```
   
7. **Вставить connection string в .env:**
   Открыть `backend/.env` и вставить:
   ```
   MONGODB_URI=mongodb+srv://eliteheat:ВАШ_ПАРОЛЬ@cluster0.xxxxx.mongodb.net/eliteheat
   ```

8. **Перезапустить backend:**
   - Остановить (Ctrl+C)
   - Запустить: `npm run dev`

### Вариант 2: Локальный MongoDB (сложнее)

1. Скачать MongoDB Community: https://www.mongodb.com/try/download/community
2. Установить
3. Запустить `mongod`
4. Создать `.env` с `MONGODB_URI=mongodb://localhost:27017/eliteheat`

## После настройки

Регистрация заработает! ✅
