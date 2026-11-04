




import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth, browserSessionPersistence, setPersistence } from "firebase/auth";
import { getMessaging, isSupported } from "firebase/messaging";




const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};


// 🔍 Log it once for verification
console.log("🔥 Firebase Config Runtime Check:", firebaseConfig);

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

// ⚙️ Initialize Messaging only if supported (fixes some browser errors)
let messaging = null;
if (await isSupported()) {
  messaging = getMessaging(app);
}

// ✅ Set Auth Persistence
setPersistence(auth, browserSessionPersistence).catch(console.error);

// ✅ Export everything you need
export { app, auth, db, rtdb, messaging };