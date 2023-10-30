import { NextRequest } from "next/server";
import { getDocument, setDocument } from "@/firebase/config";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const doc = await getDocument("park_sessions", params.id);
  if (doc) {
    return Response.json({
      session: doc,
    });
  }

  return Response.json(
    {
      error: "Session not found",
    },
    {
      status: 404,
    },
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await setDocument("park_sessions", params.id, request.body);
    return Response.json({ success: true, error: null });
  } catch (e) {
    return Response.json(
      { success: true, error: null },
      {
        status: 500,
      },
    );
  }
}
