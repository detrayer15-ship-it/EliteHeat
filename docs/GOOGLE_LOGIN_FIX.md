# 🔧 ОШИБКА ВХОДА ЧЕРЕЗ GOOGLE - РЕШЕНИЯ

## 🔍 ВОЗМОЖНЫЕ ПРОБЛЕМЫ:

### 1. **Не настроен домен в Firebase Console**
### 2. **Неправильный redirect URI**
### 3. **Popup блокируется браузером**
### 4. **Ошибка CORS**

---

## ✅ РЕШЕНИЕ 1: Проверить Firebase Console

### Шаг 1: Открыть Firebase Console
1. Перейти на https://console.firebase.google.com
2. Выбрать проект EliteHeat
3. Authentication → Sign-in method → Google

### Шаг 2: Добавить авторизованные домены
В разделе "Authorized domains" добавить:
- `localhost`
- `eliteheat.vercel.app` (ваш домен Vercel)
- `*.vercel.app`

---

## ✅ РЕШЕНИЕ 2: Проверить код loginWithGoogle

**Файл:** `src/api/firebase-auth.ts`

**Текущий код должен быть:**
```tsx
export const loginWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider)
        
        // Получаем или создаём пользователя
        const userDoc = await getDoc(doc(db, 'users', result.user.uid))
        
        if (!userDoc.exists()) {
            // Создаём нового пользователя
            const newUser = {
                id: result.user.uid,
                email: result.user.email!,
                name: result.user.displayName || 'User',
                role: 'student' as const,
                city: '',
                level: 1,
                points: 0,
                adminPoints: 0,
                createdAt: new Date()
            }
            
            await setDoc(doc(db, 'users', result.user.uid), newUser)
            return { success: true, user: newUser }
        }
        
        return { success: true, user: { id: userDoc.id, ...userDoc.data() } }
    } catch (error: any) {
        console.error('Google login error:', error)
        return { success: false, error: error.message }
    }
}
```

---

## ✅ РЕШЕНИЕ 3: Использовать redirect вместо popup

Если popup блокируется, используйте redirect:

**Файл:** `src/api/firebase-auth.ts`

```tsx
import { signInWithRedirect, getRedirectResult } from 'firebase/auth'

export const loginWithGoogle = async () => {
    try {
        const provider = new GoogleAuthProvider()
        await signInWithRedirect(auth, provider)
        // После редиректа обработка в useEffect
    } catch (error: any) {
        console.error('Google login error:', error)
        return { success: false, error: error.message }
    }
}

// В компоненте Login добавить:
useEffect(() => {
    getRedirectResult(auth).then((result) => {
        if (result) {
            // Обработать успешный вход
        }
    })
}, [])
```

---

## ✅ РЕШЕНИЕ 4: Проверить authStore

**Файл:** `src/store/authStore.ts`

**Метод loginWithGoogle должен быть:**
```tsx
loginWithGoogle: async () => {
    set({ isLoading: true, error: null })
    try {
        const result = await firebaseAuthAPI.loginWithGoogle()
        
        if (result.success && result.user) {
            set({
                user: result.user,
                isAuthenticated: true,
                isLoading: false
            })
            return { success: true, message: 'Вход выполнен успешно!' }
        } else {
            set({
                error: result.error || 'Ошибка входа',
                isLoading: false
            })
            return { success: false, message: result.error || 'Ошибка входа' }
        }
    } catch (error: any) {
        set({
            error: error.message,
            isLoading: false
        })
        return { success: false, message: error.message }
    }
}
```

---

## 🔍 ДИАГНОСТИКА:

### Проверить консоль браузера:
1. Открыть DevTools (F12)
2. Перейти в Console
3. Попробовать войти через Google
4. Посмотреть ошибку

### Типичные ошибки:

**1. "auth/popup-blocked"**
- Браузер блокирует popup
- Решение: Использовать redirect

**2. "auth/unauthorized-domain"**
- Домен не добавлен в Firebase
- Решение: Добавить в Firebase Console

**3. "auth/operation-not-allowed"**
- Google вход не включен
- Решение: Включить в Firebase Console

**4. "auth/popup-closed-by-user"**
- Пользователь закрыл popup
- Это нормально, не ошибка

---

## 💾 БЫСТРОЕ ИСПРАВЛЕНИЕ:

**Файл:** `src/pages/LoginPage.tsx`

**Добавить обработку ошибок:**
```tsx
const handleGoogleLogin = async () => {
    try {
        const result = await loginWithGoogle()
        
        if (result.success) {
            navigate('/dashboard')
        } else {
            alert(`Ошибка: ${result.message}`)
        }
    } catch (error: any) {
        console.error('Login error:', error)
        alert(`Ошибка входа: ${error.message}`)
    }
}
```

---

## 📝 ЧТО ПРОВЕРИТЬ:

1. ✅ Firebase Console → Authentication → Google включен
2. ✅ Домены добавлены в Authorized domains
3. ✅ Popup не блокируется браузером
4. ✅ Консоль браузера показывает конкретную ошибку

---

## 🆘 ЕСЛИ НЕ ПОМОГЛО:

**Пришлите:**
1. Текст ошибки из консоли браузера
2. Скриншот ошибки
3. Какой домен используете (localhost / vercel)

---

**ГОТОВО К ДИАГНОСТИКЕ!** 🔧✨
