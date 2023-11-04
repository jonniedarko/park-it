import firebaseApp from "@/firebase/config";
import { cookies } from "next/headers";

import { signInWithEmailAndPassword, getAuth } from "firebase/auth";

const firebaseAppAuth = getAuth(firebaseApp);

export default async function signIn(email, password) {
  let result = null,
    error = null;
  try {
    result = await signInWithEmailAndPassword(firebaseAppAuth, email, password);
    const token = await result.user?.getIdTokenResult();
    if (token) {
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

export async function getCurrentSession(): Promise<{
  user: { email: string; id: string; email_verified: boolean };
}> {
  let token = null;
  try {
    const sessionString = cookies().get("session")?.value || "";
    token = JSON.parse(sessionString);
  } catch (e) {
    console.log("no session");
  }
  if (!token) {
    return { user: null };
  }
  const {
    claims: { user_id, email, email_verified },
  } = token;
  return {
    user: {
      id: user_id,
      email,
      email_verified,
    },
  };
}
