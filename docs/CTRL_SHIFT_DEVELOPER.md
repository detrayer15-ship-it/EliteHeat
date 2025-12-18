# 🔑 CTRL+SHIFT ДЛЯ РОЛИ DEVELOPER

## ✅ КОД ДЛЯ АВТОМАТИЧЕСКОЙ РОЛИ:

### Файл: `src/pages/Dashboard.tsx`

**Добавить в начало файла (после импортов):**

```tsx
import { useEffect } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuthStore } from '@/store/authStore'
```

**Добавить внутри компонента Dashboard (после const navigate = ...):**

```tsx
export const Dashboard = () => {
    const projects = useProjectStore((state) => state.projects)
    const navigate = useNavigate()
    const currentUser = useAuthStore((state) => state.currentUser)
    
    // Ctrl+Shift для роли Developer
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // Проверяем Ctrl+Shift (любая буква)
            if (e.ctrlKey && e.shiftKey) {
                const user = useAuthStore.getState().currentUser
                
                if (user && user.role !== 'developer') {
                    // Обновляем роль на developer
                    updateDoc(doc(db, 'users', user.id), {
                        role: 'developer',
                        adminPoints: 9999
                    }).then(() => {
                        alert('✅ Вы получили роль Developer!')
                        // Обновляем локальное состояние
                        useAuthStore.setState({
                            currentUser: {
                                ...user,
                                role: 'developer',
                                adminPoints: 9999
                            }
                        })
                        window.location.reload()
                    }).catch((error) => {
                        console.error('Error updating role:', error)
                    })
                }
            }
        }
        
        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [])
    
    // ... остальной код компонента
```

---

## 🎯 КАК РАБОТАЕТ:

1. Пользователь заходит на Dashboard
2. Нажимает **Ctrl+Shift** (любую букву)
3. Автоматически получает роль `developer`
4. Страница перезагружается
5. Теперь у него все права developer!

---

## 📝 АЛЬТЕРНАТИВА - ДОБАВИТЬ В App.tsx (ГЛОБАЛЬНО):

**Файл:** `src/App.tsx`

**Добавить внутри компонента App:**

```tsx
function App() {
    const loadProjects = useProjectStore((state) => state.loadProjects)
    const loadTasks = useTaskStore((state) => state.loadTasks)
    const theme = useSettingsStore((state) => state.theme)
    const loadUser = useAuthStore((state) => state.loadUser)

    // Глобальный Ctrl+Shift для Developer роли
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey) {
                const user = useAuthStore.getState().currentUser
                
                if (user && user.role !== 'developer') {
                    updateDoc(doc(db, 'users', user.id), {
                        role: 'developer',
                        adminPoints: 9999
                    }).then(() => {
                        alert('✅ Роль Developer активирована!')
                        window.location.reload()
                    })
                }
            }
        }
        
        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [])

    // ... остальной код
```

**Добавить импорты в App.tsx:**
```tsx
import { doc, updateDoc } from 'firebase/firestore'
import { db } from './config/firebase'
import { useAuthStore } from './store/authStore'
```

---

## ✅ ПРЕИМУЩЕСТВА App.tsx:

- Работает на ВСЕХ страницах
- Не нужно добавлять в каждую страницу
- Один раз настроил - работает везде

---

## 💾 ПОСЛЕ ДОБАВЛЕНИЯ:

```bash
git add .
git commit -m "feat: Added Ctrl+Shift shortcut for developer role"
git push origin main
```

---

## 🎯 ТЕСТИРОВАНИЕ:

1. Войдите как обычный пользователь
2. Нажмите **Ctrl+Shift** (любую букву)
3. Должно появиться: "✅ Роль Developer активирована!"
4. Страница перезагрузится
5. Проверьте в `/settings` - должно быть "👑 Разработчик"

---

**РЕКОМЕНДУЮ ДОБАВИТЬ В App.tsx - БУДЕТ РАБОТАТЬ ВЕЗДЕ!** 🚀
