import { NextRequest, NextResponse } from "next/server";
import { getFileStream } from "@/lib/google-drive";

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const { fileId } = params;
    const { stream, mimeType, fileName } = await getFileStream(fileId);

    const readable = stream as unknown as ReadableStream;

    return new NextResponse(readable, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `inline; filename="${encodeURIComponent(fileName)}"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to get file";
    console.error("Drive file error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
