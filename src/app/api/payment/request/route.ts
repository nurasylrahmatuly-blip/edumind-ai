import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const BASE_PRICES: Record<string, number> = { pro: 4990, academic: 9990 };
const DURATION_DISCOUNTS: Record<number, number> = { 1: 0, 3: 10, 6: 20, 12: 30 };
const KASPI_PHONE = "87758658670";
const KASPI_CARD = "4400 4300 5310 2494";

export async function POST(req: NextRequest) {
  const session = await auth();
  const body = await req.json();
  const { plan, months, refCode, customerName, customerPhone } = body;

  if (!plan || !months || !BASE_PRICES[plan] || !DURATION_DISCOUNTS[months]) {
    return NextResponse.json({ error: "Неверные параметры" }, { status: 400 });
  }

  const basePrice = BASE_PRICES[plan];
  const durationDiscount = DURATION_DISCOUNTS[months] ?? 0;
  const priceAfterDuration = Math.round(basePrice * months * (1 - durationDiscount / 100));

  let refDiscount = 0;
  let ambassador = null;

  if (refCode) {
    ambassador = await prisma.ambassador.findUnique({
      where: { refCode: refCode.toUpperCase() },
    });
    if (ambassador?.isActive) {
      refDiscount = ambassador.commission;
    }
  }

  const finalAmount = Math.round(priceAfterDuration * (1 - refDiscount / 100));
  const originalAmount = basePrice * months;

  const request = await prisma.kaspiPaymentRequest.create({
    data: {
      userId: session?.user?.id ?? null,
      ambassadorId: ambassador?.id ?? null,
      refCode: refCode?.toUpperCase() ?? null,
      plan,
      months,
      originalAmount,
      discount: durationDiscount + refDiscount,
      finalAmount,
      customerName: customerName ?? session?.user?.name ?? null,
      customerPhone: customerPhone ?? null,
      status: "pending",
    },
  });

  const planLabel = plan === "pro" ? "Student Pro" : "Academic+";
  const whatsappText = encodeURIComponent(
    `Оплатил заказ ${request.id.slice(-8).toUpperCase()}, план ${planLabel} на ${months} мес., сумма ${finalAmount} тг`
  );

  return NextResponse.json({
    requestId: request.id.slice(-8).toUpperCase(),
    fullRequestId: request.id,
    originalAmount,
    discount: durationDiscount + refDiscount,
    finalAmount,
    kaspiPhone: KASPI_PHONE,
    kaspiCard: KASPI_CARD,
    whatsapp: `https://wa.me/${KASPI_PHONE}?text=${whatsappText}`,
  });
}
