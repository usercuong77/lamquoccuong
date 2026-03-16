"use client";

import { useLanguage } from "@/components/providers/language-provider";

export function SkipLink() {
  const { locale } = useLanguage();

  return (
    <a className="skip-link" href="#content">
      {locale === "vi" ? "Bỏ qua đến nội dung chính" : "Skip to content"}
    </a>
  );
}
