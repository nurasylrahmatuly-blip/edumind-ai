import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PaymentsClient } from "./PaymentsClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Заявки Kaspi — Admin" };
export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/");
  }

  const [requests, availablePromoCodes] = await Promise.all([
    prisma.kaspiPaymentRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, email: true, name: true } },
        ambassador: { select: { id: true, name: true, refCode: true } },
      },
    }),
    prisma.promoCode.findMany({
      where: { isUsed: false },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const pending = requests.filter((r) => r.status === "pending").length;
  const confirmedToday = requests.filter(
    (r) =>
      r.status === "confirmed" &&
      r.confirmedAt &&
      new Date(r.confirmedAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <PaymentsClient
      initialRequests={JSON.parse(JSON.stringify(requests))}
      availablePromoCodes={JSON.parse(JSON.stringify(availablePromoCodes))}
      pendingCount={pending}
      confirmedToday={confirmedToday}
    />
  );
}
