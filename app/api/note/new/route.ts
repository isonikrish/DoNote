import { getToken } from "@/lib/generateToken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const id = await getToken();
    if (!id) {
      return NextResponse.json({ msg: "Unautorized" }, { status: 401 });
    }

    const note = await prisma.note.create({
      data: {
        userId: id,
      },
    });

    return NextResponse.json(
      {
        id: note.id,
        title: note.title,
        content: note.content,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
