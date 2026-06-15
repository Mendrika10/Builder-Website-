import React from "react";
import { NavbarSection } from "./NavbarSection";
import { HeroSection } from "./HeroSection";
import { ExpertisesSection } from "./ExpertisesSection";
import { TemoignagesSection } from "./TemoignagesSection";
import { RealisationsSection } from "./RealisationsSection";
import { BlogSection } from "./BlogSection";
import { FaqSection } from "./FaqSection";
import { CtaSection } from "./CtaSection";
import { ContactSection } from "./ContactSection";
import { FooterSection } from "./FooterSection";
import { BuilderSection } from "../types";

export function renderSection(section: BuilderSection) {
  const d = section.data;
  switch (section.type) {
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
