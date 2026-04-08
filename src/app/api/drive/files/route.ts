import { NextRequest, NextResponse } from "next/server";
import { listFilesInFolder } from "@/lib/google-drive";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get("folderId") || undefined;
    const pageToken = searchParams.get("pageToken") || undefined;

    const result = await listFilesInFolder(folderId, pageToken);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to list files";
    console.error("Drive files error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
