"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";
import { CheckCircle2, KeyRound } from "lucide-react";
import { getCopy, type Locale } from "@/lib/content";
import { createClient } from "@/lib/supabase/client";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";

type FormState = {
  confirmPassword: string;
  password: string;
};

const labels = {
  "zh-CN": { title: "设置新密码", lead: "请输入邮箱验证后使用的新密码。", password: "新密码", confirmPassword: "确认新密码", submit: "保存密码", successTitle: "密码已更新", successMessage: "现在可使用新密码登录。", accountCta: "前往我的账户" },
  ko: {
    title: "새 비밀번호 설정",
    lead: "이메일 인증 후 사용할 새 비밀번호를 입력해 주세요.",
    password: "새 비밀번호",
    confirmPassword: "새 비밀번호 확인",
    submit: "비밀번호 저장",
    successTitle: "비밀번호가 변경되었습니다.",
    successMessage: "이제 새 비밀번호로 로그인할 수 있습니다.",
    accountCta: "My Page로 이동"
  },
  en: {
    title: "Set New Password",
    lead: "Enter the new password you want to use after email verification.",
    password: "New Password",
    confirmPassword: "Confirm New Password",
    submit: "Save Password",
    successTitle: "Password updated.",
    successMessage: "You can now log in with your new password.",
    accountCta: "Go to My Page"
  },
  es: {
    title: "Configurar Nueva Contraseña",
    lead: "Ingrese la nueva contraseña que usará después de verificar el email.",
    password: "Nueva contraseña",
    confirmPassword: "Confirmar nueva contraseña",
    submit: "Guardar contraseña",
    successTitle: "Contraseña actualizada.",
    successMessage: "Ahora puede iniciar sesión con su nueva contraseña.",
    accountCta: "Ir a My Page"
  }
} as const;

export function PasswordUpdateForm({ locale }: { locale: Locale }) {
  const t = getCopy(locale);
  const copy = labels[locale as keyof typeof labels] ?? labels.en;
  const [form, setForm] = useState<FormState>({ confirmPassword: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | "form", string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setIsSubmitted(false);
  }

  function validate() {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.password) {
      nextErrors.password = t.login.validation.passwordRequired;
    } else if (form.password.length < 8) {
      nextErrors.password = t.login.validation.passwordLength;
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword = t.signup.validation.required;
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = t.signup.validation.passwordMatch;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    if (!hasSupabaseBrowserEnv()) {
      setErrors({ form: t.login.configurationError });
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: form.password });
    setIsSubmitting(false);

    if (error) {
      setErrors({ form: error.message });
      return;
    }

    setForm({ confirmPassword: "", password: "" });
    setIsSubmitted(true);
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit} noValidate>
      <KeyRound size={28} />
      <div>
        <h2>{copy.title}</h2>
        <p>{copy.lead}</p>
      </div>
      <label>
        {copy.password}
        <input
          aria-invalid={Boolean(errors.password)}
          autoComplete="new-password"
          onChange={(event) => updateField("password", event.target.value)}
          placeholder={t.signup.passwordPlaceholder}
          type="password"
          value={form.password}
        />
        {errors.password ? <span className="form-error">{errors.password}</span> : null}
      </label>
      <label>
        {copy.confirmPassword}
        <input
          aria-invalid={Boolean(errors.confirmPassword)}
          autoComplete="new-password"
          onChange={(event) => updateField("confirmPassword", event.target.value)}
          placeholder={t.signup.confirmPasswordPlaceholder}
          type="password"
          value={form.confirmPassword}
        />
        {errors.confirmPassword ? <span className="form-error">{errors.confirmPassword}</span> : null}
      </label>
      {isSubmitted ? (
        <div className="form-success" role="status">
          <CheckCircle2 size={20} />
          <span>
            <strong>{copy.successTitle}</strong>
            {copy.successMessage}
          </span>
        </div>
      ) : null}
      {errors.form ? <span className="form-error">{errors.form}</span> : null}
      <button className="primary-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? "..." : copy.submit}
      </button>
      <Link className="text-button" href={`/${locale}/account`}>
        {copy.accountCta}
      </Link>
    </form>
  );
}
