import { getToken } from "@/lib/generateToken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
const addTaskSchema = z.object({
  title: z.string(),
  noteId: z.number(),
});
export async function POST(req: Request) {
  try {
    const id = await getToken();
    if (!id) {
      return NextResponse.json({ msg: "Unautorized" }, { status: 401 });
    }
    const data = await req.json();
    const validatedReq = addTaskSchema.safeParse(data);
    if (!validatedReq.success) {
      return NextResponse.json({ msg: "Invalid Input" }, { status: 400 });
    }

    const { title, noteId } = validatedReq.data;
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId: id,
      },
    });

    if (!note) {
      return NextResponse.json({ msg: "Note not found" }, { status: 404 });
    }
    await prisma.task.create({
      data: {
        userId: id,
        noteId,
        title,
      },
    });

    return NextResponse.json({ msg: "Task Added" }, { status: 200 });
  } catch {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
