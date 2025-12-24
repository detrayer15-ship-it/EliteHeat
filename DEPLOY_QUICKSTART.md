# 🚀 Быстрый деплой в Firebase - Пошаговая инструкция

## ✅ Что уже готово:

- ✅ `firebase.json` - конфигурация создана
- ✅ `.firebaserc` - настройки проекта
- ✅ `package.json` - скрипты добавлены

---

## 📋 Шаги для деплоя:

### 1️⃣ Установите Firebase CLI

```bash
npm install -g firebase-tools
```

Проверьте:
```bash
firebase --version
```

---

### 2️⃣ Войдите в Firebase

```bash
npm run firebase:login
```

Или:
```bash
firebase login
```

Откроется браузер - войдите в Google аккаунт.

---

### 3️⃣ Создайте Firebase проект

**Вариант A: Через консоль**
1. Откройте https://console.firebase.google.com/
2. Нажмите "Add project"
3. Введите имя: `eliteheat-platform`
4. Отключите Google Analytics (или включите)
5. Нажмите "Create project"

**Вариант B: Через CLI**
```bash
firebase projects:create eliteheat-platform
```

---

### 4️⃣ Подключите проект

Обновите `.firebaserc`:
```json
{
  "projects": {
    "default": "eliteheat-platform"
  }
}
```

Или используйте команду:
```bash
firebase use eliteheat-platform
```

---

### 5️⃣ Настройте переменные окружения

Создайте `.env.production`:

```env
# Backend API
VITE_API_URL=https://your-backend-url.com

# Gemini AI
VITE_GEMINI_API_KEY=AIzaSyCk7v9spUdCGeT9P1Blfopia1_Brc9lb08
```

**⚠️ Важно:** Убедитесь что `.env.production` в `.gitignore`!

---

### 6️⃣ Соберите проект

```bash
npm run build
```

Проверьте что папка `dist` создалась.

**Проверьте локально:**
```bash
npm run preview
```

Откройте http://localhost:4173 и убедитесь что всё работает.

---

### 7️⃣ Деплой!

```bash
npm run deploy
```

Или только hosting:
```bash
npm run deploy:hosting
```

---

### 8️⃣ Готово! 🎉

После деплоя вы увидите:

```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/eliteheat-platform
Hosting URL: https://eliteheat-platform.web.app
```

Откройте URL и проверьте сайт!

---

## 🎯 Быстрые команды:

```bash
# Полный деплой (билд + деплой)
npm run deploy

# Только hosting
npm run deploy:hosting

# Просмотр проектов
firebase projects:list

# Выбор проекта
firebase use eliteheat-platform

# Просмотр билда локально
npm run preview
```

---

## 🔧 Если что-то пошло не так:

### Ошибка: "Project not found"

```bash
# Проверьте список проектов
firebase projects:list

# Выберите правильный проект
firebase use your-project-id
```

### Ошибка: "Build failed"

```bash
# Очистите и пересоберите
rm -rf node_modules dist
npm install
npm run build
```

### Ошибка: "Permission denied"

```bash
# Перелогиньтесь
firebase logout
firebase login
```

---

## 📊 После деплоя:

### Проверьте:
- ✅ Сайт открывается
- ✅ Все страницы работают
- ✅ API запросы идут (если backend настроен)
- ✅ Gemini AI работает

### Настройте (опционально):
- 🌐 Кастомный домен
- 📊 Analytics
- 🔒 Security rules
- 🚀 CI/CD

---

## 💡 Полезные ссылки:

- **Firebase Console:** https://console.firebase.google.com/
- **Ваш проект:** https://console.firebase.google.com/project/eliteheat-platform
- **Документация:** https://firebase.google.com/docs/hosting

---

## 📝 Чеклист:

- [ ] Firebase CLI установлен
- [ ] Вошли в Firebase (`firebase login`)
- [ ] Проект создан в Firebase Console
- [ ] `.firebaserc` настроен
- [ ] `.env.production` создан
- [ ] `npm run build` работает
- [ ] `npm run preview` показывает сайт
- [ ] `npm run deploy` выполнен
- [ ] Сайт открывается по URL

---

## 🎉 Готово!

Теперь ваш сайт доступен по адресу:
```
https://eliteheat-platform.web.app
```

**Полная документация:** `FIREBASE_DEPLOY.md`

---

**Создано:** 2025-12-24  
**Статус:** ✅ ГОТОВО К ИСПОЛЬЗОВАНИЮ
