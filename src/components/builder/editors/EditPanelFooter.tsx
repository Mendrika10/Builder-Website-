"use client";

import { SectionLabel } from "../ui/SectionLabel";
import { FieldText } from "../ui/FieldText";
import { FieldColor } from "../ui/FieldColor";
import { FieldStringArray } from "../ui/FieldStringArray";

export function EditPanelFooter({
  data,
  onUpdate,
}: {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}) {
  const set = (key: string, value: unknown) =>
    onUpdate({ ...data, [key]: value });
  const columns = (data.columns as { title: string; links: string[] }[]) ?? [];

  const updateCol = (i: number, field: string, value: unknown) => {
    const next = columns.map((c, idx) =>
      idx === i ? { ...c, [field]: value } : c,
    );
    set("columns", next);
  };
  const removeCol = (i: number) =>
    set(
      "columns",
      columns.filter((_, idx) => idx !== i),
    );
  const addCol = () =>
    set("columns", [
      ...columns,
      { title: "NOUVELLE COLONNE", links: ["Lien 1", "Lien 2"] },
    ]);

  return (
    <>
      <SectionLabel>Identité</SectionLabel>
      <FieldText
        label="Nom / Logo"
        value={data.logo as string}
        onChange={(v) => set("logo", v)}
      />
      <FieldStringArray
        label="Villes / Localisations"
        value={data.cities as string[]}
        onChange={(v) => set("cities", v)}
      />
      <SectionLabel>Couleur</SectionLabel>
      <FieldColor
        label="Couleur de fond"
        value={(data.bgColor as string) || "#0F172A"}
        onChange={(v) => set("bgColor", v)}
      />
      <FieldText
        label="Copyright"
        value={data.copyright as string}
        onChange={(v) => set("copyright", v)}
      />
      <SectionLabel>Colonnes ({columns.length})</SectionLabel>
      {columns.map((col, i) => (
        <div
          key={i}
          style={{
            background: "#F8FAFC",
            borderRadius: 8,
            border: "1px solid #E2E8F0",
            marginBottom: 8,
            padding: "8px 10px",
          }}
        >
          <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
            <input
              value={col.title}
              onChange={(e) => updateCol(i, "title", e.target.value)}
              placeholder="TITRE COLONNE"
              style={{
                flex: 1,
                padding: "4px 8px",
                borderRadius: 6,
                border: "1px solid #E2E8F0",
                fontSize: ".8rem",
                fontWeight: 700,
                outline: "none",
              }}
            />
            <button
              onClick={() => removeCol(i)}
              style={{
                background: "#FEE2E2",
                border: "none",
                borderRadius: 6,
                color: "#EF4444",
                cursor: "pointer",
                padding: "0 8px",
                fontSize: ".8rem",
              }}
            >
              ✕
            </button>
          </div>
          <textarea
            value={col.links.join("\n")}
            onChange={(e) =>
              updateCol(i, "links", e.target.value.split("\n").filter(Boolean))
            }
            rows={4}
            placeholder="Un lien par ligne"
            style={{
              width: "100%",
              padding: "5px 8px",
              borderRadius: 6,
              border: "1px solid #E2E8F0",
              fontSize: ".8rem",
              resize: "vertical",
              outline: "none",
            }}
          />
        </div>
      ))}
      <button
        onClick={addCol}
        style={{
          width: "100%",
          padding: "8px",
          borderRadius: 8,
          border: "1.5px dashed #CBD5E1",
          background: "none",
          color: "#2563EB",
          fontWeight: 600,
          fontSize: ".82rem",
          cursor: "pointer",
        }}
      >
        + Ajouter une colonne
      </button>
    </>
  );
}
