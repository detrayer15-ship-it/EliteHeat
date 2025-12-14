# AI Context Sharing - Документация

## 🎯 Цель

Связать AI на разных страницах (Dashboard, AI Assistant, IDE) для обмена контекстом и историей.

## 📦 Что создано

### 1. **AI Context Store** (`src/store/aiContextStore.ts`)
Глобальное хранилище для:
- Истории всех разговоров
- Текущего контекста (проект, файл, цели)
- Обмена данными между страницами

### 2. **useAIAssistant Hook** (`src/hooks/useAIAssistant.ts`)
Удобный хук для работы с AI:
```typescript
const { messages, sendMessage, switchToProject } = useAIAssistant({
  page: 'dashboard',
  projectId: '123'
})
```

## 🚀 Как использовать

### На главной странице (Dashboard):

```typescript
import { useAIAssistant } from '@/hooks/useAIAssistant'

export const Dashboard = () => {
  const { messages, sendMessage, isLoading } = useAIAssistant({ 
    page: 'dashboard' 
  })

  const handleAsk = async () => {
    await sendMessage('Помоги создать проект')
  }

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  )
}
```

### На странице AI Assistant:

```typescript
import { useAIAssistant } from '@/hooks/useAIAssistant'

export const AIAssistantPage = () => {
  const { 
    messages, 
    sendMessage, 
    sharedContext  // Получаем контекст с других страниц!
  } = useAIAssistant({ page: 'assistant' })

  // AI автоматически знает о текущем проекте
  console.log(sharedContext.globalContext.currentProject)

  return <Chat messages={messages} onSend={sendMessage} />
}
```

### В IDE (при открытии файла):

```typescript
import { useAIContext } from '@/store/aiContextStore'

export const CodeEditor = ({ file, projectId }) => {
  const { updateGlobalContext } = useAIContext()

  useEffect(() => {
    // Обновляем контекст при открытии файла
    updateGlobalContext({
      currentProject: projectId,
      currentFile: file
    })
  }, [file, projectId])

  // Теперь AI Assistant знает какой файл открыт!
}
```

### Переключение контекста между страницами:

```typescript
import { useAIAssistant } from '@/hooks/useAIAssistant'
import { useNavigate } from 'react-router-dom'

export const ProjectCard = ({ project }) => {
  const { switchToProject } = useAIAssistant()
  const navigate = useNavigate()

  const openInAssistant = () => {
    // Передаём контекст проекта в AI Assistant
    switchToProject(project.id, {
      title: project.title,
      techStack: project.techStack
    })
    
    // Переходим на страницу AI Assistant
    navigate('/ai-assistant')
    
    // AI Assistant теперь знает о проекте!
  }

  return <button onClick={openInAssistant}>Спросить AI</button>
}
```

## 🔄 Как это работает

1. **Пользователь создаёт проект** на Dashboard
2. **Контекст сохраняется** в `aiContextStore`
3. **Переходит на AI Assistant** 
4. **AI видит историю** и знает о проекте
5. **Может задавать вопросы** с полным контекстом

## 📊 Структура данных

```typescript
{
  currentConversation: {
    id: "123",
    title: "Создание проекта",
    messages: [
      {
        id: "1",
        role: "user",
        content: "Хочу создать приложение",
        context: {
          projectId: "proj-123",
          page: "dashboard"
        }
      }
    ]
  },
  globalContext: {
    currentProject: "proj-123",
    currentFile: "App.tsx",
    recentTopics: ["создание проекта", "React"]
  }
}
```

## ✨ Преимущества

✅ **Единая история** - все разговоры в одном месте
✅ **Контекст сохраняется** - AI помнит о чём говорили
✅ **Работает везде** - Dashboard, AI Assistant, IDE
✅ **Автоматическая синхронизация** - через Zustand
✅ **Персистентность** - сохраняется в localStorage

## 🎯 Примеры использования

### 1. Создание проекта на Dashboard → Помощь в AI Assistant

```typescript
// Dashboard
const { switchToProject } = useAIAssistant()
const projectId = await createProject(data)
switchToProject(projectId, { title: data.title })

// AI Assistant (автоматически получает контекст)
const { sharedContext } = useAIAssistant()
console.log(sharedContext.globalContext.currentProject) // projectId
```

### 2. Работа в IDE → Вопрос к AI

```typescript
// IDE
const { updateContext } = useAIAssistant()
updateContext({ 
  currentFile: 'App.tsx',
  codeSnippet: selectedCode 
})

// AI Assistant
await sendMessage('Объясни этот код')
// AI получит контекст: файл App.tsx и выделенный код
```

## 🔧 Интеграция с Gemini

Хук `useAIAssistant` автоматически:
1. Собирает контекст со всех страниц
2. Формирует промпт с контекстом
3. Отправляет в Gemini API
4. Сохраняет ответ в историю

```typescript
const contextPrompt = `
Контекст:
- Проект: ${globalContext.currentProject}
- Файл: ${globalContext.currentFile}
- История: ${recentMessages}

Вопрос: ${userMessage}
`
```

## 🎨 Готово к использованию!

Теперь все AI компоненты связаны и обмениваются контекстом автоматически! 🚀
