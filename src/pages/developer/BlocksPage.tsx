import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Ban, Unlock } from 'lucide-react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/config/firebase'

interface BlockedUser {
    id: string
    user: string
    email: string
    reason: string
    date: string
    active: boolean
}

export const BlocksPage = () => {
    const navigate = useNavigate()
    const [blocks, setBlocks] = useState<BlockedUser[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const usersRef = collection(db, 'users')
                const snapshot = await getDocs(usersRef)

                const usersData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    user: doc.data().name || 'Без имени',
                    email: doc.data().email || '',
                    reason: doc.data().blockReason || 'Нет причины',
                    date: doc.data().blockDate || new Date().toISOString().split('T')[0],
                    active: doc.data().blocked || false
                }))

                setBlocks(usersData)
            } catch (error) {
                console.error('Ошибка загрузки пользователей:', error)
            } finally {
                setLoading(false)
            }
        }

        loadUsers()
    }, [])

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/developer/panel')} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />Назад
            </Button>

            <h1 className="text-3xl font-bold mb-6">🚫 Блокировки</h1>

            <Card className="p-6">
                <div className="space-y-4">
                    {blocks.map(block => (
                        <div key={block.id} className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
                            <div>
                                <div className="font-bold">{block.user}</div>
                                <div className="text-sm text-gray-600">{block.email}</div>
                                <div className="text-sm text-red-600">Причина: {block.reason}</div>
                                <div className="text-xs text-gray-500">Дата: {block.date}</div>
                            </div>
                            <div className="flex gap-2">
                                {block.active ? (
                                    <Button size="sm" className="bg-green-600">
                                        <Unlock className="w-4 h-4 mr-1" />Разблокировать
                                    </Button>
                                ) : (
                                    <Button size="sm" className="bg-red-600">
                                        <Ban className="w-4 h-4 mr-1" />Заблокировать
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
