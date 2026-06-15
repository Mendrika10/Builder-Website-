"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

const navItems = [
  { href: "/dashboard", icon: "bi-house", label: "Accueil" },
  { href: "/sites", icon: "bi-globe2", label: "Mes sites" },
  { href: "/billing", icon: "bi-credit-card", label: "Facturation" },
  { href: "/settings", icon: "bi-gear", label: "Paramètres" },
];

const adminItems = [
  { href: "/admin/users", icon: "bi-people", label: "Utilisateurs" },
  { href: "/admin/plans", icon: "bi-layers", label: "Plans" },
  { href: "/admin/modeles", icon: "bi-layout-text-window", label: "Modèles" },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <i className="bi bi-grid-3x3-gap-fill me-2" />
        Site.mg
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav flex-grow-1 py-3">
        <div className="px-3 mb-1">
          <small
            className="text-uppercase fw-semibold"
            style={{
              fontSize: "0.65rem",
              letterSpacing: "0.08em",
              color: "#7c85c4",
            }}
          >
            Menu principal
          </small>
        </div>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive ? "active" : ""}`}
            >
              <i className={`bi ${item.icon}`} />
              {item.label}
            </Link>
          );
        })}

        {/* Admin section */}
        {user.role === "admin" && (
          <>
            <hr
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                margin: "1rem 0.75rem",
              }}
            />
            <div className="px-3 mb-1">
              <small
                className="text-uppercase fw-semibold"
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  color: "#7c85c4",
                }}
              >
                Administration
              </small>
            </div>
            {adminItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${isActive ? "active" : ""}`}
                >
                  <i className={`bi ${item.icon}`} />
                  {item.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* User info + logout */}
      <div
        className="p-3 border-top"
        style={{ borderColor: "rgba(255,255,255,0.1) !important" }}
      >
        <div className="d-flex align-items-center gap-2 mb-3">
          <div
            className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
            style={{
              width: 36,
              height: 36,
              fontSize: "0.85rem",
              flexShrink: 0,
            }}
          >
            {user.name?.[0]?.toUpperCase() ?? "U"}
          </div>
          <div className="overflow-hidden">
            <div className="fw-semibold text-white small text-truncate">
              {user.name ?? "Utilisateur"}
            </div>
            <div
              className="text-truncate"
              style={{ fontSize: "0.7rem", color: "#7c85c4" }}
            >
              {user.email}
            </div>
          </div>
        </div>
        <button
          className="btn btn-sm w-100 text-start d-flex align-items-center gap-2"
          style={{
            color: "#a5b4fc",
            background: "transparent",
            border: "none",
          }}
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <i className="bi bi-box-arrow-left" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
