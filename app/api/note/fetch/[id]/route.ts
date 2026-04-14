import { getToken } from "@/lib/generateToken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getToken();

    if (!userId) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const noteId = Number(id);
    if (!noteId) {
      return NextResponse.json({ msg: "Invalid note id" }, { status: 400 });
    }

    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!note) {
      return NextResponse.json({ msg: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note, { status: 200 });
  } catch {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
