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
                        className={`border-2 rounded-lg p-4 transition-all ${module.status === 'completed' ? 'border-green-500 bg-green-50' :
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
