import firebaseApp from "@/firebase/config";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth(firebaseApp);

export default async function logOut() {
  try {
    await signOut(auth);
  } catch (e) {
    console.error("firebase/logout", e);
  }
}
