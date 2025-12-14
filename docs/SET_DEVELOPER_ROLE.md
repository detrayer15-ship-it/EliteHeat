# 🔧 Установка роли Developer через консоль браузера

## ✅ СПОСОБ 1: Через консоль браузера (САМЫЙ ПРОСТОЙ)

### Шаги:

1. **Откройте приложение:**
   ```
   http://localhost:5174
   ```

2. **Откройте консоль разработчика:**
   - Нажмите `F12` или `Ctrl+Shift+I` (Windows/Linux)
   - Нажмите `Cmd+Option+I` (Mac)
   - Перейдите на вкладку **Console**

3. **Скопируйте и вставьте этот код:**

```javascript
// Установка роли DEVELOPER
(async () => {
    const { collection, query, where, getDocs, updateDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
    
    // Ваш email
    const EMAIL = 'detrayer15@gmail.com';
    
    try {
        // Получить Firestore из глобального объекта
        const db = window.__FIREBASE_DB__;
        
        if (!db) {
            console.error('❌ Firebase не инициализирован');
            return;
        }
        
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', EMAIL));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
            console.log('❌ Пользователь не найден. Сначала зарегистрируйтесь!');
            return;
        }
        
        const userDoc = snapshot.docs[0];
        const userRef = doc(db, 'users', userDoc.id);
        
        await updateDoc(userRef, {
            role: 'developer',
            adminPoints: 9999,
            permissions: {
                fullAccess: true,
                canManageUsers: true,
                canManageRoles: true,
                canAccessAllPages: true
            },
            updatedAt: new Date().toISOString()
        });
        
        console.log('✅ Роль DEVELOPER установлена!');
        console.log('🏆 Ранг: Архитектор (9999 очков)');
        console.log('🔓 Полный доступ ко всем функциям');
        console.log('');
        console.log('⚠️ ПЕРЕЗАГРУЗИТЕ СТРАНИЦУ чтобы изменения вступили в силу!');
        
    } catch (error) {
        console.error('❌ Ошибка:', error);
    }
})();
```

4. **Нажмите Enter**

5. **Перезагрузите страницу** (`F5` или `Ctrl+R`)

---

## ✅ СПОСОБ 2: Через страницу /dev-setup

Ещё проще - просто откройте:

```
http://localhost:5174/dev-setup
```

Страница автоматически установит роль developer для `detrayer15@gmail.com`

---

## ✅ СПОСОБ 3: Через Firebase Console

1. Откройте [Firebase Console](https://console.firebase.google.com/)
2. Выберите проект **EliteHeat**
3. Перейдите в **Firestore Database**
4. Найдите коллекцию `users`
5. Найдите пользователя с email `detrayer15@gmail.com`
6. Измените/добавьте поля:
   ```
   role: "developer"
   adminPoints: 9999
   permissions: {
     fullAccess: true,
     canManageUsers: true,
     canManageRoles: true,
     canAccessAllPages: true
   }
   ```
7. Сохраните

---

## 🎯 Что даёт роль "developer"?

✅ **Полный доступ ко всем страницам**  
✅ **Управление пользователями**  
✅ **Изменение рангов** (только developer!)  
✅ **Доступ к аналитике**  
✅ **Максимальный ранг: 🏆 Архитектор (9999 очков)**  

---

## 🔒 Защита страницы "Изменение рангов"

Теперь страница `/admin/ranks` доступна **ТОЛЬКО** для пользователей с ролью `developer`.

Если админ или ученик попытается зайти, увидит:
```
🔒 Доступ запрещён
Эта страница доступна только разработчикам
```

---

## ✅ ГОТОВО!

**Рекомендую Способ 2** - самый простой!

Просто откройте: `http://localhost:5174/dev-setup`
