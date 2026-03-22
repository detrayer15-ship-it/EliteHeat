# 🚀 Деплой EliteEdu в Firebase

## 📋 Пошаговая инструкция

### Шаг 1: Установка Firebase CLI

```bash
npm install -g firebase-tools
```

Проверьте установку:
```bash
firebase --version
```

---

### Шаг 2: Вход в Firebase

```bash
firebase login
```

Откроется браузер для входа в Google аккаунт.

---

### Шаг 3: Инициализация Firebase проекта

```bash
firebase init
```

**Выберите:**
1. ✅ **Hosting** (используйте пробел для выбора)
2. **Use an existing project** или **Create a new project**
3. Выберите ваш Firebase проект

**Настройки:**
```
? What do you want to use as your public directory? 
  → dist

? Configure as a single-page app (rewrite all urls to /index.html)? 
  → Yes

? Set up automatic builds and deploys with GitHub? 
  → No (пока)

? File dist/index.html already exists. Overwrite? 
  → No
```

---

### Шаг 4: Настройка переменных окружения

Создайте файл `.env.production`:

```env
# API URLs
VITE_API_URL=https://your-backend-url.com

# Firebase (если используете)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Gemini AI
VITE_GEMINI_API_KEY=your-gemini-api-key
```

---

### Шаг 5: Билд проекта

```bash
npm run build
```

Это создаст папку `dist` с готовым приложением.

**Проверьте билд локально:**
```bash
npm run preview
```

---

### Шаг 6: Деплой в Firebase

```bash
firebase deploy
```

Или только hosting:
```bash
firebase deploy --only hosting
```

---

### Шаг 7: Проверка

После деплоя вы получите URL:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/your-project/overview
Hosting URL: https://your-project.web.app
```

Откройте URL и проверьте работу сайта.

---

## 📝 Файл firebase.json

Создайте или обновите `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

---

## 🔧 Настройка package.json

Добавьте скрипты для деплоя:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "npm run build && firebase deploy",
    "deploy:hosting": "npm run build && firebase deploy --only hosting"
  }
}
```

Теперь можно деплоить одной командой:
```bash
npm run deploy
```

---

## 🌐 Настройка кастомного домена (опционально)

### В Firebase Console:

1. Откройте **Hosting** → **Add custom domain**
2. Введите ваш домен (например: `eliteheat.com`)
3. Следуйте инструкциям для настройки DNS

### Настройка DNS:

Добавьте A-записи:
```
A    @    151.101.1.195
A    @    151.101.65.195
```

Или CNAME:
```
CNAME    www    your-project.web.app
```

---

## 🔐 Безопасность

### 1. Защита API ключей

**НЕ коммитьте:**
- `.env.local`
- `.env.production`

**Добавьте в `.gitignore`:**
```
.env.local
.env.production
.env*.local
```

### 2. Firebase Security Rules

Если используете Firestore, настройте правила:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Только авторизованные пользователи
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🚀 CI/CD с GitHub Actions (опционально)

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}
          
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

**Добавьте секреты в GitHub:**
1. Settings → Secrets → New repository secret
2. Добавьте: `VITE_API_URL`, `VITE_GEMINI_API_KEY`, `FIREBASE_SERVICE_ACCOUNT`

---

## 📊 Мониторинг

### Firebase Console:

1. **Hosting** → **Dashboard**
   - Количество запросов
   - Использование bandwidth
   - Версии деплоев

2. **Analytics** (если настроен)
   - Посещаемость
   - Пользователи
   - События

---

## 🐛 Troubleshooting

### Проблема: "Build failed"

**Решение:**
```bash
# Очистите кеш
rm -rf node_modules dist
npm install
npm run build
```

### Проблема: "Firebase command not found"

**Решение:**
```bash
# Переустановите Firebase CLI
npm uninstall -g firebase-tools
npm install -g firebase-tools
```

### Проблема: "Permission denied"

**Решение:**
```bash
# Выйдите и войдите снова
firebase logout
firebase login
```

### Проблема: "404 после деплоя"

**Решение:**
Проверьте `firebase.json` - должен быть rewrite:
```json
"rewrites": [
  {
    "source": "**",
    "destination": "/index.html"
  }
]
```

---

## 📋 Чеклист перед деплоем

- [ ] Все переменные окружения настроены
- [ ] `npm run build` работает без ошибок
- [ ] `npm run preview` показывает рабочий сайт
- [ ] `.env.production` не в git
- [ ] Firebase проект создан
- [ ] Firebase CLI установлен
- [ ] `firebase.json` настроен
- [ ] Backend API доступен (если используется)

---

## 🎯 Быстрый деплой (TL;DR)

```bash
# 1. Установка
npm install -g firebase-tools

# 2. Вход
firebase login

# 3. Инициализация
firebase init hosting

# 4. Билд
npm run build

# 5. Деплой
firebase deploy

# Готово! 🎉
```

---

## 📚 Полезные команды

```bash
# Просмотр проектов
firebase projects:list

# Выбор проекта
firebase use your-project-id

# Деплой только hosting
firebase deploy --only hosting

# Просмотр логов
firebase hosting:channel:list

# Откат к предыдущей версии
firebase hosting:clone SOURCE_SITE_ID:SOURCE_CHANNEL_ID TARGET_SITE_ID:live
```

---

## 🌟 Дополнительные возможности

### 1. Preview Channels

Создайте preview для тестирования:
```bash
firebase hosting:channel:deploy preview-name
```

### 2. Множественные сайты

Настройте несколько сайтов в одном проекте:
```bash
firebase target:apply hosting production your-site-id
firebase deploy --only hosting:production
```

### 3. Функции (Cloud Functions)

Добавьте серверную логику:
```bash
firebase init functions
```

---

## 💰 Стоимость

**Firebase Hosting - Бесплатный план:**
- 10 GB хранилища
- 360 MB/день bandwidth
- Бесплатный SSL сертификат
- Кастомный домен

**Для больших проектов:**
- Blaze (Pay as you go)
- ~$0.026 за GB bandwidth

---

## 🎉 Готово!

После деплоя ваш сайт будет доступен по адресу:
```
https://your-project.web.app
https://your-project.firebaseapp.com
```

**Следующие шаги:**
1. Настройте кастомный домен
2. Добавьте Analytics
3. Настройте CI/CD
4. Мониторьте производительность

---

**Создано:** 2025-12-24  
**Статус:** 📖 ГОТОВО К ИСПОЛЬЗОВАНИЮ
