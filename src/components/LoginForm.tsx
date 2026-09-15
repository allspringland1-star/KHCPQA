"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Lock } from "lucide-react";
import { getDefaultLoginPath, getSafeLoginNextPath, resolvePostLoginPath } from "@/lib/auth-redirect";
import { getCopy, type Locale } from "@/lib/content";
import { buildAuthCallbackUrl } from "@/lib/site-url";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/client";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isEmailRateLimitError(message: string) {
  const normalized = message.toLowerCase();
  return normalized.includes("email rate limit") || normalized.includes("rate limit") || normalized.includes("too many requests");
}

function getSafeNextPath(locale: Locale) {
  if (typeof window === "undefined") {
    return getDefaultLoginPath(locale);
  }

  return getSafeLoginNextPath(locale, new URLSearchParams(window.location.search).get("next"));
}

async function getPostLoginPath(locale: Locale, supabase: ReturnType<typeof createClient>, userId?: string) {
  const safeNextPath = getSafeNextPath(locale);

  if (safeNextPath.startsWith("/admin")) {
    return safeNextPath;
  }

  if (!userId) {
    return safeNextPath;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", userId)
    .maybeSingle();

  return resolvePostLoginPath(locale, safeNextPath, profile);
}

export function LoginForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const t = getCopy(locale);
  const resetRequestInFlightRef = useRef(false);
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const authState = new URLSearchParams(window.location.search).get("auth");
    if (authState === "config-error") {
      setErrors({ form: t.login.configurationError });
    }
  }, [t.login.configurationError]);

  function validate() {
    const nextErrors: { email?: string; password?: string } = {};

    if (email.trim().length === 0) {
      nextErrors.email = t.login.validation.emailRequired;
    } else if (!isValidEmail(email)) {
      nextErrors.email = t.login.validation.emailInvalid;
    }

    if (password.length === 0) {
      nextErrors.password = t.login.validation.passwordRequired;
    } else if (password.length < 8) {
      nextErrors.password = t.login.validation.passwordLength;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function validateReset() {
    const nextErrors: { email?: string } = {};

    if (email.trim().length === 0) {
      nextErrors.email = t.login.validation.emailRequired;
    } else if (!isValidEmail(email)) {
      nextErrors.email = t.login.validation.emailInvalid;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === "reset") {
      if (resetRequestInFlightRef.current || isSubmitted) {
        return;
      }

      if (!validateReset()) {
        setIsSubmitted(false);
        return;
      }

      if (!hasSupabaseBrowserEnv()) {
        setErrors({ form: t.login.configurationError });
        setIsSubmitted(false);
        return;
      }

      resetRequestInFlightRef.current = true;
      setIsSubmitting(true);
      const supabase = createClient();
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: buildAuthCallbackUrl(locale, "account/security")
        });

        if (error) {
          setErrors({ form: isEmailRateLimitError(error.message) ? t.login.rateLimitError : error.message });
          setIsSubmitted(false);
          return;
        }

        setErrors({});
        setIsSubmitted(true);
        return;
      } catch (error) {
        const message = error instanceof Error ? error.message : t.login.configurationError;
        setErrors({ form: isEmailRateLimitError(message) ? t.login.rateLimitError : message });
        setIsSubmitted(false);
        return;
      } finally {
        resetRequestInFlightRef.current = false;
        setIsSubmitting(false);
      }
    }

    if (!validate()) {
      setIsSubmitted(false);
      return;
    }

    if (!hasSupabaseBrowserEnv()) {
      setErrors({ form: t.login.configurationError });
      setIsSubmitted(false);
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setIsSubmitting(false);
      setErrors({ form: error.message });
      setIsSubmitted(false);
      return;
    }

    setIsSubmitted(true);
    const postLoginPath = await getPostLoginPath(locale, supabase, data.user?.id);
    window.setTimeout(() => {
      router.replace(postLoginPath);
    }, 650);
  }

  function switchMode(nextMode: "login" | "reset") {
    setMode(nextMode);
    setErrors({});
    setIsSubmitted(false);
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit} noValidate>
      <Lock size={28} />
      <label>
        {t.login.email}
        <input
          aria-invalid={Boolean(errors.email)}
          autoComplete="email"
          onChange={(event) => {
            setEmail(event.target.value);
            setErrors((current) => ({ ...current, email: undefined }));
            setIsSubmitted(false);
          }}
          placeholder={t.login.emailPlaceholder}
          type="email"
          value={email}
        />
        {errors.email ? <span className="form-error">{errors.email}</span> : null}
      </label>
      {mode === "login" ? (
        <label>
          {t.login.password}
          <input
            aria-invalid={Boolean(errors.password)}
            autoComplete="current-password"
            onChange={(event) => {
              setPassword(event.target.value);
              setErrors((current) => ({ ...current, password: undefined }));
              setIsSubmitted(false);
            }}
            placeholder={t.login.passwordPlaceholder}
            type="password"
            value={password}
          />
          {errors.password ? <span className="form-error">{errors.password}</span> : null}
        </label>
      ) : null}
      {isSubmitted ? (
        <div className="form-success" role="status">
          <CheckCircle2 size={20} />
          <span>
            <strong>{mode === "login" ? t.login.successTitle : t.login.resetSuccessTitle}</strong>
            {mode === "login" ? t.login.successMessage : t.login.resetSuccessMessage}
          </span>
        </div>
      ) : null}
      {errors.form ? <span className="form-error">{errors.form}</span> : null}
      {isSubmitting ? <LoginActionOverlay mode={mode} /> : null}
      <button className="primary-button" disabled={isSubmitting || (mode === "reset" && isSubmitted)} type="submit">
        {isSubmitting ? "..." : mode === "login" ? t.login.submitCta : t.login.resetCta}
      </button>
      <button className="text-button" type="button" onClick={() => switchMode(mode === "login" ? "reset" : "login")}>
        {mode === "login" ? t.login.forgotPassword : t.login.backToLogin}
      </button>
      {mode === "login" ? (
        <Link className="text-button" href={`/${locale}/signup`}>
          {t.signup.title}
        </Link>
      ) : null}
    </form>
  );
}

function LoginActionOverlay({ mode }: { mode: "login" | "reset" }) {
  const title = mode === "login" ? "로그인 중입니다" : "안내 메일을 보내는 중입니다";
  const description =
    mode === "login"
      ? "계정 정보를 확인하고 이동할 화면을 준비하고 있습니다."
      : "입력하신 이메일로 비밀번호 재설정 안내를 보내고 있습니다.";

  return (
    <div className="admin-action-overlay" role="status" aria-live="assertive" aria-label={title}>
      <div className="admin-action-loader">
        <span className="admin-action-spinner" aria-hidden="true" />
        <strong>{title}</strong>
        <p>{description}</p>
        <span className="admin-action-progress" aria-hidden="true">
          <span />
        </span>
      </div>
    </div>
  );
}
