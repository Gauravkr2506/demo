"use client";

import { useEffect, useState } from "react";
import { Icon } from "./icon";
import { useToast } from "@/lib/store";

/* ------------------------------------------------------------------ modal */

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div
        className="modal"
        style={width ? { width: `min(${width}px, 100%)` } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="between" style={{ padding: "20px 22px 0", alignItems: "flex-start" }}>
            <div>
              <h3 className="h3">{title}</h3>
              {subtitle && <p className="small muted" style={{ marginTop: 3 }}>{subtitle}</p>}
            </div>
            <button className="btn btn-icon btn-plain" onClick={onClose} aria-label="Close">
              <Icon name="x" size={18} />
            </button>
          </div>
        )}
        <div style={{ padding: "18px 22px 22px" }}>{children}</div>
        {footer && (
          <div style={{ padding: "0 22px 22px", display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- switch */

export function Switch({
  on,
  onChange,
  label,
  small,
}: {
  on: boolean;
  onChange: (next: boolean) => void;
  label: string;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      className={`switch${small ? " switch-sm" : ""}`}
      data-on={on}
      onClick={() => onChange(!on)}
    />
  );
}

/* ------------------------------------------------------------- segmented */

export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (next: T) => void;
}) {
  return (
    <div className="segmented" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          data-active={value === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- fields */

export function Field({
  label,
  hint,
  children,
  counter,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  counter?: string;
}) {
  return (
    <div className="field">
      <label className="label">{label}</label>
      {children}
      <div className="between" style={{ gap: 8 }}>
        {hint ? <span className="hint">{hint}</span> : <span />}
        {counter && <span className="counter">{counter}</span>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- copy field */

export function CopyRow({ value, label }: { value: string; label?: string }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard blocked — the prototype still confirms the intent */
    }
    setCopied(true);
    toast(label ? `${label} copied` : "Copied to clipboard", "copy");
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div
      className="row g8"
      style={{
        background: "var(--bg-alt)",
        border: "1px solid var(--line)",
        borderRadius: "var(--r-sm)",
        padding: "9px 9px 9px 14px",
      }}
    >
      <span className="small truncate grow" style={{ color: "var(--ink-700)", fontFamily: "var(--font-geist-mono), monospace" }}>
        {value}
      </span>
      <button className="btn btn-sm btn-soft" onClick={copy}>
        <Icon name={copied ? "check" : "copy"} size={14} />
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------ empty state */

export function EmptyState({
  icon = "layers",
  title,
  body,
  action,
}: {
  icon?: string;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card center" style={{ padding: "48px 24px" }}>
      <div
        style={{
          width: 54, height: 54, borderRadius: 16, margin: "0 auto 14px",
          background: "var(--bg-lilac)", color: "var(--brand-600)",
          display: "grid", placeItems: "center",
        }}
      >
        <Icon name={icon} size={24} />
      </div>
      <h3 className="h4">{title}</h3>
      <p className="small muted" style={{ maxWidth: 380, margin: "6px auto 0" }}>{body}</p>
      {action && <div style={{ marginTop: 18 }}>{action}</div>}
    </div>
  );
}

/* ----------------------------------------------------------------- stats */

export function StatCard({
  label,
  value,
  delta,
  icon,
  accent = "var(--brand-600)",
}: {
  label: string;
  value: string | number;
  delta?: number;
  icon: string;
  accent?: string;
}) {
  return (
    <div className="stat">
      <div className="between" style={{ marginBottom: 10 }}>
        <span
          style={{
            width: 34, height: 34, borderRadius: 10, display: "grid", placeItems: "center",
            background: "color-mix(in srgb, " + accent + " 12%, transparent)", color: accent,
          }}
        >
          <Icon name={icon} size={17} />
        </span>
        {delta !== undefined && (
          <span className={`trend ${delta >= 0 ? "trend-up" : "trend-down"}`}>
            <Icon name={delta >= 0 ? "trendUp" : "trendDown"} size={13} />
            {delta >= 0 ? "+" : ""}{delta}%
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/** Lightweight bar chart — no charting dependency. */
export function BarChart({
  data,
  height = 168,
  accent = "var(--brand-600)",
}: {
  data: { label: string; scans: number }[];
  height?: number;
  accent?: string;
}) {
  const max = Math.max(...data.map((d) => d.scans), 1);
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div>
      <div
        style={{
          display: "flex", alignItems: "flex-end", gap: 3,
          height, padding: "0 2px",
        }}
      >
        {data.map((d, i) => (
          <div
            key={`${d.label}-${i}`}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            style={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-end", position: "relative" }}
          >
            <div
              style={{
                width: "100%",
                height: `${(d.scans / max) * 100}%`,
                minHeight: 3,
                borderRadius: "4px 4px 2px 2px",
                background: hover === i ? accent : "color-mix(in srgb, " + accent + " 34%, transparent)",
                transition: "background 120ms, height 500ms cubic-bezier(.22,1,.36,1)",
              }}
            />
            {hover === i && (
              <div
                style={{
                  position: "absolute", bottom: "100%", left: "50%", transform: "translate(-50%,-6px)",
                  background: "var(--ink-900)", color: "#fff", padding: "5px 9px", borderRadius: 8,
                  fontSize: 11, fontWeight: 650, whiteSpace: "nowrap", zIndex: 5, pointerEvents: "none",
                }}
              >
                {d.label} · {d.scans}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="between tiny muted" style={{ marginTop: 8 }}>
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

export function MeterRow({
  label,
  value,
  max,
  suffix = "",
  color = "var(--brand-600)",
}: {
  label: string;
  value: number;
  max: number;
  suffix?: string;
  color?: string;
}) {
  return (
    <div>
      <div className="between small" style={{ marginBottom: 6 }}>
        <span style={{ fontWeight: 620 }}>{label}</span>
        <span className="muted">{value}{suffix}</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ accordion */

export function Accordion({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="stack g10">
      {items.map((item, i) => (
        <div key={item.q} className="card" style={{ overflow: "hidden" }}>
          <button
            className="between"
            style={{ width: "100%", padding: "16px 18px", textAlign: "left", gap: 14 }}
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
          >
            <span style={{ fontWeight: 680, letterSpacing: "-0.01em" }}>{item.q}</span>
            <span
              style={{
                flex: "none", color: "var(--brand-600)",
                transform: open === i ? "rotate(45deg)" : "none",
                transition: "transform 240ms cubic-bezier(.22,1,.36,1)",
              }}
            >
              <Icon name="plus" size={18} />
            </span>
          </button>
          {open === i && (
            <p className="small muted" style={{ padding: "0 18px 18px", maxWidth: "68ch" }}>
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
