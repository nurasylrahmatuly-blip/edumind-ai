'use client';

import { useState } from "react";
import { Check, X, Copy, CheckCircle } from "lucide-react";

interface PaymentRequest {
  id: string;
  plan: string;
  months: number;
  originalAmount: number;
  discount: number;
  finalAmount: number;
  customerName: string | null;
  customerPhone: string | null;
  refCode: string | null;
  status: string;
  createdAt: string;
  adminNote: string | null;
  promoCodeId: string | null;
  user: { id: string; email: string; name: string | null } | null;
  ambassador: { id: string; name: string; refCode: string } | null;
}

interface PromoCode {
  id: string;
  code: string;
  plan: string;
  months: number;
}

interface Props {
  initialRequests: PaymentRequest[];
  availablePromoCodes: PromoCode[];
  pendingCount: number;
  confirmedToday: number;
}

const statusColors: Record<string, string> = {
  pending: "rgba(251,191,36,0.15)",
  confirmed: "rgba(184,247,39,0.06)",
  rejected: "rgba(239,68,68,0.06)",
};
const statusBorders: Record<string, string> = {
  pending: "rgba(251,191,36,0.4)",
  confirmed: "rgba(184,247,39,0.2)",
  rejected: "rgba(239,68,68,0.2)",
};
const statusLabels: Record<string, string> = {
  pending: "Ожидает", confirmed: "Подтверждено", rejected: "Отклонено",
};
const planLabels: Record<string, string> = { pro: "Student Pro", academic: "Academic+" };

export function PaymentsClient({ initialRequests, availablePromoCodes, pendingCount, confirmedToday }: Props) {
  const [requests, setRequests] = useState(initialRequests);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [confirmModal, setConfirmModal] = useState<PaymentRequest | null>(null);
  const [rejectModal, setRejectModal] = useState<PaymentRequest | null>(null);
  const [selectedPromo, setSelectedPromo] = useState("");
  const [rejectNote, setRejectNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [givenPromoCode, setGivenPromoCode] = useState<string | null>(null);
  const [copiedPromo, setCopiedPromo] = useState(false);

  const filtered = filterStatus === "all" ? requests : requests.filter((r) => r.status === filterStatus);
  const filteredPromoCodes = confirmModal
    ? availablePromoCodes.filter((p) => p.plan === confirmModal.plan)
    : [];

  async function handleConfirm() {
    if (!confirmModal) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: confirmModal.id, promoCodeId: selectedPromo || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests((prev) => prev.map((r) => r.id === confirmModal.id ? { ...r, status: "confirmed" } : r));
        if (data.promoCode) {
          setGivenPromoCode(data.promoCode);
        } else {
          setConfirmModal(null);
        }
      }
    } finally {
      setActionLoading(false);
      setSelectedPromo("");
    }
  }

  async function handleReject() {
    if (!rejectModal) return;
    setActionLoading(true);
    try {
      await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rejectModal.id, status: "rejected", adminNote: rejectNote }),
      });
      setRequests((prev) => prev.map((r) => r.id === rejectModal.id ? { ...r, status: "rejected", adminNote: rejectNote } : r));
      setRejectModal(null);
      setRejectNote("");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 6 }}>
          Заявки на оплату Kaspi
        </h1>
        <div style={{ display: "flex", gap: 16 }}>
          <span style={{ fontFamily: "monospace", fontSize: 12, color: "#fbbf24" }}>
            {pendingCount} ожидают
          </span>
          <span style={{ fontFamily: "monospace", fontSize: 12, color: "#b8f727" }}>
            {confirmedToday} подтверждено сегодня
          </span>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all", "pending", "confirmed", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              padding: "6px 14px", borderRadius: 8, border: "1px solid",
              borderColor: filterStatus === s ? "#b8f727" : "rgba(255,255,255,0.1)",
              background: filterStatus === s ? "rgba(184,247,39,0.1)" : "transparent",
              color: filterStatus === s ? "#b8f727" : "#9ca3af",
              fontFamily: "Inter, sans-serif", fontSize: 12, cursor: "pointer",
            }}
          >
            {{ all: "Все", pending: "Ожидает", confirmed: "Подтверждено", rejected: "Отклонено" }[s]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["ID", "Клиент", "Телефон", "Тариф", "Мес.", "Сумма", "Реф-код", "Статус", "Дата", "Действия"].map((h) => (
                <th key={h} style={{
                  padding: "10px 14px", textAlign: "left",
                  fontFamily: "monospace", fontSize: 10, color: "#6b7280",
                  textTransform: "uppercase", letterSpacing: "0.08em",
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((req) => (
              <tr
                key={req.id}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                  background: statusColors[req.status] ?? "transparent",
                  borderLeft: `3px solid ${req.status === "pending" ? statusBorders.pending : "transparent"}`,
                }}
              >
                <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 11, color: "#6b7280" }}>
                  {req.id.slice(-8).toUpperCase()}
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#fff" }}>
                    {req.customerName ?? req.user?.name ?? "—"}
                  </div>
                  {req.user?.email && (
                    <div style={{ fontFamily: "monospace", fontSize: 10, color: "#6b7280" }}>{req.user.email}</div>
                  )}
                </td>
                <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 12, color: "#9ca3af" }}>
                  {req.customerPhone ?? "—"}
                </td>
                <td style={{ padding: "10px 14px", fontFamily: "Inter, sans-serif", fontSize: 12, color: "#fff" }}>
                  {planLabels[req.plan] ?? req.plan}
                </td>
                <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
                  {req.months}
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, color: "#b8f727" }}>
                    {req.finalAmount.toLocaleString("ru-RU")} тг
                  </div>
                  {req.discount > 0 && (
                    <div style={{ fontFamily: "monospace", fontSize: 10, color: "#6b7280" }}>−{req.discount}%</div>
                  )}
                </td>
                <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 11, color: "#b8f727" }}>
                  {req.refCode ?? "—"}
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{
                    display: "inline-block", padding: "3px 8px", borderRadius: 6,
                    background: statusColors[req.status], border: `1px solid ${statusBorders[req.status] ?? "transparent"}`,
                    fontFamily: "monospace", fontSize: 10, color: req.status === "pending" ? "#fbbf24" : req.status === "confirmed" ? "#b8f727" : "#ef4444",
                  }}>
                    {statusLabels[req.status] ?? req.status}
                  </span>
                </td>
                <td style={{ padding: "10px 14px", fontFamily: "monospace", fontSize: 10, color: "#6b7280" }}>
                  {new Date(req.createdAt).toLocaleDateString("ru-RU")}
                </td>
                <td style={{ padding: "10px 14px" }}>
                  {req.status === "pending" && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => setConfirmModal(req)}
                        style={{
                          padding: "5px 10px", borderRadius: 7,
                          background: "rgba(184,247,39,0.12)", border: "1px solid rgba(184,247,39,0.3)",
                          color: "#b8f727", fontSize: 11, cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 4, fontFamily: "Inter, sans-serif",
                        }}
                      >
                        <Check size={11} /> Подтвердить
                      </button>
                      <button
                        onClick={() => setRejectModal(req)}
                        style={{
                          padding: "5px 10px", borderRadius: 7,
                          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                          color: "#ef4444", fontSize: 11, cursor: "pointer",
                          display: "flex", alignItems: "center", gap: 4, fontFamily: "Inter, sans-serif",
                        }}
                      >
                        <X size={11} /> Отклонить
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#6b7280", fontFamily: "Inter, sans-serif", fontSize: 13 }}>
            Нет заявок
          </div>
        )}
      </div>

      {/* Confirm modal */}
      {confirmModal && !givenPromoCode && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        }}>
          <div style={{
            background: "#0d1117", border: "1px solid rgba(184,247,39,0.2)",
            borderRadius: 16, padding: 28, maxWidth: 440, width: "100%",
          }}>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16 }}>
              Подтвердить заявку
            </h3>
            <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 14, marginBottom: 16 }}>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#9ca3af", margin: "0 0 4px" }}>
                Клиент: <span style={{ color: "#fff" }}>{confirmModal.customerName ?? "—"}</span>
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#9ca3af", margin: "0 0 4px" }}>
                Тариф: <span style={{ color: "#fff" }}>{planLabels[confirmModal.plan]}</span> × {confirmModal.months} мес.
              </p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 14, color: "#b8f727", fontWeight: 700, margin: 0 }}>
                Сумма: {confirmModal.finalAmount.toLocaleString("ru-RU")} тг
              </p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontFamily: "monospace", fontSize: 11, color: "#6b7280", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                Промокод для клиента ({filteredPromoCodes.length} доступно)
              </label>
              <select
                value={selectedPromo}
                onChange={(e) => setSelectedPromo(e.target.value)}
                style={{
                  width: "100%", padding: "10px 12px",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, color: "#fff", fontFamily: "monospace", fontSize: 13,
                  outline: "none",
                }}
              >
                <option value="">— Без промокода —</option>
                {filteredPromoCodes.map((p) => (
                  <option key={p.id} value={p.id}>{p.code} ({p.months} мес.)</option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setConfirmModal(null)}
                style={{
                  flex: "0 0 auto", padding: "12px 20px",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, cursor: "pointer", color: "#9ca3af", fontFamily: "Inter, sans-serif", fontSize: 14,
                }}
              >
                Отмена
              </button>
              <button
                onClick={handleConfirm}
                disabled={actionLoading}
                style={{
                  flex: 1, background: "#b8f727", color: "#070809",
                  border: "none", borderRadius: 10, padding: "12px",
                  fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700,
                  cursor: actionLoading ? "not-allowed" : "pointer",
                }}
              >
                {actionLoading ? "…" : "Подтвердить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Given promo code display */}
      {givenPromoCode && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        }}>
          <div style={{
            background: "#0d1117", border: "1px solid rgba(184,247,39,0.3)",
            borderRadius: 16, padding: 32, maxWidth: 380, width: "100%", textAlign: "center",
          }}>
            <CheckCircle size={40} color="#b8f727" style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 8 }}>
              Заявка подтверждена!
            </h3>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#9ca3af", marginBottom: 20 }}>
              Отправьте клиенту промокод:
            </p>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, justifyContent: "center",
              background: "rgba(184,247,39,0.08)", border: "1px solid rgba(184,247,39,0.3)",
              borderRadius: 10, padding: "14px 20px", marginBottom: 20,
            }}>
              <span style={{ fontFamily: "monospace", fontSize: 20, fontWeight: 700, color: "#b8f727" }}>
                {givenPromoCode}
              </span>
              <button
                onClick={() => { navigator.clipboard.writeText(givenPromoCode); setCopiedPromo(true); setTimeout(() => setCopiedPromo(false), 2000); }}
                style={{
                  background: "rgba(184,247,39,0.15)", border: "1px solid rgba(184,247,39,0.3)",
                  borderRadius: 6, padding: "6px", cursor: "pointer", color: copiedPromo ? "#b8f727" : "#9ca3af",
                }}
              >
                {copiedPromo ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <button
              onClick={() => { setGivenPromoCode(null); setConfirmModal(null); }}
              style={{
                width: "100%", background: "#b8f727", color: "#070809",
                border: "none", borderRadius: 10, padding: "12px",
                fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700, cursor: "pointer",
              }}
            >
              Готово
            </button>
          </div>
        </div>
      )}

      {/* Reject modal */}
      {rejectModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        }}>
          <div style={{
            background: "#0d1117", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 16, padding: 28, maxWidth: 400, width: "100%",
          }}>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 16 }}>
              Отклонить заявку
            </h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontFamily: "monospace", fontSize: 11, color: "#6b7280", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                Причина
              </label>
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                rows={3}
                placeholder="Необязательно"
                style={{
                  width: "100%", padding: "10px 12px",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, color: "#fff", fontFamily: "Inter, sans-serif", fontSize: 13,
                  outline: "none", resize: "none", boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setRejectModal(null)}
                style={{
                  flex: "0 0 auto", padding: "12px 20px",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, cursor: "pointer", color: "#9ca3af", fontFamily: "Inter, sans-serif", fontSize: 14,
                }}
              >
                Отмена
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading}
                style={{
                  flex: 1, background: "rgba(239,68,68,0.85)", color: "#fff",
                  border: "none", borderRadius: 10, padding: "12px",
                  fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700,
                  cursor: actionLoading ? "not-allowed" : "pointer",
                }}
              >
                {actionLoading ? "…" : "Отклонить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
