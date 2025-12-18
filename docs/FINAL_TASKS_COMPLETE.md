# 🎯 ФИНАЛЬНЫЕ ЗАДАЧИ

## ✅ ЧТО НУЖНО СДЕЛАТЬ:

### 1. 🔧 Исправить Gemini API (404 ошибка)

**Файл:** `src/api/gemini.ts`

**Проблема:** Модель `gemini-1.5-flash` не найдена

**Решение - изменить на gemini-pro:**

**Строка 10:**
```tsx
// БЫЛО:
const WORKING_MODEL = 'gemini-1.5-flash'

// СТАЛО:
const WORKING_MODEL = 'gemini-pro'
```

---

### 2. 📝 Создать страницу редактирования пользователя

**Создать файл:** `src/pages/AdminUserEditPage.tsx`

```tsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export const AdminUserEditPage = () => {
    const { userId } = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'student',
        city: '',
        level: 1,
        points: 0
    })

    useEffect(() => {
        loadUser()
    }, [userId])

    const loadUser = async () => {
        if (!userId) return
        
        try {
            const userDoc = await getDoc(doc(db, 'users', userId))
            if (userDoc.exists()) {
                const userData = userDoc.data()
                setUser(userData)
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    role: userData.role || 'student',
                    city: userData.city || '',
                    level: userData.level || 1,
                    points: userData.points || 0
                })
            }
        } catch (error) {
            console.error('Error loading user:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!userId) return
        
        try {
            await updateDoc(doc(db, 'users', userId), formData)
            alert('✅ Пользователь обновлён!')
            navigate('/admin/users')
        } catch (error) {
            console.error('Error updating user:', error)
            alert('❌ Ошибка при обновлении')
        }
    }

    if (loading) {
        return <div className="p-6">Загрузка...</div>
    }

    if (!user) {
        return <div className="p-6">Пользователь не найден</div>
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Редактирование пользователя</h1>
            
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                <Input
                    label="Имя"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                
                <Input
                    label="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled
                />
                
                <div>
                    <label className="block text-sm font-medium mb-2">Роль</label>
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                    >
                        <option value="student">Ученик</option>
                        <option value="admin">Преподаватель</option>
                        <option value="developer">Разработчик</option>
                    </select>
                </div>
                
                <Input
                    label="Город"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
                
                <Input
                    label="Уровень"
                    type="number"
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: parseInt(e.target.value)})}
                />
                
                <Input
                    label="Очки"
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({...formData, points: parseInt(e.target.value)})}
                />
                
                <div className="flex gap-4">
                    <Button onClick={handleSave} className="flex-1">
                        Сохранить
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/admin/users')} className="flex-1">
                        Отмена
                    </Button>
                </div>
            </div>
        </div>
    )
}
```

---

### 3. 📍 Добавить роут в App.tsx

**Файл:** `src/App.tsx`

**Добавить импорт:**
```tsx
import { AdminUserEditPage } from './pages/AdminUserEditPage'
```

**Добавить роут (после /admin/users):**
```tsx
<Route
    path="/admin/users/:userId/edit"
    element={
        <ProtectedRoute>
            <AppLayout>
                <AdminUserEditPage />
            </AppLayout>
        </ProtectedRoute>
    }
/>
```

---

### 4. 🔑 Ctrl+Shift для роли Developer

**Файл:** `src/pages/Dashboard.tsx` (или любая страница)

**Добавить в конец компонента перед return:**

```tsx
useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
        // Ctrl+Shift+D для Developer роли
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            const currentUser = useAuthStore.getState().currentUser
            
            if (currentUser?.role === 'admin') {
                // Обновить роль на developer
                updateDoc(doc(db, 'users', currentUser.id), {
                    role: 'developer',
                    adminPoints: 9999
                }).then(() => {
                    alert('✅ Роль изменена на Developer!')
                    window.location.reload()
                })
            }
        }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
}, [])
```

**Добавить импорты:**
```tsx
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuthStore } from '@/store/authStore'
```

---

## 💾 ПОСЛЕ ВСЕХ ИЗМЕНЕНИЙ:

```bash
git add .
git commit -m "feat: Added user edit page, fixed Gemini API, added Ctrl+Shift+D for developer role"
git push origin main
```

---

## ✅ CHECKLIST:

- [ ] Изменить модель Gemini на `gemini-pro`
- [ ] Создать `AdminUserEditPage.tsx`
- [ ] Добавить роут в `App.tsx`
- [ ] Добавить Ctrl+Shift+D в Dashboard
- [ ] Протестировать редактирование пользователя
- [ ] Протестировать Ctrl+Shift+D
- [ ] Push в Git

---

**ВСЁ ПОДРОБНО РАСПИСАНО!** 📚
**СЛЕДУЙТЕ ИНСТРУКЦИИ!** ✨
