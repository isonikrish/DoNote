import { generateTokenAndSetCookies } from "@/lib/generateToken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validatedReq = loginSchema.safeParse(data);

    if (!validatedReq.success) {
      return NextResponse.json({ msg: "Invalid Input" }, { status: 400 });
    }

    const { email, password } = validatedReq.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { msg: "Invalid email or password" },
        { status: 400 }
      );
    }
    if (user.password !== password) {
      return NextResponse.json(
        { msg: "Invalid email or password" },
        { status: 400 }
      );
    }

    const response = NextResponse.json(
      {
        id: user.id,
        email: user.email,
      },
      { status: 200 }
    );

    const res = await generateTokenAndSetCookies(user.id, response);
    return res;

  } catch {
    return NextResponse.json(
      { msg: "Internal Server Error" },
      { status: 500 }
    );
  }
}