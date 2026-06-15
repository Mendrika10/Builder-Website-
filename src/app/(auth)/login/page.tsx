"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
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
        Bon retour
      </h1>
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: ".9rem",
          marginBottom: "2rem",
          lineHeight: 1.6,
        }}
      >
        Connectez-vous a Site.mg pour gerer vos sites, suivre vos analytics et
        publier en un clic.
      </p>

      {error && (
        <div
          className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-3"
          style={{ fontSize: ".85rem" }}
        >
          <i className="bi bi-exclamation-triangle-fill flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label
            htmlFor="email"
            style={{
              fontSize: ".82rem",
              fontWeight: 600,
              color: "var(--text-dark)",
              display: "block",
              marginBottom: 6,
            }}
          >
            Adresse email
          </label>
          <input
            id="email"
            type="email"
            className="form-control"
            style={{
              height: 46,
              borderRadius: 10,
              border: "1.5px solid #E2E8F0",
              fontSize: ".9rem",
            }}
            placeholder="vous@exemple.com"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="mb-2">
          <label
            htmlFor="password"
            style={{
              fontSize: ".82rem",
              fontWeight: 600,
              color: "var(--text-dark)",
              display: "block",
              marginBottom: 6,
            }}
          >
            Mot de passe
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="form-control"
              style={{
                height: 46,
                borderRadius: 10,
                border: "1.5px solid #E2E8F0",
                fontSize: ".9rem",
                paddingRight: 44,
              }}
              placeholder="••••••••"
              required
              minLength={8}
              autoComplete="current-password"
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

        <div className="text-end mb-4">
          <a
            href="#"
            style={{
              fontSize: ".82rem",
              fontWeight: 600,
              color: "var(--primary)",
              textDecoration: "none",
            }}
          >
            Mot de passe oublie ?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            height: 48,
            background: "var(--primary)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: ".95rem",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.75 : 1,
          }}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Connexion...
            </>
          ) : (
            "Se connecter"
          )}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          fontSize: ".85rem",
          color: "var(--text-muted)",
          marginTop: "1.5rem",
        }}
      >
        Pas encore de compte ?{" "}
        <Link
          href="/register"
          style={{
            color: "var(--primary)",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Creer un compte gratuit
        </Link>
      </p>
    </>
  );
}
