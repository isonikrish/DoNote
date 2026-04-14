import { getToken } from "@/lib/generateToken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const id = await getToken();
    if (!id) {
      return NextResponse.json({ msg: "Unautorized" }, { status: 401 });
    }
    const tasks = await prisma.task.findMany({
        where: {
            userId: id
        },
        select: {
            id: true,
            title: true,
            createdAt: true,
            status: true,
            note: true
        }
    })

    return NextResponse.json(tasks, {status: 200})
  } catch {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
