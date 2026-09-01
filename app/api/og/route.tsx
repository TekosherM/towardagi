import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

const GRID = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Cpath d='M0 0h56v56H0z' fill='none'/%3E%3Cpath d='M0 0h1v56H0zM0 0h56v1H0z' fill='%23e9edf2' fill-opacity='0.035'/%3E%3C/svg%3E")`;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") ?? "Toward AGI";
  const description = searchParams.get("description") ?? "Dispatches from the road to AGI";
  const category = searchParams.get("category") ?? "";

  const truncatedTitle = title.length > 80 ? `${title.slice(0, 77)}...` : title;
  const truncatedDesc = description.length > 120 ? `${description.slice(0, 117)}...` : description;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#06070a",
          padding: "60px",
          justifyContent: "space-between",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: GRID,
            opacity: 0.5,
          }}
        />

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(53,240,208,0.08), transparent 75%)",
          }}
        />

        {/* Top section - Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "1px solid rgba(53,240,208,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#35f0d0",
                borderRadius: "50%",
              }}
            />
          </div>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#e9edf2",
              letterSpacing: "-0.02em",
            }}
          >
            TOWARD<span style={{ color: "#35f0d0" }}>//</span>AGI
          </span>
        </div>

        {/* Middle section - Title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", position: "relative", flex: 1, justifyContent: "center" }}>
          {category && (
            <span
              style={{
                fontSize: "14px",
                color: "#35f0d0",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontWeight: 500,
              }}
            >
              {category}
            </span>
          )}
          <h1
            style={{
              fontSize: title.length > 50 ? "48px" : "56px",
              fontWeight: 700,
              color: "#e9edf2",
              lineHeight: 1.1,
              margin: 0,
              letterSpacing: "-0.02em",
            }}
          >
            {truncatedTitle}
          </h1>
          {truncatedDesc && (
            <p
              style={{
                fontSize: "20px",
                color: "#97a1af",
                lineHeight: 1.5,
                margin: 0,
                maxWidth: "80%",
              }}
            >
              {truncatedDesc}
            </p>
          )}
        </div>

        {/* Bottom section */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>
          <div
            style={{
              width: "40px",
              height: "2px",
              backgroundColor: "#35f0d0",
            }}
          />
          <span
            style={{
              fontSize: "13px",
              color: "#5b6470",
              textTransform: "uppercase",
              letterSpacing: "0.18em",
            }}
          >
            towardagi.com
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
