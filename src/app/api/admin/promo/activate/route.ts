import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
  }

  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "Код не указан" }, { status: 400 });

  const promo = await prisma.promoCode.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!promo) return NextResponse.json({ error: "Промокод не найден" }, { status: 404 });
  if (promo.isUsed) return NextResponse.json({ error: "Промокод уже использован" }, { status: 409 });

  const planEnum = promo.plan === "pro" ? "PRO" : "ACADEMIC";
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + promo.months);

  await prisma.$transaction([
    prisma.promoCode.update({
      where: { id: promo.id },
      data: { isUsed: true, usedByUserId: session.user.id, usedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: session.user.id },
      data: { plan: planEnum as "PRO" | "ACADEMIC", planExpiresAt: expiresAt },
    }),
  ]);

  return NextResponse.json({
    success: true,
    plan: promo.plan,
    months: promo.months,
    expiresAt: expiresAt.toISOString(),
  });
}
