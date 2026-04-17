import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, Analytics } from "firebase/analytics";

// Debug: Log Firebase initialization start
console.log("🔧 Firebase module loading...");

// Firebase configuration
// Get these values from Firebase Console > Project Settings
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

if (typeof window !== 'undefined') {
    console.log("🔥 Firebase Config [LOADED]:", {
        projectId: firebaseConfig.projectId,
        authDomain: firebaseConfig.authDomain,
        apiKeySet: !!firebaseConfig.apiKey,
    });
    
    // CRITICAL: Check if any essential config is missing
    const essentialKeys = ['apiKey', 'authDomain', 'projectId', 'appId'] as const;
    const missingKeys = essentialKeys.filter(key => !firebaseConfig[key]);
    
    if (missingKeys.length > 0) {
        console.error("❌ CRITICAL: Missing Firebase configuration keys:", missingKeys);
        console.error("   Ensure these environment variables are set in Vercel:");
        console.error("   - VITE_FIREBASE_API_KEY");
        console.error("   - VITE_FIREBASE_AUTH_DOMAIN");
        console.error("   - VITE_FIREBASE_PROJECT_ID");
        console.error("   - VITE_FIREBASE_APP_ID");
    }
}

// Initialize Firebase (singleton pattern to prevent multiple instances)
let app: FirebaseApp | null = null;
let auth: Auth | undefined;
let db: Firestore | undefined;
let analytics: Analytics | undefined;
let initializationError: Error | null = null;

function getFirebaseApp(): FirebaseApp {
    if (initializationError) {
        throw initializationError;
    }
    
    if (!app) {
        console.log("🛠️ Initializing Firebase with Project ID:", firebaseConfig.projectId);
        
        try {
            app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
            console.log("✅ Firebase App initialized successfully");
        } catch (error) {
            console.error("❌ Firebase Initialization Failed:", error);
            initializationError = error instanceof Error ? error : new Error(String(error));
            throw initializationError;
        }
    }
    return app!;
}

export function getFirebaseAnalytics(): Analytics | undefined {
    try {
        if (!analytics && typeof window !== 'undefined') {
            analytics = getAnalytics(getFirebaseApp());
            console.log("📊 Firebase Analytics initialized");
        }
        return analytics;
    } catch (error) {
        console.warn("⚠️ Firebase Analytics initialization failed (non-critical):", error);
        return undefined;
    }
}

export function getFirebaseAuth(): Auth {
    try {
        if (!auth) {
            auth = getAuth(getFirebaseApp());
            console.log("🔐 Firebase Auth initialized");
        }
        return auth!;
    } catch (error) {
        console.error("❌ Firebase Auth initialization failed:", error);
        throw error;
    }
}

export function getFirestoreDb(): Firestore {
    try {
        if (!db) {
            db = getFirestore(getFirebaseApp(), "default");
            console.log("📚 Firestore database initialized");
        }
        return db!;
    } catch (error) {
        console.error("❌ Firestore initialization failed:", error);
        throw error;
    }
}

export { getFirebaseApp };
