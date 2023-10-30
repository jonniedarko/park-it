import logout from "@/firebase/auth/logout";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await logout();
    return Response.redirect("/");
  } catch (e) {
    return Response.json(
      { success: true, error: null },
      {
        status: 500,
      },
    );
  }
}
