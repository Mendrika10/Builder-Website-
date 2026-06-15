import type { BuilderSection } from "@/components/builder/BuilderEditor";

export const entrepriseTemplate: BuilderSection[] = [
  {
    id: "navbar-1",
    type: "navbar",
    visible: true,
    label: "Navigation",
    data: {
      logo: "MonEntreprise",
      links: [
        { label: "Expertises", type: "section", href: "#expertises" },
        { label: "Technologies", type: "section", href: "#expertises" },
        { label: "Réalisations", type: "section", href: "#realisations" },
        { label: "Ressources", type: "section", href: "#blog" },
        { label: "Contact", type: "section", href: "#contact" },
      ],
      cta1Text: "Planifier un appel",
      cta1Url: "#contact",
      cta2Text: "Nous contacter",
      cta2Url: "#contact",
    },
  },
  {
    id: "hero-1",
    type: "hero",
    visible: true,
    label: "Hero",
    data: {
      badge: "AGENCE WEB & DIGITALE",
      title: "Concepteurs d'expériences\ndigitales sur mesure et\nperformantes",
      subtitle:
        "Confiez la conception et le développement de vos solutions digitales à une agence reconnue pour son expertise en innovation technologique.",
      cta1Text: "Réserver une étude de projet gratuite →",
      cta1Url: "#contact",
      cta2Text: "Consulter notre agence",
      cta2Url: "#realisations",
      rating: "4.9/5",
      ratingLabel: "sur Google",
      stats: ["+150 projets livrés", "Certifié Google Partner"],
      clients: [
        "Credit Suisse",
        "Axéréal",
        "INpi",
        "Meilleurce",
        "NATIVE",
        "Qorc",
      ],
      imageUrl: "",
    },
  },
  {
    id: "expertises-1",
    type: "expertises",
    visible: true,
    label: "Expertises",
    data: {
      sectionLabel: "LES TECHNOLOGIES UTILISÉES PAR NOS AGENCES",
      title:
        "Nos développeurs utilisent les meilleures technologies open source du marché pour votre projet",
      subtitle:
        "Chaque projet est une opportunité. Nos équipes maîtrisent un large éventail de technologies modernes pour vous offrir les meilleures solutions.",
      bgColor: "#0F172A",
      items: [
        { icon: "bi-laptop", label: "Développement Web" },
        { icon: "bi-phone", label: "Applications Mobile" },
        { icon: "bi-palette", label: "Design UI/UX" },
        { icon: "bi-graph-up-arrow", label: "SEO & Marketing" },
        { icon: "bi-cloud", label: "Cloud & DevOps" },
        { icon: "bi-shield-check", label: "Cybersécurité" },
        { icon: "bi-bar-chart-line", label: "Analytics" },
        { icon: "bi-robot", label: "Intelligence Artificielle" },
        { icon: "bi-cart3", label: "E-commerce" },
        { icon: "bi-people", label: "Conseil & Stratégie" },
        { icon: "bi-headset", label: "Support & Maintenance" },
        { icon: "bi-megaphone", label: "Communication Digitale" },
      ],
      ctaText: "Consulter toutes nos technologies",
    },
  },
  {
    id: "temoignages-1",
    type: "temoignages",
    visible: true,
    label: "Témoignages",
    data: {
      sectionLabel: "NOS CLIENTS EN PARLENT",
      title:
        "Ils ont fait confiance à notre agence et témoignent de leur expérience",
      subtitle:
        "La satisfaction de nos clients demeure notre priorité et leurs témoignages positifs constituent pour nous une immense fierté.",
      items: [
        {
          logo: "AirFrance",
          logoColor: "#00205B",
          name: "Daniel Cros",
          role: "Chef de Projet IT",
          text: "Le développement s'est déroulé de façon fluide et efficace. L'équipe a parfaitement compris nos besoins spécifiques et livré un outil robuste, ergonomique et parfaitement intégré à nos processus.",
        },
        {
          logo: "Crédit Mutuel",
          logoColor: "#CC0000",
          name: "Mickaël Joseph",
          role: "Lead Développeur, Projet & Skills",
          text: "Dans un environnement exigeant, l'agence a su s'adapter à nos nombreuses contraintes. Notre projet a avancé sans aucune friction avec un respect exemplaire des délais.",
        },
        {
          logo: "UltraEdge",
          logoColor: "#2563EB",
          name: "Henry Gill",
          role: "Fondateur - Firme",
          text: "Nous avons confié toutes les réalisations de notre système à cette agence, bâtie en un temps record. Cette agence en comparaison à d'autres sont d'un réel avantage.",
        },
      ],
    },
  },
  {
    id: "realisations-1",
    type: "realisations",
    visible: true,
    label: "Réalisations",
    data: {
      sectionLabel: "NOS RÉALISATIONS",
      title: "Quelques-unes de nos collaborations les plus marquantes",
      ctaText: "Consulter toutes nos réalisations →",
      items: [
        {
          titre: "HERMÈS Paris",
          desc: "Maintenance d'une solution de sensibilisation à la cybersécurité",
          bg: "#1A1A1A",
          color: "#C6A96A",
          imageUrl: "",
        },
        {
          titre: "ROGER & GALLET",
          desc: "Intégration d'une interface pour un e-commerce headless",
          bg: "#F5F0EB",
          color: "#2D2D2D",
          imageUrl: "",
        },
        {
          titre: "UltraEdge",
          desc: "Conception et intégration d'un site vitrine multilingue",
          bg: "#0A0E1A",
          color: "#4FC3F7",
          imageUrl: "",
        },
      ],
    },
  },
  {
    id: "blog-1",
    type: "blog",
    visible: true,
    label: "Blog",
    data: {
      sectionLabel: "NOS DERNIÈRES PUBLICATIONS",
      title: "Nos derniers articles",
      ctaText: "Consulter tous nos articles →",
      items: [
        {
          tag: "FRAMEWORK",
          titre: "Sylius : Le meilleur framework e-commerce",
          desc: "Découvrez les caractéristiques de Sylius qui en font le framework e-commerce le plus adapté pour les entreprises.",
          imageUrl: "",
          imageBg: "#F0FDF4",
          imageEmoji: "🛍️",
        },
        {
          tag: "CMS",
          titre: "Strapi : CMS Headless gratuit & open source",
          desc: "Une introduction complète de Strapi en tant que CMS Headless et les différents avantages de cette solution.",
          imageUrl: "",
          imageBg: "#EFF6FF",
          imageEmoji: "📦",
        },
        {
          tag: "CMS",
          titre: "CMS Headless : Le guide complet",
          desc: "Plongez dans le monde du CMS Headless et découvrez les avantages de passer à une architecture découplée.",
          imageUrl: "",
          imageBg: "#FDF4FF",
          imageEmoji: "📝",
        },
      ],
    },
  },
  {
    id: "faq-1",
    type: "faq",
    visible: true,
    label: "FAQ",
    data: {
      sectionLabel: "VOUS HÉSITEZ ENCORE ?",
      title: "On éclair votre choix !",
      items: [
        {
          question: "Qu'est-ce qu'une agence web ?",
          answer:
            "Une agence web est une entreprise spécialisée dans la création, le développement et la maintenance de sites internet et d'applications web.",
        },
        {
          question: "Quels sont les critères pour choisir une agence web ?",
          answer:
            "Référez-vous au portfolio, aux avis clients, à l'expertise technique et à la capacité de l'agence à comprendre vos besoins métier.",
        },
        {
          question:
            "Pourquoi préférer une agence digitale plutôt qu'un freelance ?",
          answer:
            "Une agence offre une équipe complète (développeurs, designers, chef de projet) et une continuité de service même en cas d'absence.",
        },
        {
          question:
            "Quelle est la différence entre une agence web et une agence digitale ?",
          answer:
            "L'agence digitale englobe en plus le marketing digital, le SEO et les réseaux sociaux, en complément du développement web.",
        },
      ],
    },
  },
  {
    id: "cta-1",
    type: "cta",
    visible: true,
    label: "CTA Final",
    data: {
      sectionLabel: "DES AMBITIONS PLEIN LA TÊTE",
      title: "Profitez d'un regard expert\nsur votre projet",
      subtitle:
        "Notre agence analyse gratuitement votre projet et vous apporte un rapport de performance en moins de 48h.",
      bgColor: "#0F172A",
      cta1Text: "Démarrer un projet",
      cta1Url: "#",
      cta1Color: "#2563EB",
      cta2Text: "Planifier un appel →",
      cta2Url: "#",
    },
  },
  {
    id: "footer-1",
    type: "footer",
    visible: true,
    label: "Pied de page",
    data: {
      logo: "MonEntreprise",
      cities: ["Paris", "Montpellier", "Toulouse", "Remote"],
      columns: [
        {
          title: "EXPERTISES",
          links: [
            "Développement Web",
            "Applications Mobile",
            "Design UI/UX",
            "E-commerce",
            "SEO",
          ],
        },
        {
          title: "FRONT-END",
          links: ["React", "Next.js", "Vue.js", "TypeScript", "Tailwind CSS"],
        },
        {
          title: "SITE",
          links: [
            "Accueil",
            "À propos",
            "Expertises",
            "Réalisations",
            "Blog",
            "Contact",
          ],
        },
        {
          title: "RESSOURCES",
          links: ["Blog", "Tutoriels", "Documentation", "Changelog"],
        },
      ],
      copyright: "© 2026 MonEntreprise · Tous droits réservés",
      bgColor: "#0F172A",
    },
  },
];
