import React, { useState, useEffect, useRef } from "react";
import { ImageSettingsPopover } from "./ImageSettingsPopover";

export function FieldImageCard({
  label,
  url,
  onUrlChange,
  width,
  height,
  onSizeChange,
  uploadContext,
  prefix,
  data,
  onUpdate,
}: {
  label: string;
  url: string;
  onUrlChange: (v: string) => void;
  width?: number;
  height?: number;
  onSizeChange?: (w?: number, h?: number) => void;
  uploadContext?: { siteId?: string; collection?: string };
  prefix?: string;
  data?: Record<string, unknown>;
  onUpdate?: (data: Record<string, unknown>) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string>(url || "");

  useEffect(() => {
    setPreview(url || "");
  }, [url]);

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const dataUrl: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });

      const base64 = dataUrl.split(",")[1] ?? "";
      const res = await fetch("/api/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          data: base64,
          contentType: file.type,
          size: file.size,
          siteId: uploadContext?.siteId,
          collection: uploadContext?.collection,
        }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("Upload failed:", txt);
        alert("Échec de l'upload");
        return;
      }

      const json = await res.json();
      if (json?.url) {
        onUrlChange(json.url as string);
        setPreview(json.url as string);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: 16 }}>
      {/* Label avec style épuré */}
      <label
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color: "#64748B",
          display: "block",
          marginBottom: "8px",
          letterSpacing: "0.02em",
          textTransform: "uppercase",
          marginLeft: "2px",
        }}
      >
        {label}
      </label>

      {/* Container Principal - Style "Floating Card" */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #E2E8F0",
          borderRadius: 14,
          background: "#fff",
          height: 68,

          boxShadow: "0 2px 4px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.01)",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          padding: "4px", // Donne de l'air aux éléments internes
        }}
      >
        {/* Thumbnail avec effet de profondeur */}
        <div
          style={{
            width: 60,
            height: 60,
            flexShrink: 0,
            background: "#F8FAFC",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #F1F5F9",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          ) : (
            <i
              className="bi bi-image"
              style={{ color: "#CBD5E1", fontSize: "20px" }}
            />
          )}
        </div>

        {/* Zone d'action Upload */}
        <div
          style={{
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flex: 1,
          }}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadFile(f);
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              border: "1px solid #E2E8F0",
              background: uploading ? "#F1F5F9" : "#fff",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              cursor: uploading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              fontSize: "12px",
              fontWeight: 500,
              color: "#475569",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#F8FAFC";
              e.currentTarget.style.borderColor = "#CBD5E1";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.borderColor = "#E2E8F0";
            }}
          >
            <i
              className={`bi ${uploading ? "bi-arrow-repeat" : "bi-upload"} ${uploading ? "animate-spin" : ""}`}
              style={{ fontSize: "14px", color: "#3B82F6" }}
            />
            {uploading ? "Upload..." : "Changer l'image"}
          </button>
        </div>

        {/* Zone Settings - Séparée visuellement */}
        {prefix && data && onUpdate && (
          <div
            style={{
              width: 48,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderLeft: "1px solid #F1F5F9",
              background: "#FAFBFC",
              borderRadius: "0 14px 14px 0",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F5F9")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#FAFBFC")}
          >
            <ImageSettingsPopover
              prefix={prefix}
              data={data}
              onUpdate={onUpdate}
            />
          </div>
        )}
      </div>
    </div>
  );
}
