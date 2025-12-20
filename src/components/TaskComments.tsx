import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface Comment {
    id: string
    author: string
    role: 'student' | 'teacher'
    text: string
    timestamp: number
}

interface TaskCommentsProps {
    taskId: string
    studentId?: string
}

export const TaskComments = ({ taskId, studentId = 'current-user' }: TaskCommentsProps) => {
    const [comments, setComments] = useState<Comment[]>(() => {
        const saved = localStorage.getItem(`task_comments_${taskId}_${studentId}`)
        return saved ? JSON.parse(saved) : []
    })
    const [newComment, setNewComment] = useState('')

    const handleAddComment = () => {
        if (!newComment.trim()) return

        const comment: Comment = {
            id: Date.now().toString(),
            author: 'Вы',
            role: 'student',
            text: newComment,
            timestamp: Date.now()
        }

        const updated = [...comments, comment]
        setComments(updated)
        localStorage.setItem(`task_comments_${taskId}_${studentId}`, JSON.stringify(updated))
        setNewComment('')
    }

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return 'только что'
        if (minutes < 60) return `${minutes} мин назад`
        if (hours < 24) return `${hours} ч назад`
        return `${days} дн назад`
    }

    return (
        <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
                💬 Комментарии к заданию
                <span className="text-sm text-gray-500 font-normal">({comments.length})</span>
            </h3>

            {/* Список комментариев */}
            <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                {comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                        <div className="text-4xl mb-2">💭</div>
                        <p className="text-sm">Пока нет комментариев</p>
                        <p className="text-xs mt-1">Будьте первым, кто оставит комментарий!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <Card key={comment.id} className="p-4">
                            <div className="flex items-start gap-3">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${comment.role === 'teacher'
                                        ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                                        : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                                    }`}>
                                    {comment.role === 'teacher' ? '👨‍🏫' : '👨‍🎓'}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-sm text-gray-800">
                                            {comment.author}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${comment.role === 'teacher'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {comment.role === 'teacher' ? 'Учитель' : 'Ученик'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {formatTime(comment.timestamp)}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                        {comment.text}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Форма добавления комментария */}
            <div className="space-y-3">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Напишите комментарий или задайте вопрос по заданию..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    rows={3}
                />
                <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                        💡 Комментарий будет виден вам и учителю
                    </p>
                    <Button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        size="sm"
                    >
                        Отправить комментарий
                    </Button>
                </div>
            </div>
        </div>
    )
}
