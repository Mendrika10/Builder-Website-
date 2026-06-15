"use client";

import { useRef, useState, KeyboardEvent, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

/* ─────────────────────────────────────────
   Native confetti — zero dependencies
───────────────────────────────────────── */
function launchConfetti(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const COLORS = [
    "#185FA5",
    "#1D9E75",
    "#EF9F27",
    "#E24B4A",
    "#7F77DD",
    "#D4537E",
    "#5DCAA5",
    "#FAC775",
  ];

  type Particle = {
    x: number;
    y: number;
    vx: number;
    vy: number;
    rot: number;
    rotV: number;
    w: number;
    h: number;
    color: string;
    alpha: number;
    shape: "rect" | "circle";
  };

  const particles: Particle[] = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: -10 - Math.random() * 200,
    vx: (Math.random() - 0.5) * 4,
    vy: 2 + Math.random() * 4,
    rot: Math.random() * Math.PI * 2,
    rotV: (Math.random() - 0.5) * 0.2,
    w: 6 + Math.random() * 10,
    h: 4 + Math.random() * 6,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    alpha: 1,
    shape: Math.random() > 0.5 ? "rect" : "circle",
  }));

  let raf: number;
  const start = performance.now();
  const DURATION = 3000;

  function draw(now: number) {
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;
      p.rot += p.rotV;
      p.alpha = Math.max(0, 1 - elapsed / DURATION);

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;

      if (p.shape === "circle") {
        ctx.beginPath();
        ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      ctx.restore();
    });

    if (elapsed < DURATION) {
      raf = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(raf);
    }
  }

  raf = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(raf);
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
const CODE_LIFETIME = 2 * 60; // seconds
const MAX_ATTEMPTS = 5;

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const email = searchParams.get("email") ?? "";

  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [redirectIn, setRedirectIn] = useState(3);
  const [resendCooldown, setResendCooldown] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [blockedUntil, setBlockedUntil] = useState<Date | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockedSecondsLeft, setBlockedSecondsLeft] = useState<number | null>(
    null,
  );
  const [showUnblockModal, setShowUnblockModal] = useState(false);

  // Countdown for code validity
  const [timeLeft, setTimeLeft] = useState(CODE_LIFETIME);
  const [codeExpired, setCodeExpired] = useState(false);

  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Code validity countdown ── */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setCodeExpired(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current!);
    setTimeLeft(CODE_LIFETIME);
    setCodeExpired(false);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setCodeExpired(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  /* ── Success: confetti + redirect countdown ── */
  useEffect(() => {
    if (!showSuccess) return;

    if (canvasRef.current) {
      launchConfetti(canvasRef.current);
    }

    let count = 3;
    const iv = setInterval(() => {
      count -= 1;
      setRedirectIn(count);
      if (count <= 0) {
        clearInterval(iv);
        router.refresh();
        setTimeout(() => {
          router.push("/login");
        }, 100);
      }
    }, 1000);

    return () => clearInterval(iv);
  }, [showSuccess, router]);

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
        setShowUnblockModal(true);
      }
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isBlocked, blockedUntil]);

  /* ── Fetch status helper ── */
  const fetchStatus = useCallback(
    async (showLoading = true) => {
      if (!userId) return;
      if (showLoading) setLoadingStatus(true);
      try {
        const res = await fetch(
          `/api/auth/verify/status?userId=${encodeURIComponent(userId)}`,
        );
        if (!res.ok) {
          if (showLoading) setLoadingStatus(false);
          return;
        }
        const data = await res.json();
        if (data.isValidated) {
          setShowSuccess(true);
          return;
        }
        if (data.codeBlocked) {
          setIsBlocked(true);
          setBlockedUntil(
            data.blockedUntil ? new Date(data.blockedUntil) : null,
          );
          setBlockedSecondsLeft(
            typeof data.secondsLeftBlocked === "number"
              ? data.secondsLeftBlocked
              : null,
          );
        } else {
          if (typeof data.attemptsLeft === "number")
            setAttemptsLeft(data.attemptsLeft);
          if (typeof data.secondsLeftExpires === "number") {
            setTimeLeft(data.secondsLeftExpires);
            setCodeExpired(data.secondsLeftExpires <= 0);
          }
        }
        if (showLoading) setLoadingStatus(false);
      } catch (err) {
        console.error("[VERIFY STATUS CLIENT]", err);
        if (showLoading) setLoadingStatus(false);
      }
    },
    [userId],
  );

  /* ── Restore status on load ── */
  useEffect(() => {
    if (!userId) return;

    let mounted = true;
    fetchStatus(true);

    return () => {
      mounted = false;
    };
  }, [userId, fetchStatus]);

  /* ── OTP helpers ── */
  const handleChange = (val: string, idx: number) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = digit;
    setDigits(next);
    if (digit && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const next = Array(6).fill("");
    pasted.split("").forEach((c, i) => (next[i] = c));
    setDigits(next);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const code = digits.join("");
  const isComplete = code.length === 6;

  /* ── Submit ── */
  const handleSubmit = async () => {
    setError("");
    if (!userId) {
      setError("Identifiant utilisateur manquant. Retournez à l'inscription.");
      return;
    }
    if (!isComplete) {
      setError("Veuillez saisir les 6 chiffres du code.");
      return;
    }
    if (codeExpired) {
      setError("Le code a expiré. Veuillez en demander un nouveau.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message ?? "Code invalide ou expiré.");
        if (data.attemptsLeft !== undefined) {
          setAttemptsLeft(data.attemptsLeft);
        }
        if (data.blockedUntil) {
          setIsBlocked(true);
          setBlockedUntil(new Date(data.blockedUntil));
        }
        setLoading(false);
        fetchStatus(false);
        return;
      }
      setLoading(false);
      localStorage.removeItem("register_form_data");
      setShowSuccess(true);
    } catch (err) {
      console.error("[VERIFY CLIENT]", err);
      setError("Impossible de contacter le serveur. Réessayez.");
      setLoading(false);
    }
  };

  /* ── Resend ── */
  const handleResend = async () => {
    if (!userId || resendCooldown || isBlocked) return;
    setError("");
    setResendLoading(true);
    setResendCooldown(true);
    setDigits(Array(6).fill(""));
    inputs.current[0]?.focus();

    try {
      const res = await fetch("/api/auth/resend-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message ?? "Impossible de renvoyer le code.");
        if (data.blockedUntil) {
          setIsBlocked(true);
          setBlockedUntil(new Date(data.blockedUntil));
        }
        fetchStatus(false);
      } else {
        resetTimer();
        setAttemptsLeft(MAX_ATTEMPTS);
        setIsBlocked(false);
        setBlockedUntil(null);
        fetchStatus(false);
      }
    } catch {
      setError("Impossible de renvoyer le code. Réessayez.");
    } finally {
      setResendLoading(false);
      setTimeout(() => setResendCooldown(false), 60_000);
    }
  };

  /* ── Timer badge color ── */
  const isLow = timeLeft <= 60 && !codeExpired;

  const s = {
    iconWrap: {
      width: 48,
      height: 48,
      borderRadius: "50%",
      background: "#E6F1FB",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "1rem",
    } as React.CSSProperties,

    emailPill: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      background: "#E6F1FB",
      color: "#0d6efd",
      fontSize: "0.75rem",
      fontWeight: 500,
      padding: "2px 10px",
      borderRadius: 99,
      marginLeft: 4,
    } as React.CSSProperties,

    label: {
      fontSize: "0.7rem",
      textTransform: "uppercase" as const,
      letterSpacing: "0.06em",
      fontWeight: 600,
      color: "var(--text-muted)",
      display: "block",
      marginBottom: 8,
    } as React.CSSProperties,

    otpBox: (filled: boolean, hasError: boolean): React.CSSProperties => ({
      flex: 1,
      height: 50,
      textAlign: "center",
      fontSize: "1.35rem",
      fontWeight: 600,
      border: hasError
        ? "1.5px solid #E24B4A"
        : filled
          ? "1.5px solid #185FA5"
          : "1.5px solid #E2E8F0",
      borderRadius: 10,
      background: hasError ? "#FCEBEB" : filled ? "#E6F1FB" : "transparent",
      color: hasError ? "#A32D2D" : filled ? "#185FA5" : "var(--text-dark)",
      outline: "none",
      transition: "border-color .15s, background .15s",
      cursor: codeExpired ? "not-allowed" : "text",
      maxWidth: 60,
      opacity: codeExpired ? 0.5 : 1,
    }),

    timerBadge: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      background: codeExpired
        ? "#FCEBEB"
        : isBlocked
          ? "#FEF3C7"
          : isLow
            ? "#FAEEDA"
            : "#EAF3DE",
      color: codeExpired
        ? "#d62222"
        : isBlocked
          ? "#92400E"
          : isLow
            ? "#854F0B"
            : "#27500A",
      fontSize: "0.78rem",
      fontWeight: 600,
      padding: "4px 10px",
      borderRadius: 99,
      transition: "background .4s, color .4s",
    } as React.CSSProperties,

    resendBtn: {
      background: "none",
      border: "none",
      padding: 0,
      color: resendCooldown ? "var(--text-muted)" : "var(--primary)",
      fontSize: "0.8rem",
      fontWeight: 600,
      cursor: resendCooldown ? "not-allowed" : "pointer",
      display: "flex",
      alignItems: "center",
      gap: 4,
    } as React.CSSProperties,

    submitBtn: {
      width: "100%",
      height: 46,
      background: isComplete && !codeExpired ? "var(--primary)" : "#94A3B8",
      color: "#fff",
      border: "none",
      borderRadius: 10,
      fontWeight: 700,
      fontSize: "0.95rem",
      cursor: loading || !isComplete || codeExpired ? "not-allowed" : "pointer",
      opacity: loading ? 0.75 : 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      transition: "background .2s",
      marginBottom: 8,
    } as React.CSSProperties,

    backBtn: {
      width: "100%",
      height: 38,
      background: "transparent",
      border: "1.5px solid #E2E8F0",
      borderRadius: 10,
      color: "var(--text-muted)",
      fontSize: "0.85rem",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    } as React.CSSProperties,
  };

  /* ── Success overlay ── */
  if (showSuccess) {
    return (
      <>
        <canvas
          ref={canvasRef}
          style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        />

        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#E1F5EE",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
              animation: "popIn .4s cubic-bezier(.36,1.56,.64,1) both",
            }}
          >
            <i
              className="bi bi-check-lg"
              style={{ fontSize: "2rem", color: "#0F6E56" }}
            />
          </div>

          <h1
            style={{
              fontWeight: 800,
              fontSize: "1.65rem",
              color: "var(--text-dark)",
              marginBottom: "0.4rem",
            }}
          >
            Email vérifié !
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.875rem",
              lineHeight: 1.6,
              marginBottom: "1.5rem",
            }}
          >
            Votre compte est maintenant actif.
            <br />
            Redirection dans…
          </p>

          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              border: "3px solid #1D9E75",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <span
              key={redirectIn}
              style={{
                fontSize: "1.6rem",
                fontWeight: 800,
                color: "#0F6E56",
                animation: "countPop .3s cubic-bezier(.36,1.56,.64,1) both",
                display: "inline-block",
              }}
            >
              {redirectIn}
            </span>
          </div>

          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            Redirection vers la page de connexion…
          </p>
        </div>

        <style>{`
          @keyframes popIn {
            0%  { transform: scale(0); opacity: 0; }
            100%{ transform: scale(1); opacity: 1; }
          }
          @keyframes countPop {
            0%  { transform: scale(1.6); opacity: 0; }
            100%{ transform: scale(1);   opacity: 1; }
          }
        `}</style>
      </>
    );
  }

  /* ── Normal form ── */
  return (
    <>
      {loadingStatus && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            gap: 16,
          }}
        >
          <div className="spinner-border" style={{ color: "var(--primary)" }} />
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Chargement de votre vérification...
          </p>
        </div>
      )}

      {!loadingStatus && (
        <>
          {/* <div style={s.iconWrap}>
        <i
          className="bi bi-envelope-check"
          style={{ fontSize: "1.35rem", color: "#185FA5" }}
        />
      </div> */}

          <h1
            style={{
              fontWeight: 800,
              fontSize: "1.65rem",
              color: "var(--text-dark)",
              marginBottom: "0.3rem",
            }}
          >
            Vérification email
          </h1>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.875rem",
              marginBottom: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            Entrez le code à 6 chiffres envoyé à
            {email ? (
              <span style={s.emailPill}>
                <i className="bi bi-envelope" style={{ fontSize: "0.7rem" }} />
                {email}
              </span>
            ) : (
              " votre adresse email."
            )}
          </p>

          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#FCEBEB",
                border: "1px solid #F09595",
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: "0.82rem",
                color: "#791F1F",
                marginBottom: "1rem",
              }}
            >
              <i
                className="bi bi-exclamation-triangle-fill"
                style={{ flexShrink: 0 }}
              />
              {error}
            </div>
          )}

          {codeExpired && !error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#FAEEDA",
                border: "1px solid #EF9F27",
                borderRadius: 10,
                padding: "10px 12px",
                fontSize: "0.82rem",
                color: "#633806",
                marginBottom: "1rem",
              }}
            >
              <i className="bi bi-clock-history" style={{ flexShrink: 0 }} />
              Code expiré — demandez-en un nouveau ci-dessous.
            </div>
          )}

          <label style={s.label}>Code de vérification</label>

          <div style={{ display: "flex", gap: "18px", marginBottom: 10 }}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                autoFocus={i === 0}
                style={s.otpBox(!!d, !!error)}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={i === 0 ? handlePaste : undefined}
                onFocus={(e) => e.target.select()}
                aria-label={`Chiffre ${i + 1}`}
                disabled={codeExpired || isBlocked}
              />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "0 0 0.85rem",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <span style={s.timerBadge}>
              <i
                className={`bi ${isBlocked ? "bi-lock-fill" : codeExpired ? "bi-x-circle" : "bi-clock"}`}
              />
              {isBlocked && blockedSecondsLeft !== null
                ? `Réessayez après ${formatTime(blockedSecondsLeft)}`
                : codeExpired
                  ? "Code expiré"
                  : `Expire dans ${formatTime(timeLeft)}`}
            </span>
            <button
              style={s.resendBtn}
              onClick={handleResend}
              disabled={resendLoading || resendCooldown || !userId || isBlocked}
            >
              {resendLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm" />{" "}
                  Renvoyer...
                </>
              ) : (
                <>
                  <i className="bi bi-arrow-clockwise" />
                  {isBlocked
                    ? "Bloqué"
                    : resendCooldown
                      ? "Renvoyé ✓"
                      : "Renvoyer"}
                </>
              )}
            </button>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 18,
              gap: 12,
              flexWrap: "wrap",
              color: "#475569",
              fontSize: "0.82rem",
            }}
          >
            <span>
              Tentatives restantes : <strong>{attemptsLeft}</strong>
            </span>
            {isBlocked && blockedUntil && (
              <span style={{ color: "#B45309" }}>
                Bloqué jusqu&apos;à{" "}
                {blockedUntil.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </div>

          <button
            style={s.submitBtn}
            onClick={handleSubmit}
            disabled={
              loading || !isComplete || !userId || codeExpired || isBlocked
            }
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" />{" "}
                Vérification...
              </>
            ) : (
              <>
                <i className="bi bi-shield-check" /> Valider le code
              </>
            )}
          </button>

          {showUnblockModal && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
              }}
              onClick={() => setShowUnblockModal(false)}
            >
              <div
                style={{
                  background: "white",
                  borderRadius: 12,
                  padding: "24px 20px",
                  maxWidth: 380,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                  animation: "slideUp .3s ease-out",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    background: "#E1F5EE",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <i
                    className="bi bi-unlock-fill"
                    style={{ fontSize: "1.5rem", color: "#0F6E56" }}
                  />
                </div>

                <h2
                  style={{
                    textAlign: "center",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "var(--text-dark)",
                    marginBottom: 8,
                  }}
                >
                  Déverrouillé !
                </h2>

                <p
                  style={{
                    textAlign: "center",
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    marginBottom: 20,
                    lineHeight: 1.5,
                  }}
                >
                  Votre compte de vérification a été déverrouillé. Vous pouvez
                  maintenant essayer à nouveau ou demander un nouveau code.
                </p>

                <button
                  onClick={() => {
                    setShowUnblockModal(false);
                    handleResend();
                  }}
                  style={{
                    width: "100%",
                    height: 40,
                    background: "#185FA5",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "background .2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.background =
                      "#1448A0";
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.background =
                      "#185FA5";
                  }}
                >
                  Renvoyer un code
                </button>
              </div>
            </div>
          )}

          <Link href="/register" style={{ textDecoration: "none" }}>
            <button style={s.backBtn}>
              <i className="bi bi-arrow-left" />
              Retour à l&apos;inscription
            </button>
          </Link>
        </>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
