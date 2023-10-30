import { getAllDocuments, createDocument } from "@/firebase/config";
import { NextRequest } from "next/server";

export async function GET() {
  return Response.json({
    sessions: await getAllDocuments("park_sessions"),
  });
}

export async function POST(request: NextRequest) {
  try {
    await createDocument("park_sessions", await request.json());
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
