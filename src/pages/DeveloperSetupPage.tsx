import { useEffect, useState } from 'react'
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/config/firebase'

export const DeveloperSetupPage = () => {
    const [status, setStatus] = useState('⏳ Установка роли developer...')

    useEffect(() => {
        setupDeveloper()
    }, [])

    const setupDeveloper = async () => {
        try {
            const email = 'detrayer15@gmail.com'

            const usersRef = collection(db, 'users')
            const q = query(usersRef, where('email', '==', email))
            const snapshot = await getDocs(q)

            if (snapshot.empty) {
                setStatus('❌ Пользователь не найден. Сначала зарегистрируйтесь!')
                return
            }

            const userDoc = snapshot.docs[0]
            const userRef = doc(db, 'users', userDoc.id)

            await updateDoc(userRef, {
                role: 'developer',
                adminPoints: 9999,
                permissions: {
                    fullAccess: true,
                    canManageUsers: true,
                    canManageRoles: true,
                    canAccessAllPages: true
                }
            })

            setStatus('✅ Роль DEVELOPER установлена! Перезагрузите страницу.')
        } catch (error: any) {
            console.error(error)
            setStatus('❌ Ошибка: ' + (error?.message || 'Неизвестная ошибка'))
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600">
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full text-center">
                <h1 className="text-3xl font-bold mb-4">🔧 Developer Setup</h1>
                <p className="text-lg mb-6">{status}</p>
                <div className="text-sm text-gray-600">
                    <p>Email: detrayer15@gmail.com</p>
                    <p>Role: Developer</p>
                    <p>Points: 9999</p>
                </div>
            </div>
        </div>
    )
}
