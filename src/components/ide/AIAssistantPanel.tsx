import React, { useState } from 'react'
import { Sparkles, Terminal, Send, Search, Loader2 } from 'lucide-react'
import type { Project } from '@/types/project'

interface AIAssistantPanelProps {
    project: Project
    currentFile: string
    currentCode: string
}

export const AIAssistantPanel = ({ project, currentFile, currentCode }: AIAssistantPanelProps) => {
    const [messages, setMessages] = useState<any[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        setMessages(prev => [...prev, { role: 'user', content: input }])
        setInput('')
        setIsLoading(true)

        // Simulate AI thinking and analyzing code
        setTimeout(() => {
            let response = "Я проанализировал текущий файл и проект. Код выглядит хорошо! Могу ли я помочь с рефакторингом или добавлением новых функций?"

            if (input.toLowerCase().includes('ошибк') || input.toLowerCase().includes('баг')) {
                response = "Я проверил код на наличие типичных ошибок. Похоже, в этом файле нет критических багов, но можно оптимизировать импорты."
            } else if (input.toLowerCase().includes('как')) {
                response = `Для работы с ${currentFile} я рекомендую использовать стандартные паттерны React. Вы уже добавили основную логику, можно расширить её обработкой ошибок.`
            }

            setMessages(prev => [...prev, { role: 'assistant', content: response }])
            setIsLoading(false)
        }, 1500)
    }

    return (
        <div className="h-full flex flex-col bg-[#252526] text-gray-300">
            <div className="p-4 border-b border-[#3e3e42] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold uppercase tracking-wider">AI Ассистент</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center space-y-4 py-8">
                        <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-sm font-bold text-white">Чем я могу помочь?</h3>
                        <p className="text-xs text-gray-500">
                            Я могу объяснить код, найти ошибки или написать за вас компоненты.
                        </p>

                        <div className="grid grid-cols-1 gap-2 pt-4">
                            {[
                                "Объясни этот код",
                                "Найди ошибки в файле",
                                "Как мне продолжить проект?"
                            ].map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => setInput(q)}
                                    className="p-2 text-[10px] bg-[#2d2d30] hover:bg-[#3e3e42] rounded border border-[#3e3e42] transition-colors text-left"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] p-3 rounded-xl text-xs ${msg.role === 'user'
                                ? 'bg-purple-600 text-white rounded-tr-none'
                                : 'bg-[#2d2d30] text-gray-200 rounded-tl-none border border-[#3e3e42]'
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Ассистент анализирует код...
                    </div>
                )}
            </div>

            <div className="p-4 bg-[#1e1e1e] border-t border-[#3e3e42]">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Задайте вопрос по коду..."
                        className="w-full bg-[#2d2d30] border border-[#3e3e42] rounded-lg py-2 pl-3 pr-10 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none placeholder:text-gray-600"
                    />
                    <button
                        onClick={handleSend}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-400 p-1"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}
