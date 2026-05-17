import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#070809",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Logo E badge */}
        <div
          style={{
            width: 80,
            height: 80,
            background: "#b8f727",
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 40,
            fontWeight: 800,
            color: "#070809",
            marginBottom: 32,
            boxShadow: "0 0 60px rgba(184,247,39,0.4)",
          }}
        >
          E
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#f4f4f2",
            letterSpacing: "-2px",
            lineHeight: 1,
            marginBottom: 16,
            display: "flex",
          }}
        >
          EduMind{" "}
          <span style={{ color: "#b8f727", marginLeft: 16 }}>AI</span>
        </div>

        <div
          style={{
            fontSize: 28,
            color: "rgba(244,244,242,0.55)",
            maxWidth: 700,
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          Умный AI-ассистент для студентов
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 40,
          }}
        >
          {["9 AI-агентов", "Курсовые по ГОСТ", "DOCX / PPTX", "KZT / USD"].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  background: "rgba(184,247,39,0.1)",
                  border: "1px solid rgba(184,247,39,0.25)",
                  borderRadius: 999,
                  padding: "8px 20px",
                  fontSize: 16,
                  color: "#c9f94a",
                  fontFamily: "monospace",
                }}
              >
                {tag}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
