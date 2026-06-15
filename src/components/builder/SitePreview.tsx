"use client";

import { useState } from "react";
import { BuilderSection, SectionType } from "./types";

// ============================================================
// Section renderers (preview — fully interactive)
// ============================================================

type NavLink = { label: string; type: "section" | "page"; href: string };

function normalizeNavLinks(raw: unknown[]): NavLink[] {
  return raw.map((l) =>
    typeof l === "string"
      ? { label: l, href: "#", type: "section" as const }
      : (l as NavLink),
  );
}

function NavbarSection({ data }: { data: Record<string, unknown> }) {
  const links = normalizeNavLinks((data.links as unknown[]) ?? []);
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

  const navStyle: any = {
    borderBottom: "1px solid #E2E8F0",
    padding: "0 2rem",
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 1px 8px rgba(0,0,0,.06)",
  };
  const cta1Color = (data.cta1Color as string) ?? "#334155";
  const cta1TextColor = (data.cta1TextColor as string) ?? cta1Color;
  const cta1BorderColor = (data.cta1BorderColor as string) || "#E2E8F0";
  const cta1Icon = (data.cta1Icon as string) ?? "";
  const cta1Size = (data.cta1Size as string) ?? "md";
  const cta2Color = (data.cta2Color as string) ?? "#2563EB";
  const cta2TextColor = (data.cta2TextColor as string) ?? "#fff";
  const cta2BorderColor = (data.cta2BorderColor as string) || "";
  const cta2Icon = (data.cta2Icon as string) ?? "";
  const cta2Size = (data.cta2Size as string) ?? "md";
  const sizeMap: Record<string, { padding: string; fontSize: string }> = {
    sm: { padding: "10px 18px", fontSize: ".9rem" },
    md: { padding: "13px 28px", fontSize: ".95rem" },
    lg: { padding: "16px 36px", fontSize: "1.05rem" },
  };
  // position context + hide overflow for bg layer
  navStyle.overflow = "hidden";
  // apply background: color or gradient
  if (navBgType === "color") {
    navStyle.background =
      navBgColorType === "solid" ? navBgColor : navBgGradientCode;
  } else {
    navStyle.background = navBgColor;
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
        {(data.logoImageUrl as string) || "" ? (
          <img
            src={data.logoImageUrl as string}
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
            <a
              key={l.label}
              href={l.href || "#"}
              style={{
                fontSize: (data.linksFontSize as string) || ".88rem",
                fontWeight: (data.linksFontWeight as string) || 600,
                color: (data.linksColor as string) || "#334155",
                fontStyle: (data.linksFontStyle as string) || "normal",
                textDecoration: "none",
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
        <div style={{ display: "block" }}>
          {(data.cta1Enabled as boolean) !== false && (
            <a
              href={(data.cta1Url as string) || "#"}
              style={{
                padding: sizeMap[cta1Size]?.padding || sizeMap.md.padding,
                borderRadius: 8,
                border: `1.5px solid ${cta1BorderColor}`,
                fontSize:
                  (data.cta1FontSize as string) ||
                  sizeMap[cta1Size]?.fontSize ||
                  sizeMap.md.fontSize,
                fontWeight: 600,
                textDecoration: "none",
                color: cta1TextColor,
                background: "transparent",
                display: "inline-block",
                verticalAlign: "middle",
              }}
            >
              {cta1Icon && (
                <i
                  className={`bi ${cta1Icon}`}
                  aria-hidden="true"
                  style={{ marginRight: 8, verticalAlign: "middle" }}
                />
              )}
              {data.cta1Text as string}
            </a>
          )}
          {(data.cta2Enabled as boolean) !== false && (
            <a
              href={(data.cta2Url as string) || "#"}
              style={{
                marginLeft: 8,
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
                textDecoration: "none",
                display: "inline-block",
                verticalAlign: "middle",
              }}
            >
              {cta2Icon && (
                <i
                  className={`bi ${cta2Icon}`}
                  aria-hidden="true"
                  style={{ marginRight: 8, verticalAlign: "middle" }}
                />
              )}
              {data.cta2Text as string}
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

function HeroSection({ data }: { data: Record<string, unknown> }) {
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

  // --- Logique du Badge ---
  const badgeText = (data.heroBadgeText as string) ?? "Nouveau";
  const badgeBg = (data.heroBadgeBgColor as string) ?? "#EFF6FF";
  const badgeColor = (data.heroBadgeTextColor as string) ?? "#2563EB";
  const badgeEnabled = (data.heroBadgeEnabled as boolean) ?? true;
  const badgeFontSize = (data.heroBadgeFontSize as string) ?? ".78rem";
  const badgeWeight = (data.heroBadgeWeight as string) ?? "700";
  const badgeItalic = (data.heroBadgeItalic as boolean) ?? false;

  // --- Logique du Titre ---
  const titleText = (data.title as string) ?? "";
  const titleColor = (data.titleColor as string) ?? "#1E293B";
  const titleFontSize =
    (data.titleFontSize as string) ?? "clamp(2rem, 4vw, 3rem)";
  const titleAlign = (data.titleAlign as string) ?? "center";
  const titleWeight = (data.titleWeight as string) ?? "800";
  const titleItalic = (data.titleItalic as boolean) ?? false;
  const subtitleText = (data.subtitle as string) ?? "";
  const subtitleColor = (data.subtitleColor as string) ?? "#475569";
  const subtitleFontSize = (data.subtitleFontSize as string) ?? "1rem";
  const subtitleAlign = (data.subtitleAlign as string) ?? "center";
  const subtitleWeight = (data.subtitleWeight as string) ?? "400";
  const subtitleItalic = (data.subtitleItalic as boolean) ?? false;
  const subtitleEnabled = (data.subtitleEnabled as boolean) ?? true;

  const sectionStyle: React.CSSProperties = {
    padding: "5rem 2rem 4rem",
    maxWidth: "100%",
    margin: "0 auto",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  };

  if (bgType === "color") {
    sectionStyle.backgroundColor = bgColor;
    sectionStyle.backgroundImage =
      bgColorType === "solid" ? "none" : bgGradientCode;
  } else {
    sectionStyle.backgroundColor = bgColor;
  }

  // --- Logique des Boutons ---
  const getButtonStyle = (prefix: "cta1" | "cta2") => {
    const size = (data[`${prefix}Size`] as string) ?? "md";
    const heights = { sm: 26, md: 32, lg: 40 };
    const paddings = { sm: "0 10px", md: "0 14px", lg: "0 20px" };

    return {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
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

  return (
    <section style={sectionStyle}>
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

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 960,
          margin: "0 auto",
        }}
      >
        {/* Badge Dynamique */}
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

        {/* Titre Dynamique */}
        <h1
          style={{
            fontWeight: titleWeight,
            fontStyle: titleItalic ? "italic" : "normal",
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
              maxHeight: 360,
              objectFit: "cover",
              borderRadius: 16,
              marginBottom: "2rem",
            }}
          />
        )}

        {/* Boutons Dynamiques */}
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
            <a
              href={(data.cta1Url as string) || "#"}
              style={getButtonStyle("cta1")}
            >
              {(data.cta1Icon as string) && (
                <i
                  className={`bi ${data.cta1Icon}`}
                  style={{ marginRight: 2 }}
                />
              )}
              {data.cta1Text as string}
            </a>
          )}

          {/* Bouton 2 */}
          {data.cta2Enabled !== false && (
            <a
              href={(data.cta2Url as string) || "#"}
              style={getButtonStyle("cta2")}
            >
              {(data.cta2Icon as string) && (
                <i
                  className={`bi ${data.cta2Icon}`}
                  style={{ marginRight: 2 }}
                />
              )}
              {data.cta2Text as string}
            </a>
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
          {stats.map((s) => (
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
            {clients.map((c) => (
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

function ExpertisesSection({ data }: { data: Record<string, unknown> }) {
  const items = (data.items as { icon: string; label: string }[]) ?? [];
  const bg = (data.bgColor as string) || "#0F172A";
  return (
    <section style={{ background: bg, padding: "5rem 2rem", color: "#fff" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <p
          style={{
            fontSize: ".75rem",
            fontWeight: 700,
            color: "#60A5FA",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          {data.sectionLabel as string}
        </p>
        <h2
          style={{
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
            color: "#fff",
            maxWidth: 500,
            lineHeight: 1.25,
            marginBottom: "1rem",
          }}
        >
          {data.title as string}
        </h2>
        <p
          style={{
            color: "#94A3B8",
            fontSize: ".9rem",
            lineHeight: 1.7,
            maxWidth: 500,
            marginBottom: "2.5rem",
          }}
        >
          {data.subtitle as string}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: "1rem",
          }}
        >
          {items.map((s, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,.06)",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: 12,
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
              }}
            >
              <i
                className={`bi ${s.icon}`}
                style={{ fontSize: "1.5rem", color: "#60A5FA" }}
              />
              <span
                style={{
                  fontSize: ".78rem",
                  fontWeight: 600,
                  color: "#CBD5E1",
                  textAlign: "center",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
          <a
            href="#"
            style={{
              color: "#60A5FA",
              fontWeight: 700,
              fontSize: ".9rem",
              textDecoration: "none",
            }}
          >
            {data.ctaText as string} →
          </a>
        </div>
      </div>
    </section>
  );
}

function TemoignagesSection({ data }: { data: Record<string, unknown> }) {
  const items =
    (data.items as {
      logo: string;
      logoColor: string;
      name: string;
      role: string;
      text: string;
    }[]) ?? [];
  return (
    <section style={{ padding: "5rem 2rem", background: "#F8FAFC" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <p
          style={{
            fontSize: ".75rem",
            fontWeight: 700,
            color: "#2563EB",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: ".75rem",
          }}
        >
          {data.sectionLabel as string}
        </p>
        <h2
          style={{
            fontWeight: 800,
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            maxWidth: 400,
            marginBottom: "2.5rem",
          }}
        >
          {data.title as string}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {items.map((t, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "1.75rem",
                boxShadow: "0 2px 16px rgba(0,0,0,.06)",
                border: "1px solid #E2E8F0",
              }}
            >
              <div
                style={{
                  background: t.logoColor,
                  color: "#fff",
                  padding: "8px 14px",
                  borderRadius: 8,
                  fontWeight: 800,
                  fontSize: ".9rem",
                  display: "inline-block",
                  marginBottom: "1rem",
                }}
              >
                {t.logo}
              </div>
              <p
                style={{
                  fontSize: ".85rem",
                  color: "#475569",
                  lineHeight: 1.65,
                  marginBottom: "1.25rem",
                }}
              >
                &ldquo;{t.text}&rdquo;
              </p>
              <div style={{ fontWeight: 700, fontSize: ".85rem" }}>
                {t.name}
              </div>
              <div style={{ fontSize: ".78rem", color: "#64748B" }}>
                {t.role}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RealisationsSection({ data }: { data: Record<string, unknown> }) {
  const items =
    (data.items as {
      titre: string;
      desc: string;
      bg: string;
      color: string;
      imageUrl?: string;
    }[]) ?? [];
  return (
    <section style={{ padding: "5rem 2rem" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <p
          style={{
            fontSize: ".75rem",
            fontWeight: 700,
            color: "#2563EB",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: ".75rem",
          }}
        >
          {data.sectionLabel as string}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          <h2
            style={{
              fontWeight: 800,
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              maxWidth: 440,
            }}
          >
            {data.title as string}
          </h2>
          <a
            href="#"
            style={{
              color: "#2563EB",
              fontWeight: 700,
              fontSize: ".88rem",
              textDecoration: "none",
            }}
          >
            {data.ctaText as string}
          </a>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {items.map((r, i) => (
            <div
              key={i}
              style={{
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,.1)",
              }}
            >
              <div
                style={{
                  background: r.bg,
                  height: 180,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {r.imageUrl ? (
                  <img
                    src={r.imageUrl}
                    alt={r.titre}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      fontWeight: 900,
                      fontSize: "1.4rem",
                      color: r.color,
                      textAlign: "center",
                      padding: "1rem",
                    }}
                  >
                    {r.titre}
                  </span>
                )}
              </div>
              <div style={{ padding: "1.25rem", background: "#fff" }}>
                <p
                  style={{
                    fontSize: ".82rem",
                    color: "#475569",
                    margin: 0,
                    lineHeight: 1.55,
                  }}
                >
                  {r.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogSection({ data }: { data: Record<string, unknown> }) {
  const items =
    (data.items as {
      tag: string;
      titre: string;
      desc: string;
      imageUrl?: string;
      imageBg: string;
      imageEmoji: string;
    }[]) ?? [];
  return (
    <section style={{ padding: "5rem 2rem", background: "#F8FAFC" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <p
          style={{
            fontSize: ".75rem",
            fontWeight: 700,
            color: "#2563EB",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: ".75rem",
          }}
        >
          {data.sectionLabel as string}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2.5rem",
          }}
        >
          <h2 style={{ fontWeight: 800, fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>
            {data.title as string}
          </h2>
          <a
            href="#"
            style={{
              color: "#2563EB",
              fontWeight: 700,
              fontSize: ".88rem",
              textDecoration: "none",
            }}
          >
            {data.ctaText as string}
          </a>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {items.map((a, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid #E2E8F0",
              }}
            >
              <div
                style={{
                  background: a.imageBg,
                  height: 140,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {a.imageUrl ? (
                  <img
                    src={a.imageUrl}
                    alt={a.titre}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: "3rem" }}>{a.imageEmoji}</span>
                )}
              </div>
              <div style={{ padding: "1.25rem" }}>
                <span
                  style={{
                    fontSize: ".7rem",
                    fontWeight: 700,
                    color: "#2563EB",
                    background: "#EFF6FF",
                    borderRadius: 999,
                    padding: "2px 10px",
                    display: "inline-block",
                    marginBottom: 8,
                  }}
                >
                  {a.tag}
                </span>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: ".95rem",
                    marginBottom: ".5rem",
                    lineHeight: 1.4,
                  }}
                >
                  {a.titre}
                </h3>
                <p
                  style={{
                    fontSize: ".8rem",
                    color: "#64748B",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {a.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ data }: { data: Record<string, unknown> }) {
  const items = (data.items as { question: string; answer: string }[]) ?? [];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section style={{ padding: "5rem 2rem" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <p
          style={{
            fontSize: ".75rem",
            fontWeight: 700,
            color: "#2563EB",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: ".75rem",
            textAlign: "center",
          }}
        >
          {data.sectionLabel as string}
        </p>
        <h2
          style={{
            fontWeight: 800,
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            textAlign: "center",
            marginBottom: "3rem",
          }}
        >
          {data.title as string}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {items.map((q, i) => (
            <div
              key={i}
              style={{
                border: "1.5px solid #E2E8F0",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%",
                  padding: "1rem 1.25rem",
                  fontWeight: 600,
                  fontSize: ".9rem",
                  background: open === i ? "#EFF6FF" : "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textAlign: "left",
                }}
              >
                {q.question}
                <i
                  className={`bi ${open === i ? "bi-chevron-up" : "bi-chevron-down"}`}
                  style={{ color: "#2563EB", flexShrink: 0, marginLeft: 12 }}
                />
              </button>
              {open === i && (
                <div
                  style={{
                    padding: "1rem 1.25rem 1.25rem",
                    fontSize: ".88rem",
                    color: "#475569",
                    lineHeight: 1.7,
                    background: "#EFF6FF",
                  }}
                >
                  {q.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection({ data }: { data: Record<string, unknown> }) {
  return (
    <section style={{ padding: "2rem 2rem 5rem" }}>
      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          background: (data.bgColor as string) || "#0F172A",
          borderRadius: 24,
          padding: "4rem 3rem",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <p
          style={{
            fontSize: ".75rem",
            fontWeight: 700,
            color: "#60A5FA",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}
        >
          {data.sectionLabel as string}
        </p>
        <h2
          style={{
            fontWeight: 800,
            fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
            color: "#fff",
            marginBottom: "1rem",
            whiteSpace: "pre-line",
          }}
        >
          {data.title as string}
        </h2>
        <p
          style={{ color: "#94A3B8", marginBottom: "2rem", fontSize: ".9rem" }}
        >
          {data.subtitle as string}
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href={(data.cta1Url as string) || "#"}
            style={{
              padding: "13px 28px",
              borderRadius: 10,
              background: (data.cta1Color as string) || "#2563EB",
              color: "#fff",
              fontWeight: 700,
              fontSize: ".95rem",
              textDecoration: "none",
            }}
          >
            {data.cta1Text as string}
          </a>
          <a
            href={(data.cta2Url as string) || "#"}
            style={{
              padding: "13px 24px",
              borderRadius: 10,
              border: "1.5px solid rgba(255,255,255,.2)",
              color: "#fff",
              fontWeight: 600,
              fontSize: ".95rem",
              textDecoration: "none",
            }}
          >
            {data.cta2Text as string}
          </a>
        </div>
      </div>
    </section>
  );
}

function ContactSection({ data }: { data: Record<string, unknown> }) {
  const [formData, setFormData] = useState({ nom: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: show success without real submission
    setSent(true);
  };

  return (
    <section
      style={{
        padding: "5rem 2rem",
        background: (data.bgColor as string) || "#F8FAFC",
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <p
          style={{
            fontSize: ".75rem",
            fontWeight: 700,
            color: "#2563EB",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: ".75rem",
            textAlign: "center",
          }}
        >
          {data.sectionLabel as string}
        </p>
        <h2
          style={{
            fontWeight: 800,
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            textAlign: "center",
            marginBottom: ".75rem",
          }}
        >
          {data.title as string}
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#64748B",
            fontSize: ".9rem",
            marginBottom: "3rem",
          }}
        >
          {data.subtitle as string}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
          }}
        >
          {/* Infos */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              justifyContent: "center",
            }}
          >
            {(data.email as string) && (
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: "#EFF6FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i
                    className="bi bi-envelope"
                    style={{ color: "#2563EB", fontSize: "1.1rem" }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: ".85rem",
                      marginBottom: 2,
                    }}
                  >
                    Email
                  </div>
                  <a
                    href={`mailto:${data.email}`}
                    style={{
                      fontSize: ".85rem",
                      color: "#475569",
                      textDecoration: "none",
                    }}
                  >
                    {data.email as string}
                  </a>
                </div>
              </div>
            )}
            {(data.phone as string) && (
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: "#EFF6FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i
                    className="bi bi-telephone"
                    style={{ color: "#2563EB", fontSize: "1.1rem" }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: ".85rem",
                      marginBottom: 2,
                    }}
                  >
                    Téléphone
                  </div>
                  <a
                    href={`tel:${data.phone}`}
                    style={{
                      fontSize: ".85rem",
                      color: "#475569",
                      textDecoration: "none",
                    }}
                  >
                    {data.phone as string}
                  </a>
                </div>
              </div>
            )}
            {(data.address as string) && (
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: "#EFF6FF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i
                    className="bi bi-geo-alt"
                    style={{ color: "#2563EB", fontSize: "1.1rem" }}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: ".85rem",
                      marginBottom: 2,
                    }}
                  >
                    Adresse
                  </div>
                  <div style={{ fontSize: ".85rem", color: "#475569" }}>
                    {data.address as string}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Formulaire */}
          {sent ? (
            <div
              style={{
                background: "#F0FDF4",
                border: "1.5px solid #86EFAC",
                borderRadius: 16,
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                textAlign: "center",
              }}
            >
              <i
                className="bi bi-check-circle-fill"
                style={{ fontSize: "2.5rem", color: "#22C55E" }}
              />
              <p style={{ fontWeight: 700, fontSize: "1rem" }}>
                Message envoyé !
              </p>
              <p style={{ fontSize: ".85rem", color: "#475569" }}>
                Nous vous répondrons dans les 24h.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "2rem",
                boxShadow: "0 2px 16px rgba(0,0,0,.06)",
                border: "1px solid #E2E8F0",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: ".8rem",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  {data.labelNom as string}
                </label>
                <input
                  required
                  value={formData.nom}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1.5px solid #E2E8F0",
                    fontSize: ".85rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: ".8rem",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  {data.labelEmail as string}
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1.5px solid #E2E8F0",
                    fontSize: ".85rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: ".8rem",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  {data.labelMessage as string}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: "1.5px solid #E2E8F0",
                    fontSize: ".85rem",
                    outline: "none",
                    resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: "11px",
                  borderRadius: 9,
                  background: "#2563EB",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: ".88rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {data.labelSubmit as string}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function FooterSection({ data }: { data: Record<string, unknown> }) {
  const cities = (data.cities as string[]) ?? [];
  const columns = (data.columns as { title: string; links: string[] }[]) ?? [];
  return (
    <footer
      style={{
        background: (data.bgColor as string) || "#0F172A",
        color: "#94A3B8",
        padding: "4rem 2rem 2rem",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3rem",
          }}
        >
          <div>
            <p
              style={{
                fontWeight: 800,
                color: "#fff",
                fontSize: ".95rem",
                marginBottom: "1rem",
              }}
            >
              {data.logo as string}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {cities.map((city) => (
                <span
                  key={city}
                  style={{
                    fontSize: ".8rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <i
                    className="bi bi-geo-alt"
                    style={{ fontSize: ".75rem", color: "#60A5FA" }}
                  />
                  {city}
                </span>
              ))}
            </div>
          </div>
          {columns.map((col, i) => (
            <div key={i}>
              <p
                style={{
                  fontWeight: 700,
                  color: "#fff",
                  fontSize: ".85rem",
                  marginBottom: ".75rem",
                }}
              >
                {col.title}
              </p>
              {col.links.map((l) => (
                <p
                  key={l}
                  style={{
                    fontSize: ".8rem",
                    marginBottom: 6,
                    color: "#94A3B8",
                  }}
                >
                  {l}
                </p>
              ))}
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,.08)",
            paddingTop: "1.5rem",
          }}
        >
          <span style={{ fontSize: ".78rem" }}>{data.copyright as string}</span>
        </div>
      </div>
    </footer>
  );
}

function renderSection(section: BuilderSection) {
  if (!section.visible) return null;
  const d = section.data;
  switch (section.type as SectionType) {
    case "navbar":
      return <NavbarSection data={d} />;
    case "hero":
      return <HeroSection data={d} />;
    case "expertises":
      return <ExpertisesSection data={d} />;
    case "temoignages":
      return <TemoignagesSection data={d} />;
    case "realisations":
      return <RealisationsSection data={d} />;
    case "blog":
      return <BlogSection data={d} />;
    case "faq":
      return <FaqSection data={d} />;
    case "cta":
      return <CtaSection data={d} />;
    case "contact":
      return <ContactSection data={d} />;
    case "footer":
      return <FooterSection data={d} />;
    default:
      return null;
  }
}

// ============================================================
// Main SitePreview component
// ============================================================
interface SitePreviewProps {
  siteId: string;
  siteNom: string;
  sections: BuilderSection[];
  hideBanner?: boolean;
}

export default function SitePreview({
  siteId,
  siteNom,
  sections,
  hideBanner = false,
}: SitePreviewProps) {
  return (
    <div
      style={{
        fontFamily: "Manrope, sans-serif",
        minHeight: "100vh",
        background: "#fff",
      }}
    >
      {/* Preview banner */}
      {!hideBanner && (
        <div
          style={{
            background: "#1D4ED8",
            color: "#fff",
            textAlign: "center",
            padding: "10px 1rem",
            fontSize: ".8rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            position: "sticky",
            top: 0,
            zIndex: 200,
          }}
        >
          <i className="bi bi-eye" />
          Aperçu de <strong>&nbsp;{siteNom}&nbsp;</strong> — Ceci est une
          prévisualisation
          <a
            href={`/builder/${siteId}`}
            style={{
              padding: "4px 14px",
              borderRadius: 20,
              background: "rgba(255,255,255,.2)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: ".78rem",
              marginLeft: 8,
            }}
          >
            ← Retour à l&apos;éditeur
          </a>
        </div>
      )}

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.id} id={section.type}>
          {renderSection(section)}
        </div>
      ))}

      {sections.length === 0 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "80vh",
            color: "#94A3B8",
            gap: 16,
          }}
        >
          <i
            className="bi bi-layout-text-window-reverse"
            style={{ fontSize: "3rem" }}
          />
          <p style={{ fontWeight: 600, fontSize: "1rem" }}>
            Aucune section à afficher
          </p>
          <p style={{ fontSize: ".85rem" }}>
            Ajoutez des sections dans l&apos;éditeur puis sauvegardez.
          </p>
          <a
            href={`/builder/${siteId}`}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              background: "#2563EB",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: ".88rem",
            }}
          >
            Ouvrir l&apos;éditeur
          </a>
        </div>
      )}
    </div>
  );
}
