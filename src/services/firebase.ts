import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, initializeFirestore, doc, getDocFromServer, Firestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  
  if (app) {
    auth = getAuth(app);
    
    const databaseId = firebaseConfig.firestoreDatabaseId;
    if (databaseId) {
      try {
        db = getFirestore(app, databaseId);
      } catch (e) {
        db = initializeFirestore(app, {}, databaseId);
      }
    } else {
      db = getFirestore(app);
    }
  }
} catch (error) {
  console.warn('Firebase initialization warning:', error);
}

// Connection test on initial boot (per Firebase Skill guideline)
if (db) {
  getDocFromServer(doc(db, 'test', 'connection')).catch(() => {
    // Non-blocking connection check
  });
}

export { app, auth, db };
export const googleProvider = new GoogleAuthProvider();
