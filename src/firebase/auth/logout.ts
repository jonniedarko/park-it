import firebaseApp from "@/firebase/config";
import { getAuth, signOut } from "firebase/auth";
import { cookies } from "next/headers";

const auth = getAuth(firebaseApp);

export default async function logOut() {
  try {
    await signOut(auth);
    cookies().delete("session");
  } catch (e) {
    console.error("firebase/logout", e);
  }
}
