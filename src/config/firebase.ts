import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyB3_sAnEGrWo71UfwfQIM1ruJhhwsFIqBk",
    authDomain: "eliteheat-2ee0b.firebaseapp.com",
    projectId: "eliteheat-2ee0b",
    storageBucket: "eliteheat-2ee0b.firebasestorage.app",
    messagingSenderId: "70394651592",
    appId: "1:70394651592:web:8769ab3461fb25734196fd",
    measurementId: "G-RY3NL750X9"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
