"use client";

import { useState } from "react";
import { CtaLinkEditor } from "../CtaLinkEditor";

interface ButtonConfig {
  key: string;
  label: string;
}

interface ButtonEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
  buttons: ButtonConfig[];
  sectionAnchors: { label: string; href: string }[];
  pageOptions: { label: string; href: string }[];
  inputStyle?: React.CSSProperties;
}

export function ButtonEditor({
  data,
  onUpdate,
  buttons,
  sectionAnchors,
  pageOptions,
  inputStyle,
}: ButtonEditorProps) {
  const [expandedCta, setExpandedCta] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {buttons.map((btn, index) => {
        const key = btn.key;
        return (
          <div
            key={key}
            style={{
              background: "#F8FAFC",
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              marginBottom: index === buttons.length - 1 ? 0 : 8,
            }}
          >
            <button
              type="button"
              onClick={() =>
                setExpandedCta(expandedCta === index ? null : index)
              }
              style={{
                width: "100%",
                background: expandedCta === index ? "transparent" : "#fff",
                border: "none",
                borderBottom:
                  expandedCta === index ? "none" : "1px solid #E2E8F0",
                padding: "8px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                color: "#334155",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  fontWeight: 600,
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <i className="bi bi-cursor text-primary" />
                {btn.label}
              </span>
              <i
                className={`bi ${expandedCta === index ? "bi-chevron-up" : "bi-chevron-down"}`}
                style={{ fontSize: "10px", color: "#64748B" }}
              />
            </button>
            {expandedCta === index && (
              <div style={{ padding: "12px", background: "#fff" }}>
                <CtaLinkEditor
                  prefix={key} // On passe le prefix pour le popover
                  data={data} // On passe les données
                  onUpdate={onUpdate} // On passe la fonction de mise à jour
                  label={btn.label}
                  enabled={(data[`${key}Enabled`] as boolean) ?? true}
                  textValue={(data[`${key}Text`] as string) || ""}
                  urlValue={(data[`${key}Url`] as string) || "#contact"}
                  sectionAnchors={sectionAnchors}
                  pageOptions={pageOptions}
                  inputStyle={inputStyle || {}}
                  onEnabledChange={(v) =>
                    onUpdate({ ...data, [`${key}Enabled`]: v })
                  }
                  onTextChange={(v) => onUpdate({ ...data, [`${key}Text`]: v })}
                  onUrlChange={(v) => onUpdate({ ...data, [`${key}Url`]: v })}
                  compact
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
