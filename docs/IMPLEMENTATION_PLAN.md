# 🎯 ПЛАН РЕАЛИЗАЦИИ: Project Dashboard с 3 вкладками

## 📊 РАЗДЕЛЕНИЕ НА 3 СЕКЦИИ:

### СЕКЦИЯ 1: Интерфейс (UI/UX)
### СЕКЦИЯ 2: Хранение данных + Mock AI
### СЕКЦИЯ 3: Подключение реального AI (Gemini)

---

## 📋 ДЕТАЛЬНЫЙ СПИСОК ЗАДАЧ:

### **СЕКЦИЯ 1: ИНТЕРФЕЙС** (6 задач)

**Задача 1.1:** Создать основной лейаут ProjectDashboard
- Header с названием проекта и статусом
- Система переключения табов (3 вкладки)
- Сетка: 75% контент + 25% AI сайдбар

**Задача 1.2:** Создать Tab 1 - Roadmap (План)
- Чеклист задач с галочками
- Прогресс-бар
- Блоки: Суть проекта, Цель, Боль клиента

**Задача 1.3:** Создать Tab 2 - Prompt Pack (Промпты)
- Карточки промптов
- Кнопка "Copy" для каждого промпта
- Настройки стека (Frontend/Backend/DB)

**Задача 1.4:** Создать Tab 3 - Storyboard (Слайды)
- Карточки слайдов
- Поля: Заголовок, Контент, Заметки спикера
- Кнопки: Добавить/Удалить слайд

**Задача 1.5:** Создать AI Sidebar (Правая панель)
- Контекстно-зависимый контент (меняется по табам)
- Mock чат интерфейс
- Быстрые действия (кнопки)

**Задача 1.6:** Добавить кнопки экспорта
- "Экспорт промптов" (копирует все)
- "Экспорт PDF" (заглушка пока)

---

### **СЕКЦИЯ 2: ХРАНЕНИЕ ДАННЫХ + MOCK AI** (4 задачи)

**Задача 2.1:** Расширить TypeScript типы
- Обновить интерфейс `Project`
- Добавить поля: roadmap, prompts, slides

**Задача 2.2:** Создать хук useProjectData
- Загрузка проекта из Firebase по ID
- Функция updateProject для сохранения
- Real-time обновления (onSnapshot)

**Задача 2.3:** Создать Mock AI ответы
- Функция `mockAIResponse(message, context)`
- Разные ответы для разных табов
- Имитация задержки (setTimeout)

**Задача 2.4:** Интегрировать данные в компоненты
- Передать данные из хука в табы
- Автосохранение при редактировании
- Обновление UI при изменениях

---

### **СЕКЦИЯ 3: ПОДКЛЮЧЕНИЕ РЕАЛЬНОГО AI** (3 задачи)

**Задача 3.1:** Исправить Gemini API модель
- Изменить на `gemini-1.5-flash-latest`
- Проверить работу API
- Обработка ошибок

**Задача 3.2:** Создать AI функции для каждого таба
- `generateRoadmap(projectIdea)` - генерация плана
- `generatePrompts(techStack, description)` - промпты
- `generateSlides(projectData)` - слайды

**Задача 3.3:** Заменить Mock на реальный AI
- Подключить Gemini в AI Sidebar
- Контекстно-зависимые промпты
- Обновление данных после ответа AI

---

## 🚀 ПРОМПТЫ ДЛЯ ANTIGRAVITY:

### **ПРОМПТ 0: Описание проекта**

```
Опиши мой проект EliteHeat для технического менеджера.

Проект: EliteHeat - образовательная платформа для студентов

Стек:
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS
- Backend: Firebase (Firestore, Authentication, Storage)
- AI: Google Gemini 1.5 Flash
- Роутинг: React Router
- Иконки: Lucide React

Архитектура:
- SPA (Single Page Application)
- Serverless (Firebase BaaS)
- Real-time database (Firestore)
- AI-powered features

Текущая структура:
- `/src/pages/` - страницы
- `/src/components/` - компоненты
- `/src/api/` - API интеграции
- `/src/types/` - TypeScript типы
- `/src/hooks/` - custom hooks

Роут для проектов: `/projects/:id`

Опиши как работает взаимодействие Frontend-Firebase-AI.
```

---

### **ПРОМПТ 1: Основной лейаут**

```
Act as a Senior React Developer with expertise in TypeScript and Tailwind CSS.

Context:
- Project: EliteHeat (EdTech platform)
- Stack: React 18, TypeScript, Vite, Tailwind CSS, Firebase
- We have an existing route `/projects/:id`

Task:
Create a new page component `src/pages/ProjectDashboardPage.tsx`.

Requirements:
1. Use `useParams` to get project ID from URL
2. Create a 3-column layout:
   - Left: Main content area (75% width)
   - Right: AI Sidebar (25% width)
3. Implement tab system with 3 tabs:
   - "🗺️ Roadmap" (key: 'roadmap')
   - "⚙️ Prompt Pack" (key: 'prompts')  
   - "🎞️ Storyboard" (key: 'storyboard')
4. Header section with:
   - Project title (editable)
   - Status badge
   - Action buttons: "Экспорт промптов", "Экспорт PDF"
5. Create placeholder components:
   - `src/components/project/RoadmapTab.tsx`
   - `src/components/project/PromptPackTab.tsx`
   - `src/components/project/StoryboardTab.tsx`
   - `src/components/project/AiSidebar.tsx`

Design:
- Use Tailwind CSS
- Modern, clean interface
- Smooth tab transitions
- Responsive design

Output:
- Complete `ProjectDashboardPage.tsx`
- Basic structure for all sub-components
- Proper TypeScript types
```

---

### **ПРОМПТ 2: Roadmap Tab**

```
Act as a Senior React Developer.

Context:
- Component: RoadmapTab.tsx
- Purpose: Display project roadmap with interactive checklist

Task:
Create `src/components/project/RoadmapTab.tsx`.

Requirements:
1. Accept props:
   - `roadmap`: Array<{ id: string, title: string, isCompleted: boolean }>
   - `onUpdate`: (roadmap) => void
2. Display sections:
   - Progress bar (% completed tasks)
   - "Суть проекта" (editable textarea)
   - Checklist of tasks (with checkboxes)
   - "Цель проекта" (editable)
   - "Боль клиента" (editable)
3. Features:
   - Click checkbox to toggle completion
   - Strikethrough completed tasks
   - Auto-save on change (debounced)
4. If roadmap is empty, show "Сгенерировать план" button

Design:
- Use Tailwind CSS
- Card-based layout
- Lucide React icons for checkboxes
- Smooth animations

Output complete component with TypeScript types.
```

---

### **ПРОМПТ 3: Prompt Pack Tab**

```
Act as a Senior React Developer.

Context:
- Component: PromptPackTab.tsx
- Purpose: Display AI prompts for code generation

Task:
Create `src/components/project/PromptPackTab.tsx`.

Requirements:
1. Accept props:
   - `project`: { techStack, description, title }
   - `prompts`: Array<{ id, title, content, category }>
   - `onUpdate`: (prompts) => void
2. Display:
   - Tech stack selector (Frontend/Backend/DB)
   - List of prompt cards
   - Each card has:
     * Title
     * Category badge
     * Prompt text (with variable substitution)
     * "Copy" button
3. Template variables:
   - `{techStack.frontend}` → "React"
   - `{techStack.backend}` → "Firebase"
   - `{description}` → project description
4. Features:
   - Copy to clipboard with toast feedback
   - "Добавить промпт" button
   - Edit prompt inline

Design:
- Monospace font for prompts
- Color-coded categories
- Copy button with icon

Output complete component with mock prompt templates.
```

---

### **ПРОМПТ 4: Storyboard Tab**

```
Act as a Senior React Developer.

Context:
- Component: StoryboardTab.tsx
- Purpose: Create presentation slides as text cards

Task:
Create `src/components/project/StoryboardTab.tsx`.

Requirements:
1. Accept props:
   - `slides`: Array<{ id, title, bullets, speakerNotes }>
   - `onUpdate`: (slides) => void
2. Display:
   - Grid of slide cards (2 columns)
   - Each card has:
     * Slide number
     * Title input
     * Bullets textarea (what's on slide)
     * Speaker notes textarea (what to say)
     * Delete button
3. Features:
   - Add new slide button
   - Drag to reorder (optional)
   - Auto-save on blur
   - "Экспорт в PDF" button (mock for now)
4. Default slides if empty:
   - Slide 1: Проблема
   - Slide 2: Решение
   - Slide 3: Технологии
   - Slide 4: Демо

Design:
- Card-based layout
- Different bg color for speaker notes
- Slide number badge

Output complete component.
```

---

### **ПРОМПТ 5: AI Sidebar (Mock)**

```
Act as a Senior React Developer.

Context:
- Component: AiSidebar.tsx
- Purpose: Context-aware AI assistant (mock for now)

Task:
Create `src/components/project/AiSidebar.tsx`.

Requirements:
1. Accept props:
   - `activeTab`: 'roadmap' | 'prompts' | 'storyboard'
   - `project`: Project data
2. Display different content based on activeTab:
   
   **Roadmap mode:**
   - Title: "🎯 Project Mentor"
   - Description: "Помогу спланировать следующие шаги"
   - Actions: ["Анализ прогресса", "Предложить следующий шаг"]
   
   **Prompts mode:**
   - Title: "🛠️ Tech Architect"
   - Description: "Помогу настроить промпты под ваш стек"
   - Current stack display
   - Actions: ["Изменить стек", "Оптимизировать промпты"]
   
   **Storyboard mode:**
   - Title: "🎤 Presentation Coach"
   - Description: "Помогу подготовить убедительную презентацию"
   - Actions: ["Симуляция защиты", "Проверить заметки"]

3. Mock chat interface:
   - Input field
   - "Отправить" button (disabled with text "скоро")
   - Message: "Чат будет доступен после подключения AI"

Design:
- Sticky sidebar
- Gradient backgrounds
- Icon-based actions

Output complete component.
```

---

### **ПРОМПТ 6: TypeScript типы и хук**

```
Act as a Senior TypeScript Developer.

Context:
- Project: EliteHeat
- Database: Firebase Firestore

Task 1: Update `src/types/project.ts`

Add these fields to Project interface:
```typescript
interface Project {
  // ... existing fields
  
  // New fields for dashboard
  roadmap?: Array<{
    id: string
    title: string
    isCompleted: boolean
    order: number
  }>
  
  techStack?: {
    frontend: string
    backend: string
    db: string
  }
  
  prompts?: Array<{
    id: string
    title: string
    content: string
    category: 'database' | 'backend' | 'frontend' | 'other'
  }>
  
  slides?: Array<{
    id: string
    order: number
    title: string
    bullets: string[]
    speakerNotes: string
  }>
}
```

Task 2: Create `src/hooks/useProjectData.ts`

Requirements:
1. Custom hook that accepts projectId
2. Uses Firestore `onSnapshot` for real-time updates
3. Returns:
   - `project`: Project | null
   - `loading`: boolean
   - `error`: string | null
   - `updateProject`: (updates: Partial<Project>) => Promise<void>
4. Handle errors gracefully

Output both files with complete TypeScript types.
```

---

### **ПРОМПТ 7: Mock AI функции**

```
Act as a Senior React Developer.

Context:
- We need mock AI responses before connecting real Gemini API

Task:
Create `src/utils/mockAI.ts`

Requirements:
1. Function `mockAIResponse(message: string, context: string)`
2. Context can be: 'roadmap' | 'prompts' | 'storyboard'
3. Return different responses based on context and keywords:

   **Roadmap context:**
   - If message contains "план" → suggest roadmap items
   - If message contains "задач" → add task to checklist
   
   **Prompts context:**
   - If message contains "промпт" → generate prompt template
   - If message contains "стек" → suggest tech stack
   
   **Storyboard context:**
   - If message contains "слайд" → suggest slide content
   - If message contains "речь" → generate speaker notes

4. Add 500ms delay to simulate API call
5. Return mock responses in Russian

Output complete utility file with TypeScript types.
```

---

### **ПРОМПТ 8: Интеграция данных**

```
Act as a Senior React Developer.

Context:
- We have all UI components ready
- We have useProjectData hook
- We have mock AI

Task:
Update `ProjectDashboardPage.tsx` to integrate everything.

Requirements:
1. Use `useProjectData(id)` hook
2. Pass data to child components:
   - RoadmapTab gets roadmap data
   - PromptPackTab gets prompts and techStack
   - StoryboardTab gets slides
   - AiSidebar gets activeTab and project
3. Implement update handlers:
   - `handleRoadmapUpdate`
   - `handlePromptsUpdate`
   - `handleSlidesUpdate`
4. Add loading state
5. Add error handling
6. Initialize empty data if project is new

Output updated ProjectDashboardPage.tsx with full integration.
```

---

### **ПРОМПТ 9: Исправить Gemini API**

```
Act as a Senior Developer with Google AI API expertise.

Context:
- File: `src/api/gemini.ts`
- Current model: 'gemini-pro' (404 error)
- API Key: Free tier

Task:
Fix the Gemini API integration.

Requirements:
1. Change model to: 'gemini-1.5-flash-latest'
2. Update generationConfig for optimal free tier usage
3. Add proper error handling:
   - 404: Model not found
   - 429: Rate limit
   - 403: API key invalid
4. Add retry logic (max 3 attempts)
5. Add fallback to mock responses if API fails

Output updated gemini.ts file.
```

---

### **ПРОМПТ 10: AI функции для табов**

```
Act as a Senior AI Integration Developer.

Context:
- We have working Gemini API
- Need AI functions for each tab

Task:
Create `src/api/projectAI.ts`

Requirements:
1. Function `generateRoadmap(projectIdea: string)`
   - Prompt: Analyze idea and create 5-7 step roadmap
   - Return: Array of roadmap items
   
2. Function `generatePrompts(techStack, description)`
   - Prompt: Create 3 specialized prompts (DB, Backend, Frontend)
   - Return: Array of prompt objects
   
3. Function `generateSlides(projectData)`
   - Prompt: Create 5 presentation slides
   - Return: Array of slide objects

4. All functions should:
   - Use Gemini API
   - Parse JSON responses
   - Handle errors
   - Return TypeScript typed data

Output complete projectAI.ts file.
```

---

### **ПРОМПТ 11: Подключить реальный AI**

```
Act as a Senior React Developer.

Context:
- We have mock AI working
- We have real Gemini API functions ready

Task:
Replace mock AI with real Gemini in AiSidebar.

Requirements:
1. Update AiSidebar.tsx:
   - Remove mock responses
   - Add real AI chat functionality
   - Use `sendTextMessage` from gemini.ts
2. Context-aware prompts:
   - Roadmap tab: "Act as Project Manager..."
   - Prompts tab: "Act as Tech Architect..."
   - Storyboard tab: "Act as Presentation Coach..."
3. Features:
   - Send message to AI
   - Display loading state
   - Show AI response
   - Update project data based on AI suggestions
4. Add quick action buttons that trigger AI:
   - "Сгенерировать план" → calls generateRoadmap
   - "Создать промпты" → calls generatePrompts
   - "Подготовить слайды" → calls generateSlides

Output updated AiSidebar.tsx with real AI integration.
```

---

## ✅ ЧЕКЛИСТ ВЫПОЛНЕНИЯ:

### Секция 1: Интерфейс
- [ ] Промпт 1: Основной лейаут
- [ ] Промпт 2: Roadmap Tab
- [ ] Промпт 3: Prompt Pack Tab
- [ ] Промпт 4: Storyboard Tab
- [ ] Промпт 5: AI Sidebar (Mock)

### Секция 2: Данные + Mock
- [ ] Промпт 6: TypeScript типы и хук
- [ ] Промпт 7: Mock AI функции
- [ ] Промпт 8: Интеграция данных

### Секция 3: Реальный AI
- [ ] Промпт 9: Исправить Gemini API
- [ ] Промпт 10: AI функции для табов
- [ ] Промпт 11: Подключить реальный AI

---

## 🎯 КАК ИСПОЛЬЗОВАТЬ:

1. **Сначала:** Скопируй **ПРОМПТ 0** и отправь Antigravity
2. **Получи ответ** → скопируй и отправь в Gemini/ChatGPT
3. **Gemini изучит проект** → вернись к Antigravity
4. **Отправляй промпты по порядку** (1 → 2 → 3 → ...)
5. **После каждого промпта:** Проверяй работает ли код
6. **Если ошибка:** Скажи Antigravity "Fix errors" и покажи ошибку
7. **Если всё ОК:** Переходи к следующему промпту

**Удачи!** 🚀
