import crypto from 'crypto';

const PAYBOX_BASE = process.env.PAYBOX_TEST_MODE === 'true'
  ? 'https://api.paybox.money'
  : 'https://api.paybox.money';

export function generateSignature(
  scriptName: string,
  params: Record<string, string>,
  secretKey: string
): string {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => params[k])
    .join(';');
  const str = `${scriptName};${sorted};${secretKey}`;
  return crypto.createHash('md5').update(str).digest('hex');
}

export interface CreatePaymentParams {
  amount: number;
  currency: string;
  orderId: string;
  userId: string;
  plan: string;
  description: string;
  userEmail: string;
}

export async function createPayment(params: CreatePaymentParams): Promise<{
  paymentUrl: string;
  paymentId: string;
}> {
  const merchantId = process.env.PAYBOX_MERCHANT_ID!;
  const secretKey = process.env.PAYBOX_SECRET_KEY!;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const salt = crypto.randomBytes(8).toString('hex');

  const pgParams: Record<string, string> = {
    pg_merchant_id: merchantId,
    pg_amount: String(params.amount),
    pg_currency: params.currency,
    pg_order_id: params.orderId,
    pg_description: params.description,
    pg_salt: salt,
    pg_result_url: `${baseUrl}/api/paybox/callback`,
    pg_success_url: `${baseUrl}/api/paybox/success`,
    pg_failure_url: `${baseUrl}/pricing`,
    pg_user_id: params.userId,
    pg_user_contact_email: params.userEmail,
  };

  const sig = generateSignature('init_payment.php', pgParams, secretKey);
  pgParams['pg_sig'] = sig;

  const formData = new URLSearchParams(pgParams);

  const res = await fetch(`${PAYBOX_BASE}/init_payment.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });

  const text = await res.text();

  const paymentUrlMatch = text.match(/<pg_redirect_url>([\s\S]*?)<\/pg_redirect_url>/);
  const paymentIdMatch = text.match(/<pg_payment_id>([\s\S]*?)<\/pg_payment_id>/);

  if (!paymentUrlMatch) {
    throw new Error(`PayBox error: ${text}`);
  }

  return {
    paymentUrl: paymentUrlMatch[1].trim(),
    paymentId: paymentIdMatch?.[1]?.trim() ?? params.orderId,
  };
}

export function verifyCallback(params: Record<string, string>): boolean {
  const secretKey = process.env.PAYBOX_SECRET_KEY!;
  const sig = params['pg_sig'];
  if (!sig) return false;

  const scriptName = 'result_url';
  const filtered: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (k !== 'pg_sig') filtered[k] = v;
  }

  const expected = generateSignature(scriptName, filtered, secretKey);
  return expected === sig;
}
