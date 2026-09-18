"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { apiPost } from "@/lib/api";

type VerifyResponse = { user: { email: string; emailVerifie: boolean }; message: string };

const CODE_LENGTH = 6;

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const codeDigits = code.replace(/\D/g, "").slice(0, CODE_LENGTH);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (codeDigits.length < CODE_LENGTH) {
      setError("Le code doit contenir exactement 6 chiffres.");
      return;
    }
    setLoading(true);
    try {
      await apiPost<VerifyResponse>("/auth/verify", { email, code: codeDigits });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError(null);
    setResendMessage(null);
    setResendLoading(true);
    try {
      const { message } = await apiPost<{ message: string }>("/auth/resend-code", { email });
      setResendMessage(message);
      setCooldown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setResendLoading(false);
    }
  }

  if (!email) {
    return (
      <Card variant="elevated" className="p-8 text-center">
        <p className="text-body text-neutral-600">
          Ouvrez cette page depuis l&apos;email de vérification, ou{" "}
          <a href="/register" className="text-primary-600 underline-offset-4 hover:underline">
            créez un compte
          </a>
          .
        </p>
      </Card>
    );
  }

  if (success) {
    return (
      <Card variant="elevated" className="p-8 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-success/10 text-2xl text-success">
          ✓
        </div>
        <h1 className="mt-4 font-display text-h3 text-neutral-900">Compte activé !</h1>
        <p className="mt-2 text-body text-neutral-600">
          Bienvenue sur Site.mg — votre compte est prêt.
        </p>
        <Button size="lg" className="mt-6 w-full" onClick={() => (window.location.href = "/")}>
          Aller au tableau de bord
        </Button>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className="p-8">
      <h1 className="font-display text-h2 text-neutral-900">Vérifiez votre email</h1>
      <p className="mt-2 text-body text-neutral-600">
        Un code à 6 chiffres a été envoyé à <strong className="text-neutral-900">{email}</strong>.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <Input
          label="Code de vérification"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="••••••"
          required
          value={codeDigits}
          onChange={(e) => setCode(e.target.value)}
          className="text-center font-display text-h3 tracking-[0.5em]"
          error={error ?? undefined}
        />

        <Button type="submit" size="lg" loading={loading} className="w-full">
          {loading ? "Vérification…" : "Vérifier mon email"}
        </Button>
      </form>

      {resendMessage && (
        <p role="status" className="mt-4 text-small text-success">
          {resendMessage}
        </p>
      )}

      <p className="mt-6 text-center text-small text-neutral-600">
        Pas reçu de code ?{" "}
        <Button
          variant="link"
          size="sm"
          loading={resendLoading}
          disabled={cooldown > 0}
          onClick={handleResend}
        >
          {cooldown > 0 ? `Renvoyer dans ${cooldown}s` : "Renvoyer un code"}
        </Button>
      </p>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<Card variant="elevated" className="h-96 animate-pulse" />}>
      <VerifyContent />
    </Suspense>
  );
}
