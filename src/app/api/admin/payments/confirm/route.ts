import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { requestId, promoCodeId } = await req.json();
  if (!requestId) return NextResponse.json({ error: "requestId required" }, { status: 400 });

  const paymentRequest = await prisma.kaspiPaymentRequest.findUnique({
    where: { id: requestId },
    include: { ambassador: true },
  });

  if (!paymentRequest) return NextResponse.json({ error: "Заявка не найдена" }, { status: 404 });

  await prisma.kaspiPaymentRequest.update({
    where: { id: requestId },
    data: {
      status: "confirmed",
      confirmedAt: new Date(),
      promoCodeId: promoCodeId ?? null,
    },
  });

  let promoCode = null;
  if (promoCodeId) {
    promoCode = await prisma.promoCode.findUnique({ where: { id: promoCodeId } });
  }

  if (paymentRequest.ambassadorId) {
    await prisma.ambassador.update({
      where: { id: paymentRequest.ambassadorId },
      data: {
        totalReferrals: { increment: 1 },
        totalRevenue: { increment: paymentRequest.finalAmount },
      },
    });

    await prisma.referralVisit.updateMany({
      where: { ambassadorId: paymentRequest.ambassadorId, converted: false },
      data: { converted: true },
    });
  }

  if (paymentRequest.userId && paymentRequest.plan) {
    const planEnum = paymentRequest.plan === "pro" ? "PRO" : "ACADEMIC";
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + paymentRequest.months);

    await prisma.user.update({
      where: { id: paymentRequest.userId },
      data: { plan: planEnum as "PRO" | "ACADEMIC", planExpiresAt: expiresAt },
    });
  }

  return NextResponse.json({ success: true, promoCode: promoCode?.code ?? null });
}
