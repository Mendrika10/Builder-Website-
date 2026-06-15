import React from "react";

type NavLink = { label: string; type: "section" | "page"; href: string };

function normalizeNavLinks(raw: unknown[]): NavLink[] {
  return raw.map((l) =>
    typeof l === "string"
      ? { label: l, href: "#", type: "section" as const }
      : (l as NavLink),
  );
}

export function NavbarSection({ data }: { data: Record<string, unknown> }) {
  const links = normalizeNavLinks((data.links as unknown[]) ?? []);
  const logoImageUrl = (data.logoImageUrl as string) || "";
  const logoImageHeight = (data.logoImageHeight as number) ?? 40;
  const logoImageWidth = (data.logoImageWidth as number) ?? undefined;
  const navBgType = (data.navBgType as string) ?? "color";
  const navBgColor = (data.navBgColor as string) ?? "#ffffff";
  const navBgImageUrl = (data.navBgImageUrl as string) ?? "";
  const navBgColorType = (data.navBgColorType as string) ?? "solid";
  const navBgGradientCode =
    (data.navBgGradientCode as string) ??
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  const navBgImageOpacity = (data.navBgImageOpacity as number) ?? 1;
  const navBgImageSize = (data.navBgImageSize as string) ?? "cover";
  const navBgImagePosition = (data.navBgImagePosition as string) ?? "center";
  const navBgImageBlur = (data.navBgImageBlur as number) ?? 0;
  const navStyle: React.CSSProperties = {
    borderBottom: "1px solid #E2E8F0",
    padding: "0 2rem",
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };
  const cta1Color = (data.cta1Color as string) ?? "#334155";
  const cta1TextColor = (data.cta1TextColor as string) ?? cta1Color;
  const cta1BorderColor =
    (data.cta1BorderColor as string) || cta1Color || "#E2E8F0";
  const cta1Icon = (data.cta1Icon as string) ?? "";
  const cta1Size = (data.cta1Size as string) ?? "md";
  const cta2Color = (data.cta2Color as string) ?? "#2563EB";
  const cta2TextColor = (data.cta2TextColor as string) ?? "#fff";
  const cta2BorderColor = (data.cta2BorderColor as string) || "";
  const cta2Icon = (data.cta2Icon as string) ?? "";
  const cta2Size = (data.cta2Size as string) ?? "md";
  const sizeMap: Record<string, { padding: string; fontSize: string }> = {
    sm: { padding: "6px 10px", fontSize: ".78rem" },
    md: { padding: "8px 16px", fontSize: ".85rem" },
    lg: { padding: "10px 20px", fontSize: "1rem" },
  };
  // ensure container is positioning context for background layer
  navStyle.position = "relative";
  navStyle.overflow = "hidden";
  // apply background: color or gradient
  if (navBgType === "color") {
    if (navBgColorType === "solid") {
      navStyle.backgroundColor = navBgColor;
      navStyle.backgroundImage = "none";
    } else {
      // Pour les gradients, on utilise backgroundImage et on garde la couleur comme fallback
      navStyle.backgroundImage = navBgGradientCode;
      navStyle.backgroundColor = navBgColor;
    }
  } else {
    // Mode image : on utilise la couleur comme fond de secours pendant le chargement
    navStyle.backgroundColor = navBgColor;
  }

  return (
    <nav style={navStyle}>
      {navBgType === "image" && navBgImageUrl && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${navBgImageUrl})`,
            backgroundSize: navBgImageSize,
            backgroundPosition: navBgImagePosition,
            backgroundRepeat: "no-repeat",
            opacity: navBgImageOpacity,
            filter: `blur(${navBgImageBlur}px)`,
            zIndex: 0,
          }}
        />
      )}

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
        }}
      >
        {logoImageUrl ? (
          <img
            src={logoImageUrl}
            alt={(data.logo as string) || "logo"}
            style={{
              height: logoImageHeight,
              objectFit: "contain",
              ...(logoImageWidth ? { width: logoImageWidth } : {}),
            }}
          />
        ) : (
          <span style={{ fontWeight: 800, fontSize: "1.05rem" }}>
            {data.logo as string}
          </span>
        )}
        <div style={{ display: "flex", gap: "2rem" }}>
          {links.map((l) => (
            <span
              key={l.label}
              style={{
                fontSize: (data.linksFontSize as string) || ".88rem",
                fontWeight: (data.linksFontWeight as string) || "600",
                color: (data.linksColor as string) || "#334155",
                fontStyle: (data.linksFontStyle as string) || "normal",
              }}
            >
              {l.label}
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {(data.cta1Enabled as boolean) !== false && (
            <span
              style={{
                padding: sizeMap[cta1Size]?.padding || sizeMap.md.padding,
                borderRadius: 8,
                border: `1.5px solid ${cta1BorderColor}`,
                fontSize:
                  (data.cta1FontSize as string) ||
                  sizeMap[cta1Size]?.fontSize ||
                  sizeMap.md.fontSize,
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                color: cta1TextColor,
                background: "transparent",
              }}
            >
              {cta1Icon && (
                <i className={`bi ${cta1Icon}`} aria-hidden="true" />
              )}
              {data.cta1Text as string}
            </span>
          )}
          {(data.cta2Enabled as boolean) !== false && (
            <span
              style={{
                padding: sizeMap[cta2Size]?.padding || sizeMap.md.padding,
                borderRadius: 8,
                background: cta2Color,
                border: cta2BorderColor
                  ? `1.5px solid ${cta2BorderColor}`
                  : "none",
                color: cta2TextColor,
                fontSize:
                  (data.cta2FontSize as string) ||
                  sizeMap[cta2Size]?.fontSize ||
                  sizeMap.md.fontSize,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {cta2Icon && (
                <i className={`bi ${cta2Icon}`} aria-hidden="true" />
              )}
              {data.cta2Text as string}
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
