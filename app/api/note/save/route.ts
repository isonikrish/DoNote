import { getToken } from "@/lib/generateToken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const saveSchema = z.object({
  noteId: z.number(),
  title: z.string().optional(),
  content: z.string().optional(),
});

export async function PUT(req: Request) {
  try {
    const userId = await getToken();

    if (!userId) {
      return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = saveSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ msg: "Invalid Input" }, { status: 400 });
    }

    const { noteId, title, content } = parsed.data;

    // Ensure note belongs to user
    const existingNote = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId,
      },
    });

    if (!existingNote) {
      return NextResponse.json({ msg: "Note not found" }, { status: 404 });
    }

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
      },
    });

    return NextResponse.json(updatedNote, { status: 200 });

  } catch {
    return NextResponse.json(
      { msg: "Internal Server Error" },
      { status: 500 }
    );
  }
}