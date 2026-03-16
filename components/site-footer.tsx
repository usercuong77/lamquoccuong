"use client";

import Link from "next/link";

import { useLanguage } from "@/components/providers/language-provider";
import type { Locale } from "@/lib/locale";

const socialLinks = [
  { href: "https://www.linkedin.com/in/lamquoccuong", label: "LinkedIn" },
  { href: "https://www.instagram.com/lamquoccuong", label: "Instagram" },
  { href: "https://www.behance.net/lamquoccuong", label: "Behance" }
];

function getFooterCopy(locale: Locale) {
  return locale === "vi"
    ? {
        description:
          "Premium video editing và visual brand building cho cá nhân, thương hiệu và doanh nghiệp muốn nâng tầm hình ảnh truyền thông.",
        navigationLabel: "Điều Hướng",
        socialLabel: "Mạng Xã Hội",
        copyright: "Bảo lưu mọi quyền.",
        quickLinks: [
          { href: "#highlights", label: "Dự Án Video" },
          { href: "#services", label: "Dịch Vụ" },
          { href: "#why-work", label: "Lý Do Chọn Tôi" },
          { href: "#final-cta", label: "Liên Hệ" }
        ]
      }
    : {
        description:
          "Premium video editing and visual brand building for founders, personal brands, and businesses that want stronger market perception.",
        navigationLabel: "Navigation",
        socialLabel: "Social",
        copyright: "All rights reserved.",
        quickLinks: [
          { href: "#highlights", label: "Video Work" },
          { href: "#services", label: "Services" },
          { href: "#why-work", label: "Why Work With Me" },
          { href: "#final-cta", label: "Contact" }
        ]
      };
}

export function SiteFooter() {
  const { locale } = useLanguage();
  const copy = getFooterCopy(locale);

  return (
    <footer className="border-t border-white/10 py-8">
      <div className="shell flex flex-col gap-8 text-sm text-mist md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="font-semibold uppercase tracking-[0.2em] text-ink/95">Lam Quoc Cuong</p>
          <p className="max-w-md text-sm leading-relaxed">{copy.description}</p>
          <Link href="mailto:lamquoccuong.f@gmail.com" className="focus-outline link-underline inline-block rounded-sm text-ink">
            lamquoccuong.f@gmail.com
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-mist/85">{copy.navigationLabel}</p>
            {copy.quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="focus-outline link-underline block w-fit rounded-sm text-ink/90">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-mist/85">{copy.socialLabel}</p>
            {socialLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="focus-outline link-underline block w-fit rounded-sm text-ink/90"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="shell mt-8 border-t border-white/8 pt-5 text-xs text-mist/80">
        <p>
          © {new Date().getFullYear()} Lam Quoc Cuong. {copy.copyright}
        </p>
      </div>
    </footer>
  );
}
