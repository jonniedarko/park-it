import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import firebaseApp from "@/firebase/config";
import { getAuth } from "firebase/auth";
import { cookies } from "next/headers";

const auth = getAuth(firebaseApp);

export default async function middleware(request: NextRequest) {
  const token = (await cookies().get("session")?.value) || "";
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

// paths include middleware on
export const config = {
  matcher:
    "/((?!api/auth/login|api/auth/register|login|register|_next/static|_next/image|favicon.ico).*)",
};
