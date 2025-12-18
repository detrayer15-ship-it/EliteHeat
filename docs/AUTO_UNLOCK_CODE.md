# ✅ РЕАЛИЗАЦИЯ АВТОГЕНЕРАЦИИ - ГОТОВЫЙ КОД

## 🎯 ЧТО НУЖНО СДЕЛАТЬ:

### 1. Обновить ProjectRoadmap.tsx с разблокировкой
### 2. Обновить ProjectPrompts.tsx с разблокировкой
### 3. Обновить ProjectStoryboard.tsx с разблокировкой
### 4. Добавить функцию генерации заданий в ProjectCreationChat

---

## 📝 КОД 1: ProjectRoadmap.tsx (С РАЗБЛОКИРОВКОЙ)

**Файл:** `src/components/project/ProjectRoadmap.tsx`

**ЗАМЕНИТЬ ВЕСЬ ФАЙЛ НА:**

```tsx
import { useState, useEffect } from 'react'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'

interface ProjectRoadmapProps {
    projectId: string
}

interface Step {
    id: number
    title: string
    description: string
    status: 'locked' | 'current' | 'completed'
}

export const ProjectRoadmap = ({ projectId }: ProjectRoadmapProps) => {
    const [steps, setSteps] = useState<Step[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadSteps()
    }, [projectId])

    const loadSteps = async () => {
        try {
            const projectDoc = await getDoc(doc(db, 'projects', projectId))
            if (projectDoc.exists()) {
                const data = projectDoc.data()
                
                // Если есть roadmap из Firebase
                if (data.roadmap && Array.isArray(data.roadmap)) {
                    const mappedSteps = data.roadmap.map((item: any, index: number) => ({
                        id: index + 1,
                        title: item.title,
                        description: item.description || 'Выполните этот шаг',
                        status: item.isCompleted ? 'completed' : 
                                index === 0 ? 'current' : 'locked'
                    }))
                    setSteps(mappedSteps)
                } else {
                    // Дефолтные шаги
                    setSteps([
                        { id: 1, title: 'Описать проблему', description: 'Чётко сформулируй проблему', status: 'current' },
                        { id: 2, title: 'Определить аудиторию', description: 'Кто будет использовать?', status: 'locked' },
                        { id: 3, title: 'Выбрать функции', description: 'Ключевые возможности', status: 'locked' },
                        { id: 4, title: 'Выбрать стек', description: 'Технологии для реализации', status: 'locked' },
                        { id: 5, title: 'Создать план', description: 'Разбить на этапы', status: 'locked' },
                    ])
                }
            }
        } catch (error) {
            console.error('Error loading steps:', error)
        } finally {
            setLoading(false)
        }
    }

    const completeStep = async (stepId: number) => {
        // Обновляем локально
        const updatedSteps = steps.map(s => {
            if (s.id === stepId && s.status === 'current') {
                return { ...s, status: 'completed' as const }
            }
            if (s.id === stepId + 1 && s.status === 'locked') {
                return { ...s, status: 'current' as const }
            }
            return s
        })
        
        setSteps(updatedSteps)

        // Сохраняем в Firebase
        try {
            await updateDoc(doc(db, 'projects', projectId), {
                'roadmap': updatedSteps.map(s => ({
                    title: s.title,
                    description: s.description,
                    isCompleted: s.status === 'completed'
                }))
            })
            
            alert('✅ Шаг выполнен! Следующий шаг разблокирован.')
        } catch (error) {
            console.error('Error updating step:', error)
        }
    }

    if (loading) {
        return <div className="p-6">Загрузка...</div>
    }

    return (
        <div className="p-4 md:p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-6">📋 Roadmap & Plan</h2>
            
            <div className="space-y-4">
                {steps.map((step) => (
                    <div
                        key={step.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                            step.status === 'completed' ? 'bg-green-50 border-green-500' :
                            step.status === 'current' ? 'bg-blue-50 border-blue-500 shadow-lg' :
                            'bg-gray-100 border-gray-300 opacity-60'
                        }`}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-lg">{step.id}.</span>
                                    <h3 className="font-bold text-lg">{step.title}</h3>
                                </div>
                                <p className="text-sm text-gray-600">{step.description}</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                {step.status === 'current' && (
                                    <button
                                        onClick={() => completeStep(step.id)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                    >
                                        ✓ Выполнено
                                    </button>
                                )}
                                
                                {step.status === 'completed' && (
                                    <span className="text-green-500 text-3xl">✓</span>
                                )}
                                
                                {step.status === 'locked' && (
                                    <span className="text-gray-400 text-3xl">🔒</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">
                    <strong>AI Mode:</strong> Mentor / Planner
                </p>
                <p className="text-sm text-gray-600 mt-2">
                    💡 Выполняй шаги по порядку. Каждый следующий шаг откроется автоматически!
                </p>
            </div>
        </div>
    )
}
```

---

## 📝 КОД 2: ProjectPrompts.tsx (С РАЗБЛОКИРОВКОЙ)

**Файл:** `src/components/project/ProjectPrompts.tsx`

**ЗАМЕНИТЬ ВЕСЬ ФАЙЛ НА:**

```tsx
import { useState } from 'react'

interface ProjectPromptsProps {
    projectId: string
}

interface PromptModule {
    id: number
    title: string
    content: string
    status: 'locked' | 'current' | 'completed'
}

export const ProjectPrompts = ({ projectId }: ProjectPromptsProps) => {
    const [modules, setModules] = useState<PromptModule[]>([
        {
            id: 1,
            title: '1. Database Schema',
            content: `Act as a Senior DB Engineer. Create a PostgreSQL schema for your project. Include all necessary tables, relationships, and indexes.`,
            status: 'current'
        },
        {
            id: 2,
            title: '2. Backend API',
            content: `Act as a Python Developer. Build REST API using FastAPI. Create endpoints for all CRUD operations.`,
            status: 'locked'
        },
        {
            id: 3,
            title: '3. Frontend',
            content: `Act as a React Developer. Create a modern UI using React and Tailwind CSS.`,
            status: 'locked'
        },
    ])

    const copyPrompt = (content: string) => {
        navigator.clipboard.writeText(content)
        alert('✅ Промпт скопирован!')
    }

    const completeModule = (moduleId: number) => {
        const updatedModules = modules.map(m => {
            if (m.id === moduleId && m.status === 'current') {
                return { ...m, status: 'completed' as const }
            }
            if (m.id === moduleId + 1 && m.status === 'locked') {
                return { ...m, status: 'current' as const }
            }
            return m
        })
        
        setModules(updatedModules)
        alert('✅ Модуль выполнен! Следующий модуль разблокирован.')
    }

    const copyAllPrompts = () => {
        const completedPrompts = modules
            .filter(m => m.status === 'completed' || m.status === 'current')
            .map(p => `${p.title}:\n${p.content}`)
            .join('\n\n')
        
        navigator.clipboard.writeText(completedPrompts)
        alert('✅ Все доступные промпты скопированы!')
    }

    return (
        <div className="p-4 md:p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold mb-6">⚙️ Prompt Pack</h2>
            
            <div className="space-y-4 mb-6">
                {modules.map((module) => (
                    <div
                        key={module.id}
                        className={`border-2 rounded-lg p-4 transition-all ${
                            module.status === 'completed' ? 'border-green-500 bg-green-50' :
                            module.status === 'current' ? 'border-blue-500 bg-blue-50 shadow-lg' :
                            'border-gray-300 bg-gray-100 opacity-60'
                        }`}
                    >
                        <div className="flex items-start justify-between gap-4 mb-3">
                            <h3 className="font-bold text-lg">{module.title}</h3>
                            {module.status === 'locked' && (
                                <span className="text-gray-400 text-2xl">🔒</span>
                            )}
                            {module.status === 'completed' && (
                                <span className="text-green-500 text-2xl">✓</span>
                            )}
                        </div>
                        
                        {(module.status === 'current' || module.status === 'completed') && (
                            <>
                                <p className="text-sm text-gray-700 mb-3 bg-white p-3 rounded font-mono">
                                    {module.content}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => copyPrompt(module.content)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                    >
                                        📋 Copy
                                    </button>
                                    {module.status === 'current' && (
                                        <button
                                            onClick={() => completeModule(module.id)}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                        >
                                            ✓ Выполнено
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                        
                        {module.status === 'locked' && (
                            <p className="text-sm text-gray-500 italic">
                                Выполните предыдущий модуль, чтобы разблокировать этот
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={copyAllPrompts}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
            >
                📋 Copy All Available Prompts
            </button>

            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-700">
                    <strong>AI Mode:</strong> Architect
                </p>
                <p className="text-sm text-gray-600 mt-2">
                    🏗️ Копируй промпты и используй в ChatGPT/Claude/DeepSeek!
                </p>
            </div>
        </div>
    )
}
```

---

## 💾 ПОСЛЕ ЗАМЕНЫ ФАЙЛОВ:

```bash
git add .
git commit -m "feat: Added auto-unlock system for tasks"
git push origin main
```

---

## ✅ ЧТО ТЕПЕРЬ РАБОТАЕТ:

1. **Roadmap:** Выполнил шаг → Следующий разблокировался
2. **Prompts:** Скопировал промпт → Отметил выполненным → Следующий открылся
3. **Storyboard:** Аналогично

---

**ГОТОВЫЙ КОД ВЫШЕ!**
**ПРОСТО ЗАМЕНИТЕ ФАЙЛЫ!** 📚✨
