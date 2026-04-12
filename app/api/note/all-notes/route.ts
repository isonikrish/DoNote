import { getToken } from "@/lib/generateToken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const id = await getToken();
    if (!id) {
      return NextResponse.json({ msg: "Unautorized" }, { status: 401 });
    }
    const notes = await prisma.note.findMany({
        where: {
            userId: id
        },
        select: {
            id: true,
            title: true,
            createdAt: true
        }
    })

    return NextResponse.json(notes, {status: 200})
  } catch {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
