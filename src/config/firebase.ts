import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyA46J4VdaznwpQBkAT1wMPyQ8X3D1OGb4Q",
    authDomain: "eliteheat-da70c.firebaseapp.com",
    projectId: "eliteheat-da70c",
    storageBucket: "eliteheat-da70c.firebasestorage.app",
    messagingSenderId: "86087836414",
    appId: "1:86087836414:web:79f5cadca6177af116bbaf",
    measurementId: "G-3EECL4FG8F"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export default app
