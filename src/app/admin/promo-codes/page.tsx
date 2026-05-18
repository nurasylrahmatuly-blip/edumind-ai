import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PromoCodesClient } from "./PromoCodesClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Промокоды — Admin" };
export const dynamic = "force-dynamic";

export default async function PromoCodesPage() {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  const codes = await prisma.promoCode.findMany({
    orderBy: { createdAt: "asc" },
    include: { usedBy: { select: { email: true, name: true } } },
  });

  return <PromoCodesClient initialCodes={JSON.parse(JSON.stringify(codes))} />;
}
