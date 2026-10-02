"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { PublishedBanner } from "@/lib/public-content";
import type { Locale } from "@/i18n/config";

const dismissalPrefix = "khcpqa.homePopup.dismissedUntil";

function getPopupStorageKey(banner: PublishedBanner) {
  return [
    dismissalPrefix,
    banner.id || banner.title,
    banner.startsAt || "always",
    banner.imageUrl || "no-image"
  ].join(":");
}

function getTomorrowStart() {
  const nextDate = new Date();
  nextDate.setHours(24, 0, 0, 0);
  return nextDate.getTime();
}

function isDismissed(storageKey: string) {
  try {
    const dismissedUntil = Number(window.localStorage.getItem(storageKey));
    return Number.isFinite(dismissedUntil) && dismissedUntil > Date.now();
  } catch {
    return false;
  }
}

function dismissForToday(storageKey: string) {
  try {
    window.localStorage.setItem(storageKey, String(getTomorrowStart()));
  } catch {
    // The popup should still close if storage is blocked by browser settings.
  }
}

export function HomePopup({ banner, locale = "ko" }: { banner?: PublishedBanner; locale?: Locale }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!banner?.imageUrl) {
      return;
    }

    setIsVisible(!isDismissed(getPopupStorageKey(banner)));
  }, [banner]);

  if (!banner?.imageUrl || !isVisible) {
    return null;
  }

  const storageKey = getPopupStorageKey(banner);

  function closePopup() {
    setIsVisible(false);
  }

  function closeForToday() {
    dismissForToday(storageKey);
    setIsVisible(false);
  }

  const popupImage = (
    <img
      alt={banner.title}
      className="home-popup-image"
      src={banner.imageUrl}
    />
  );

  return (
    <div className="home-popup-backdrop" role="presentation">
      <aside aria-label={banner.title} className="home-popup" role="dialog">
        <button aria-label={locale === "zh-CN" ? "关闭弹窗" : "팝업 닫기"} className="home-popup-close" onClick={closePopup} type="button">
          <X size={18} />
        </button>
        {banner.targetUrl ? (
          <a className="home-popup-link" href={banner.targetUrl}>
            {popupImage}
          </a>
        ) : (
          popupImage
        )}
        <div className="home-popup-actions">
          <button className="home-popup-dismiss-today" onClick={closeForToday} type="button">
            {locale === "zh-CN" ? "今天不再显示" : "오늘 하루 보지 않기"}
          </button>
          <button className="home-popup-dismiss-now" onClick={closePopup} type="button">
            {locale === "zh-CN" ? "关闭" : "닫기"}
          </button>
        </div>
      </aside>
    </div>
  );
}
