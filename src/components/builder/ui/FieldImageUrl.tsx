import React, { useState, useRef } from "react";

export function FieldImageUrl({
  label,
  value,
  onChange,
  uploadContext,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  uploadContext?: { siteId?: string; collection?: string };
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

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
      if (json?.url) onChange(json.url as string);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <label
        style={{
          fontSize: ".75rem",
          fontWeight: 700,
          color: "#475569",
          display: "block",
          marginBottom: 4,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </label>
      {value && (
        <img
          src={value}
          alt=""
          style={{
            width: "100%",
            height: 80,
            objectFit: "cover",
            borderRadius: 8,
            border: "1.5px solid #E2E8F0",
            marginBottom: 6,
          }}
        />
      )}

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://exemple.com/image.jpg"
          style={{
            flex: 1,
            padding: "7px 10px",
            borderRadius: 8,
            border: "1.5px solid #E2E8F0",
            fontSize: ".82rem",
            outline: "none",
          }}
        />

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
            padding: "7px 10px",
            borderRadius: 8,
            border: "1px solid #E2E8F0",
            background: uploading ? "#F1F5F9" : "#fff",
            cursor: uploading ? "not-allowed" : "pointer",
          }}
        >
          {uploading ? "Envoi…" : "Uploader"}
        </button>
      </div>

      <p style={{ fontSize: ".7rem", color: "#94A3B8", margin: "6px 0 0" }}>
        Collez l'URL d'une image en ligne ou uploadez un fichier depuis votre
        ordinateur.
      </p>
    </div>
  );
}
