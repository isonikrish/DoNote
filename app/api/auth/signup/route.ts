import { generateTokenAndSetCookies } from "@/lib/generateToken";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const validatedReq = signupSchema.safeParse(data);
    if (!validatedReq.success) {
      return NextResponse.json({ msg: "Invalid Input" }, { status: 400 });
    }
    const { email, password } = validatedReq.data;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return NextResponse.json(
        {
          msg: "Account with this email already exists.",
        },
        { status: 400 },
      );
    }
    const createdUser = await prisma.user.create({
      data: {
        email,
        password,
      },
    });
    const response = NextResponse.json(
      {
        id: createdUser.id,
        email: createdUser.email,
      },
      { status: 200 }
    );

    const res = await generateTokenAndSetCookies(createdUser.id, response)
    return res;
  } catch {
    return NextResponse.json({ msg: "Internal Server Error" }, { status: 500 });
  }
}
