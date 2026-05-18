import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function checkAdmin(_req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    return false;
  }
  return true;
}

export async function GET(_req: NextRequest) {
  if (!(await checkAdmin(_req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = _req.nextUrl.searchParams.get("status");

  const requests = await prisma.kaspiPaymentRequest.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, email: true, name: true } },
      ambassador: { select: { id: true, name: true, refCode: true } },
    },
  });

  return NextResponse.json({ requests });
}

export async function PATCH(req: NextRequest) {
  if (!(await checkAdmin(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, status, adminNote } = body;

  const updated = await prisma.kaspiPaymentRequest.update({
    where: { id },
    data: { status, adminNote, confirmedAt: status === "confirmed" ? new Date() : undefined },
  });

  return NextResponse.json({ request: updated });
}
