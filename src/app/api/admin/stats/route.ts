import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!session?.user?.email || session.user.email !== adminEmail) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const today = new Date(new Date().toDateString());

  const [userCount, docCount, chatCount, proUsers, academicUsers, recentUsers] =
    await Promise.all([
      prisma.user.count(),
      prisma.document.count(),
      prisma.conversation.count({ where: { createdAt: { gte: today } } }),
      prisma.user.count({ where: { plan: "PRO" } }),
      prisma.user.count({ where: { plan: "ACADEMIC" } }),
      prisma.user.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          name: true,
          plan: true,
          createdAt: true,
          _count: { select: { documents: true, conversations: true } },
        },
      }),
    ]);

  return NextResponse.json({
    userCount,
    docCount,
    chatCount,
    proUsers,
    academicUsers,
    recentUsers,
  });
}
