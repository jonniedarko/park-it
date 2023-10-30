import login from "@/firebase/auth/login";

export async function POST(request: Request, response: Response) {
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
    const d = await login(body.email, body.password);
    return Response.json({ success: true });
  } catch (e) {
    return Response.json(
      { success: false, error: e.message },
      {
        status: 401,
      },
    );
  }
}
