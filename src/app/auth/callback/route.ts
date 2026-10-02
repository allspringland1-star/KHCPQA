import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { hasSupabaseBrowserEnv } from "@/lib/supabase/env";

function getSafeRedirectPath(value: string | null) {
  if (!value) {
    return "/ko/account";
  }

  const isInternal = value.startsWith("/") && !value.startsWith("//") && !value.includes("://");
  const isAllowedPath = /^\/(?:ko|en|es|zh-CN)\/account(?:\/|$)/.test(value) || /^\/admin(?:\/|$)/.test(value);

  return isInternal && isAllowedPath ? value : "/ko/account";
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getSafeRedirectPath(requestUrl.searchParams.get("next"));
  let response = NextResponse.redirect(new URL(next, requestUrl.origin));

  if (!hasSupabaseBrowserEnv()) {
    return NextResponse.redirect(new URL("/ko/login?auth=config-error", requestUrl.origin));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/ko/login?auth=missing-code", requestUrl.origin));
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, options, value }) => {
            response.cookies.set(name, value, options);
          });
        }
      }
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/ko/login?auth=failed", requestUrl.origin));
  }

  return response;
}
