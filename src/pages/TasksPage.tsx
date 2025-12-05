import { useState } from 'react'
import { PythonTasksPage } from './PythonTasksPage'
import { FigmaTasksPage } from './FigmaTasksPage'

export const TasksPage = () => {
    const [activeTab, setActiveTab] = useState<'python' | 'figma'>('python')

    return (
        <div>
            <h1 className="text-3xl font-bold text-text mb-6">Курсы</h1>

            <div className="flex gap-2 mb-6 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('python')}
                    className={`px-6 py-3 font-semibold transition-smooth ${activeTab === 'python'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-600 hover:text-primary'
                        }`}
                >
                    🐍 Python
                </button>
                <button
                    onClick={() => setActiveTab('figma')}
                    className={`px-6 py-3 font-semibold transition-smooth ${activeTab === 'figma'
                        ? 'text-primary border-b-2 border-primary'
                        : 'text-gray-600 hover:text-primary'
                        }`}
                >
                    🎨 Figma
                </button>
            </div>

            {activeTab === 'python' && <PythonTasksPage />}
            {activeTab === 'figma' && <FigmaTasksPage />}
        </div>
    )
}
