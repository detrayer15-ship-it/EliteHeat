# ✅ ФИНАЛЬНЫЙ КОД - КОПИРОВАТЬ И ВСТАВИТЬ

## 🎯 ШАГ 2: ДОБАВИТЬ РОУТ

**Файл:** `src/App.tsx`

**Найти любой роут (например `/settings`) и добавить ПОСЛЕ него:**

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

## 🎯 ШАГ 3: ДОБАВИТЬ КНОПКУ

**Файл:** `src/pages/AdminUsersPage.tsx`

### 3.1 Добавить импорт navigate (если нет):

**В начале файла, после других импортов:**
```tsx
import { useNavigate } from 'react-router-dom'
```

**В компоненте:**
```tsx
export const AdminUsersPage = () => {
    const navigate = useNavigate()
    const currentUser = useAuthStore((state) => state.currentUser)
    // ... остальной код
```

### 3.2 Найти где рендерятся кнопки для пользователей

**Найти кнопку "Удалить" (примерно строка 240-260):**

```tsx
{currentUser?.role === 'developer' && (
    <button
        onClick={() => handleDeleteUser(user.id)}
        ...
    >
        🗑️ Удалить
    </button>
)}
```

### 3.3 Добавить кнопку "Изменить" ПЕРЕД кнопкой "Удалить":

```tsx
{currentUser?.role === 'developer' && (
    <button
        onClick={() => navigate(`/admin/users/${user.id}/edit`)}
        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
    >
        ✏️ Изменить
    </button>
)}

{currentUser?.role === 'developer' && (
    <button
        onClick={() => handleDeleteUser(user.id)}
        ...
    >
        🗑️ Удалить
    </button>
)}
```

---

## 💾 ПОСЛЕ ВСЕХ ИЗМЕНЕНИЙ:

```bash
git add .
git commit -m "feat: Added user edit route and button"
git push origin main
```

---

## ✅ ПРОВЕРКА:

1. Сохраните все файлы
2. Перезапустите dev server (если нужно)
3. Войдите как developer (Ctrl+Shift)
4. Перейдите в "Управление пользователями"
5. Должна появиться кнопка "✏️ Изменить"
6. Нажмите - откроется страница редактирования

---

**ВЕСЬ КОД ГОТОВ!**
**ПРОСТО СКОПИРУЙТЕ И ВСТАВЬТЕ!** 📚✨
