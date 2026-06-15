"use client";

import { useState } from "react";
import { SectionAccordion } from "../ui/SectionAccordion";
import { FieldImageCard } from "../ui/FieldImageCard";
import { CtaLinkEditor } from "../CtaLinkEditor";
import { BuilderSection, BuilderPage } from "../types";
import { FieldColor } from "../ui/FieldColor";
import { LinkStyleEditor } from "./LinkStyleEditor";
import { BackgroundEditor } from "../ui/BackgroundEditor";
import { ButtonEditor } from "../ui/ButtonEditor";

// ============================================================
// Types & Helpers
// ============================================================
export type NavLink = { label: string; type: "section" | "page"; href: string };

function normalizeNavLinks(raw: unknown[]): NavLink[] {
  return raw.map((l) =>
    typeof l === "string"
      ? { label: l, href: "#", type: "section" as const }
      : (l as NavLink),
  );
}

// ============================================================
// Main Component
// ============================================================
export function EditPanelNavbar({
  data,
  onUpdate,
  sections,
  pages,
  siteSlug,
  siteId,
}: {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
  sections: BuilderSection[];
  pages: BuilderPage[];
  siteSlug: string;
  siteId: string;
}) {
  const set = (key: string, value: unknown) =>
    onUpdate({ ...data, [key]: value });

  const links = normalizeNavLinks((data.links as unknown[]) ?? []);
  const [expanded, setExpanded] = useState<number | null>(null);

  const navBgType = (data.navBgType as string) ?? "color";
  const navBgColor = (data.navBgColor as string) ?? "#ffffff";
  const navBgImageUrl = (data.navBgImageUrl as string) ?? "";

  const updateLink = (i: number, field: keyof NavLink, value: string) => {
    const next = links.map((link, idx) =>
      idx === i ? { ...link, [field]: value } : link,
    );
    set("links", next);
  };
  const removeLink = (i: number) => {
    set(
      "links",
      links.filter((_, idx) => idx !== i),
    );
    if (expanded === i) setExpanded(null);
  };
  const addLink = () => {
    set("links", [
      ...links,
      { label: "Nouveau lien", type: "section", href: "#hero" },
    ]);
    setExpanded(links.length);
  };

  const sectionAnchors = sections
    .filter((s) => s.type !== "navbar")
    .map((s) => ({ label: s.label, href: `#${s.type}` }));

  const pageOptions = pages.map((p) => ({
    label: p.name,
    href: `/${siteSlug}/${p.slug}`,
  }));

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "5px 8px",
    borderRadius: 6,
    border: "1px solid #E2E8F0",
    fontSize: ".82rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const [showLinkStyleModal, setShowLinkStyleModal] = useState(false);
  const [expandedCta, setExpandedCta] = useState<number | null>(0);

  return (
    <>
      <SectionAccordion title="Identité" icon="bi bi-person-circle">
        <FieldImageCard
          label="Logo (URL)"
          url={(data.logoImageUrl as string) || ""}
          onUrlChange={(v) => set("logoImageUrl", v)}
          width={(data.logoImageWidth as number) ?? undefined}
          height={(data.logoImageHeight as number) ?? undefined}
          onSizeChange={(w, h) =>
            onUpdate({ ...data, logoImageWidth: w, logoImageHeight: h })
          }
          uploadContext={{ siteId, collection: "navigation-img" }}
        />
      </SectionAccordion>

      <SectionAccordion title="Arrière-plan" icon="bi bi-palette">
        <BackgroundEditor
          prefix="navBg"
          data={data}
          onUpdate={onUpdate}
          siteId={siteId}
        />
      </SectionAccordion>

      <SectionAccordion
        title={`Liens de navigation (${links.length})`}
        icon="bi bi-link-45deg"
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            position: "relative",
          }}
        >
          <button
            onClick={() => setShowLinkStyleModal((prev) => !prev)}
            style={{
              padding: "5px 12px",
              borderRadius: 5,
              border: "1px solid #CBD5E1",
              background: "#fff",
              color: "#2563EB",
              fontWeight: 700,
              fontSize: "10px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <i className="bi bi-highlighter me-1" style={{ fontSize: 11 }} />
            Style des liens
          </button>

          {showLinkStyleModal && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                zIndex: 20,
                width: 320,
                maxWidth: "100%",
                background: "#fff",
                borderRadius: 16,
                border: "1px solid #E2E8F0",
                boxShadow: "0 10px 24px rgba(15, 23, 42, 0.12)",
                overflow: "hidden",
                marginTop: 10,
              }}
            >
              <div style={{ padding: "0" }}>
                <LinkStyleEditor
                  data={data}
                  onUpdate={onUpdate}
                  inputStyle={inputStyle}
                />
              </div>
            </div>
          )}
        </div>

        {links.map((link, i) => (
          <div
            key={i}
            style={{
              background: "#F8FAFC",
              borderRadius: 6,
              border: "1px solid #E2E8F0",
              marginBottom: 1,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "4px 10px",
                cursor: "pointer",
              }}
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  flex: 1,
                  overflow: "hidden",
                }}
              >
                <i
                  className={`bi ${link.type === "section" ? "bi-hash" : "bi-link-45deg"}`}
                  style={{ color: "#2563EB", fontSize: ".8rem", flexShrink: 0 }}
                />
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: "10px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {link.label || "(sans titre)"}
                </span>
              </div>
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeLink(i);
                  }}
                  style={{
                    background: "#FEE2E2",
                    border: "none",
                    borderRadius: 4,
                    color: "#EF4444",
                    cursor: "pointer",
                    padding: "1px 4px",
                    fontSize: "8px",
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
            {expanded === i && (
              <div
                style={{
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 7,
                  background: "#fff",
                  border: "0.5px solid #E2E8F0",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                  <label
                    style={{
                      fontSize: 10,
                      color: "#94A3B8",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <i
                      className="bi bi-cursor-text"
                      style={{ fontSize: 10, color: "#94A3B8" }}
                    />
                    Libellé
                  </label>
                  <input
                    value={link.label}
                    onChange={(e) => updateLink(i, "label", e.target.value)}
                    placeholder="Ex: Services"
                    style={{
                      ...inputStyle,
                      height: 26,
                      fontSize: 10,
                      fontWeight: 600,
                      padding: "0 8px",
                    }}
                  />
                </div>

                <div style={{ height: "0.5px", background: "#F1F5F9" }} />

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                  <label
                    style={{
                      fontSize: 10,
                      color: "#94A3B8",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <i
                      className="bi bi-link"
                      style={{ fontSize: 10, color: "#94A3B8" }}
                    />
                    Type de lien
                  </label>
                  <div
                    style={{
                      display: "flex",
                      gap: 2,
                      padding: 2,
                      background: "#F1F5F9",
                      border: "0.5px solid #E2E8F0",
                      borderRadius: 6,
                    }}
                  >
                    {(["section", "page"] as const).map((t) => {
                      const active = link.type === t;
                      return (
                        <button
                          key={t}
                          onClick={() => {
                            const newHref =
                              t === "section"
                                ? (sectionAnchors[0]?.href ?? "#")
                                : (pageOptions[0]?.href ?? "/");
                            const next = links.map((l, idx) =>
                              idx === i ? { ...l, type: t, href: newHref } : l,
                            );
                            set("links", next);
                          }}
                          style={{
                            flex: 1,
                            height: 24,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 4,
                            border: active ? "0.5px solid #BFDBFE" : "none",
                            borderRadius: 5,
                            background: active ? "#fff" : "transparent",
                            color: active ? "#2563EB" : "#64748B",
                            fontSize: 10,
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "background .15s, color .15s",
                          }}
                        >
                          <i
                            className={`bi ${t === "section" ? "bi-hash" : "bi-link"}`}
                            style={{
                              fontSize: 10,
                              color: active ? "#2563EB" : "#94A3B8",
                            }}
                          />
                          {t === "section" ? "Ancre section" : "URL / Page"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ height: "0.5px", background: "#F1F5F9" }} />

                <div
                  style={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                  <label
                    style={{
                      fontSize: 10,
                      color: "#94A3B8",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <i
                      className="bi bi-target"
                      style={{ fontSize: 10, color: "#94A3B8" }}
                    />
                    {link.type === "section" ? "Section cible" : "Page cible"}
                  </label>

                  {link.type === "section" ? (
                    <select
                      value={link.href}
                      onChange={(e) => updateLink(i, "href", e.target.value)}
                      style={{
                        ...inputStyle,
                        height: 26,
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "0 8px",
                        background: "#F8FAFC",
                      }}
                    >
                      {sectionAnchors.length === 0 && (
                        <option value="#">Aucune section disponible</option>
                      )}
                      {sectionAnchors.map((opt) => (
                        <option key={opt.href} value={opt.href}>
                          {opt.label} ({opt.href})
                        </option>
                      ))}
                      {link.href &&
                        !sectionAnchors.find((o) => o.href === link.href) && (
                          <option value={link.href}>{link.href}</option>
                        )}
                    </select>
                  ) : (
                    <>
                      <select
                        value={
                          pageOptions.find((p) => p.href === link.href)
                            ? link.href
                            : "__custom__"
                        }
                        onChange={(e) => {
                          if (e.target.value !== "__custom__")
                            updateLink(i, "href", e.target.value);
                          else updateLink(i, "href", "/");
                        }}
                        style={{
                          ...inputStyle,
                          height: 26,
                          fontSize: 10,
                          fontWeight: 600,
                          padding: "0 8px",
                          background: "#F8FAFC",
                          marginBottom: 5,
                        }}
                      >
                        {pageOptions.length > 0 ? (
                          <optgroup label="Pages du site">
                            {pageOptions.map((opt) => (
                              <option key={opt.href} value={opt.href}>
                                {opt.label} — {opt.href}
                              </option>
                            ))}
                          </optgroup>
                        ) : (
                          <option disabled value="">
                            Aucune page créée
                          </option>
                        )}
                        <option value="__custom__">
                          ✏️ URL personnalisée…
                        </option>
                      </select>
                      {!pageOptions.find((p) => p.href === link.href) && (
                        <input
                          value={link.href}
                          onChange={(e) =>
                            updateLink(i, "href", e.target.value)
                          }
                          placeholder="/ma-page ou https://..."
                          style={{
                            ...inputStyle,
                            height: 26,
                            fontSize: 10,
                            fontWeight: 600,
                            padding: "0 8px",
                          }}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        <button
          onClick={addLink}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: 8,
            border: "1.5px dashed #CBD5E1",
            background: "none",
            color: "#2563EB",
            fontWeight: 600,
            fontSize: "10px",
            cursor: "pointer",
            marginBottom: 12,
          }}
        >
          + Ajouter un lien
        </button>
      </SectionAccordion>

      <SectionAccordion title="Boutons d'action" icon="bi bi-rocket-takeoff">
        <ButtonEditor
          data={data}
          onUpdate={onUpdate}
          sectionAnchors={sectionAnchors}
          pageOptions={pageOptions}
          inputStyle={inputStyle}
          buttons={[
            { key: "cta1", label: "Bouton secondaire" },
            { key: "cta2", label: "Bouton principal" },
          ]}
        />
      </SectionAccordion>
    </>
  );
}
