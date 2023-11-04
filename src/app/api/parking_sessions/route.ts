import { getAllDocuments, createDocument } from "@/firebase/db";
import { NextRequest } from "next/server";

export async function GET() {
  return Response.json({
    sessions: await getAllDocuments("parking_sessions"),
  });
}

export async function POST(request: NextRequest) {
  try {
    await createDocument("parking_sessions", await request.json());
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
