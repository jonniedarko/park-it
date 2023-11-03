import logout from "@/firebase/auth/logout";
import { NextRequest } from "next/server";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(_request: NextRequest) {
  let redirectTo = "/";
  try {
    const options = {
      name: "session",
      value: "",
      maxAge: -1,
      httpOnly: true,
      secure: true,
    };

    cookies().set(options);
    console.info("cookie deleted");
    await logout();
  } catch (e) {
    console.error("Logout", e);
    redirectTo = headers()?.get("referer");
    const errUrlMessage = `logout_err=${encodeURIComponent(e.message)}`;
    redirectTo += redirectTo.includes("?")
      ? `&${errUrlMessage}`
      : `?${errUrlMessage}`;
  }
  redirect(redirectTo);
}
