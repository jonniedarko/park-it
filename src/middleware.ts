import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import firebaseApp from "@/firebase/config";
import { getAuth, signOut } from "firebase/auth";
import { cookies } from "next/headers";

const auth = getAuth(firebaseApp);
// This function can be marked `async` if using `await` inside
export default async function middleware(request: NextRequest) {
  const token = (await cookies().get("session")?.value) || "";
  console.log("middleware", token);
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher:
    "/((?!api/auth/login|api/auth/register|login|register|_next/static|_next/image|favicon.ico).*)",
};
