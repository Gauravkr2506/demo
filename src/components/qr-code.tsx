"use client";

import { useMemo } from "react";
import { qrMatrix, qrPath } from "@/lib/qr";

/**
 * Renders a real, scannable QR code as inline SVG.
 *
 * `logo` punches a quiet square in the middle for the brand mark — safe at
 * EC level M for the small payloads used here.
 */
export function QRCode({
  value,
  size = 200,
  color = "#0b0b10",
  background = "#ffffff",
  logo = true,
  className,
}: {
  value: string;
  size?: number;
  color?: string;
  background?: string;
  logo?: boolean;
  className?: string;
}) {
  const { path, modules } = useMemo(() => {
    try {
      const grid = qrMatrix(value);
      return { path: qrPath(grid), modules: grid.length };
    } catch {
      return { path: "", modules: 21 };
    }
  }, [value]);

  const quiet = 3;
  const total = modules + quiet * 2;
  const logoSpan = Math.round(modules * 0.24);
  const logoStart = (total - logoSpan) / 2;

  return (
    <svg
      className={`qr-svg${className ? ` ${className}` : ""}`}
      width={size}
      height={size}
      viewBox={`0 0 ${total} ${total}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={`QR code for ${value}`}
    >
      <rect width={total} height={total} fill={background} />
      <g transform={`translate(${quiet} ${quiet})`} fill={color}>
        <path d={path} />
      </g>
      {logo && (
        <g>
          <rect
            x={logoStart}
            y={logoStart}
            width={logoSpan}
            height={logoSpan}
            rx={logoSpan * 0.22}
            fill={background}
          />
          <rect
            x={logoStart + logoSpan * 0.16}
            y={logoStart + logoSpan * 0.16}
            width={logoSpan * 0.68}
            height={logoSpan * 0.68}
            rx={logoSpan * 0.17}
            fill={color}
          />
          <rect
            x={logoStart + logoSpan * 0.3}
            y={logoStart + logoSpan * 0.3}
            width={logoSpan * 0.4}
            height={logoSpan * 0.4}
            rx={logoSpan * 0.09}
            fill={background}
          />
        </g>
      )}
    </svg>
  );
}

/** The framed "SCAN ME" treatment used throughout the concepts. */
export function ScanCard({
  value,
  size = 190,
  label = "SCAN ME",
  accent,
  className,
}: {
  value: string;
  size?: number;
  label?: string;
  accent?: string;
  className?: string;
}) {
  return (
    <div className={`qr-card${className ? ` ${className}` : ""}`}>
      <QRCode value={value} size={size} color={accent ?? "#0b0b10"} />
      <span className="qr-scan-label" style={accent ? { background: accent } : undefined}>
        {label}
      </span>
    </div>
  );
}
