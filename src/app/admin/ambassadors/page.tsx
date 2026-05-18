import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AmbassadorsClient } from "./AmbassadorsClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Амбассадоры — Admin" };
export const dynamic = "force-dynamic";

export default async function AmbassadorsPage() {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  const ambassadors = await prisma.ambassador.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { referrals: true, paymentRequests: true } },
    },
  });

  return <AmbassadorsClient initialAmbassadors={JSON.parse(JSON.stringify(ambassadors))} />;
}
