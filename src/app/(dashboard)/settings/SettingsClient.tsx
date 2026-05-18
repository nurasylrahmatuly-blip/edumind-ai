'use client';

import { useState } from "react";
import Link from "next/link";
import { User, CreditCard, Key, Bell, ExternalLink, CheckCircle, Clock, Gift, Sparkles } from "lucide-react";

interface PaymentOrder {
  id: string;
  plan: string;
  amount: number;
  currency: string;
  provider: string;
  status: string;
  createdAt: string;
}

interface SettingsUser {
  id: string;
  name: string | null;
  email: string;
  plan: string;
  stripeCustomerId: string | null;
  planExpiresAt: string | null;
  createdAt: string;
}

interface Props {
  user: SettingsUser;
  usageToday: number;
  paymentOrders: PaymentOrder[];
}

type Tab = "profile" | "subscription" | "api" | "notifications";

const planLabels: Record<string, string> = {
  FREE: "Бесплатный", PRO: "Student Pro", ACADEMIC: "Academic+", UNIVERSITY: "University",
};
const planLimits: Record<string, string> = {
  FREE: "50 запросов / день", PRO: "Безлимит", ACADEMIC: "Безлимит", UNIVERSITY: "Безлимит",
};
const statusBadge: Record<string, string> = {
  pending: "badge-amber", success: "badge-teal", failed: "badge-red",
};
const statusLabel: Record<string, string> = {
  pending: "Ожидание", success: "Оплачено", failed: "Ошибка",
};

function getInitials(name?: string | null, email?: string): string {
  if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  return (email?.[0] ?? "?").toUpperCase();
}

export function SettingsClient({ user, usageToday, paymentOrders }: Props) {
  const [tab, setTab] = useState<Tab>("profile");
  const [name, setName] = useState(user.name ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoResult, setPromoResult] = useState<{ success: boolean; message: string; expiresAt?: string } | null>(null);

  async function handlePromoActivate() {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoResult(null);
    try {
      const res = await fetch("/api/admin/promo/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (data.success) {
        const exp = new Date(data.expiresAt).toLocaleDateString("ru-RU");
        setPromoResult({ success: true, message: `Ваш план активирован до ${exp}! 🎉` });
        setPromoCode("");
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setPromoResult({ success: false, message: data.error ?? "Неверный промокод" });
      }
    } catch {
      setPromoResult({ success: false, message: "Ошибка сети, попробуйте снова" });
    } finally {
      setPromoLoading(false);
    }
  }

  const planLower = user.plan.toLowerCase() as "free" | "pro" | "academic";
  const dailyLimit = planLower === "free" ? 50 : -1;

  async function handleSave() {
    setSaving(true);
    await fetch("/api/user/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handlePortal() {
    setPortalLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setPortalLoading(false);
  }

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "profile", label: "Профиль", icon: User },
    { key: "subscription", label: "Подписка", icon: CreditCard },
    { key: "api", label: "API", icon: Key },
    { key: "notifications", label: "Уведомления", icon: Bell },
  ];

  return (
    <div style={{ padding: "28px", maxWidth: 800, overflowY: "auto", flex: 1 }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: "var(--white)", marginBottom: 28 }}>
        Настройки
      </h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid var(--border-dim)", marginBottom: 28 }}>
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "8px 16px",
              background: "transparent",
              border: "none",
              borderBottom: `2px solid ${tab === key ? "var(--lime)" : "transparent"}`,
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: tab === key ? "var(--lime-text)" : "var(--white-muted)",
              transition: "all 0.15s",
              marginBottom: -1,
            }}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === "profile" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "var(--lime-dim)", border: "2px solid var(--border-lime)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--lime-text)",
            }}>
              {getInitials(user.name, user.email)}
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-ui)", fontSize: 16, fontWeight: 600, color: "var(--white)" }}>{user.name || "Без имени"}</p>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--white-muted)" }}>{user.email}</p>
            </div>
          </div>

          <div className="card-base" style={{ padding: "24px" }}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--white-muted)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
                Имя
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                style={{
                  width: "100%", padding: "10px 14px",
                  background: "var(--bg-hover)", border: "1px solid var(--border-soft)",
                  borderRadius: "var(--radius-md)", color: "var(--white)",
                  fontFamily: "var(--font-ui)", fontSize: 14, outline: "none",
                }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--white-muted)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>
                Email (только чтение)
              </label>
              <input
                value={user.email}
                readOnly
                style={{
                  width: "100%", padding: "10px 14px",
                  background: "var(--bg-surface)", border: "1px solid var(--border-dim)",
                  borderRadius: "var(--radius-md)", color: "var(--white-muted)",
                  fontFamily: "var(--font-mono)", fontSize: 13, outline: "none", cursor: "not-allowed",
                }}
              />
            </div>
            <button className="btn-primary btn-sm" onClick={handleSave} disabled={saving}>
              {saving ? "Сохранение…" : saved ? <><CheckCircle size={13} /> Сохранено</> : "Сохранить"}
            </button>
          </div>
        </div>
      )}

      {/* Subscription tab */}
      {tab === "subscription" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Current plan */}
          <div className="card-base" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--white-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Текущий план</p>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: user.plan === "FREE" ? "var(--white-dim)" : "var(--lime)" }}>
                  {planLabels[user.plan] ?? user.plan}
                </p>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--white-muted)", marginTop: 4 }}>{planLimits[user.plan]}</p>
              </div>
              {user.plan !== "FREE" && user.stripeCustomerId && (
                <button className="btn-outline btn-sm" onClick={handlePortal} disabled={portalLoading} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <ExternalLink size={12} /> {portalLoading ? "Загрузка…" : "Управлять подпиской"}
                </button>
              )}
            </div>

            {user.planExpiresAt && (
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--white-muted)", display: "flex", alignItems: "center", gap: 5 }}>
                <Clock size={11} /> Активна до {new Date(user.planExpiresAt).toLocaleDateString("ru-RU")}
              </p>
            )}

            {/* Usage */}
            {dailyLimit !== -1 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--white-muted)" }}>Запросов сегодня</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--lime-text)" }}>{usageToday} / {dailyLimit}</span>
                </div>
                <div style={{ height: 4, background: "var(--bg-hover)", borderRadius: "var(--radius-pill)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min((usageToday / dailyLimit) * 100, 100)}%`, background: "var(--lime)", borderRadius: "var(--radius-pill)" }} />
                </div>
              </div>
            )}

            {user.plan === "FREE" && (
              <div style={{ marginTop: 16 }}>
                <Link href="/pricing" className="btn-primary btn-sm">Обновить план</Link>
              </div>
            )}
          </div>

          {/* Promo code activation */}
          <div className="card-base" style={{ padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Gift size={16} style={{ color: "var(--lime)" }} />
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--white)" }}>
                Активировать план
              </h3>
            </div>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--white-dim)", marginBottom: 14 }}>
              Введите промокод полученный от EduMind
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => { if (e.key === "Enter") handlePromoActivate(); }}
                placeholder="EDUPRO-001"
                style={{
                  flex: 1, padding: "10px 14px",
                  background: "var(--bg-hover)", border: "1px solid var(--border-soft)",
                  borderRadius: "var(--radius-md)", color: "var(--white)",
                  fontFamily: "var(--font-mono)", fontSize: 13, outline: "none",
                }}
              />
              <button
                className="btn-primary btn-sm"
                onClick={handlePromoActivate}
                disabled={promoLoading || !promoCode.trim()}
              >
                {promoLoading ? "…" : <><Sparkles size={13} /> Активировать</>}
              </button>
            </div>
            {promoResult && (
              <div style={{
                marginTop: 10, padding: "10px 14px", borderRadius: "var(--radius-md)",
                background: promoResult.success ? "rgba(184,247,39,0.08)" : "rgba(239,68,68,0.08)",
                border: `1px solid ${promoResult.success ? "rgba(184,247,39,0.3)" : "rgba(239,68,68,0.3)"}`,
              }}>
                <p style={{
                  fontFamily: "var(--font-ui)", fontSize: 13,
                  color: promoResult.success ? "var(--lime-text)" : "#ef4444", margin: 0,
                }}>
                  {promoResult.message}
                </p>
              </div>
            )}
          </div>

          {/* Payment history */}
          {paymentOrders.length > 0 && (
            <div className="card-base" style={{ padding: "24px" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--white)", marginBottom: 16 }}>
                История платежей
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {paymentOrders.map((order) => (
                  <div key={order.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border-dim)" }}>
                    <div>
                      <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--white)" }}>
                        {order.plan === "pro" ? "Student Pro" : "Academic+"}
                      </p>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--white-muted)" }}>
                        {new Date(order.createdAt).toLocaleDateString("ru-RU")} · {order.provider}
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--white)" }}>
                        {order.amount.toLocaleString()} {order.currency}
                      </span>
                      <span className={`badge ${statusBadge[order.status] ?? "badge"}`}>
                        {statusLabel[order.status] ?? order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* API tab */}
      {tab === "api" && (
        <div className="card-base" style={{ padding: "24px" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--white)", marginBottom: 6 }}>
            API Ключ
          </h3>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--white-dim)", marginBottom: 20 }}>
            API доступ доступен в плане Academic+. Позволяет интегрировать EduMind AI в ваши приложения.
          </p>
          {user.plan === "ACADEMIC" ? (
            <div style={{ background: "var(--bg-hover)", border: "1px solid var(--border-soft)", borderRadius: "var(--radius-md)", padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--lime-text)" }}>
              em_api_••••••••••••••••
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--white-muted)", marginBottom: 12 }}>Доступно только в Academic+</p>
              <Link href="/pricing" className="btn-primary btn-sm">Обновить план</Link>
            </div>
          )}

          <div style={{ marginTop: 24 }}>
            <h4 style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--white-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
              Лимиты по плану
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { plan: "Free", limit: "50 запросов / день", burst: "10 запросов / 10 сек" },
                { plan: "Student Pro", limit: "1000 запросов / день", burst: "10 запросов / 10 сек" },
                { plan: "Academic+", limit: "1000 запросов / день", burst: "10 запросов / 10 сек" },
              ].map((row) => (
                <div key={row.plan} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border-dim)" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--white)", width: 100 }}>{row.plan}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--white-muted)" }}>{row.limit}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--white-muted)", marginLeft: "auto" }}>{row.burst}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications tab */}
      {tab === "notifications" && (
        <div className="card-base" style={{ padding: "24px" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: "var(--white)", marginBottom: 16 }}>
            Уведомления
          </h3>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--white-dim)" }}>
            Настройка уведомлений будет доступна в следующем обновлении.
          </p>
        </div>
      )}
    </div>
  );
}
