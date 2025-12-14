/**
 * Скрипт для установки роли DEVELOPER для главного разработчика
 * 
 * Email: detrayer15@gmail.com
 * Роль: developer (полный доступ ко всему)
 */

import { collection, query, where, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore'
import { db } from '../src/config/firebase'

const DEVELOPER_EMAIL = 'detrayer15@gmail.com'

/**
 * Установить роль разработчика
 */
export async function setDeveloperRole() {
    console.log('🔧 Установка роли разработчика...')

    try {
        // Найти пользователя по email
        const usersRef = collection(db, 'users')
        const q = query(usersRef, where('email', '==', DEVELOPER_EMAIL))
        const querySnapshot = await getDocs(q)

        if (querySnapshot.empty) {
            console.log('❌ Пользователь не найден. Создаём нового...')

            // Создать нового пользователя с ролью developer
            const newUserRef = doc(collection(db, 'users'))
            await setDoc(newUserRef, {
                email: DEVELOPER_EMAIL,
                role: 'developer',
                name: 'Main Developer',
                adminPoints: 9999,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                permissions: {
                    fullAccess: true,
                    canManageUsers: true,
                    canManageRoles: true,
                    canAccessAllPages: true,
                    canModifyDatabase: true,
                    canViewAnalytics: true,
                    canManageSubscriptions: true,
                }
            })

            console.log('✅ Новый пользователь создан с ролью DEVELOPER')
            return
        }

        // Обновить существующего пользователя
        for (const userDoc of querySnapshot.docs) {
            const userRef = doc(db, 'users', userDoc.id)
            await updateDoc(userRef, {
                role: 'developer',
                adminPoints: 9999,
                updatedAt: new Date().toISOString(),
                permissions: {
                    fullAccess: true,
                    canManageUsers: true,
                    canManageRoles: true,
                    canAccessAllPages: true,
                    canModifyDatabase: true,
                    canViewAnalytics: true,
                    canManageSubscriptions: true,
                }
            })

            console.log('✅ Роль DEVELOPER установлена для:', DEVELOPER_EMAIL)
            console.log('🏆 Ранг: Архитектор (9999 очков)')
            console.log('🔓 Полный доступ ко всем функциям')
        }
    } catch (error) {
        console.error('❌ Ошибка:', error)
    }
}

// Запустить
setDeveloperRole()
