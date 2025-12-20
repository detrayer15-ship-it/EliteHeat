import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, Send, Tag, Star, Clock } from 'lucide-react'

interface Chat {
    id: string
    student: string
    lastMessage: string
    tag: 'question' | 'bug' | 'learning' | null
    priority: boolean
    unread: number
    time: string
}

export const EnhancedChatPage = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const [chats] = useState<Chat[]>([
        { id: '1', student: 'Иван', lastMessage: 'Как решить задачу 5?', tag: 'question', priority: true, unread: 3, time: '5 мин' },
        { id: '2', student: 'Мария', lastMessage: 'Ошибка в коде...', tag: 'bug', priority: true, unread: 1, time: '10 мин' },
        { id: '3', student: 'Алексей', lastMessage: 'Спасибо за помощь!', tag: 'learning', priority: false, unread: 0, time: '1 ч' }
    ])
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
    const [message, setMessage] = useState('')

    const faqTemplates = [
        'Посмотрите видео-урок по этой теме',
        'Проверьте синтаксис кода',
        'Попробуйте перезапустить проект'
    ]

    if (!user || user.role !== 'admin') {
        return <div className="p-6"><h1 className="text-2xl font-bold text-red-600">403</h1></div>
    }

    const tagColors = {
        question: 'bg-blue-100 text-blue-700',
        bug: 'bg-red-100 text-red-700',
        learning: 'bg-green-100 text-green-700'
    }

    const tagLabels = {
        question: '❓ Вопрос',
        bug: '🐛 Баг',
        learning: '📚 Обучение'
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />Назад
            </Button>

            <h1 className="text-3xl font-bold mb-6">💬 Улучшенный чат</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Список чатов */}
                <Card className="p-4 lg:col-span-1">
                    <h2 className="font-bold mb-4">Чаты ({chats.length})</h2>
                    <div className="space-y-2">
                        {chats.map(chat => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${selectedChat?.id === chat.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="font-bold">{chat.student}</div>
                                    {chat.priority && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                                </div>
                                <div className="text-sm text-gray-600 mb-2">{chat.lastMessage}</div>
                                <div className="flex items-center justify-between">
                                    {chat.tag && (
                                        <span className={`text-xs px-2 py-0.5 rounded font-bold ${tagColors[chat.tag]}`}>
                                            {tagLabels[chat.tag]}
                                        </span>
                                    )}
                                    <div className="flex items-center gap-2">
                                        {chat.unread > 0 && (
                                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                                {chat.unread}
                                            </span>
                                        )}
                                        <span className="text-xs text-gray-500">{chat.time}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Окно чата */}
                <Card className="p-6 lg:col-span-2">
                    {selectedChat ? (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">{selectedChat.student}</h2>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="secondary">
                                        <Tag className="w-4 h-4 mr-2" />
                                        Теги
                                    </Button>
                                    <Button size="sm" variant="secondary">
                                        <Clock className="w-4 h-4 mr-2" />
                                        История
                                    </Button>
                                </div>
                            </div>

                            {/* Быстрые ответы */}
                            <div className="mb-4">
                                <div className="text-sm font-medium text-gray-700 mb-2">💬 Быстрые ответы (FAQ):</div>
                                <div className="flex flex-wrap gap-2">
                                    {faqTemplates.map((template, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setMessage(template)}
                                            className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300"
                                        >
                                            {template}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Сообщения */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-4 h-64 overflow-y-auto">
                                <div className="space-y-3">
                                    <div className="bg-blue-100 p-3 rounded-lg max-w-[80%]">
                                        <div className="text-sm">{selectedChat.lastMessage}</div>
                                        <div className="text-xs text-gray-500 mt-1">{selectedChat.time}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Ввод */}
                            <div className="flex gap-3">
                                <Input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Введите сообщение..."
                                    className="flex-1"
                                />
                                <Button>
                                    <Send className="w-4 h-4 mr-2" />
                                    Отправить
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Выберите чат
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
