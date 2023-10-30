import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  getDocs,
  collection,
  getDoc,
  doc,
  addDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
console.log("ENV", process.env);
const firebaseConfig = {
  // This throws error currently as used in AuthContext
  // not enough time to figure otu correct solution
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
};
// Initialize Firebase
let firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(firebaseApp);
export async function getDocument<T = any>(
  targetCollection: string,
  id: string,
): Promise<T> {
  const snap = await getDoc(doc(db, targetCollection, id));
  if (snap.exists()) return snap.data() as T;
  else
    return Promise.reject(Error(`No such document: ${targetCollection}.${id}`));
}

export async function setDocument<T = any>(
  targetCollection: string,
  id: string,
  value: T,
) {
  await setDoc(doc(db, targetCollection, id), value);
}
export async function createDocument<T = any>(
  targetCollection: string,
  value: T,
) {
  await addDoc(collection(db, targetCollection), value);
}
export async function getAllDocuments<T = any>(
  targetCollection: string,
): Promise<{ [keyof: string]: T }> {
  const querySnapshot = await getDocs(collection(db, targetCollection));
  let documents: { [keyof: string]: T } = {};
  querySnapshot.forEach((doc) => {
    documents[`${doc.id}`] = doc.data() as T;
    console.log(`${doc.id} => ${doc.data()}`);
  });
  return documents;
}

export function subscribeToCollection<T = any>(
  targetCollection: string,
  onUpdateRecieved: Function,
) {
  const unsubscribe = onSnapshot(doc(db, targetCollection), (doc) => {
    onUpdateRecieved(doc.data() as Array<T>);
  });
  return unsubscribe;
}
export default firebaseApp;
