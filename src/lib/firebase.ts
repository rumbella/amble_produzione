/// <reference types="vite/client" />
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || "AIzaSyDh8BGz2NikYB-LJG_6aHqncQrZEFvXsPw",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || "gen-lang-client-0578122726.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || "gen-lang-client-0578122726",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || "gen-lang-client-0578122726.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_ID       || "820130572676",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || "1:820130572676:web:6c095f2ff23c2dab6095d1",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, import.meta.env.VITE_FIREBASE_DATABASE_ID || "ai-studio-21a4f9dd-4625-4758-aec5-bb4be20d2cf5");
export const auth = getAuth(app);
