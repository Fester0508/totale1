import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "LavoroChiaro - Analisi AI della tua busta paga in 30 secondi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a5f 0%, #152a45 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(217, 119, 6, 0.15)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(59, 130, 246, 0.1)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
            zIndex: 1,
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              backgroundColor: "rgba(217, 119, 6, 0.2)",
              borderRadius: 50,
              padding: "10px 24px",
              fontSize: 20,
              color: "#fbbf24",
              fontWeight: 600,
            }}
          >
            Il 67% dei lavoratori ha errori in busta paga
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "white",
              textAlign: "center",
              lineHeight: 1.1,
              maxWidth: 900,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span>La tua busta paga</span>
            <span>
              è corretta?{" "}
              <span style={{ color: "#d97706" }}>Scoprilo in 30s.</span>
            </span>
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 24,
              color: "rgba(255, 255, 255, 0.7)",
              textAlign: "center",
              maxWidth: 700,
              display: "flex",
            }}
          >
            Analisi AI gratuita, senza registrazione. GDPR compliant.
          </div>

          {/* Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 16,
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "white",
                display: "flex",
              }}
            >
              Lavoro
              <span style={{ color: "#d97706" }}>Chiaro</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
