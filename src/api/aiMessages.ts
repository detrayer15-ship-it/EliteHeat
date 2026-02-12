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
import { isFirestoreBroken, markFirestoreAsBroken } from '@/config/firebase';

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
    if (isFirestoreBroken()) return null as any;

    const messageData = {
        chatId,
        userId: user.uid,
        role: 'user' as const,
        content,
        timestamp: Timestamp.now()
    };

    try {
        const docRef = await addDoc(collection(db, 'aiMessages'), messageData);
        return {
            id: docRef.id,
            ...messageData
        };
    } catch (error: any) {
        if (error?.message?.includes('INTERNAL ASSERTION FAILED')) {
            markFirestoreAsBroken(error);
        }
        throw error;
    }
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
    if (isFirestoreBroken()) return null as any;

    const messageData = {
        chatId,
        userId: user.uid,
        role: 'assistant' as const,
        content,
        meta: meta || {},
        timestamp: Timestamp.now()
    };

    try {
        const docRef = await addDoc(collection(db, 'aiMessages'), messageData);
        return {
            id: docRef.id,
            ...messageData
        };
    } catch (error: any) {
        if (error?.message?.includes('INTERNAL ASSERTION FAILED')) {
            markFirestoreAsBroken(error);
        }
        throw error;
    }
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
    if (!user || isFirestoreBroken()) {
        if (isFirestoreBroken()) console.warn("Firestore subscription blocked: SDK is in corrupted state.");
        return () => { };
    }

    try {
        const q = query(
            collection(db, 'aiMessages'),
            where('chatId', '==', chatId),
            where('userId', '==', user.uid),
            orderBy('timestamp', 'asc')
        );

        return onSnapshot(q, (snapshot: QuerySnapshot) => {
            try {
                const messages = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as AIMessage));
                callback(messages);
            } catch (innerError: any) {
                console.error("Firestore callback error:", innerError);
                if (innerError?.message?.includes('INTERNAL ASSERTION FAILED')) {
                    markFirestoreAsBroken(innerError);
                }
            }
        }, (error: any) => {
            console.warn("AI Message Listener Stream Error:", error);
            if (error?.message?.includes('INTERNAL ASSERTION FAILED')) {
                markFirestoreAsBroken(error);
            }
        });
    } catch (outerError: any) {
        console.error("Firestore subscription setup error:", outerError);
        if (outerError?.message?.includes('INTERNAL ASSERTION FAILED')) {
            markFirestoreAsBroken(outerError);
        }
        return () => { };
    }
}
