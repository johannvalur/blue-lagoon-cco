"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSignIn: () => void;
}

export function LoginModal({ open, onClose, onSignIn }: LoginModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => setPortalReady(true), []);

  // Reset form a beat after close so the exit transition isn't disrupted.
  useEffect(() => {
    if (open) return;
    const t = window.setTimeout(() => {
      setEmail("");
      setPassword("");
      setShowPassword(false);
      setError(null);
      setSubmitting(false);
    }, 220);
    return () => window.clearTimeout(t);
  }, [open]);

  // Focus + body scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevActive = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const focusId = window.setTimeout(() => emailRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(focusId);
      prevActive?.focus?.();
    };
  }, [open]);

  // Escape to close + Tab focus trap.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        if (!submitting) onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const all = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const usable = Array.from(all).filter(
          (el) => !el.hasAttribute("disabled"),
        );
        if (usable.length === 0) return;
        const first = usable[0];
        const last = usable[usable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, submitting]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    if (!email.trim() || !password) {
      setError("Please enter your email or Saga number and password.");
      return;
    }
    setError(null);
    setSubmitting(true);
    window.setTimeout(() => {
      onSignIn();
      onClose();
    }, 600);
  }

  function safeClose() {
    if (!submitting) onClose();
  }

  if (!portalReady) return null;

  return createPortal(
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close sign in"
        onClick={safeClose}
        className={`absolute inset-0 bg-bluelagoon-midnight/40 backdrop-blur-[2px] transition-opacity duration-200 ease-out motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={open ? titleId : undefined}
        className={`relative w-full max-w-[26rem] overflow-hidden rounded-xl border border-bluelagoon-line bg-bluelagoon-paper shadow-[0_30px_80px_-30px_rgba(0,19,77,0.45)] transition-all duration-200 ease-out motion-reduce:transition-none ${
          open
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-2 scale-[0.98] opacity-0"
        }`}
      >
        <div aria-hidden className="flex h-1.5">
          <span className="flex-1 bg-bluelagoon-fiery" />
          <span className="flex-1 bg-bluelagoon-crisp" />
          <span className="flex-1 bg-bluelagoon-aurora" />
          <span className="flex-1 bg-bluelagoon-golden" />
        </div>

        <div className="relative px-7 pb-1 pt-6">
          <button
            type="button"
            onClick={safeClose}
            aria-label="Close"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-bluelagoon-muted transition hover:bg-bluelagoon-mist hover:text-bluelagoon-midnight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bluelagoon-midnight/20"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden
            >
              <path d="M2 2 L12 12 M12 2 L2 12" />
            </svg>
          </button>

          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-bluelagoon-muted">
            Saga Club
          </p>
          <h2
            id={titleId}
            className="mt-1.5 font-loft text-[26px] font-extrabold leading-[1.05] tracking-tight text-bluelagoon-midnight"
          >
            Welcome back.
          </h2>
          <p className="mt-2 max-w-[34ch] text-[13.5px] leading-relaxed text-bluelagoon-ink/70">
            Sign in to manage trips, redeem points and unlock companion
            upgrades.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-4 px-7 pb-5 pt-6"
        >
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="block text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted"
            >
              Email or Saga number
            </label>
            <input
              id="login-email"
              ref={emailRef}
              type="text"
              autoComplete="username"
              value={email}
              disabled={submitting}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="you@bluelagoon.is"
              className="w-full rounded-lg border border-bluelagoon-line bg-bluelagoon-paper px-3.5 py-2.5 text-sm text-bluelagoon-ink placeholder:text-bluelagoon-muted/70 transition focus:border-bluelagoon-midnight focus:outline-none focus:ring-2 focus:ring-bluelagoon-midnight/15 disabled:opacity-60"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <label
                htmlFor="login-password"
                className="block text-[11px] font-semibold uppercase tracking-widest text-bluelagoon-muted"
              >
                Password
              </label>
              <a
                href="#"
                className="text-xs font-semibold text-bluelagoon-midnight/80 transition hover:text-bluelagoon-midnight"
              >
                Forgot?
              </a>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                disabled={submitting}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="••••••••"
                className="w-full rounded-lg border border-bluelagoon-line bg-bluelagoon-paper py-2.5 pl-3.5 pr-10 text-sm text-bluelagoon-ink placeholder:text-bluelagoon-muted/70 transition focus:border-bluelagoon-midnight focus:outline-none focus:ring-2 focus:ring-bluelagoon-midnight/15 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                disabled={submitting}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-bluelagoon-muted transition hover:text-bluelagoon-midnight focus-visible:text-bluelagoon-midnight focus-visible:outline-none disabled:opacity-60"
              >
                {showPassword ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <path d="M14.12 14.12A3 3 0 1 1 9.88 9.88" />
                    <path d="m1 1 22 22" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error ? (
            <p role="alert" className="text-xs text-rose-600">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary inline-flex w-full items-center justify-center gap-2 py-2.5 text-sm font-semibold"
          >
            {submitting ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeOpacity="0.25"
                    strokeWidth="3"
                  />
                  <path
                    d="M22 12a10 10 0 0 1-10 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="px-7 pb-5">
          <div
            aria-hidden
            className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-bluelagoon-muted"
          >
            <span className="h-px flex-1 bg-bluelagoon-line" />
            <span>or continue with</span>
            <span className="h-px flex-1 bg-bluelagoon-line" />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <button
              type="button"
              disabled={submitting}
              aria-label="Continue with Apple"
              onClick={() => {
                if (submitting) return;
                setSubmitting(true);
                window.setTimeout(() => {
                  onSignIn();
                  onClose();
                }, 600);
              }}
              className="group inline-flex items-center justify-center rounded-lg border border-bluelagoon-line bg-bluelagoon-paper py-2.5 text-bluelagoon-ink transition hover:border-bluelagoon-midnight hover:bg-bluelagoon-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bluelagoon-midnight/20 disabled:opacity-50"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            </button>

            <button
              type="button"
              disabled={submitting}
              aria-label="Continue with Google"
              onClick={() => {
                if (submitting) return;
                setSubmitting(true);
                window.setTimeout(() => {
                  onSignIn();
                  onClose();
                }, 600);
              }}
              className="group inline-flex items-center justify-center rounded-lg border border-bluelagoon-line bg-bluelagoon-paper py-2.5 transition hover:border-bluelagoon-midnight hover:bg-bluelagoon-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bluelagoon-midnight/20 disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                <path
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                  fill="#4285F4"
                />
                <path
                  d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                  fill="#34A853"
                />
                <path
                  d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                  fill="#FBBC05"
                />
                <path
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                  fill="#EA4335"
                />
              </svg>
            </button>

            <button
              type="button"
              disabled={submitting}
              aria-label="Continue with Microsoft"
              onClick={() => {
                if (submitting) return;
                setSubmitting(true);
                window.setTimeout(() => {
                  onSignIn();
                  onClose();
                }, 600);
              }}
              className="group inline-flex items-center justify-center rounded-lg border border-bluelagoon-line bg-bluelagoon-paper py-2.5 transition hover:border-bluelagoon-midnight hover:bg-bluelagoon-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bluelagoon-midnight/20 disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                <path d="M0 0h8.5v8.5H0z" fill="#F25022" />
                <path d="M9.5 0H18v8.5H9.5z" fill="#7FBA00" />
                <path d="M0 9.5h8.5V18H0z" fill="#00A4EF" />
                <path d="M9.5 9.5H18V18H9.5z" fill="#FFB900" />
              </svg>
            </button>
          </div>
        </div>

        <div className="border-t border-bluelagoon-line bg-bluelagoon-cloud/70 px-7 py-3.5 text-center text-[13px] text-bluelagoon-ink/80">
          Not a member yet?{" "}
          <a
            href="#"
            className="font-semibold text-bluelagoon-midnight transition hover:underline"
          >
            Join Saga Club →
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
}
