import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function checkAdmin(_req: NextRequest) {
  const session = await auth();
  return session?.user?.email === process.env.ADMIN_EMAIL;
}

export async function GET(req: NextRequest) {
  if (!(await checkAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const plan = req.nextUrl.searchParams.get("plan");
  const status = req.nextUrl.searchParams.get("status");

  const codes = await prisma.promoCode.findMany({
    where: {
      ...(plan ? { plan } : {}),
      ...(status === "used" ? { isUsed: true } : status === "free" ? { isUsed: false } : {}),
    },
    orderBy: { createdAt: "asc" },
    include: { usedBy: { select: { email: true, name: true } } },
  });

  return NextResponse.json({ codes });
}

export async function POST(req: NextRequest) {
  if (!(await checkAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan, months, count, prefix } = await req.json();
  if (!plan || !count) {
    return NextResponse.json({ error: "plan и count обязательны" }, { status: 400 });
  }

  const codePrefix = prefix ?? (plan === "pro" ? "EDUPRO" : "ACADKZ");
  const existing = await prisma.promoCode.count({ where: { plan } });
  const created: string[] = [];

  for (let i = existing + 1; i <= existing + count; i++) {
    const code = `${codePrefix}-${String(i).padStart(3, "0")}`;
    await prisma.promoCode.create({
      data: { code, plan, months: months ?? 1 },
    });
    created.push(code);
  }

  return NextResponse.json({ created });
}
