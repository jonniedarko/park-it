import firebaseApp from "../config";
import { cookies, headers } from "next/headers";

import { signInWithEmailAndPassword, getAuth } from "firebase/auth";

const firebaseAppAuth = getAuth(firebaseApp);

export default async function signIn(email, password) {
  let result = null,
    error = null;
  try {
    result = await signInWithEmailAndPassword(firebaseAppAuth, email, password);
    const token = await result.user?.getIdTokenResult();
    console.log("token", token);
    if (token) {
      //Generate session cookie
      const expiresIn = 60 * 60 * 1000;

      const options = {
        name: "session",
        value: JSON.stringify(token),
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
      };

      cookies().set(options);
    }
  } catch (e) {
    error = e;
  }

  return { result, error };
}
