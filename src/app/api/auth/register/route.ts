import register from "@/firebase/auth/regsiter";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.email || !body.password) {
      return Response.json(
        {
          error: "email and password is required",
        },
        {
          status: 400,
        },
      );
    }
    await register(body.email, body.password);
    return Response.json({
      success: true,
    });
  } catch (e) {
    return Response.json(
      { success: true, error: null },
      {
        status: 500,
      },
    );
  }
}
