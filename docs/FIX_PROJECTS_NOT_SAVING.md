# 🔧 ИСПРАВЛЕНИЕ: Проекты не сохраняются

## Проблема:
Проекты создаются в Firebase, но НЕ показываются в "Мои проекты"

## Причина:
- `ProjectCreationChat` сохраняет в **Firebase** (облако)
- `ProjectsPage` читает из **projectStore** (localStorage)
- Это **разные хранилища**!

## Решение:

### Вариант 1: Добавить в оба хранилища (БЫСТРО)

В файле `src/components/project/ProjectCreationChat.tsx`:

**Найдите строку 160:**
```typescript
const docRef = await addDoc(collection(db, 'projects'), projectData)
```

**Добавьте СРАЗУ ПОСЛЕ НЕЁ:**
```typescript
// Сохраняем также в локальное хранилище
createLocalProject({ ...projectData, id: docRef.id })
```

### Вариант 2: Загружать из Firebase (ПРАВИЛЬНО)

Изменить `ProjectsPage.tsx` чтобы загружал из Firebase:

```typescript
import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { useAuthStore } from '@/store/authStore'

export const ProjectsPage = () => {
    const [projects, setProjects] = useState([])
    const user = useAuthStore(state => state.user)

    useEffect(() => {
        const loadProjects = async () => {
            if (!user?.uid) return
            
            const q = query(
                collection(db, 'projects'),
                where('userId', '==', user.uid)
            )
            
            const snapshot = await getDocs(q)
            const projectsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            
            setProjects(projectsData)
        }
        
        loadProjects()
    }, [user?.uid])

    return (
        <div>
            <h1>Мои проекты</h1>
            <p>Всего: {projects.length}</p>
            {/* Отобразить проекты */}
        </div>
    )
}
```

## Проверка Gemini API:

✅ **Gemini API УЖЕ ПОДКЛЮЧЁН!**

Проверьте файлы:
- `src/api/gemini.ts` - строка 4: `const API_KEY = 'AIzaSy...'`
- `src/components/project/ProjectCreationChat.tsx` - строка 9: `import { sendTextMessage } from '@/api/gemini'`
- `src/components/ide/AIAssistantPanel.tsx` - строка 4: `import { sendTextMessage } from '@/api/gemini'`
- `src/components/project/AiSidebar.tsx` - строка 3: `import { sendTextMessage } from '@/api/gemini'`

**Все AI компоненты используют Gemini API!**

## Тест:

1. Откройте консоль браузера (F12)
2. Создайте проект через чат
3. Проверьте есть ли ошибки
4. Откройте "Мои проекты"
5. Если проекта нет - примените Вариант 1 или 2

## Быстрое исправление (СЕЙЧАС):

Откройте `src/components/project/ProjectCreationChat.tsx`

Найдите строку 160 и добавьте после неё:
```typescript
createLocalProject({ ...projectData, id: docRef.id })
```

Готово! Проекты будут сохраняться в оба места! ✅
