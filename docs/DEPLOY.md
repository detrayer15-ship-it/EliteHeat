# Инструкция по деплою и GitHub 🚀

Эта инструкция поможет вам загрузить код на GitHub и развернуть проект в интернете.

## 1. Загрузка на GitHub 📂

Если у вас еще нет репозитория:

1. Создайте новый репозиторий на [github.com](https://github.com/new).
2. В терминале в корне проекта выполните:

```bash
# Инициализация git
git init

# Добавление всех файлов (убедитесь, что .gitignore настроен)
git add .

# Первый коммит
git commit -m "Initial commit: EliteEdu with Mita AI"

# Привязка к GitHub (замените на вашу ссылку)
git remote add origin https://github.com/ВАШ_ЛОГИН/EliteEdu.git

# Отправка кода
git push -u origin main
```

## 2. Развертывание (Deploy) 🌍

Проект настроен для работы с **Firebase**.

### Шаг 1: Сборка фронтенда
```bash
npm run build
```
Это создаст папку `dist` с готовыми файлами.

### Шаг 2: Настройка бэкенда
Для работы ИИ в интернете бэкенд должен быть развернут. 
- Если вы используете **Firebase Cloud Functions**, выполните:
  ```bash
  firebase deploy --only functions
  ```
- Если вы разворачиваете на обычный хостинг (например, Render или Railway):
  1. Загрузите папку `backend` в отдельный проект.
  2. Укажите `start command`: `node src/index.js`.
  3. Добавьте `GEMINI_API_KEY` в настройки переменных окружения (Environment Variables) на хостинге.

### Шаг 3: Деплой фронтенда (Firebase Hosting)
```bash
firebase deploy --only hosting
```

---

## ⚡ Важные моменты

1. **API Ключи**: Никогда не выкладывайте файл `.env` на GitHub. Он должен быть в `.gitignore`.
2. **URL Бэкенда**: После деплоя бэкенда не забудьте обновить ссылку в `src/api/gemini.ts` (переменная `VITE_API_URL` или `API_URL`).
3. **CORS**: Убедитесь, что бэкенд разрешает запросы с вашего адреса `.web.app`.

---
*Инструкция подготовлена для проекта EliteEdu.*
