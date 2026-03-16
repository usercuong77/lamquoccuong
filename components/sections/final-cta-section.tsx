"use client";

import { CtaLink } from "@/components/ui/cta-link";
import { useLanguage } from "@/components/providers/language-provider";
import type { Locale } from "@/lib/locale";
import { Reveal } from "@/components/ui/reveal";

function getFinalCtaCopy(locale: Locale) {
  return locale === "vi"
    ? {
        eyebrow: "Bước Chốt",
        title: "Nếu bạn muốn thương hiệu trông cao cấp hơn bằng video, hãy bắt đầu từ portfolio edit.",
        description: "Đây là điểm đến chính để xem chất lượng triển khai và chọn hướng hợp tác phù hợp với mục tiêu của bạn.",
        primary: "Mở Portfolio Video",
        secondary: "Dịch Vụ MXH (Phụ Trợ)",
        tertiary: "Email Để Trao Đổi Trực Tiếp"
      }
    : {
        eyebrow: "Final Step",
        title: "If your goal is stronger brand attraction through video, start with the editing portfolio.",
        description:
          "This is the primary destination to evaluate visual standard, strategic fit, and collaboration potential.",
        primary: "Open Video Portfolio",
        secondary: "Social Services (Secondary)",
        tertiary: "Email for Direct Inquiry"
      };
}

export function FinalCtaSection() {
  const { locale } = useLanguage();
  const copy = getFinalCtaCopy(locale);

  return (
    <section id="final-cta" className="section-gap pt-10" aria-labelledby="final-cta-title">
      <div className="shell">
        <Reveal>
          <div className="premium-card relative overflow-hidden rounded-[1.9rem] p-7 sm:p-10 lg:p-12">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-500/32 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 left-8 h-32 w-32 rounded-full bg-gold/22 blur-3xl" />

            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-400/90">{copy.eyebrow}</p>
            <h2
              id="final-cta-title"
              className="mt-3 max-w-4xl font-[var(--font-serif)] text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl"
            >
              {copy.title}
            </h2>
            <p className="mt-5 max-w-3xl text-base text-mist sm:text-lg">{copy.description}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CtaLink href="https://edit.lamquoccuong.com" variant="primary" className="min-w-[250px] text-sm">
                {copy.primary}
              </CtaLink>
              <CtaLink href="https://mxh.lamquoccuong.com" variant="secondary" className="min-w-[230px]">
                {copy.secondary}
              </CtaLink>
              <CtaLink href="mailto:lamquoccuong.f@gmail.com" variant="ghost" className="min-w-[220px] text-ink/85">
                {copy.tertiary}
              </CtaLink>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
