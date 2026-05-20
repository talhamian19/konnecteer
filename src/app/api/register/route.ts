import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);
    const username = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "") + Math.floor(Math.random() * 999);

    const user = await prisma.user.create({
      data: { name, email, passwordHash: hash, username },
    });

    return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
