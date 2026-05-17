import { prisma } from '@/lib/prisma';
import { verifyCallback } from '@/lib/paybox';

const planMap: Record<string, 'FREE' | 'PRO' | 'ACADEMIC'> = {
  pro: 'PRO',
  academic: 'ACADEMIC',
};

const okXml = '<?xml version="1.0" encoding="utf-8"?><response><pg_status>ok</pg_status></response>';
const rejectXml = '<?xml version="1.0" encoding="utf-8"?><response><pg_status>rejected</pg_status></response>';

export async function POST(req: Request) {
  const text = await req.text();
  const params: Record<string, string> = {};
  const sp = new URLSearchParams(text);
  sp.forEach((v, k) => { params[k] = v; });

  if (!verifyCallback(params)) {
    return new Response(rejectXml, {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    });
  }

  const pgResult = params['pg_result'];
  const orderId = params['pg_order_id'];
  const paymentId = params['pg_payment_id'];

  if (pgResult === '1' && orderId) {
    const order = await prisma.paymentOrder.findFirst({
      where: { externalId: orderId },
    });

    if (order) {
      await prisma.paymentOrder.update({
        where: { id: order.id },
        data: { status: 'success', externalId: paymentId ?? orderId },
      });

      const dbPlan = planMap[order.plan] ?? 'FREE';
      await prisma.user.update({
        where: { id: order.userId },
        data: {
          plan: dbPlan,
          planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    }
  }

  return new Response(okXml, {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}
