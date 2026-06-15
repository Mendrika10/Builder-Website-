"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { entrepriseTemplate } from "@/lib/templates/entreprise-template";

import {
  SectionType,
  BuilderSection,
  BuilderPage,
  BuilderEditorProps,
} from "./types";
import { SECTION_CONFIGS } from "./configs";
import { SectionWrapper } from "./ui/SectionWrapper";
import { renderSection } from "./canvas";
import { EditPanelNavbar } from "./editors/EditPanelNavbar";
import { EditPanelHero } from "./editors/EditPanelHero";
import { EditPanelExpertises } from "./editors/EditPanelExpertises";
import { EditPanelTemoignages } from "./editors/EditPanelTemoignages";
import { EditPanelRealisations } from "./editors/EditPanelRealisations";
import { EditPanelBlog } from "./editors/EditPanelBlog";
import { EditPanelFaq } from "./editors/EditPanelFaq";
import { EditPanelCta } from "./editors/EditPanelCta";
import { EditPanelContact } from "./editors/EditPanelContact";
import { EditPanelFooter } from "./editors/EditPanelFooter";
import { EditPanel } from "./editors/EditPanel";
import { PagesPanel } from "./panels/PagesPanel";
import { AddSectionPanel } from "./panels/AddSectionPanel";

// ============================================================
// Main BuilderEditor component
// ============================================================
export default function BuilderEditor({
  siteId,
  siteSlug,
  siteNom,
  siteStatut,
  modeleNom,
}: BuilderEditorProps) {
  const [sections, setSections] = useState<BuilderSection[]>([]);
  const [pages, setPages] = useState<BuilderPage[]>([]);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [leftTab, setLeftTab] = useState<"sections" | "pages">("sections");
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );

  // Ref pour éviter l'auto-save au chargement initial
  const isInitialLoad = useRef(true);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveStatusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Charger les sections et pages depuis la base de données
  useEffect(() => {
    async function loadBuilderData() {
      try {
        const res = await fetch(`/api/sites/${siteId}/builder`);
        if (res.ok) {
          const data = await res.json();
          if (
            data.sections &&
            Array.isArray(data.sections) &&
            data.sections.length > 0
          ) {
            setSections(data.sections as BuilderSection[]);
          } else {
            if (modeleNom === "Agence / Entreprise") {
              setSections(entrepriseTemplate);
            } else {
              setSections([
                {
                  id: "nav-default",
                  type: "navbar",
                  visible: true,
                  label: "Navigation",
                  data: SECTION_CONFIGS.navbar.defaultData(),
                },
                {
                  id: "footer-default",
                  type: "footer",
                  visible: true,
                  label: "Pied de page",
                  data: SECTION_CONFIGS.footer.defaultData(),
                },
              ]);
            }
          }
          if (data.pages && Array.isArray(data.pages)) {
            setPages(data.pages as BuilderPage[]);
          }
        }
      } catch {
        if (modeleNom === "Agence / Entreprise") {
          setSections(entrepriseTemplate);
        }
      } finally {
        setLoading(false);
        setTimeout(() => {
          isInitialLoad.current = false;
        }, 200);
      }
    }
    loadBuilderData();
  }, [siteId, modeleNom]);

  // Auto-sauvegarde après chaque modification (debounce 1.5s)
  useEffect(() => {
    if (isInitialLoad.current || loading) return;
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    if (saveStatusTimer.current) clearTimeout(saveStatusTimer.current);
    setSaveStatus("saving");
    autoSaveTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/sites/${siteId}/builder`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sections, pages }),
        });
        setSaveStatus(res.ok ? "saved" : "error");
      } catch {
        setSaveStatus("error");
      }
      saveStatusTimer.current = setTimeout(() => setSaveStatus("idle"), 2500);
    }, 1500);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [sections, pages, siteId, loading]);

  // Contexte actif: page secondaire ou page principale
  const activePage = pages.find((p) => p.id === activePageId) ?? null;
  const activeSections: BuilderSection[] = activePage
    ? activePage.sections
    : sections;

  const setActiveSections = useCallback(
    (updater: (prev: BuilderSection[]) => BuilderSection[]) => {
      if (activePageId) {
        setPages((prev) =>
          prev.map((p) =>
            p.id === activePageId ? { ...p, sections: updater(p.sections) } : p,
          ),
        );
      } else {
        setSections(updater);
      }
    },
    [activePageId],
  );

  const selectedSection =
    activeSections.find((s) => s.id === selectedId) ?? null;

  const updateSection = useCallback(
    (id: string, newData: Record<string, unknown>) => {
      setActiveSections((prev) =>
        prev.map((s) => (s.id === id ? { ...s, data: newData } : s)),
      );
    },
    [setActiveSections],
  );

  const deleteSection = useCallback(
    (id: string) => {
      setActiveSections((prev) => prev.filter((s) => s.id !== id));
      setSelectedId(null);
    },
    [setActiveSections],
  );

  const moveSection = useCallback(
    (id: string, dir: -1 | 1) => {
      setActiveSections((prev) => {
        const idx = prev.findIndex((s) => s.id === id);
        if (idx < 0) return prev;
        const next = [...prev];
        const target = idx + dir;
        if (target < 0 || target >= next.length) return prev;
        [next[idx], next[target]] = [next[target], next[idx]];
        return next;
      });
    },
    [setActiveSections],
  );

  const addSection = useCallback(
    (type: SectionType) => {
      const cfg = SECTION_CONFIGS[type];
      const newSection: BuilderSection = {
        id: `${type}-${Date.now()}`,
        type,
        visible: true,
        label: cfg.label,
        data: cfg.defaultData(),
      };
      setActiveSections((prev) => [...prev, newSection]);
      setSelectedId(newSection.id);
      setShowAddPanel(false);
    },
    [setActiveSections],
  );

  const save = useCallback(async () => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    if (saveStatusTimer.current) clearTimeout(saveStatusTimer.current);
    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/sites/${siteId}/builder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections, pages }),
      });
      setSaveStatus(res.ok ? "saved" : "error");
    } catch {
      setSaveStatus("error");
    }
    saveStatusTimer.current = setTimeout(() => setSaveStatus("idle"), 2500);
  }, [siteId, sections, pages]);

  // Pages callbacks
  const addPage = useCallback(() => {
    const newPage: BuilderPage = {
      id: `page-${Date.now()}`,
      name: "Nouvelle page",
      slug: `page-${Date.now()}`,
      sections: [],
    };
    setPages((prev) => [...prev, newPage]);
    setActivePageId(newPage.id);
    setSelectedId(null);
    setLeftTab("pages");
  }, []);

  const deletePage = useCallback(
    (id: string) => {
      setPages((prev) => prev.filter((p) => p.id !== id));
      if (activePageId === id) {
        setActivePageId(null);
        setSelectedId(null);
      }
    },
    [activePageId],
  );

  const renamePage = useCallback((id: string, name: string, slug: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name, slug } : p)),
    );
  }, []);

  const selectPage = useCallback((id: string | null) => {
    setActivePageId(id);
    setSelectedId(null);
    setShowAddPanel(false);
  }, []);

  const deviceWidth =
    device === "mobile" ? 375 : device === "tablet" ? 768 : "100%";

  const sectionIcons: Record<SectionType, string> = {
    navbar: "bi-layout-text-sidebar-reverse",
    hero: "bi-layout-text-window-reverse",
    expertises: "bi-grid",
    temoignages: "bi-chat-quote",
    realisations: "bi-images",
    blog: "bi-newspaper",
    faq: "bi-question-circle",
    cta: "bi-megaphone",
    contact: "bi-envelope",
    footer: "bi-layout-bottom",
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#F8FAFC",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid #E2E8F0",
            borderTop: "3px solid #2563EB",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <p style={{ color: "#64748B", fontWeight: 600, fontSize: ".9rem" }}>
          Chargement de l&apos;éditeur…
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Manrope, sans-serif",
      }}
    >
      {/* ===== TOPBAR ===== */}
      <div
        style={{
          height: 52,
          flexShrink: 0,
          background: "#0F172A",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1rem",
          gap: 12,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href="/sites"
            style={{
              color: "#94A3B8",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: ".85rem",
            }}
          >
            <i className="bi bi-arrow-left" /> Sites
          </Link>
          <span style={{ color: "rgba(255,255,255,.2)" }}>|</span>
          <span style={{ fontWeight: 700, fontSize: ".9rem" }}>{siteNom}</span>
          <span
            style={{
              fontSize: ".7rem",
              fontWeight: 600,
              padding: "2px 10px",
              borderRadius: 999,
              background: siteStatut === "publie" ? "#16A34A" : "#475569",
            }}
          >
            {siteStatut}
          </span>
        </div>

        {/* Device toggle */}
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,.1)",
            borderRadius: 8,
            padding: 3,
            gap: 2,
          }}
        >
          {(["desktop", "tablet", "mobile"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              style={{
                padding: "4px 10px",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                background: device === d ? "#fff" : "none",
                color: device === d ? "#0F172A" : "#94A3B8",
                fontSize: ".8rem",
              }}
            >
              <i
                className={`bi bi-${d === "desktop" ? "display" : d === "tablet" ? "tablet" : "phone"}`}
              />
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link
            href={`/preview/${siteId}`}
            target="_blank"
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,.2)",
              color: "#fff",
              textDecoration: "none",
              fontSize: ".83rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <i className="bi bi-eye" /> Aperçu
          </Link>
          <button
            onClick={save}
            disabled={saveStatus === "saving"}
            style={{
              padding: "6px 16px",
              borderRadius: 8,
              border: "none",
              background:
                saveStatus === "saved"
                  ? "#16A34A"
                  : saveStatus === "error"
                    ? "#DC2626"
                    : saveStatus === "saving"
                      ? "#475569"
                      : "#2563EB",
              color: "#fff",
              fontWeight: 700,
              fontSize: ".83rem",
              cursor: saveStatus === "saving" ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "background .2s",
            }}
          >
            <i
              className={`bi ${
                saveStatus === "saved"
                  ? "bi-check-lg"
                  : saveStatus === "error"
                    ? "bi-exclamation-triangle"
                    : saveStatus === "saving"
                      ? "bi-hourglass-split"
                      : "bi-floppy"
              }`}
            />
            {saveStatus === "saved"
              ? "Sauvegardé ✓"
              : saveStatus === "error"
                ? "Erreur"
                : saveStatus === "saving"
                  ? "Sauvegarde…"
                  : "Sauvegarder"}
          </button>
        </div>
      </div>

      {/* ===== BODY ===== */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* ===== LEFT PANEL ===== */}
        <div
          style={{
            width: 240,
            flexShrink: 0,
            background: "#fff",
            borderRight: "1px solid #E2E8F0",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {showAddPanel ? (
            <AddSectionPanel
              onAdd={addSection}
              onClose={() => setShowAddPanel(false)}
            />
          ) : (
            <>
              {/* Tabs: Sections / Pages */}
              <div
                style={{
                  display: "flex",
                  borderBottom: "1px solid #E2E8F0",
                  flexShrink: 0,
                }}
              >
                {(["sections", "pages"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setLeftTab(tab);
                      if (tab === "sections") {
                        setActivePageId(null);
                        setSelectedId(null);
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: "9px 0",
                      border: "none",
                      borderBottom: `2px solid ${leftTab === tab ? "#2563EB" : "transparent"}`,
                      background: leftTab === tab ? "#EFF6FF" : "#fff",
                      color: leftTab === tab ? "#2563EB" : "#64748B",
                      fontWeight: 700,
                      fontSize: ".75rem",
                      cursor: "pointer",
                      transition: "all .15s",
                    }}
                  >
                    <i
                      className={`bi ${tab === "sections" ? "bi-layers" : "bi-files"}`}
                      style={{ marginRight: 4 }}
                    />
                    {tab === "sections"
                      ? `Sections (${sections.length})`
                      : `Pages (${pages.length})`}
                  </button>
                ))}
              </div>

              {leftTab === "sections" ? (
                <>
                  {/* Active page breadcrumb */}
                  {activePage && (
                    <div
                      style={{
                        background: "#EFF6FF",
                        borderBottom: "1px solid #BFDBFE",
                        padding: "6px 12px",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <i
                        className="bi bi-file-text"
                        style={{ color: "#2563EB", fontSize: ".8rem" }}
                      />
                      <span
                        style={{
                          fontSize: ".75rem",
                          fontWeight: 700,
                          color: "#1D4ED8",
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {activePage.name}
                      </span>
                      <button
                        onClick={() => {
                          setActivePageId(null);
                          setSelectedId(null);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#64748B",
                          fontSize: ".75rem",
                          padding: 0,
                        }}
                      >
                        <i className="bi bi-x" />
                      </button>
                    </div>
                  )}
                  <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
                    {activeSections.map((s, i) => (
                      <div
                        key={s.id}
                        onClick={() =>
                          setSelectedId(s.id === selectedId ? null : s.id)
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "8px 10px",
                          borderRadius: 8,
                          cursor: "pointer",
                          marginBottom: 2,
                          background:
                            selectedId === s.id ? "#EFF6FF" : "transparent",
                          border:
                            selectedId === s.id
                              ? "1.5px solid #BFDBFE"
                              : "1.5px solid transparent",
                        }}
                      >
                        <i
                          className={`bi ${sectionIcons[s.type]}`}
                          style={{
                            color: selectedId === s.id ? "#2563EB" : "#94A3B8",
                            fontSize: ".9rem",
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: ".83rem",
                            fontWeight: 600,
                            color: selectedId === s.id ? "#1D4ED8" : "#334155",
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {s.label}
                        </span>
                        <div style={{ display: "flex", gap: 2 }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveSection(s.id, -1);
                            }}
                            disabled={i === 0}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: i === 0 ? "not-allowed" : "pointer",
                              color: i === 0 ? "#CBD5E1" : "#94A3B8",
                              padding: "2px",
                              borderRadius: 4,
                              fontSize: ".75rem",
                            }}
                          >
                            <i className="bi bi-chevron-up" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveSection(s.id, 1);
                            }}
                            disabled={i === activeSections.length - 1}
                            style={{
                              background: "none",
                              border: "none",
                              cursor:
                                i === activeSections.length - 1
                                  ? "not-allowed"
                                  : "pointer",
                              color:
                                i === activeSections.length - 1
                                  ? "#CBD5E1"
                                  : "#94A3B8",
                              padding: "2px",
                              borderRadius: 4,
                              fontSize: ".75rem",
                            }}
                          >
                            <i className="bi bi-chevron-down" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSection(s.id);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#EF4444",
                              padding: "2px",
                              borderRadius: 4,
                              fontSize: ".75rem",
                            }}
                          >
                            <i className="bi bi-trash3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: 12, borderTop: "1px solid #E2E8F0" }}>
                    <button
                      onClick={() => setShowAddPanel(true)}
                      style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: 10,
                        border: "1.5px dashed #CBD5E1",
                        background: "none",
                        cursor: "pointer",
                        color: "#2563EB",
                        fontWeight: 700,
                        fontSize: ".85rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                      }}
                    >
                      <i className="bi bi-plus-circle" /> Ajouter une section
                    </button>
                  </div>
                </>
              ) : (
                <PagesPanel
                  pages={pages}
                  activePageId={activePageId}
                  onSelect={(id) => {
                    selectPage(id);
                    setLeftTab("sections");
                  }}
                  onAdd={addPage}
                  onDelete={deletePage}
                  onRename={renamePage}
                />
              )}
            </>
          )}
        </div>

        {/* ===== CANVAS ===== */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            background: "#E2E8F0",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: "16px 0",
          }}
        >
          <div
            style={{
              width: deviceWidth,
              maxWidth: "100%",
              background: "#fff",
              boxShadow: "0 8px 40px rgba(0,0,0,.12)",
              borderRadius: device !== "desktop" ? 16 : 0,
              overflow: "hidden",
              minHeight: "100%",
              transition: "width .3s",
            }}
          >
            {activeSections.length === 0 ? (
              <div
                style={{
                  padding: "4rem",
                  textAlign: "center",
                  color: "#94A3B8",
                }}
              >
                <i
                  className="bi bi-plus-square-dotted"
                  style={{
                    fontSize: "3rem",
                    display: "block",
                    marginBottom: "1rem",
                  }}
                />
                <p style={{ fontWeight: 600, fontSize: ".9rem" }}>
                  {activePage
                    ? `Page « ${activePage.name} » vide`
                    : "Aucune section"}
                </p>
                <p style={{ fontSize: ".8rem" }}>
                  Ajoutez votre première section depuis le panneau gauche.
                </p>
              </div>
            ) : (
              activeSections.map((section, i) => (
                <SectionWrapper
                  key={section.id}
                  section={section}
                  isSelected={selectedId === section.id}
                  canMoveUp={i > 0}
                  canMoveDown={i < activeSections.length - 1}
                  onSelect={() =>
                    setSelectedId(selectedId === section.id ? null : section.id)
                  }
                  onDelete={() => deleteSection(section.id)}
                  onMoveUp={() => moveSection(section.id, -1)}
                  onMoveDown={() => moveSection(section.id, 1)}
                >
                  {renderSection(section)}
                </SectionWrapper>
              ))
            )}
          </div>
        </div>

        {/* ===== RIGHT PANEL (edit) ===== */}
        {selectedSection && (
          <div
            style={{
              width: 300,
              flexShrink: 0,
              background: "#fff",
              borderLeft: "1px solid #E2E8F0",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid #E2E8F0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: ".7rem",
                    fontWeight: 700,
                    color: "#2563EB",
                    background: "#EFF6FF",
                    padding: "2px 10px",
                    borderRadius: 999,
                    textTransform: "uppercase",
                  }}
                >
                  {SECTION_CONFIGS[selectedSection.type]?.label}
                </span>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748B",
                  fontSize: "1.1rem",
                }}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>
            {/* Fields */}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
              <EditPanel
                section={selectedSection}
                onUpdate={(newData) =>
                  updateSection(selectedSection.id, newData)
                }
                sections={activeSections}
                pages={pages}
                siteSlug={siteSlug}
                siteId={siteId}
              />
            </div>
          </div>
        )}

        {/* Empty state right panel */}
        {!selectedSection && (
          <div
            style={{
              width: 220,
              flexShrink: 0,
              background: "#F8FAFC",
              borderLeft: "1px solid #E2E8F0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
              gap: 12,
              textAlign: "center",
            }}
          >
            <i
              className="bi bi-cursor"
              style={{ fontSize: "2rem", color: "#CBD5E1" }}
            />
            <p
              style={{
                fontSize: ".82rem",
                color: "#94A3B8",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Cliquez sur une section dans le canvas pour la modifier
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
