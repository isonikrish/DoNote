import { getToken } from "@/lib/generateToken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
const toggleTaskSchema = z.object({
  taskId: z.number(),
});
export async function PUT(req: Request) {
  try {
    const id = await getToken();
    if (!id) {
      return NextResponse.json({ msg: "Unautorized" }, { status: 401 });
    }
    const data = await req.json();
    const validatedReq = toggleTaskSchema.safeParse(data);
    if (!validatedReq.success) {
      return NextResponse.json({ msg: "Invalid Input" }, { status: 400 });
    }
    const { taskId } = validatedReq.data;

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: id,
      },
    });

    if (!task) {
      return NextResponse.json({ msg: "Task not found" }, { status: 404 });
    }
    await prisma.task.update({
      where: { id: task.id },
      data: {
        status: task.status === "PENDING" ? "DONE" : "PENDING",
      },
    });
    return NextResponse.json({ msg: "Task status updated" }, { status: 200 });
  } catch {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
