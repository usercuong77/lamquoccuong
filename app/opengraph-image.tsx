import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px",
          color: "#f5f7fc",
          background:
            "radial-gradient(circle at 15% -15%, rgba(79,141,255,0.35), transparent 42%), radial-gradient(circle at 85% 5%, rgba(211,176,111,0.24), transparent 35%), linear-gradient(165deg, #07090f, #0a111d 45%, #070a12 100%)"
        }}
      >
        <div
          style={{
            fontSize: 20,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            opacity: 0.8
          }}
        >
          Lam Quoc Cuong
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.04, maxWidth: 930 }}>
          Strategic Video Editing for Stronger Brand Presence
        </div>
      </div>
    ),
    size
  );
}
