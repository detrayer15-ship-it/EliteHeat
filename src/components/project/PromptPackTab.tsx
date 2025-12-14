import { useState } from 'react'
import { Copy, Check, Plus } from 'lucide-react'
import type { Project } from '@/types/project'

interface Prompt {
    id: string
    title: string
    content: string
    category: 'database' | 'backend' | 'frontend' | 'other'
}

interface PromptPackTabProps {
    project: Project
    prompts: Prompt[]
    onUpdate: (updates: any) => Promise<void>
}

const CATEGORY_COLORS = {
    database: 'bg-blue-100 text-blue-800',
    backend: 'bg-green-100 text-green-800',
    frontend: 'bg-purple-100 text-purple-800',
    other: 'bg-gray-100 text-gray-800',
}

const CATEGORY_LABELS = {
    database: 'База данных',
    backend: 'Backend',
    frontend: 'Frontend',
    other: 'Другое',
}

export const PromptPackTab = ({ project, prompts, onUpdate }: PromptPackTabProps) => {
    const [copiedId, setCopiedId] = useState<string | null>(null)

    const substituteVariables = (content: string) => {
        return content
            .replace(/\{techStack\.frontend\}/g, project.techStack?.frontend || 'React')
            .replace(/\{techStack\.backend\}/g, project.techStack?.backend || 'Firebase')
            .replace(/\{techStack\.db\}/g, project.techStack?.db || 'Firestore')
            .replace(/\{description\}/g, project.description || '')
            .replace(/\{title\}/g, project.title || '')
    }

    const handleCopy = async (promptId: string, content: string) => {
        const processedContent = substituteVariables(content)
        await navigator.clipboard.writeText(processedContent)
        setCopiedId(promptId)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const defaultPrompts: Prompt[] = [
        {
            id: '1',
            title: 'Database Schema',
            category: 'database',
            content: `Act as a Senior Database Architect.

Project: {title}
Description: {description}
Database: {techStack.db}

Task: Create a detailed database schema for this project.
Include:
- Tables and relationships
- Primary and foreign keys
- Indexes for performance
- Data types
- Sample queries

Use best practices for {techStack.db}.`
        },
        {
            id: '2',
            title: 'Backend API',
            category: 'backend',
            content: `Act as a Senior Backend Developer.

Project: {title}
Tech Stack: {techStack.backend}
Database: {techStack.db}

Task: Create a RESTful API structure for this project.
Include:
- API endpoints (CRUD operations)
- Request/Response formats
- Authentication/Authorization
- Error handling
- Validation rules

Use {techStack.backend} best practices.`
        },
        {
            id: '3',
            title: 'Frontend Components',
            category: 'frontend',
            content: `Act as a Senior Frontend Developer.

Project: {title}
Tech Stack: {techStack.frontend}

Task: Create component structure for this project.
Include:
- Main components list
- Component hierarchy
- Props interfaces
- State management approach
- Routing structure

Use {techStack.frontend} and TypeScript.`
        },
    ]

    const displayPrompts = prompts.length > 0 ? prompts : defaultPrompts

    return (
        <div className="space-y-6">
            {/* Tech Stack Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Технологический стек</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Frontend
                        </label>
                        <input
                            type="text"
                            value={project.techStack?.frontend || ''}
                            onChange={(e) => onUpdate({
                                techStack: { ...project.techStack, frontend: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="React, Vue, Angular..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Backend
                        </label>
                        <input
                            type="text"
                            value={project.techStack?.backend || ''}
                            onChange={(e) => onUpdate({
                                techStack: { ...project.techStack, backend: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Node.js, Python, Firebase..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Database
                        </label>
                        <input
                            type="text"
                            value={project.techStack?.db || ''}
                            onChange={(e) => onUpdate({
                                techStack: { ...project.techStack, db: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="PostgreSQL, MongoDB, Firestore..."
                        />
                    </div>
                </div>
            </div>

            {/* Prompts List */}
            <div className="space-y-4">
                {displayPrompts.map((prompt) => (
                    <div key={prompt.id} className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                    {prompt.title}
                                </h4>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[prompt.category]}`}>
                                    {CATEGORY_LABELS[prompt.category]}
                                </span>
                            </div>
                            <button
                                onClick={() => handleCopy(prompt.id, prompt.content)}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                {copiedId === prompt.id ? (
                                    <>
                                        <Check className="w-4 h-4" />
                                        Скопировано
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4" />
                                        Копировать
                                    </>
                                )}
                            </button>
                        </div>
                        <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 whitespace-pre-wrap">
                            {substituteVariables(prompt.content)}
                        </pre>
                    </div>
                ))}
            </div>

            {/* Add Prompt Button */}
            <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" />
                Добавить промпт
            </button>
        </div>
    )
}
