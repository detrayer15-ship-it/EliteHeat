import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Shield, Check, X } from 'lucide-react'

export const AccessMatrixPage = () => {
    const navigate = useNavigate()

    const roles = ['student', 'admin', 'developer']
    const permissions = [
        { name: 'Просмотр курсов', student: true, admin: true, developer: true },
        { name: 'Создание курсов', student: false, admin: true, developer: true },
        { name: 'Проверка заданий', student: false, admin: true, developer: true },
        { name: 'Управление пользователями', student: false, admin: true, developer: true },
        { name: 'Блокировка пользователей', student: false, admin: true, developer: true },
        { name: 'Developer Panel', student: false, admin: false, developer: true },
        { name: 'Feature Flags', student: false, admin: false, developer: true },
    ]

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Button variant="ghost" onClick={() => navigate('/developer/panel')} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />Назад
            </Button>

            <h1 className="text-3xl font-bold mb-6">🛡️ Матрица доступов</h1>

            <Card className="p-6 overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b-2">
                            <th className="text-left p-3">Разрешение</th>
                            {roles.map(role => (
                                <th key={role} className="text-center p-3 capitalize">{role}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {permissions.map((perm, i) => (
                            <tr key={i} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{perm.name}</td>
                                <td className="text-center p-3">
                                    {perm.student ? <Check className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-red-600 mx-auto" />}
                                </td>

                                <td className="text-center p-3">
                                    {perm.admin ? <Check className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-red-600 mx-auto" />}
                                </td>
                                <td className="text-center p-3">
                                    {perm.developer ? <Check className="w-5 h-5 text-green-600 mx-auto" /> : <X className="w-5 h-5 text-red-600 mx-auto" />}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    )
}
