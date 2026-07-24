import { ImageResponse } from "next/og";

export const alt = "Cinematic — Khám phá thế giới điện ảnh";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 75% 20%, #7f1d1d 0, #18181b 36%, #050507 75%)",
          color: "white",
          display: "flex",
          height: "100%",
          justifyContent: "center",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 40,
            display: "flex",
            flexDirection: "column",
            padding: "72px 88px",
            width: 1000,
          }}
        >
          <div
            style={{
              color: "#ef4444",
              display: "flex",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
            }}
          >
            Movie discovery
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 900,
              letterSpacing: "-0.05em",
              marginTop: 22,
            }}
          >
            CINE<span style={{ color: "#ef4444" }}>MATIC</span>
          </div>
          <div
            style={{
              color: "#d4d4d8",
              display: "flex",
              fontSize: 34,
              marginTop: 20,
            }}
          >
            Khám phá thế giới điện ảnh.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
