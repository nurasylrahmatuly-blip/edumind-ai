import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function checkAdmin(_req: NextRequest) {
  const session = await auth();
  return session?.user?.email === process.env.ADMIN_EMAIL;
}

export async function GET(_req: NextRequest) {
  if (!(await checkAdmin(_req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ambassadors = await prisma.ambassador.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { referrals: true } },
    },
  });

  return NextResponse.json({ ambassadors });
}

export async function POST(_req: NextRequest) {
  if (!(await checkAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email, phone, telegramUsername, refCode, commission } = await req.json();
  if (!name || !email || !refCode) {
    return NextResponse.json({ error: "name, email и refCode обязательны" }, { status: 400 });
  }

  const existing = await prisma.ambassador.findUnique({ where: { refCode: refCode.toUpperCase() } });
  if (existing) {
    return NextResponse.json({ error: "Реф-код уже используется" }, { status: 409 });
  }

  const ambassador = await prisma.ambassador.create({
    data: {
      name,
      email,
      phone: phone ?? null,
      telegramUsername: telegramUsername ?? null,
      refCode: refCode.toUpperCase(),
      commission: commission ?? 15,
    },
  });

  return NextResponse.json({ ambassador });
}

export async function PATCH(_req: NextRequest) {
  if (!(await checkAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, isActive } = await req.json();
  const updated = await prisma.ambassador.update({
    where: { id },
    data: { isActive },
  });

  return NextResponse.json({ ambassador: updated });
}

export async function DELETE(_req: NextRequest) {
  if (!(await checkAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.ambassador.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
