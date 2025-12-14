import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { Users, Plus, Edit, Trash2, UserPlus, X } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'

interface Group {
    id: string
    name: string
    description: string
    studentIds: string[]
    createdAt: any
}

interface Student {
    id: string
    name: string
    email: string
}

export const AdminGroupsPage = () => {
    const navigate = useNavigate()
    const currentUser = useAuthStore((state) => state.user)
    const [groups, setGroups] = useState<Group[]>([])
    const [students, setStudents] = useState<Student[]>([])
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [editingGroup, setEditingGroup] = useState<Group | null>(null)
    const [newGroupName, setNewGroupName] = useState('')
    const [newGroupDescription, setNewGroupDescription] = useState('')
    const [selectedStudents, setSelectedStudents] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    // Проверка доступа
    if (currentUser?.role !== 'admin' && currentUser?.role !== 'developer') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                    <div className="text-6xl mb-4">🔒</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Доступ запрещён</h1>
                    <p className="text-gray-600 mb-6">
                        Эта страница доступна только администраторам
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        На главную
                    </button>
                </div>
            </div>
        )
    }

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            // Load groups
            const groupsRef = collection(db, 'groups')
            const groupsSnapshot = await getDocs(groupsRef)
            const groupsData = groupsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Group[]
            setGroups(groupsData)

            // Load students
            const usersRef = collection(db, 'users')
            const usersSnapshot = await getDocs(usersRef)
            const studentsData = usersSnapshot.docs
                .filter(doc => doc.data().role === 'student')
                .map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    email: doc.data().email
                })) as Student[]
            setStudents(studentsData)

            setLoading(false)
        } catch (error) {
            console.error('Error loading data:', error)
            setLoading(false)
        }
    }

    const handleCreateGroup = async () => {
        if (!newGroupName.trim()) return

        try {
            await addDoc(collection(db, 'groups'), {
                name: newGroupName,
                description: newGroupDescription,
                studentIds: selectedStudents,
                createdAt: new Date()
            })

            setNewGroupName('')
            setNewGroupDescription('')
            setSelectedStudents([])
            setShowCreateModal(false)
            loadData()
        } catch (error) {
            console.error('Error creating group:', error)
            alert('Ошибка при создании группы')
        }
    }

    const handleUpdateGroup = async () => {
        if (!editingGroup || !newGroupName.trim()) return

        try {
            await updateDoc(doc(db, 'groups', editingGroup.id), {
                name: newGroupName,
                description: newGroupDescription,
                studentIds: selectedStudents
            })

            setEditingGroup(null)
            setNewGroupName('')
            setNewGroupDescription('')
            setSelectedStudents([])
            loadData()
        } catch (error) {
            console.error('Error updating group:', error)
            alert('Ошибка при обновлении группы')
        }
    }

    const handleDeleteGroup = async (groupId: string) => {
        if (!confirm('Вы уверены, что хотите удалить эту группу?')) return

        try {
            await deleteDoc(doc(db, 'groups', groupId))
            loadData()
        } catch (error) {
            console.error('Error deleting group:', error)
            alert('Ошибка при удалении группы')
        }
    }

    const openEditModal = (group: Group) => {
        setEditingGroup(group)
        setNewGroupName(group.name)
        setNewGroupDescription(group.description)
        setSelectedStudents(group.studentIds || [])
    }

    const closeModal = () => {
        setShowCreateModal(false)
        setEditingGroup(null)
        setNewGroupName('')
        setNewGroupDescription('')
        setSelectedStudents([])
    }

    const toggleStudent = (studentId: string) => {
        if (selectedStudents.includes(studentId)) {
            setSelectedStudents(selectedStudents.filter(id => id !== studentId))
        } else {
            setSelectedStudents([...selectedStudents, studentId])
        }
    }

    const getStudentName = (studentId: string) => {
        const student = students.find(s => s.id === studentId)
        return student?.name || 'Неизвестный'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                Управление группами
                            </h1>
                            <p className="text-gray-600">Всего групп: {groups.length}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Создать группу
                    </button>
                </div>

                {/* Groups Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">⏳</div>
                        <p className="text-gray-600">Загрузка групп...</p>
                    </div>
                ) : groups.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                        <div className="text-6xl mb-4">📚</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Нет групп</h3>
                        <p className="text-gray-600 mb-6">Создайте первую группу учеников</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                        >
                            Создать группу
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groups.map((group) => (
                            <div
                                key={group.id}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border-2 border-gray-100"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                                        <p className="text-sm text-gray-600 mb-4">{group.description}</p>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                        <Users className="w-4 h-4" />
                                        <span>Учеников: {group.studentIds?.length || 0}</span>
                                    </div>
                                    {group.studentIds && group.studentIds.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {group.studentIds.slice(0, 3).map(studentId => (
                                                <span
                                                    key={studentId}
                                                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs"
                                                >
                                                    {getStudentName(studentId)}
                                                </span>
                                            ))}
                                            {group.studentIds.length > 3 && (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
                                                    +{group.studentIds.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(group)}
                                        className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Изменить
                                    </button>
                                    <button
                                        onClick={() => handleDeleteGroup(group.id)}
                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create/Edit Modal */}
                {(showCreateModal || editingGroup) && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {editingGroup ? 'Редактировать группу' : 'Создать группу'}
                                </h2>
                                <button
                                    onClick={closeModal}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Название группы
                                    </label>
                                    <input
                                        type="text"
                                        value={newGroupName}
                                        onChange={(e) => setNewGroupName(e.target.value)}
                                        placeholder="Например: Группа Python 2024"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Описание
                                    </label>
                                    <textarea
                                        value={newGroupDescription}
                                        onChange={(e) => setNewGroupDescription(e.target.value)}
                                        placeholder="Краткое описание группы..."
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ученики ({selectedStudents.length} выбрано)
                                    </label>
                                    <div className="border border-gray-300 rounded-xl p-4 max-h-64 overflow-y-auto space-y-2">
                                        {students.map((student) => (
                                            <label
                                                key={student.id}
                                                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedStudents.includes(student.id)}
                                                    onChange={() => toggleStudent(student.id)}
                                                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">{student.name}</div>
                                                    <div className="text-sm text-gray-600">{student.email}</div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-200 flex gap-3">
                                <button
                                    onClick={closeModal}
                                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                                >
                                    Отмена
                                </button>
                                <button
                                    onClick={editingGroup ? handleUpdateGroup : handleCreateGroup}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                                >
                                    {editingGroup ? 'Сохранить' : 'Создать'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
