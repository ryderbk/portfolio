import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";

// Firebase configuration
// Get these values from Firebase Console > Project Settings
// Safe environment variable accessor
const getEnv = (key: string) => {
    // @ts-ignore
    return (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env[key] : undefined) || process.env[key] || process.env[`VITE_${key}`] || '';
};

const firebaseConfig = {
    apiKey: getEnv("VITE_FIREBASE_API_KEY"),
    authDomain: getEnv("VITE_FIREBASE_AUTH_DOMAIN"),
    projectId: getEnv("VITE_FIREBASE_PROJECT_ID"),
    storageBucket: getEnv("VITE_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: getEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
    appId: getEnv("VITE_FIREBASE_APP_ID"),
    measurementId: getEnv("VITE_FIREBASE_MEASUREMENT_ID"),
};

if (typeof window !== 'undefined') {
    console.log("🔥 Firebase Config [ACTIVE]:", {
        projectId: firebaseConfig.projectId,
        authDomain: firebaseConfig.authDomain
    });
}

// Initialize Firebase (singleton pattern to prevent multiple instances)
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let analytics: Analytics;

function getFirebaseApp(): FirebaseApp {
    if (!app) {
        console.log("🛠️ Initializing Firebase with Project ID:", firebaseConfig.projectId);
        
        if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('your_')) {
            console.error("❌ ERROR: Firebase API Key is missing or default. Check your .env file!");
        }
        
        try {
            app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
            console.log("✅ Firebase App initialized successfully.");
        } catch (error) {
            console.error("❌ Firebase Initialization Failed:", error);
            throw error;
        }
    }
    return app;
}

export function getFirebaseAnalytics(): Analytics | undefined {
    if (!analytics && typeof window !== 'undefined') {
        analytics = getAnalytics(getFirebaseApp());
    }
    return analytics;
}

export function getFirebaseAuth(): Auth {
    if (!auth) {
        auth = getAuth(getFirebaseApp());
    }
    return auth;
}

export function getFirestoreDb(): Firestore {
    if (!db) {
        db = getFirestore(getFirebaseApp(), "default");
    }
    return db;
}

export { getFirebaseApp };
