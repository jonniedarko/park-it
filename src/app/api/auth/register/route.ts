import register from "@/firebase/auth/regsiter";
import { NextRequest } from "next/server";
const ALLOWED_DOMAINS = ['jonnie.io']
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
    const emailDomain = body.email.split('@')[0];
    if(ALLOWED_DOMAINS.includes(emailDomain){
      await register(body.email, body.password);

      return Response.json({
        success: true,
      });
    } 
    return Response.json(
        {
          error: "NOT ALLOWED",
        },
        {
          status: 401,
        },
      );
  } catch (e) {
    return Response.json(
      { success: true, error: null },
      {
        status: 500,
      },
    );
  }
}
