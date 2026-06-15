"use client";

import { useState, useRef, useEffect } from "react";

interface ImageSettingsPopoverProps {
  prefix: string;
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function ImageSettingsPopover({
  prefix,
  data,
  onUpdate,
}: ImageSettingsPopoverProps) {
  const set = (key: string, value: unknown) =>
    onUpdate({ ...data, [key]: value });

  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        buttonRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        type="button"
        aria-label="Paramètres d'image"
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          border: "1px solid #E2E8F0",
          background: open ? "#EFF6FF" : "#F8FAFC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.15s ease",
          color: open ? "#2563EB" : "#64748B",
        }}
      >
        <i className="bi bi-sliders2" style={{ fontSize: "14px" }} />
      </button>

      {open && (
        <div
          ref={popoverRef}
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: 8,
            width: 240,
            background: "#fff",
            border: "1px solid #E2E8F0",
            borderRadius: 10,
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            zIndex: 1000,
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* --- Opacité --- */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#64748B",
                letterSpacing: "0.015em",
                textTransform: "uppercase",
              }}
            >
              Opacité
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(
                  ((data[`${prefix}ImageOpacity`] as number) ?? 1) * 100,
                )}
                onChange={(e) =>
                  set(`${prefix}ImageOpacity`, Number(e.target.value) / 100)
                }
                style={{
                  flex: 1,
                  accentColor: "#2563EB",
                  cursor: "pointer",
                  height: 6,
                  borderRadius: 3,
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#1E293B",
                  minWidth: 35,
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {Math.round(
                  ((data[`${prefix}ImageOpacity`] as number) ?? 1) * 100,
                )}
                %
              </span>
            </div>
          </div>

          {/* --- Dimensions (NOUVEAU) --- */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#64748B",
                letterSpacing: "0.015em",
                textTransform: "uppercase",
              }}
            >
              Dimensions (px)
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="number"
                value={(data[`${prefix}Width`] as string) ?? ""}
                onChange={(e) => set(`${prefix}Width`, e.target.value)}
                placeholder="W"
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 6,
                  border: "1px solid #E2E8F0",
                  background: "#F8FAFC",
                  fontSize: "12px",
                  textAlign: "center",
                  outline: "none",
                  color: "#1E293B",
                }}
              />
              <span
                style={{ fontSize: "11px", color: "#CBD5E1", fontWeight: 600 }}
              >
                ×
              </span>
              <input
                type="number"
                value={(data[`${prefix}Height`] as string) ?? ""}
                onChange={(e) => set(`${prefix}Height`, e.target.value)}
                placeholder="H"
                style={{
                  width: "100%",
                  padding: "6px 8px",
                  borderRadius: 6,
                  border: "1px solid #E2E8F0",
                  background: "#F8FAFC",
                  fontSize: "12px",
                  textAlign: "center",
                  outline: "none",
                  color: "#1E293B",
                }}
              />
            </div>
          </div>

          <div style={{ height: "0.5px", background: "#E2E8F0" }} />

          {/* --- Taille --- */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#64748B",
                letterSpacing: "0.015em",
                textTransform: "uppercase",
              }}
            >
              Taille
            </label>
            <select
              value={(data[`${prefix}ImageSize`] as string) ?? "cover"}
              onChange={(e) => set(`${prefix}ImageSize`, e.target.value)}
              style={{
                padding: "6px 8px",
                borderRadius: 6,
                border: "1px solid #E2E8F0",
                background: "#F8FAFC",
                fontSize: "12px",
                fontWeight: 500,
                outline: "none",
                color: "#1E293B",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          {/* --- Position --- */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#64748B",
                letterSpacing: "0.015em",
                textTransform: "uppercase",
              }}
            >
              Position
            </label>
            <select
              value={(data[`${prefix}ImagePosition`] as string) ?? "center"}
              onChange={(e) => set(`${prefix}ImagePosition`, e.target.value)}
              style={{
                padding: "6px 8px",
                borderRadius: 6,
                border: "1px solid #E2E8F0",
                background: "#F8FAFC",
                fontSize: "12px",
                fontWeight: 500,
                outline: "none",
                color: "#1E293B",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <option value="center">Center</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="top left">Top left</option>
              <option value="top right">Top right</option>
              <option value="bottom left">Bottom left</option>
              <option value="bottom right">Bottom right</option>
            </select>
          </div>

          <div style={{ height: "0.5px", background: "#E2E8F0" }} />

          {/* --- Flou --- */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#64748B",
                letterSpacing: "0.015em",
                textTransform: "uppercase",
              }}
            >
              Flou
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="range"
                min={0}
                max={20}
                value={Math.round((data[`${prefix}ImageBlur`] as number) ?? 0)}
                onChange={(e) =>
                  set(`${prefix}ImageBlur`, Number(e.target.value))
                }
                style={{
                  flex: 1,
                  accentColor: "#2563EB",
                  cursor: "pointer",
                  height: 6,
                  borderRadius: 3,
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#1E293B",
                  minWidth: 35,
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {Math.round((data[`${prefix}ImageBlur`] as number) ?? 0)}px
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
