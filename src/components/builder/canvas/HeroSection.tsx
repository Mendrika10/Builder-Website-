import React from "react";

export function HeroSection({ data }: { data: Record<string, unknown> }) {
  const stats = (data.stats as string[]) ?? [];
  const clients = (data.clients as string[]) ?? [];
  const imgUrl = data.imageUrl as string;

  // --- Logique d'arrière-plan ---
  const bgType = (data.heroBgType as string) ?? "color";
  const bgColor = (data.heroBgColor as string) ?? "#ffffff";
  const bgImageUrl = (data.heroBgImageUrl as string) ?? "";
  const bgColorType = (data.heroBgColorType as string) ?? "solid";
  const bgGradientCode =
    (data.heroBgGradientCode as string) ??
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  const bgImageOpacity = (data.heroBgImageOpacity as number) ?? 1;
  const bgImageSize = (data.heroBgImageSize as string) ?? "cover";
  const bgImagePosition = (data.heroBgImagePosition as string) ?? "center";
  const bgImageBlur = (data.heroBgImageBlur as number) ?? 0;

  const sectionStyle: React.CSSProperties = {
    padding: "5rem 2rem 4rem",
    maxWidth: "100%", // Changé de 960 pour que le fond prenne toute la largeur
    margin: "0 auto",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  };

  // Application du fond
  if (bgType === "color") {
    sectionStyle.backgroundColor = bgColor;
    sectionStyle.backgroundImage =
      bgColorType === "solid" ? "none" : bgGradientCode;
  } else {
    sectionStyle.backgroundColor = bgColor; // Fallback
  }

  const getButtonStyle = (prefix: "cta1" | "cta2") => {
    const size = (data[`${prefix}Size`] as string) ?? "md";
    const heights = { sm: 26, md: 32, lg: 40 };
    const paddings = { sm: "0 10px", md: "0 14px", lg: "0 20px" };

    return {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: paddings[size as keyof typeof paddings] || paddings.md,
      height: heights[size as keyof typeof heights] || heights.md,
      borderRadius: 10,
      background:
        (data[`${prefix}Color`] as string) ??
        (prefix === "cta1" ? "#2563EB" : "transparent"),
      color:
        (data[`${prefix}TextColor`] as string) ??
        (prefix === "cta1" ? "#fff" : "#334155"),
      border: `1.5px solid ${(data[`${prefix}BorderColor`] as string) ?? (prefix === "cta1" ? "transparent" : "#CBD5E1")}`,
      fontWeight: 700,
      fontSize: (data[`${prefix}FontSize`] as string) ?? ".95rem",
      cursor: "pointer",
      textDecoration: "none" as const,
    };
  };

  const badgeText = (data.heroBadgeText as string) ?? "Nouveau";
  const badgeBg = (data.heroBadgeBgColor as string) ?? "#EFF6FF";
  const badgeColor = (data.heroBadgeTextColor as string) ?? "#2563EB";
  const badgeEnabled = (data.heroBadgeEnabled as boolean) ?? true;
  const badgeFontSize = (data.heroBadgeFontSize as string) ?? ".78rem";
  const badgeWeight = (data.heroBadgeWeight as string) ?? "700";
  const badgeItalic = (data.heroBadgeItalic as boolean) ?? false;

  // 1. Récupérer les styles du titre
  const titleText = (data.title as string) ?? "";
  const titleColor = (data.titleColor as string) ?? "#1E293B";
  const titleFontSize =
    (data.titleFontSize as string) ?? "clamp(2rem, 4vw, 3rem)";
  const titleAlign = (data.titleAlign as string) ?? "center";
  const titleWeight = (data.titleWeight as string) ?? "800";
  const titleItalic = (data.titleItalic as boolean) ?? false;
  // --- Logique du Sous-titre ---
  const subtitleText = (data.subtitle as string) ?? "";
  const subtitleColor = (data.subtitleColor as string) ?? "#475569";
  const subtitleFontSize = (data.subtitleFontSize as string) ?? "1rem";
  const subtitleAlign = (data.subtitleAlign as string) ?? "center";
  const subtitleWeight = (data.subtitleWeight as string) ?? "400";
  const subtitleItalic = (data.subtitleItalic as boolean) ?? false;
  const subtitleEnabled = (data.subtitleEnabled as boolean) ?? true; // <--- Toggle d'affichage
  return (
    <section style={sectionStyle}>
      {/* Couche d'image d'arrière-plan */}
      {bgType === "image" && bgImageUrl && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${bgImageUrl})`,
            backgroundSize: bgImageSize,
            backgroundPosition: bgImagePosition,
            backgroundRepeat: "no-repeat",
            opacity: bgImageOpacity,
            filter: `blur(${bgImageBlur}px)`,
            zIndex: 0,
          }}
        />
      )}

      {/* Contenu (doit être en z-index 1 pour être au-dessus du fond) */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 960,
          margin: "0 auto",
        }}
      >
        {badgeEnabled && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: badgeBg,
              borderRadius: 999,
              padding: "4px 14px",
              fontSize: badgeFontSize,
              fontWeight: badgeWeight as any, // <--- Remplacer 700 par badgeWeight
              fontStyle: badgeItalic ? "italic" : "normal", // <--- Ajouter cette ligne
              color: badgeColor,
              marginBottom: "1.5rem",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: badgeColor,
                display: "inline-block",
              }}
            />
            {badgeText}
          </div>
        )}
        <h1
          style={{
            fontWeight: titleWeight, // <-- Dynamique (300, 400, 700, 800, etc.)
            fontStyle: titleItalic ? "italic" : "normal", // <-- Dynamique (italic ou normal)
            fontSize: titleFontSize,
            color: titleColor,
            textAlign: titleAlign as any,
            lineHeight: 1.15,
            marginBottom: "1.25rem",
            whiteSpace: "pre-line",
          }}
        >
          {titleText}
        </h1>
        {subtitleEnabled && (
          <p
            style={{
              fontSize: subtitleFontSize,
              color: subtitleColor,
              textAlign: subtitleAlign as any,
              fontWeight: subtitleWeight,
              fontStyle: subtitleItalic ? "italic" : "normal",
              maxWidth: 580,
              margin: "0 auto 2rem",
              lineHeight: 1.7,
              whiteSpace: "pre-line",
            }}
          >
            {subtitleText}
          </p>
        )}
        {imgUrl && (
          <img
            src={imgUrl}
            alt="hero"
            style={{
              width: "100%",
              maxHeight: 300,
              objectFit: "cover",
              borderRadius: 16,
              marginBottom: "2rem",
            }}
          />
        )}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: "2.5rem",
          }}
        >
          {/* Bouton 1 */}
          {data.cta1Enabled !== false && (
            <div style={getButtonStyle("cta1")}>
              {(data.cta1Icon as string) && (
                <i className={`bi ${data.cta1Icon}`} />
              )}
              {data.cta1Text as string}
            </div>
          )}

          {/* Bouton 2 */}
          {data.cta2Enabled !== false && (
            <div style={getButtonStyle("cta2")}>
              {(data.cta2Icon as string) && (
                <i className={`bi ${data.cta2Icon}`} />
              )}
              {data.cta2Text as string}
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <span key={s} style={{ color: "#F59E0B" }}>
                ★
              </span>
            ))}
            <span style={{ fontWeight: 700, fontSize: ".82rem" }}>
              {data.rating as string}
            </span>
            <span style={{ fontSize: ".78rem", color: "#64748B" }}>
              {data.ratingLabel as string}
            </span>
          </div>
          {stats.map((s: string) => (
            <span key={s} style={{ fontSize: ".82rem", color: "#64748B" }}>
              · {s}
            </span>
          ))}
        </div>
        {clients.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "2rem",
              justifyContent: "center",
              marginTop: "2.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid #E2E8F0",
            }}
          >
            {clients.map((c: string) => (
              <span
                key={c}
                style={{
                  fontSize: ".85rem",
                  fontWeight: 700,
                  color: "#94A3B8",
                }}
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
