import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ valid: false, error: "Код не указан" }, { status: 400 });
  }

  const ambassador = await prisma.ambassador.findUnique({
    where: { refCode: code.toUpperCase() },
  });

  if (!ambassador || !ambassador.isActive) {
    return NextResponse.json({ valid: false });
  }

  const visitorIp = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? null;
  await prisma.referralVisit.create({
    data: { ambassadorId: ambassador.id, visitorIp },
  });

  return NextResponse.json({
    valid: true,
    ambassadorName: ambassador.name,
    discount: ambassador.commission,
    refCode: ambassador.refCode,
  });
}
