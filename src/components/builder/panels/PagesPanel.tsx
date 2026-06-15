"use client";

import { useState } from "react";
import { BuilderPage } from "../types";

export function PagesPanel({
  pages,
  activePageId,
  onSelect,
  onAdd,
  onDelete,
  onRename,
}: {
  pages: BuilderPage[];
  activePageId: string | null;
  onSelect: (id: string | null) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string, slug: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");

  const startEdit = (page: BuilderPage) => {
    setEditingId(page.id);
    setEditName(page.name);
    setEditSlug(page.slug);
  };

  const commitEdit = (id: string) => {
    onRename(id, editName, editSlug);
    setEditingId(null);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "4px 7px",
    borderRadius: 5,
    border: "1px solid #E2E8F0",
    fontSize: ".78rem",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
        {pages.length === 0 && (
          <div
            style={{
              padding: "2rem 1rem",
              textAlign: "center",
              color: "#94A3B8",
            }}
          >
            <i
              className="bi bi-files"
              style={{ fontSize: "2rem", display: "block", marginBottom: 8 }}
            />
            <p style={{ fontSize: ".8rem", fontWeight: 600, margin: 0 }}>
              Aucune page
            </p>
            <p style={{ fontSize: ".75rem", margin: "4px 0 0" }}>
              Créez votre première page
            </p>
          </div>
        )}
        {pages.map((page) => (
          <div
            key={page.id}
            style={{
              borderRadius: 8,
              border: `1.5px solid ${activePageId === page.id ? "#BFDBFE" : "#E2E8F0"}`,
              background: activePageId === page.id ? "#EFF6FF" : "#FAFAFA",
              marginBottom: 6,
              overflow: "hidden",
            }}
          >
            {editingId === page.id ? (
              /* Inline edit form */
              <div
                style={{
                  padding: "8px 10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <div>
                  <label
                    style={{
                      fontSize: ".7rem",
                      fontWeight: 700,
                      color: "#64748B",
                      display: "block",
                      marginBottom: 2,
                    }}
                  >
                    Nom
                  </label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Ex: À propos"
                    style={inputStyle}
                    autoFocus
                  />
                </div>
                <div>
                  <label
                    style={{
                      fontSize: ".7rem",
                      fontWeight: 700,
                      color: "#64748B",
                      display: "block",
                      marginBottom: 2,
                    }}
                  >
                    URL (slug)
                  </label>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <span style={{ fontSize: ".72rem", color: "#94A3B8" }}>
                      /
                    </span>
                    <input
                      value={editSlug}
                      onChange={(e) =>
                        setEditSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, "-"),
                        )
                      }
                      placeholder="a-propos"
                      style={inputStyle}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    onClick={() => commitEdit(page.id)}
                    style={{
                      flex: 1,
                      padding: "5px",
                      borderRadius: 6,
                      border: "none",
                      background: "#2563EB",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: ".75rem",
                      cursor: "pointer",
                    }}
                  >
                    ✓ Valider
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: 6,
                      border: "1px solid #E2E8F0",
                      background: "#fff",
                      color: "#64748B",
                      fontWeight: 600,
                      fontSize: ".75rem",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              /* Page item row */
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 10px",
                  cursor: "pointer",
                }}
                onClick={() =>
                  onSelect(activePageId === page.id ? null : page.id)
                }
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background:
                      activePageId === page.id ? "#2563EB" : "#E2E8F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i
                    className="bi bi-file-text"
                    style={{
                      color: activePageId === page.id ? "#fff" : "#64748B",
                      fontSize: ".8rem",
                    }}
                  />
                </div>
                <div style={{ flex: 1, overflow: "hidden" }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: ".82rem",
                      color: activePageId === page.id ? "#1D4ED8" : "#0F172A",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {page.name}
                  </div>
                  <div style={{ fontSize: ".72rem", color: "#94A3B8" }}>
                    /{page.slug}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(page);
                    }}
                    title="Renommer"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94A3B8",
                      padding: "3px",
                      borderRadius: 4,
                      fontSize: ".78rem",
                    }}
                  >
                    <i className="bi bi-pencil" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(page.id);
                    }}
                    title="Supprimer"
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#EF4444",
                      padding: "3px",
                      borderRadius: 4,
                      fontSize: ".78rem",
                    }}
                  >
                    <i className="bi bi-trash" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ padding: "8px", borderTop: "1px solid #E2E8F0" }}>
        <button
          onClick={onAdd}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: 8,
            border: "1.5px dashed #CBD5E1",
            background: "none",
            color: "#2563EB",
            fontWeight: 700,
            fontSize: ".82rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <i className="bi bi-plus-circle" /> Nouvelle page
        </button>
      </div>
    </div>
  );
}
