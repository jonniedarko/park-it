import { NextRequest } from "next/server";
import { getDocument, setDocument } from "@/firebase/db";

export const dynamic = "force-dynamic";
export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const doc = await getDocument("parking_sessions", params.id);
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
    await setDocument("parking_sessions", params.id, await request.json());
    return Response.json({ success: true, error: null });
  } catch (e) {
    console.log("error", e);
    return Response.json(
      { success: true, error: null },
      {
        status: 500,
      },
    );
  }
}
