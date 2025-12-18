# 🎯 АВТОМАТИЧЕСКАЯ ГЕНЕРАЦИЯ ЗАДАНИЙ - КОНЦЕПЦИЯ

## 📋 ОБЩАЯ ИДЕЯ:

Ученик пишет идею → Система генерирует задания → Ученик выполняет → Открывается следующее

---

## 🔄 ПРОЦЕСС:

### 1. Ввод идеи
```
Ученик: "Хочу создать приложение для изучения английского"
```

### 2. AI анализирует и создаёт:
- Название проекта: "English Learning App"
- Задания для Roadmap (5-7 шагов)
- Задания для Prompts (3-5 модулей)
- Задания для Storyboard (5-7 слайдов)

### 3. Выполнение по шагам:
```
Roadmap:
  [✓] Шаг 1: Описать проблему
  [→] Шаг 2: Определить целевую аудиторию (ТЕКУЩИЙ)
  [ ] Шаг 3: Выбрать функции
  ...

Prompts:
  [ ] Модуль 1: Database Schema (ЗАБЛОКИРОВАН)
  [ ] Модуль 2: Backend API (ЗАБЛОКИРОВАН)
  ...

Storyboard:
  [ ] Слайд 1: Проблема (ЗАБЛОКИРОВАН)
  ...
```

---

## 📊 СТРУКТУРА ДАННЫХ:

```typescript
interface GeneratedProject {
  id: string
  title: string // AI генерирует
  description: string
  studentIdea: string // Оригинальная идея ученика
  
  roadmap: {
    steps: Array<{
      id: number
      title: string
      description: string
      status: 'locked' | 'current' | 'completed'
      aiGenerated: boolean
    }>
  }
  
  prompts: {
    modules: Array<{
      id: number
      title: string
      content: string
      status: 'locked' | 'current' | 'completed'
      aiGenerated: boolean
    }>
  }
  
  storyboard: {
    slides: Array<{
      id: number
      title: string
      content: string
      notes: string
      status: 'locked' | 'current' | 'completed'
      aiGenerated: boolean
    }>
  }
}
```

---

## 🤖 AI ГЕНЕРАЦИЯ (Промпт для AI):

```typescript
const generateProjectTasks = async (studentIdea: string) => {
  const prompt = `
Ты - эксперт по созданию образовательных проектов.

Идея ученика: "${studentIdea}"

Создай структуру проекта в JSON формате:

{
  "title": "Краткое название проекта (2-4 слова)",
  "description": "Описание проекта (1-2 предложения)",
  
  "roadmap": {
    "steps": [
      {
        "id": 1,
        "title": "Описать проблему",
        "description": "Чётко сформулируй, какую проблему решает твой проект",
        "status": "current"
      },
      {
        "id": 2,
        "title": "Определить целевую аудиторию",
        "description": "Кто будет использовать твой проект?",
        "status": "locked"
      },
      // ... ещё 3-5 шагов
    ]
  },
  
  "prompts": {
    "modules": [
      {
        "id": 1,
        "title": "Database Schema",
        "content": "Act as a Senior DB Engineer. Create a schema for...",
        "status": "locked"
      },
      // ... ещё 2-4 модуля
    ]
  },
  
  "storyboard": {
    "slides": [
      {
        "id": 1,
        "title": "Проблема",
        "content": "Опиши проблему, которую решает проект",
        "notes": "Начни с вопроса к аудитории",
        "status": "locked"
      },
      // ... ещё 4-6 слайдов
    ]
  }
}

Важно:
- Первый шаг в roadmap всегда "current"
- Остальные шаги "locked"
- Задания должны быть конкретными и выполнимыми
- Каждый следующий шаг логически следует из предыдущего
`

  const response = await sendTextMessage(prompt)
  return JSON.parse(response)
}
```

---

## 🔓 ЛОГИКА РАЗБЛОКИРОВКИ:

```typescript
const completeTask = (projectId: string, tabType: string, taskId: number) => {
  // 1. Отметить текущую задачу как completed
  // 2. Разблокировать следующую задачу (locked → current)
  // 3. Сохранить в Firebase
  
  const nextTask = tasks.find(t => t.id === taskId + 1)
  if (nextTask) {
    nextTask.status = 'current'
  }
}
```

---

## 🎨 UI КОМПОНЕНТЫ:

### ProjectRoadmap.tsx (обновлённый):
```tsx
export const ProjectRoadmap = ({ projectId }: { projectId: string }) => {
  const [steps, setSteps] = useState([
    { id: 1, title: 'Описать проблему', status: 'current', description: '...' },
    { id: 2, title: 'Определить аудиторию', status: 'locked', description: '...' },
    // ...
  ])

  const completeStep = (stepId: number) => {
    setSteps(steps.map(s => {
      if (s.id === stepId) return { ...s, status: 'completed' }
      if (s.id === stepId + 1) return { ...s, status: 'current' }
      return s
    }))
  }

  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <div
          key={step.id}
          className={`p-4 rounded-lg border-2 ${
            step.status === 'completed' ? 'bg-green-50 border-green-500' :
            step.status === 'current' ? 'bg-blue-50 border-blue-500' :
            'bg-gray-100 border-gray-300 opacity-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
            
            {step.status === 'current' && (
              <button
                onClick={() => completeStep(step.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                ✓ Выполнено
              </button>
            )}
            
            {step.status === 'completed' && (
              <span className="text-green-500 text-2xl">✓</span>
            )}
            
            {step.status === 'locked' && (
              <span className="text-gray-400 text-2xl">🔒</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
```

---

## 🔄 ПОЛНЫЙ ЦИКЛ:

### 1. Создание проекта (ProjectCreationChat):
```tsx
const handleSubmit = async (idea: string) => {
  // 1. Отправляем идею в AI
  const generatedProject = await generateProjectTasks(idea)
  
  // 2. Создаём проект в Firebase
  const projectRef = await addDoc(collection(db, 'projects'), {
    ...generatedProject,
    userId: currentUser.id,
    createdAt: new Date(),
    studentIdea: idea
  })
  
  // 3. Перенаправляем на страницу проекта
  navigate(`/projects/${projectRef.id}`)
}
```

### 2. Работа с заданиями (ProjectDetailPage):
```tsx
const completeTask = async (tabType: string, taskId: number) => {
  // Обновляем статусы
  await updateDoc(doc(db, 'projects', projectId), {
    [`${tabType}.tasks`]: updatedTasks
  })
  
  // Показываем уведомление
  alert('✅ Задание выполнено! Следующее задание разблокировано.')
}
```

---

## 📝 ПРИМЕР ГЕНЕРАЦИИ:

### Идея ученика:
```
"Хочу создать приложение для изучения английского языка"
```

### AI генерирует:
```json
{
  "title": "English Learning App",
  "description": "Мобильное приложение для интерактивного изучения английского языка",
  
  "roadmap": {
    "steps": [
      {
        "id": 1,
        "title": "Описать проблему",
        "description": "Почему людям сложно учить английский?",
        "status": "current"
      },
      {
        "id": 2,
        "title": "Определить целевую аудиторию",
        "description": "Школьники? Студенты? Взрослые?",
        "status": "locked"
      },
      {
        "id": 3,
        "title": "Выбрать ключевые функции",
        "description": "Карточки? Игры? Тесты?",
        "status": "locked"
      }
    ]
  },
  
  "prompts": {
    "modules": [
      {
        "id": 1,
        "title": "Database Schema",
        "content": "Act as DB Engineer. Create schema for: Users, Words, Progress, Tests...",
        "status": "locked"
      }
    ]
  },
  
  "storyboard": {
    "slides": [
      {
        "id": 1,
        "title": "Проблема",
        "content": "Людям сложно учить английский самостоятельно",
        "notes": "Спросите аудиторию: кто пытался учить английский?",
        "status": "locked"
      }
    ]
  }
}
```

---

## ✅ ИТОГО:

**Система делает:**
1. Принимает идею ученика
2. Генерирует название проекта
3. Создаёт задания для всех 3 режимов
4. Открывает первое задание
5. По мере выполнения открывает следующие

**Ученик делает:**
1. Пишет идею
2. Выполняет задания по порядку
3. Получает готовый проект

---

**ГОТОВО К РЕАЛИЗАЦИИ!** 🚀✨
