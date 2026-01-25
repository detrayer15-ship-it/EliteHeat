import { db, auth } from '@/config/firebase';
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    onSnapshot,
    Timestamp,
    QuerySnapshot
} from 'firebase/firestore';

export interface AIMessage {
    id: string;
    chatId: string;
    userId: string;
    role: 'user' | 'assistant';
    content: string;
    meta?: {
        model?: string;
        inputTokens?: number;
        outputTokens?: number;
        latencyMs?: number;
    };
    timestamp: Timestamp;
}

/**
 * Add user message to Firestore
 */
export async function addUserMessage(chatId: string, content: string): Promise<AIMessage> {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const messageData = {
        chatId,
        userId: user.uid,
        role: 'user' as const,
        content,
        timestamp: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'aiMessages'), messageData);

    return {
        id: docRef.id,
        ...messageData
    };
}

/**
 * Add assistant message to Firestore
 */
export async function addAssistantMessage(
    chatId: string,
    content: string,
    meta?: AIMessage['meta']
): Promise<AIMessage> {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const messageData = {
        chatId,
        userId: user.uid,
        role: 'assistant' as const,
        content,
        meta: meta || {},
        timestamp: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'aiMessages'), messageData);

    return {
        id: docRef.id,
        ...messageData
    };
}

/**
 * Get chat messages (one-time fetch)
 */
export async function getAIChatMessages(chatId: string): Promise<AIMessage[]> {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const q = query(
        collection(db, 'aiMessages'),
        where('chatId', '==', chatId),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'asc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as AIMessage));
}

/**
 * Subscribe to chat messages (real-time updates)
 */
export function subscribeToAIChatMessages(
    chatId: string,
    callback: (messages: AIMessage[]) => void
): () => void {
    const user = auth.currentUser;
    if (!user) {
        console.error("Not authenticated for subscription");
        return () => { };
    }

    const q = query(
        collection(db, 'aiMessages'),
        where('chatId', '==', chatId),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (snapshot: QuerySnapshot) => {
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as AIMessage));
        callback(messages);
    }, (error) => {
        console.error("AI Message Listener Error:", error);
    });
}
