import { db, auth } from '@/config/firebase';
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    Timestamp
} from 'firebase/firestore';

export type ChatMode = 'tutor' | 'developer' | 'debug' | 'product';

export interface AIChat {
    id: string;
    userId: string;
    title: string;
    mode: ChatMode;
    timestamp: Timestamp;
    updatedAt: Timestamp;
}

/**
 * Create new AI chat in Firestore
 */
export async function createAIChat(title: string, mode: ChatMode = 'tutor'): Promise<AIChat> {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const chatData = {
        userId: user.uid,
        title,
        mode,
        timestamp: Timestamp.now(),
        updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'aiChats'), chatData);

    return {
        id: docRef.id,
        ...chatData
    };
}

/**
 * Get user's AI chats (sorted by most recent)
 */
export async function getUserAIChats(): Promise<AIChat[]> {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const q = query(
        collection(db, 'aiChats'),
        where('userId', '==', user.uid),
        orderBy('updatedAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as AIChat));
}

/**
 * Update AI chat title
 */
export async function updateAIChatTitle(chatId: string, title: string): Promise<void> {
    const chatRef = doc(db, 'aiChats', chatId);
    await updateDoc(chatRef, {
        title,
        updatedAt: Timestamp.now()
    });
}

/**
 * Update AI chat's updatedAt timestamp
 */
export async function touchAIChat(chatId: string): Promise<void> {
    const chatRef = doc(db, 'aiChats', chatId);
    await updateDoc(chatRef, {
        updatedAt: Timestamp.now()
    });
}

/**
 * Delete AI chat and all its messages
 */
export async function deleteAIChat(chatId: string): Promise<void> {
    const user = auth.currentUser;

    // Delete all messages first
    const messagesQuery = query(
        collection(db, 'aiMessages'),
        where('chatId', '==', chatId),
        where('userId', '==', user?.uid)
    );
    const messagesSnapshot = await getDocs(messagesQuery);

    const deletePromises = messagesSnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Delete chat
    await deleteDoc(doc(db, 'aiChats', chatId));
}
