import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
  updateDoc,
  doc,
  or,
  and
} from 'firebase/firestore'
import { db } from '@/config/firebase'

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string | null
  senderRole: 'student' | 'admin'
  receiverRole: 'student' | 'admin'
  senderName: string
  message: string
  timestamp: any
  isRead: boolean
}

export const chatAPI = {
  // Send message
  sendMessage: async (
    senderId: string,
    senderName: string,
    senderRole: 'student' | 'admin',
    receiverId: string | null,
    receiverRole: 'student' | 'admin',
    message: string
  ) => {
    try {
      await addDoc(collection(db, 'messages'), {
        senderId,
        senderName,
        senderRole,
        receiverId,
        receiverRole,
        message,
        timestamp: Timestamp.now(),
        isRead: false
      })

      return { success: true }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  },

  // Get messages between two users
  getMessages: async (user1Id: string, user2Id: string | null) => {
    try {
      const messagesRef = collection(db, 'messages')
      let q

      if (user2Id === null) {
        // Student-Mentor chat (receiverId = null)
        q = query(
          messagesRef,
          or(
            and(where('senderId', '==', user1Id), where('receiverId', '==', null)),
            and(where('receiverId', '==', user1Id), where('senderId', '!=', user1Id))
          ),
          orderBy('timestamp', 'asc')
        )
      } else {
        // Direct chat
        q = query(
          messagesRef,
          or(
            and(where('senderId', '==', user1Id), where('receiverId', '==', user2Id)),
            and(where('senderId', '==', user2Id), where('receiverId', '==', user1Id))
          ),
          orderBy('timestamp', 'asc')
        )
      }

      const snapshot = await getDocs(q)
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[]

      return { success: true, data: messages }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  },

  // Listen to messages (real-time)
  listenToMessages: (user1Id: string, user2Id: string | null, callback: (messages: ChatMessage[]) => void) => {
    const messagesRef = collection(db, 'messages')
    let q

    if (user2Id === null) {
      // Student-Mentor: messages where student sent OR admin sent to this student
      q = query(
        messagesRef,
        orderBy('timestamp', 'asc')
      )
    } else {
      // Direct chat
      q = query(
        messagesRef,
        orderBy('timestamp', 'asc')
      )
    }

    return onSnapshot(q, (snapshot) => {
      let messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[]

      // Filter in memory for complex queries
      if (user2Id === null) {
        messages = messages.filter(msg =>
          (msg.senderId === user1Id && msg.receiverId === null) ||
          (msg.receiverId === user1Id && msg.senderRole === 'admin')
        )
      } else {
        messages = messages.filter(msg =>
          (msg.senderId === user1Id && msg.receiverId === user2Id) ||
          (msg.senderId === user2Id && msg.receiverId === user1Id)
        )
      }

      callback(messages)
    })
  },

  // Mark messages as read
  markAsRead: async (userId: string, otherUserId: string | null) => {
    try {
      const messagesRef = collection(db, 'messages')
      let q

      if (otherUserId === null) {
        q = query(
          messagesRef,
          where('receiverId', '==', userId),
          where('isRead', '==', false)
        )
      } else {
        q = query(
          messagesRef,
          where('senderId', '==', otherUserId),
          where('receiverId', '==', userId),
          where('isRead', '==', false)
        )
      }

      const snapshot = await getDocs(q)
      const updates = snapshot.docs.map(docSnapshot =>
        updateDoc(doc(db, 'messages', docSnapshot.id), { isRead: true })
      )

      await Promise.all(updates)
      return { success: true }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  },

  // Get unread count
  getUnreadCount: async (userId: string) => {
    try {
      const messagesRef = collection(db, 'messages')
      const q = query(
        messagesRef,
        where('receiverId', '==', userId),
        where('isRead', '==', false)
      )

      const snapshot = await getDocs(q)
      return { success: true, data: snapshot.size }
    } catch (error: any) {
      return { success: false, message: error.message }
    }
  }
}
