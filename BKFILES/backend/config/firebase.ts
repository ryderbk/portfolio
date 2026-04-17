import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getDataConnect, DataConnect } from "firebase/data-connect";
import { getFirestore, Firestore } from "firebase/firestore";
// @ts-ignore
import { connectorConfig } from "@dataconnect/generated";

// Firebase configuration
// Get these values from Firebase Console > Project Settings
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase (singleton pattern to prevent multiple instances)
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let dataConnect: DataConnect;

function getFirebaseApp(): FirebaseApp {
    if (!app) {
        app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    }
    return app;
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

export function getDataConnectInstance(): DataConnect {
    if (!dataConnect) {
        dataConnect = getDataConnect(getFirebaseApp(), connectorConfig);
    }
    return dataConnect;
}

export { getFirebaseApp };
