import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ArrowLeft, Send, Pin, Tag, AtSign, Search } from 'lucide-react'

interface Message {
    id: string
    channel: string
    author: string
    role: 'admin' | 'teacher' | 'architect'
    text: string
    timestamp: number
    tags?: string[]
    isPinned?: boolean
    linkedTo?: { type: 'student' | 'assignment' | 'course'; id: string; name: string }
    reactions?: { emoji: string; count: number }[]
}

export const AdminOpsChat = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const [selectedChannel, setSelectedChannel] = useState('general')
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            channel: 'students',
            author: 'Иван Петров',
            role: 'admin',
            text: 'Ученик Алексей не сдаёт задания уже 2 недели',
            timestamp: Date.now() - 3600000,
            tags: ['важно', 'проверка'],
            linkedTo: { type: 'student', id: '123', name: 'Алексей Иванов' },
            reactions: [{ emoji: '👍', count: 3 }]
        },
        {
            id: '2',
            channel: 'students',
            author: 'Мария Сидорова',
            role: 'teacher',
            text: 'Я с ним связалась, обещал сдать завтра',
            timestamp: Date.now() - 1800000,
            isPinned: true
        },
        {
            id: '3',
            channel: 'reviews',
            author: 'Архитектор',
            role: 'architect',
            text: 'Сложное задание по Python - нужна помощь в проверке',
            timestamp: Date.now() - 900000,
            tags: ['проверка'],
            linkedTo: { type: 'assignment', id: '456', name: 'Python: Задача 15' }
        }
    ])
    const [newMessage, setNewMessage] = useState('')
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [showMentions, setShowMentions] = useState(false)

    const channels = [
        { id: 'general', name: '💬 General', description: 'Общие вопросы' },
        { id: 'students', name: '👥 Students', description: 'Проблемные ученики' },
        { id: 'reviews', name: '📝 Reviews', description: 'Сложные задания' },
        { id: 'announcements', name: '📢 Announcements', description: 'Решения и правила' },
        { id: 'ideas', name: '💡 Ideas', description: 'Улучшения платформы' }
    ]

    const availableTags = ['бан', 'проверка', 'баг', 'важно']
    const mentions = ['@все_админы', '@учителя', '@архитектор']

    if (!user || (user.role !== 'admin' && user.role !== 'developer')) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-red-600">403 - Доступ запрещён</h1>
                <p className="mt-2">Этот чат доступен только админам.</p>
                <Button onClick={() => navigate('/dashboard')} className="mt-4">Назад</Button>
            </div>
        )
    }

    const channelMessages = messages.filter(m => m.channel === selectedChannel)
    const pinnedMessages = channelMessages.filter(m => m.isPinned)

    const handleSendMessage = () => {
        if (!newMessage.trim()) return

        const message: Message = {
            id: Date.now().toString(),
            channel: selectedChannel,
            author: user.name || 'Админ',
            role: user.role as any,
            text: newMessage,
            timestamp: Date.now(),
            tags: selectedTags.length > 0 ? selectedTags : undefined
        }

        setMessages([...messages, message])
        setNewMessage('')
        setSelectedTags([])
    }

    const togglePin = (messageId: string) => {
        setMessages(messages.map(m =>
            m.id === messageId ? { ...m, isPinned: !m.isPinned } : m
        ))
    }

    const addReaction = (messageId: string, emoji: string) => {
        setMessages(messages.map(m => {
            if (m.id === messageId) {
                const reactions = m.reactions || []
                const existing = reactions.find(r => r.emoji === emoji)
                if (existing) {
                    existing.count++
                } else {
                    reactions.push({ emoji, count: 1 })
                }
                return { ...m, reactions }
            }
            return m
        }))
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />Назад к админ панели
            </Button>

            <h1 className="text-3xl font-bold mb-6">👥 Admin Ops Chat</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Каналы */}
                <div className="lg:col-span-1">
                    <Card className="p-4">
                        <h2 className="font-bold mb-4">Каналы</h2>
                        <div className="space-y-2">
                            {channels.map(channel => (
                                <button
                                    key={channel.id}
                                    onClick={() => setSelectedChannel(channel.id)}
                                    className={`w-full text-left p-3 rounded-lg transition-all ${selectedChannel === channel.id
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                >
                                    <div className="font-bold text-sm">{channel.name}</div>
                                    <div className={`text-xs mt-1 ${selectedChannel === channel.id ? 'text-blue-100' : 'text-gray-600'
                                        }`}>
                                        {channel.description}
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Быстрые упоминания */}
                        <div className="mt-6">
                            <h3 className="font-bold text-sm mb-2">Упоминания</h3>
                            <div className="space-y-1">
                                {mentions.map(mention => (
                                    <button
                                        key={mention}
                                        onClick={() => setNewMessage(newMessage + ' ' + mention)}
                                        className="w-full text-left px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                                    >
                                        {mention}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Чат */}
                <div className="lg:col-span-3">
                    {/* Закреплённые сообщения */}
                    {pinnedMessages.length > 0 && (
                        <Card className="p-4 mb-4 bg-yellow-50 border-2 border-yellow-300">
                            <div className="flex items-center gap-2 mb-3">
                                <Pin className="w-5 h-5 text-yellow-600" />
                                <h3 className="font-bold text-yellow-900">Закреплённые решения</h3>
                            </div>
                            <div className="space-y-2">
                                {pinnedMessages.map(msg => (
                                    <div key={msg.id} className="p-3 bg-white rounded-lg border border-yellow-200">
                                        <div className="font-bold text-sm">{msg.author}</div>
                                        <div className="text-sm mt-1">{msg.text}</div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Сообщения */}
                    <Card className="p-6 mb-4">
                        <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto mb-4">
                            <div className="space-y-4">
                                {channelMessages.map(msg => (
                                    <div key={msg.id} className="bg-white p-4 rounded-lg border-2 border-gray-200">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <span className="font-bold">{msg.author}</span>
                                                <span className={`ml-2 text-xs px-2 py-0.5 rounded ${msg.role === 'architect' ? 'bg-red-100 text-red-700' :
                                                    msg.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-blue-100 text-blue-700'
                                                    }`}>
                                                    {msg.role === 'architect' ? 'Архитектор' :
                                                        msg.role === 'admin' ? 'Админ' : 'Учитель'}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => togglePin(msg.id)}
                                                    className={`p-1 rounded ${msg.isPinned ? 'text-yellow-600' : 'text-gray-400 hover:text-gray-600'}`}
                                                >
                                                    <Pin className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-2">{msg.text}</div>

                                        {/* Теги */}
                                        {msg.tags && msg.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {msg.tags.map(tag => (
                                                    <span key={tag} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Связь */}
                                        {msg.linkedTo && (
                                            <div className="p-2 bg-gray-100 rounded text-sm mb-2">
                                                <span className="font-medium">Связано с:</span>{' '}
                                                <span className="text-blue-600">{msg.linkedTo.name}</span>
                                            </div>
                                        )}

                                        {/* Реакции */}
                                        <div className="flex gap-2 items-center">
                                            {msg.reactions?.map((reaction, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => addReaction(msg.id, reaction.emoji)}
                                                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                                                >
                                                    {reaction.emoji} {reaction.count}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => addReaction(msg.id, '👍')}
                                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <div className="text-xs text-gray-500 mt-2">
                                            {new Date(msg.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Теги */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Tag className="w-4 h-4 inline mr-1" />
                                Теги:
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {availableTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => {
                                            if (selectedTags.includes(tag)) {
                                                setSelectedTags(selectedTags.filter(t => t !== tag))
                                            } else {
                                                setSelectedTags([...selectedTags, tag])
                                            }
                                        }}
                                        className={`px-3 py-1 rounded-lg text-sm transition-all ${selectedTags.includes(tag)
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                    >
                                        #{tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Ввод */}
                        <div className="flex gap-3">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Введите сообщение..."
                                className="flex-1"
                            />
                            <Button onClick={handleSendMessage}>
                                <Send className="w-4 h-4 mr-2" />
                                Отправить
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
