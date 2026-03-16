"use client";

import Link from "next/link";

import { CtaLink } from "@/components/ui/cta-link";
import { useLanguage } from "@/components/providers/language-provider";
import type { Locale } from "@/lib/locale";

const navItems = [
  { href: "#about", label: { en: "Positioning", vi: "Định Vị" } },
  { href: "#highlights", label: { en: "Video Work", vi: "Dự Án Video" } },
  { href: "#services", label: { en: "Services", vi: "Dịch Vụ" } },
  { href: "#why-work", label: { en: "Why Me", vi: "Lý Do Chọn Tôi" } },
  { href: "#final-cta", label: { en: "Contact", vi: "Liên Hệ" } }
];

function getHeaderCopy(locale: Locale) {
  return locale === "vi"
    ? {
        primaryNavLabel: "Điều hướng chính",
        socialLabel: "Dịch Vụ MXH (Phụ Trợ)",
        portfolioLabel: "Xem Portfolio Video",
        languageLabel: "Chuyển đổi ngôn ngữ"
      }
    : {
        primaryNavLabel: "Primary navigation",
        socialLabel: "Social Support",
        portfolioLabel: "Video Portfolio",
        languageLabel: "Change language"
      };
}

export function SiteHeader() {
  const { locale, setLocale } = useLanguage();
  const copy = getHeaderCopy(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#060a12]/75 backdrop-blur-xl">
      <div className="shell flex h-[74px] items-center justify-between gap-5">
        <Link href="/" className="focus-outline inline-flex items-center gap-2 rounded-full px-2 py-1">
          <span className="h-2.5 w-2.5 rounded-full bg-gold" aria-hidden />
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/95">Lam Quoc Cuong</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-mist xl:flex" aria-label={copy.primaryNavLabel}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="focus-outline link-underline rounded-sm py-1 hover:text-ink">
              {item.label[locale]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div
            className="flex items-center rounded-full border border-white/15 bg-white/[0.03] p-1"
            role="group"
            aria-label={copy.languageLabel}
          >
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`focus-outline rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
                locale === "en" ? "bg-white/15 text-ink" : "text-mist hover:text-ink"
              }`}
              aria-pressed={locale === "en"}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLocale("vi")}
              className={`focus-outline rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] transition ${
                locale === "vi" ? "bg-white/15 text-ink" : "text-mist hover:text-ink"
              }`}
              aria-pressed={locale === "vi"}
            >
              VI
            </button>
          </div>

          <CtaLink href="https://mxh.lamquoccuong.com" variant="secondary" className="hidden px-4 py-2 text-xs lg:inline-flex">
            {copy.socialLabel}
          </CtaLink>

          <CtaLink href="https://edit.lamquoccuong.com" variant="primary" className="px-4 py-2 text-xs sm:text-sm">
            {copy.portfolioLabel}
          </CtaLink>
        </div>
      </div>
    </header>
  );
}
