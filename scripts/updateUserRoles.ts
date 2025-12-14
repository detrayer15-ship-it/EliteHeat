/**
 * Скрипт для изменения ролей пользователей в Firebase
 * 
 * ИНСТРУКЦИЯ:
 * 1. Замените EMAIL_ADDRESSES на нужные email'ы
 * 2. Запустите этот файл: node scripts/updateUserRoles.js
 * 3. Или вызовите функцию из консоли браузера
 */

import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../src/config/firebase'

// ✏️ ЗАМЕНИТЕ НА НУЖНЫЕ EMAIL'Ы
const ADMIN_EMAILS = [
    'admin@example.com',
    'your-email@gmail.com',
    // Добавьте сюда email'ы администраторов
]

/**
 * Обновить роли пользователей на admin
 */
export async function updateUserRolesToAdmin() {
    console.log('🔄 Начинаем обновление ролей...')

    try {
        for (const email of ADMIN_EMAILS) {
            // Найти пользователя по email
            const usersRef = collection(db, 'users')
            const q = query(usersRef, where('email', '==', email))
            const querySnapshot = await getDocs(q)

            if (querySnapshot.empty) {
                console.log(`❌ Пользователь не найден: ${email}`)
                continue
            }

            // Обновить роль
            querySnapshot.forEach(async (userDoc) => {
                const userRef = doc(db, 'users', userDoc.id)
                await updateDoc(userRef, {
                    role: 'admin',
                    updatedAt: new Date().toISOString()
                })
                console.log(`✅ Роль обновлена для: ${email}`)
            })
        }

        console.log('🎉 Все роли обновлены!')
    } catch (error) {
        console.error('❌ Ошибка при обновлении ролей:', error)
    }
}

/**
 * Показать всех пользователей с их ролями
 */
export async function listAllUsers() {
    console.log('📋 Список всех пользователей:')

    try {
        const usersRef = collection(db, 'users')
        const querySnapshot = await getDocs(usersRef)

        querySnapshot.forEach((doc) => {
            const user = doc.data()
            console.log(`
                Email: ${user.email}
                Роль: ${user.role || 'student'}
                Имя: ${user.name || 'Не указано'}
                ID: ${doc.id}
            `)
        })
    } catch (error) {
        console.error('❌ Ошибка при получении пользователей:', error)
    }
}

// Если запускаете напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log('🚀 Запуск скрипта обновления ролей...')
    await listAllUsers()
    await updateUserRolesToAdmin()
}
