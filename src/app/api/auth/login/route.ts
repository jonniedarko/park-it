import login, { getCurrentSession } from "@/firebase/auth/login";

export async function GET(_request: Request, _response: Response) {
  const { user } = await getCurrentSession();

  if (!user) {
    return Response.json({ user: null }, { status: 401 });
  }
  return Response.json({ user });
}

export async function POST(request: Request, _response: Response) {
  try {
    const body = await request.json();
    if (!body.email || !body.password) {
      return Response.json(
        {
          success: false,
          error: "email and password is required",
        },
        {
          status: 400,
        },
      );
    }
    const firebaseResponse = await login(body.email, body.password);
    if (firebaseResponse.error) {
      throw firebaseResponse.error;
    }

    const { user } = await getCurrentSession();
    return Response.json({ success: !!firebaseResponse.result, user });
  } catch (e) {
    console.error("error", e);
    return Response.json(
      { success: false, error: e.message },
      {
        status: 401,
      },
    );
  }
}
