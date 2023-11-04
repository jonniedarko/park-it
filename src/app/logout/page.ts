"use server";
import logout from "@/firebase/auth/logout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LogoutAndRedirect() {
  const options = {
    name: "session",
    value: "",
    maxAge: -1,
    httpOnly: true,
    secure: true,
  };

  cookies().set(options);
  await logout();
  redirect("/");
}
