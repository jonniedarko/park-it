import {
  getDocs,
  collection,
  getDoc,
  doc,
  addDoc,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./config";

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
