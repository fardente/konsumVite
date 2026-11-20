import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  connectAuthEmulator,
  indexedDBLocalPersistence,
  initializeAuth,
} from 'firebase/auth';
import {
  connectFirestoreEmulator,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const COLLECTION_PREFIX = import.meta.env
  .VITE_FIREBASE_COLLECTION_PREFIX;

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
  'VITE_FIREBASE_COLLECTION_PREFIX',
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
// initializeAuth instead of getAuth: getAuth also bundles and initialises the
// popup/redirect resolver (loads an extra iframe from authDomain), which this
// app doesn't need since it only uses email/password sign-in.
export const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence],
});
// Persistent (IndexedDB) cache: on app start, listeners get the last known data
// immediately instead of waiting for the network round trip to Firestore.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});

// Connect to emulators if in development mode
const isUsingEmulator = import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true';

/**
 * Firebase Storage is only needed for recipe images, so it is loaded on demand
 * instead of being part of the initial bundle.
 */
export async function loadStorage() {
  const { connectStorageEmulator, getStorage, getBlob, ref, uploadBytes } =
    await import('firebase/storage');
  const storage = getStorage(app);
  if (isUsingEmulator && import.meta.env.DEV) {
    const storageHost =
      import.meta.env.VITE_FIREBASE_EMULATOR_HOST || 'localhost';
    const storagePort =
      import.meta.env.VITE_FIREBASE_EMULATOR_STORAGE_PORT || 9199;
    try {
      connectStorageEmulator(storage, storageHost, parseInt(storagePort));
    } catch (error) {
      // Already connected to storage emulator
    }
  }
  return { storage, getBlob, ref, uploadBytes };
}

if (isUsingEmulator && import.meta.env.DEV) {
  const authPort = import.meta.env.VITE_FIREBASE_EMULATOR_AUTH_PORT || 9099;
  const firestorePort =
    import.meta.env.VITE_FIREBASE_EMULATOR_FIRESTORE_PORT || 8080;

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

  console.log(`🌐 Using emulator host: ${emulatorHost}`);
  console.log('🔥 Firebase emulators connected');
  console.log(`📧 Auth: http://${emulatorHost}:${authPort}`);
  console.log(`🗄️  Firestore: http://${emulatorHost}:${firestorePort}`);
}
