"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--bg-hover)", border: "1px solid var(--border-soft)",
  borderRadius: "var(--radius-md)", padding: "10px 14px",
  fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--white)", outline: "none",
  transition: "border-color 0.15s",
};

export default function LoginPage() {
  const searchParams = useSearchParams();
  const isVerify = searchParams.get("verify") === "1";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      const result = await signIn("nodemailer", { email, redirect: false, callbackUrl: "/dashboard" });
      if (result?.error) setError("Не удалось отправить письмо. Попробуйте ещё раз.");
      else setEmailSent(true);
    } catch {
      setError("Произошла ошибка. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  const cardStyle: React.CSSProperties = {
    width: "100%", maxWidth: 420,
    background: "var(--bg-raised)", border: "1px solid var(--border-soft)",
    borderRadius: "var(--radius-xl)", padding: 32,
  };

  if (emailSent || isVerify) {
    return (
      <div style={cardStyle}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "var(--radius-xl)", background: "var(--lime-dim)", border: "1px solid var(--border-lime)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 28 }}>
            ✉️
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--white)", marginBottom: 8 }}>Проверь почту</h2>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--white-dim)", lineHeight: 1.65 }}>
            Мы отправили ссылку для входа на{" "}
            <span style={{ color: "var(--lime-text)", fontWeight: 500 }}>{email || "твой email"}</span>.
            Нажми на неё чтобы войти.
          </p>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--white-muted)", marginTop: 12 }}>
            Не нашёл письмо? Проверь папку «Спам»
          </p>
          <button className="btn-ghost" style={{ marginTop: 16, width: "100%", justifyContent: "center" }} onClick={() => { setEmailSent(false); setEmail(""); }}>
            Отправить снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: "var(--lime)", color: "#070809", fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 0 16px var(--lime-glow)" }}>
          E
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--white)", marginBottom: 4 }}>Добро пожаловать</h1>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: 14, color: "var(--white-dim)" }}>Войди в свой аккаунт EduMind AI</p>
      </div>

      {/* Google */}
      <button
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="btn-outline"
        style={{ width: "100%", justifyContent: "center", marginBottom: 16, borderColor: "var(--border-med)", color: "var(--white)" }}
      >
        {googleLoading ? (
          <span style={{ width: 18, height: 18, border: "2px solid var(--border-soft)", borderTopColor: "var(--lime)", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
        ) : <GoogleIcon />}
        Войти через Google
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ flex: 1, height: 1, background: "var(--border-dim)" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--white-muted)" }}>или</span>
        <div style={{ flex: 1, height: 1, background: "var(--border-dim)" }} />
      </div>

      <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--white-muted)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 6 }}>
            Email
          </label>
          <input
            type="email"
            placeholder="student@university.kz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "var(--border-lime)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-soft)")}
          />
        </div>

        {error && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#fb7185" }}>{error}</p>
        )}

        <button type="submit" disabled={loading || !email} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
          {loading ? (
            <span style={{ width: 14, height: 14, border: "2px solid rgba(7,8,9,0.3)", borderTopColor: "#070809", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
          ) : <Mail size={14} />}
          Отправить ссылку для входа
        </button>
      </form>

      <p style={{ fontFamily: "var(--font-ui)", fontSize: 13, color: "var(--white-muted)", textAlign: "center", marginTop: 20 }}>
        Нет аккаунта?{" "}
        <Link href="/register" style={{ color: "var(--lime-text)", fontWeight: 500, textDecoration: "none" }}>
          Зарегистрироваться <ArrowRight size={11} style={{ display: "inline", verticalAlign: "middle" }} />
        </Link>
      </p>
    </div>
  );
}
