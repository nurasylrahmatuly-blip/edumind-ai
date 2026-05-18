'use client';

import { useState } from "react";
import { Plus, Copy, Check, Power, Trash2 } from "lucide-react";

interface Ambassador {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  telegramUsername: string | null;
  refCode: string;
  commission: number;
  totalReferrals: number;
  totalRevenue: number;
  isActive: boolean;
  createdAt: string;
  _count: { referrals: number; paymentRequests: number };
}

interface Props {
  initialAmbassadors: Ambassador[];
}

const APP_URL = "https://edumind.kz";

export function AmbassadorsClient({ initialAmbassadors }: Props) {
  const [ambassadors, setAmbassadors] = useState(initialAmbassadors);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", telegram: "", refCode: "", commission: "15" });
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");

  function autoRefCode(name: string) {
    const clean = name.trim().split(" ")[0].toUpperCase().replace(/[^A-Z]/g, "");
    return clean ? `${clean}15` : "";
  }

  async function handleCreate() {
    if (!form.name || !form.email || !form.refCode) {
      setFormError("Имя, Email и Реф-код обязательны");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const res = await fetch("/api/admin/ambassadors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, email: form.email,
          phone: form.phone || undefined,
          telegramUsername: form.telegram || undefined,
          refCode: form.refCode,
          commission: parseInt(form.commission),
        }),
      });
      const data = await res.json();
      if (data.ambassador) {
        setAmbassadors((prev) => [{ ...data.ambassador, _count: { referrals: 0, paymentRequests: 0 } }, ...prev]);
        setShowModal(false);
        setForm({ name: "", email: "", phone: "", telegram: "", refCode: "", commission: "15" });
      } else {
        setFormError(data.error ?? "Ошибка");
      }
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(amb: Ambassador) {
    await fetch("/api/admin/ambassadors", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: amb.id, isActive: !amb.isActive }),
    });
    setAmbassadors((prev) => prev.map((a) => a.id === amb.id ? { ...a, isActive: !a.isActive } : a));
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить амбассадора?")) return;
    await fetch(`/api/admin/ambassadors?id=${id}`, { method: "DELETE" });
    setAmbassadors((prev) => prev.filter((a) => a.id !== id));
  }

  function copyLink(refCode: string, id: string) {
    navigator.clipboard.writeText(`${APP_URL}/?ref=${refCode}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: "Syne, sans-serif", fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
            Амбассадоры
          </h1>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#6b7280" }}>
            {ambassadors.length} амбассадоров
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#b8f727", color: "#070809",
            border: "none", borderRadius: 10, padding: "10px 18px",
            fontFamily: "Syne, sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer",
          }}
        >
          <Plus size={15} /> Добавить амбассадора
        </button>
      </div>

      {/* Table */}
      <div style={{ background: "#0d1117", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Имя", "Email", "Телефон", "Telegram", "Реф-код", "Переходов", "Конверсий", "Выручка тг", "Статус", "Действия"].map((h) => (
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
            {ambassadors.map((amb) => (
              <tr key={amb.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "12px 14px", fontFamily: "Inter, sans-serif", fontSize: 13, color: "#fff" }}>{amb.name}</td>
                <td style={{ padding: "12px 14px", fontFamily: "monospace", fontSize: 11, color: "#9ca3af" }}>{amb.email}</td>
                <td style={{ padding: "12px 14px", fontFamily: "monospace", fontSize: 11, color: "#9ca3af" }}>{amb.phone ?? "—"}</td>
                <td style={{ padding: "12px 14px", fontFamily: "monospace", fontSize: 11, color: "#9ca3af" }}>
                  {amb.telegramUsername ? `@${amb.telegramUsername}` : "—"}
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{
                    fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#b8f727",
                    background: "rgba(184,247,39,0.08)", padding: "3px 8px", borderRadius: 6,
                  }}>
                    {amb.refCode}
                  </span>
                </td>
                <td style={{ padding: "12px 14px", fontFamily: "monospace", fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
                  {amb._count.referrals}
                </td>
                <td style={{ padding: "12px 14px", fontFamily: "monospace", fontSize: 12, color: "#9ca3af", textAlign: "center" }}>
                  {amb._count.paymentRequests}
                </td>
                <td style={{ padding: "12px 14px", fontFamily: "Syne, sans-serif", fontSize: 13, fontWeight: 700, color: "#b8f727" }}>
                  {amb.totalRevenue.toLocaleString("ru-RU")}
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <span style={{
                    display: "inline-block", padding: "3px 8px", borderRadius: 6, fontSize: 10,
                    fontFamily: "monospace", fontWeight: 700,
                    background: amb.isActive ? "rgba(184,247,39,0.1)" : "rgba(239,68,68,0.1)",
                    color: amb.isActive ? "#b8f727" : "#ef4444",
                    border: `1px solid ${amb.isActive ? "rgba(184,247,39,0.3)" : "rgba(239,68,68,0.3)"}`,
                  }}>
                    {amb.isActive ? "Активен" : "Неактивен"}
                  </span>
                </td>
                <td style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      title="Копировать реф-ссылку"
                      onClick={() => copyLink(amb.refCode, amb.id)}
                      style={{
                        padding: "5px 8px", borderRadius: 6,
                        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                        color: copiedId === amb.id ? "#b8f727" : "#9ca3af", cursor: "pointer",
                      }}
                    >
                      {copiedId === amb.id ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                    <button
                      title={amb.isActive ? "Деактивировать" : "Активировать"}
                      onClick={() => toggleActive(amb)}
                      style={{
                        padding: "5px 8px", borderRadius: 6,
                        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                        color: "#9ca3af", cursor: "pointer",
                      }}
                    >
                      <Power size={13} />
                    </button>
                    <button
                      title="Удалить"
                      onClick={() => handleDelete(amb.id)}
                      style={{
                        padding: "5px 8px", borderRadius: 6,
                        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                        color: "#ef4444", cursor: "pointer",
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {ambassadors.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", color: "#6b7280", fontFamily: "Inter, sans-serif", fontSize: 13 }}>
            Нет амбассадоров
          </div>
        )}
      </div>

      {/* Create modal */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        }}>
          <div style={{
            background: "#0d1117", border: "1px solid rgba(184,247,39,0.2)",
            borderRadius: 16, padding: 28, maxWidth: 460, width: "100%",
          }}>
            <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 20 }}>
              Добавить амбассадора
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { key: "name", label: "Имя *", placeholder: "Зарина Сейтова" },
                { key: "email", label: "Email *", placeholder: "zarina@example.com" },
                { key: "phone", label: "Телефон", placeholder: "+7 777 000 0000" },
                { key: "telegram", label: "Telegram", placeholder: "username (без @)" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label style={{ fontFamily: "monospace", fontSize: 10, color: "#6b7280", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                    {label}
                  </label>
                  <input
                    value={form[key as keyof typeof form]}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm((f) => {
                        const next = { ...f, [key]: val };
                        if (key === "name" && !f.refCode) next.refCode = autoRefCode(val);
                        return next;
                      });
                    }}
                    placeholder={placeholder}
                    style={{
                      width: "100%", padding: "10px 12px",
                      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10, color: "#fff", fontFamily: "Inter, sans-serif", fontSize: 13,
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontFamily: "monospace", fontSize: 10, color: "#6b7280", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                    Реф-код *
                  </label>
                  <input
                    value={form.refCode}
                    onChange={(e) => setForm((f) => ({ ...f, refCode: e.target.value.toUpperCase() }))}
                    placeholder="ZARINA15"
                    style={{
                      width: "100%", padding: "10px 12px",
                      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10, color: "#b8f727", fontFamily: "monospace", fontSize: 13,
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontFamily: "monospace", fontSize: 10, color: "#6b7280", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                    Комиссия %
                  </label>
                  <input
                    type="number"
                    value={form.commission}
                    onChange={(e) => setForm((f) => ({ ...f, commission: e.target.value }))}
                    style={{
                      width: "100%", padding: "10px 12px",
                      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10, color: "#fff", fontFamily: "monospace", fontSize: 13,
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
              </div>
            </div>

            {formError && (
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: 13, color: "#ef4444", marginTop: 10 }}>{formError}</p>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                onClick={() => { setShowModal(false); setFormError(""); }}
                style={{
                  flex: "0 0 auto", padding: "12px 20px",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, cursor: "pointer", color: "#9ca3af", fontFamily: "Inter, sans-serif", fontSize: 14,
                }}
              >
                Отмена
              </button>
              <button
                onClick={handleCreate}
                disabled={saving}
                style={{
                  flex: 1, background: "#b8f727", color: "#070809",
                  border: "none", borderRadius: 10, padding: "12px",
                  fontFamily: "Syne, sans-serif", fontSize: 14, fontWeight: 700,
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving ? "Сохранение…" : "Создать"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
