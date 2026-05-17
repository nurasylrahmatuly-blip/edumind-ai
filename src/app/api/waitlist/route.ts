import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, university } = body as { email?: string; name?: string; university?: string };

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const entry = await prisma.waitlist.upsert({
      where: { email },
      update: { name: name ?? undefined, university: university ?? undefined },
      create: { email, name: name ?? undefined, university: university ?? undefined },
    });

    return NextResponse.json({ success: true, id: entry.id });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
