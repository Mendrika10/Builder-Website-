"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { apiPost } from "@/lib/api";

type RegisterResponse = {
  user: { id: string; email: string; emailVerifie: boolean };
  message: string;
};

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planChoisi = searchParams.get("plan"); // PLAN-003 — préselection depuis /pricing
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldError(null);
    setServerError(null);

    if (motDePasse.length < 8 || !/[A-Za-z]/.test(motDePasse) || !/[0-9]/.test(motDePasse)) {
      setFieldError("Le mot de passe doit contenir au moins 8 caractères, une lettre et un chiffre.");
      return;
    }

    setLoading(true);
    try {
      await apiPost<RegisterResponse>("/auth/register", { nom, email, motDePasse });
      router.push(`/verify?email=${encodeURIComponent(email.trim().toLowerCase())}`);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card variant="elevated" className="p-8">
      <h1 className="font-display text-h2 text-neutral-900">Créer un compte</h1>
      <p className="mt-2 text-body text-neutral-600">
        Créez votre premier site en quelques minutes.
      </p>
      {planChoisi && (
        <p role="status" className="mt-4 rounded-input border border-primary-600/30 bg-primary-600/5 px-3 py-2 text-small text-primary-700">
          Plan sélectionné : <strong className="capitalize">{planChoisi}</strong> — vous pourrez l&apos;activer après la création de votre compte.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <Input
          label="Nom complet"
          name="nom"
          autoComplete="name"
          required
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          error={nom.length > 0 && nom.trim().length < 2 ? "Au moins 2 caractères." : undefined}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Mot de passe"
          name="motDePasse"
          type="password"
          autoComplete="new-password"
          required
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          error={fieldError ?? undefined}
          hint="8 caractères minimum, avec une lettre et un chiffre."
        />

        {serverError && (
          <p role="alert" className="rounded-input border border-danger/30 bg-danger/5 px-3 py-2 text-small text-danger">
            {serverError}
          </p>
        )}

        <Button type="submit" size="lg" loading={loading} className="w-full">
          {loading ? "Création du compte…" : "Créer mon compte"}
        </Button>
      </form>      <p className="mt-6 text-center text-small text-neutral-600">
        Déjà un compte ? {" "}
        <a href="/login" className="text-primary-600 underline-offset-4 hover:underline">
          Se connecter
        </a>
      </p>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<Card variant="elevated" className="h-96 animate-pulse" />}>
      <RegisterContent />
    </Suspense>
  );
}
