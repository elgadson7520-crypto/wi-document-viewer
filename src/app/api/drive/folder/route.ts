import { NextRequest, NextResponse } from "next/server";
import { getFolderStructure } from "@/lib/google-drive";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const folderId = searchParams.get("folderId") || undefined;

    const result = await getFolderStructure(folderId);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to get folder structure";
    console.error("Drive folder error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
