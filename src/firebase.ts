import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];
const missingVars = requiredEnvVars.filter(
  varName => !import.meta.env[varName]
);
if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}`
  );
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators if in development mode
const isUsingEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true';

if (isUsingEmulator && import.meta.env.DEV) {
  const authPort = import.meta.env.VITE_FIREBASE_EMULATOR_AUTH_PORT || 9099;
  const firestorePort =
    import.meta.env.VITE_FIREBASE_EMULATOR_FIRESTORE_PORT || 8080;
  const storagePort =
    import.meta.env.VITE_FIREBASE_EMULATOR_STORAGE_PORT || 9199;

  // Use custom host if provided (for mobile testing), otherwise localhost
  const emulatorHost =
    import.meta.env.VITE_FIREBASE_EMULATOR_HOST || 'localhost';

  console.log('🔧 Connecting to Firebase emulators...');
  console.log(`🌐 Using emulator host: ${emulatorHost}`);

  // Connect to emulators
  // These functions are safe to call multiple times
  try {
    connectAuthEmulator(auth, `http://${emulatorHost}:${authPort}`, {
      disableWarnings: true,
    });
  } catch (error) {
    // Already connected to auth emulator
  }

  try {
    connectFirestoreEmulator(db, emulatorHost, parseInt(firestorePort));
  } catch (error) {
    // Already connected to firestore emulator
  }

  try {
    connectStorageEmulator(storage, emulatorHost, parseInt(storagePort));
  } catch (error) {
    // Already connected to storage emulator
  }

  console.log(`🌐 Using emulator host: ${emulatorHost}`);
  console.log('🔥 Firebase emulators connected');
  console.log(`📧 Auth: http://${emulatorHost}:${authPort}`);
  console.log(`🗄️  Firestore: http://${emulatorHost}:${firestorePort}`);
  console.log(`📁 Storage: http://${emulatorHost}:${storagePort}`);
}
