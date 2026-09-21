/** THEME-002 — Thèmes de couleur des sites publiés (miroir de THEMES côté API). */
export const THEMES = ["indigo", "emeraude", "orange", "rose", "ocean"] as const;
export type Theme = (typeof THEMES)[number];

export type ThemePalette = {
  label: string;
  /** Fond du bloc hero (dégradé). */
  heroBg: string;
  /** Fond des sections accentuées (cta). */
  accentBg: string;
  /** Fond clair des sections secondaires (cta clair, horaires). */
  accentSoftBg: string;
  /** Couleur du texte sur fond accent. */
  accentText: string;
  /** Couleur des boutons pleins. */
  buttonBg: string;
  /** Couleur du texte des liens dans la navigation publique. */
  navActive: string;
  /** Pastille du sélecteur de thème. */
  swatch: string;
};

export const PALETTES: Record<Theme, ThemePalette> = {
  indigo: {
    label: "Indigo",
    heroBg: "from-[#4338CA] via-[#6366F1] to-[#4F46E5]",
    accentBg: "bg-[#4F46E5] hover:bg-[#4338CA]",
    accentSoftBg: "bg-[#EEF2FF]",
    accentText: "text-[#4338CA]",
    buttonBg: "bg-[#4F46E5] hover:bg-[#4338CA]",
    navActive: "bg-[#EEF2FF] text-[#4338CA]",
    swatch: "bg-[#6366F1]",
  },
  emeraude: {
    label: "Émeraude",
    heroBg: "from-[#047857] via-[#10B981] to-[#059669]",
    accentBg: "bg-[#059669] hover:bg-[#047857]",
    accentSoftBg: "bg-[#ECFDF5]",
    accentText: "text-[#047857]",
    buttonBg: "bg-[#059669] hover:bg-[#047857]",
    navActive: "bg-[#ECFDF5] text-[#047857]",
    swatch: "bg-[#10B981]",
  },
  orange: {
    label: "Orange",
    heroBg: "from-[#C2410C] via-[#F97316] to-[#EA580C]",
    accentBg: "bg-[#EA580C] hover:bg-[#C2410C]",
    accentSoftBg: "bg-[#FFF7ED]",
    accentText: "text-[#C2410C]",
    buttonBg: "bg-[#EA580C] hover:bg-[#C2410C]",
    navActive: "bg-[#FFF7ED] text-[#C2410C]",
    swatch: "bg-[#F97316]",
  },
  rose: {
    label: "Rose",
    heroBg: "from-[#BE123C] via-[#F43F5E] to-[#E11D48]",
    accentBg: "bg-[#E11D48] hover:bg-[#BE123C]",
    accentSoftBg: "bg-[#FFF1F2]",
    accentText: "text-[#BE123C]",
    buttonBg: "bg-[#E11D48] hover:bg-[#BE123C]",
    navActive: "bg-[#FFF1F2] text-[#BE123C]",
    swatch: "bg-[#F43F5E]",
  },
  ocean: {
    label: "Océan",
    heroBg: "from-[#0E7490] via-[#06B6D4] to-[#0891B2]",
    accentBg: "bg-[#0891B2] hover:bg-[#0E7490]",
    accentSoftBg: "bg-[#ECFEFF]",
    accentText: "text-[#0E7490]",
    buttonBg: "bg-[#0891B2] hover:bg-[#0E7490]",
    navActive: "bg-[#ECFEFF] text-[#0E7490]",
    swatch: "bg-[#06B6D4]",
  },
};

/** Retourne la palette du thème, avec repli Indigo si thème inconnu. */
export function paletteOf(theme: string | undefined | null): ThemePalette {
  return PALETTES[(theme ?? "indigo") as Theme] ?? PALETTES.indigo;
}
