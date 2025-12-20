import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Send, ArrowLeft, Search, User as UserIcon } from 'lucide-react'
import { collection, getDocs, query, where, addDoc, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '@/config/firebase'

interface Message {
    id: string
    senderId: string
    senderName: string
    text: string
    timestamp: number
}

interface Student {
    id: string
    name: string
    email: string
    online?: boolean
}

export const StudentChatsPage = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const [students, setStudents] = useState<Student[]>([])
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)

    // Загружаем учеников
    useEffect(() => {
        const loadStudents = async () => {
            try {
                const usersRef = collection(db, 'users')
                const q = query(usersRef, where('role', '==', 'student'))
                const snapshot = await getDocs(q)

                const studentsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name || 'Без имени',
                    email: doc.data().email || '',
                    online: false
                }))

                setStudents(studentsData)
                setFilteredStudents(studentsData)
            } catch (error) {
                console.error('Ошибка загрузки учеников:', error)
            } finally {
                setLoading(false)
            }
        }

        loadStudents()
    }, [])

    // Поиск
    useEffect(() => {
        if (searchQuery) {
            const filtered = students.filter(s =>
                s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.email.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredStudents(filtered)
        } else {
            setFilteredStudents(students)
        }
    }, [searchQuery, students])

    // Загружаем сообщения при выборе ученика
    useEffect(() => {
        if (!selectedStudent || !user) return

        const chatId = [user.uid, selectedStudent.id].sort().join('_')
        const messagesRef = collection(db, 'chats', chatId, 'messages')
        const q = query(messagesRef, orderBy('timestamp', 'asc'))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Message))
            setMessages(msgs)
        })

        return () => unsubscribe()
    }, [selectedStudent, user])

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedStudent || !user) return

        try {
            const chatId = [user.uid, selectedStudent.id].sort().join('_')
            const messagesRef = collection(db, 'chats', chatId, 'messages')

            await addDoc(messagesRef, {
                senderId: user.uid,
                senderName: user.name || 'Учитель',
                text: newMessage,
                timestamp: Date.now()
            })

            setNewMessage('')
        } catch (error) {
            console.error('Ошибка отправки:', error)
        }
    }

    if (!user) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold text-red-600">Требуется авторизация</h1>
                <Button onClick={() => navigate('/login')} className="mt-4">Войти</Button>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />Назад
            </Button>

            <h1 className="text-3xl font-bold mb-6">💬 Чаты с учениками</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Список учеников */}
                <div className="lg:col-span-1">
                    <Card className="p-4">
                        <div className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Поиск ученика..."
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <h2 className="font-bold mb-4">Ученики ({filteredStudents.length})</h2>

                        {loading ? (
                            <div className="text-center py-8 text-gray-500">Загрузка...</div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">Ученики не найдены</div>
                        ) : (
                            <div className="space-y-2 max-h-[600px] overflow-y-auto">
                                {filteredStudents.map(student => (
                                    <button
                                        key={student.id}
                                        onClick={() => setSelectedStudent(student)}
                                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${selectedStudent?.id === student.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                {student.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-sm truncate">{student.name}</div>
                                                <div className="text-xs text-gray-600 truncate">{student.email}</div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Окно чата */}
                <div className="lg:col-span-2">
                    {selectedStudent ? (
                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    {selectedStudent.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{selectedStudent.name}</h2>
                                    <p className="text-sm text-gray-600">{selectedStudent.email}</p>
                                </div>
                            </div>

                            {/* Сообщения */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-4 h-96 overflow-y-auto">
                                {messages.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <div className="text-4xl mb-2">💬</div>
                                        <div>Нет сообщений</div>
                                        <div className="text-sm">Начните диалог!</div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {messages.map(msg => (
                                            <div
                                                key={msg.id}
                                                className={`p-3 rounded-lg max-w-[80%] ${msg.senderId === user.uid
                                                        ? 'ml-auto bg-blue-500 text-white'
                                                        : 'bg-white border-2 border-gray-200'
                                                    }`}
                                            >
                                                <div className="text-sm mb-1 font-medium">
                                                    {msg.senderId === user.uid ? 'Вы' : msg.senderName}
                                                </div>
                                                <div>{msg.text}</div>
                                                <div className="text-xs mt-1 opacity-70">
                                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                    ) : (
                        <Card className="p-12 text-center">
                            <div className="text-6xl mb-4">👥</div>
                            <h3 className="text-xl font-bold text-gray-700 mb-2">
                                Выберите ученика
                            </h3>
                            <p className="text-gray-500">
                                Выберите ученика слева, чтобы начать общение
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
