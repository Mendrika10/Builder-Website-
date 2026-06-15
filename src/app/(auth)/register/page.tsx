"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("register_form_data");
      return saved
        ? JSON.parse(saved)
        : { nom: "", email: "", password: "", confirm: "" };
    }
    return { nom: "", email: "", password: "", confirm: "" };
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);

  // Synchroniser la validité de l'email au chargement
  useEffect(() => {
    if (form.email) {
      setIsEmailValid(isValidEmail(form.email));
    }
  }, []);

  useEffect(() => {
    // SÉCURITÉ EXPERTE : On ne sauvegarde que si le formulaire n'est pas vide
    // Cela empêche l'écrasement accidentel des données restaurées par un état initial vide
    const hasData = Object.values(form).some((value) => value !== "");
    if (hasData) {
      localStorage.setItem("register_form_data", JSON.stringify(form));
    }
  }, [form]);
  // ...existing code...

  // États pour le blocage
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedUntil, setBlockedUntil] = useState<Date | null>(null);
  const [blockedSecondsLeft, setBlockedSecondsLeft] = useState<number | null>(
    null,
  );

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

  // Timer pour le compte à rebours du blocage
  useEffect(() => {
    if (!isBlocked || !blockedUntil) {
      setBlockedSecondsLeft(null);
      return;
    }

    const tick = () => {
      const now = new Date();
      const secs = Math.max(
        0,
        Math.floor((blockedUntil.getTime() - now.getTime()) / 1000),
      );
      setBlockedSecondsLeft(secs);
      if (secs <= 0) {
        setIsBlocked(false);
        setBlockedUntil(null);
        setBlockedSecondsLeft(null);
        setError("");
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isBlocked, blockedUntil]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsBlocked(false);
    setBlockedUntil(null);

    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (form.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: form.nom,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 429) {
          // BLOCAGE DÉTECTÉ : On affiche l'alerte avec compte à rebours
          setIsBlocked(true);
          setBlockedUntil(
            data.blockedUntil ? new Date(data.blockedUntil) : null,
          );
          setError(
            data.message ?? "Trop de tentatives. Votre compte est bloqué.",
          );
        } else if (res.status === 409) {
          setError(data.message ?? "Cet email est déjà utilisé.");
        } else if (res.status === 400) {
          setError(data.message ?? "Données invalides.");
        } else {
          setError(data.message ?? "Une erreur est survenue.");
        }
        setLoading(false);
        return;
      }

      setLoading(false);
      router.push(
        `/verify?userId=${encodeURIComponent(data.userId)}&email=${encodeURIComponent(
          form.email,
        )}`,
      );
    } catch (err) {
      console.error("[REGISTER CLIENT]", err);
      setError("Impossible de contacter le serveur. Vérifiez votre connexion.");
      setLoading(false);
    }
  };

  const inputStyle = {
    height: 46,
    borderRadius: 10,
    border: "1.5px solid #E2E8F0",
    fontSize: ".9rem",
  };
  const labelStyle = {
    fontSize: ".82rem",
    fontWeight: 600,
    color: "var(--text-dark)",
    display: "block",
    marginBottom: 6,
  };

  return (
    <>
      <h1
        style={{
          fontWeight: 800,
          fontSize: "1.7rem",
          color: "var(--text-dark)",
          marginBottom: ".4rem",
        }}
      >
        Creer un compte
      </h1>
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: ".9rem",
          marginBottom: "1.75rem",
          lineHeight: 1.6,
        }}
      >
        Gratuit · Sans carte bancaire · Votre site en ligne en 5 minutes.
      </p>

      {error && !isBlocked && (
        <div
          className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3"
          style={{ fontSize: ".85rem" }}
        >
          <i className="bi bi-exclamation-triangle-fill flex-shrink-0" />
          {error}
        </div>
      )}

      {isBlocked && (
        <div
          className="alert alert-warning d-flex flex-column gap-2 py-3 mb-3"
          style={{
            fontSize: ".85rem",
            background: "#FEF3C7",
            border: "1px solid #F59E0B",
            color: "#92400E",
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-lock-fill flex-shrink-0" />
            <strong>Vérification bloquée</strong>
          </div>
          <span>
            Trop de tentatives infructueuses. Veuillez patienter avant de
            réessayer.
          </span>
          <div
            className="badge bg-warning text-dark d-inline-block"
            style={{
              width: "fit-content",
              padding: "6px 12px",
              borderRadius: "8px",
            }}
          >
            Réessayez dans{" "}
            {blockedSecondsLeft !== null
              ? `${Math.floor(blockedSecondsLeft / 60)}m ${blockedSecondsLeft % 60}s`
              : "..."}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nom" style={labelStyle}>
            Nom complet
          </label>
          <input
            id="nom"
            type="text"
            className="form-control"
            style={inputStyle}
            placeholder="Jean Dupont"
            required
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" style={labelStyle}>
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            className="form-control"
            style={inputStyle}
            placeholder="vous@exemple.com"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => {
              const v = e.target.value;
              setForm({ ...form, email: v });
              setIsEmailValid(isValidEmail(v));
            }}
          />
          {!isEmailValid && (
            <div style={{ color: "#d63333", fontSize: ".82rem", marginTop: 6 }}>
              Format d'email invalide
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="password" style={labelStyle}>
            Mot de passe
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="form-control"
              style={{ ...inputStyle, paddingRight: 44 }}
              placeholder="Minimum 8 caracteres"
              required
              minLength={8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                padding: 0,
              }}
            >
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                style={{ fontSize: "1rem" }}
              />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="confirm" style={labelStyle}>
            Confirmer le mot de passe
          </label>
          <input
            id="confirm"
            type="password"
            className="form-control"
            style={inputStyle}
            placeholder="Repetez le mot de passe"
            required
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !isEmailValid || isBlocked}
          style={{
            width: "100%",
            height: 48,
            background:
              loading || !isEmailValid || isBlocked
                ? "#94A3B8"
                : "var(--primary)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: ".95rem",
            cursor:
              loading || !isEmailValid || isBlocked ? "not-allowed" : "pointer",
            opacity: loading ? 0.75 : 1,
          }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Creation du compte...
            </>
          ) : isBlocked ? (
            <>
              <i className="bi bi-lock-fill me-2" />
              Compte bloqué
            </>
          ) : (
            "Creer mon compte gratuit"
          )}
        </button>
      </form>

      <p
        style={{
          fontSize: ".78rem",
          color: "var(--text-muted)",
          textAlign: "center",
          marginTop: "1rem",
        }}
      >
        En creant un compte, vous acceptez nos{" "}
        <a href="#" style={{ color: "var(--primary)", textDecoration: "none" }}>
          CGU
        </a>{" "}
        et notre{" "}
        <a href="#" style={{ color: "var(--primary)", textDecoration: "none" }}>
          politique de confidentialite
        </a>
        .
      </p>

      <p
        style={{
          textAlign: "center",
          fontSize: ".85rem",
          color: "var(--text-muted)",
          marginTop: ".75rem",
        }}
      >
        Deja un compte ?{" "}
        <Link
          href="/login"
          style={{
            color: "var(--primary)",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Se connecter
        </Link>
      </p>
    </>
  );
}
