"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { formatInquiryReceipt } from "@/lib/receipts";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const locales = ["ko", "en", "es", "zh-CN"] as const;
const inquiryTypes = ["general", "course", "certification", "partnership"] as const;

type Locale = (typeof locales)[number];
type InquiryType = (typeof inquiryTypes)[number];

export type PartnerInquiryInput = {
  country: string;
  email: string;
  locale: string;
  message: string;
  name: string;
  organization: string;
};

export type PartnerInquiryResult = {
  ok: boolean;
  message: string;
  receipt: string;
};

function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeInquiryType(value: string): InquiryType {
  return inquiryTypes.includes(value as InquiryType) ? (value as InquiryType) : "partnership";
}

export async function submitPartnerInquiry(input: PartnerInquiryInput): Promise<PartnerInquiryResult> {
  const trimmed = {
    country: input.country.trim(),
    email: input.email.trim(),
    locale: input.locale.trim(),
    message: input.message.trim(),
    name: input.name.trim(),
    organization: input.organization.trim()
  };

  if (
    !trimmed.name ||
    !trimmed.organization ||
    !trimmed.email ||
    !trimmed.country ||
    !trimmed.message ||
    !isValidEmail(trimmed.email)
  ) {
    return {
      ok: false,
      message: trimmed.locale === "zh-CN" ? "请检查咨询的必填项。" : "문의 필수 항목을 확인해 주세요.",
      receipt: ""
    };
  }

  const receiptId = randomUUID();
  const receipt = formatInquiryReceipt(receiptId);

  if (!hasSupabaseBrowserEnv()) {
    return {
      ok: false,
      message: trimmed.locale === "zh-CN" ? "咨询服务尚未连接，请联系管理员。" : "문의 저장 환경변수가 설정되지 않았습니다.",
      receipt: ""
    };
  }

  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("inquiries").insert({
    country: trimmed.country,
    email: trimmed.email,
    id: receiptId,
    inquiry_type: normalizeInquiryType("partnership"),
    locale: isLocale(trimmed.locale) ? trimmed.locale : "ko",
    message: trimmed.message,
    name: trimmed.name,
    organization: trimmed.organization,
    status: "new",
    user_id: user?.id ?? null
  });

  if (error) {
    return {
      ok: false,
      message: error.message,
      receipt: ""
    };
  }

  revalidatePath("/admin");
  if (user) {
    revalidatePath(`/${isLocale(trimmed.locale) ? trimmed.locale : "ko"}/account/inquiries`);
  }

  return {
    ok: true,
    message: trimmed.locale === "zh-CN" ? "咨询已受理。" : "문의가 접수되었습니다.",
    receipt
  };
}
