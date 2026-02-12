import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, terminate, clearIndexedDbPersistence } from 'firebase/firestore'
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

/**
 * FIRESTORE SHIELD (12.6.0 CRASH PREVENTION)
 * If the SDK throws an internal assertion error, we must block all future calls
 * to prevent the entire UI from locking up or crashing.
 */
let _isFirestoreBroken = false;

export const isFirestoreBroken = () => _isFirestoreBroken;

export const markFirestoreAsBroken = async (error?: any) => {
    if (!_isFirestoreBroken) {
        console.error("🔥 CRITICAL: Firestore SDK has crashed (Assertion Failed). Shielding app...", error);
        _isFirestoreBroken = true;

        // Attempt clean shutdown to prevent further background loops
        try {
            await terminate(db);
            console.warn("🛡️ Firestore terminated safely.");
            // Suggest reload or attempt to clear cache for next time
            await clearIndexedDbPersistence(db).catch(() => { });
        } catch (e) {
            console.error("Failed to terminate Firestore:", e);
        }
    }
};

// Global error listener to catch Firebase's internal "Assertion failed" that bypass standard try-catches
if (typeof window !== 'undefined') {
    const originalOnError = window.onerror;
    window.onerror = function (message, source, lineno, colno, error) {
        const msg = String(message).toUpperCase();
        if (msg.includes('FIRESTORE') && msg.includes('INTERNAL ASSERTION FAILED')) {
            markFirestoreAsBroken(error);
        }
        if (originalOnError) {
            return originalOnError.apply(this, arguments as any);
        }
        return false;
    };
}

export default app
