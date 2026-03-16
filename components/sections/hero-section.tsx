"use client";

import { CtaLink } from "@/components/ui/cta-link";
import { useLanguage } from "@/components/providers/language-provider";
import type { Locale } from "@/lib/locale";
import { Reveal } from "@/components/ui/reveal";

function getHeroCopy(locale: Locale) {
  return locale === "vi"
    ? {
        eyebrow: "Trung Tâm Thương Hiệu Video-First",
        headline: "Video Chiến Lược Để Thương Hiệu Nổi Bật Hơn.",
        lead: "Tôi giúp thương hiệu và cá nhân xây dựng hình ảnh chuyên nghiệp, hấp dẫn và thu hút khách hàng bằng video.",
        sub:
          "Không chỉ cắt dựng kỹ thuật. Tôi biến footage thô thành tài sản hình ảnh có chiến lược, giúp tăng độ tin cậy và tạo sức hút rõ ràng cho kinh doanh.",
        primaryCta: "Xem Portfolio Video",
        secondaryCta: "Xem Dịch Vụ MXH (Phụ Trợ)",
        proofLabel: "Dịch Vụ Cốt Lõi",
        proofValue: "Video Editing Cao Cấp + Xây Dựng Hình Ảnh Thương Hiệu",
        outcomesTitle: "Tác Động Thương Hiệu Từ Video",
        outcomes: [
          "Nâng tầm cảm nhận thương hiệu ngay từ vài giây đầu",
          "Biến footage thô thành tài sản hình ảnh có sức thuyết phục",
          "Tối ưu video để vừa đẹp vừa tăng khả năng chuyển đổi"
        ],
        markerA: "Cảm Nhận Thương Hiệu",
        markerB: "Thu Hút & Tin Tưởng",
        markerC: "Mục Tiêu Chuyển Đổi"
      }
    : {
        eyebrow: "Video-First Brand Hub",
        headline: "Strategic Video Editing For Stronger Brand Presence.",
        lead: "I help brands and individuals build a stronger, more attractive presence through strategic video editing.",
        sub:
          "I do more than technical cutting. I turn raw footage into visual assets that elevate brand perception, attract attention, and strengthen buyer confidence.",
        primaryCta: "View Video Portfolio",
        secondaryCta: "Social Services (Secondary)",
        proofLabel: "Core Offer",
        proofValue: "Premium Video Editing + Visual Brand Building",
        outcomesTitle: "Brand Impact Through Video",
        outcomes: [
          "Elevate brand perception from the very first seconds",
          "Turn raw footage into assets that look and feel premium",
          "Balance aesthetic quality with conversion-oriented intent"
        ],
        markerA: "Brand Perception",
        markerB: "Attention & Trust",
        markerC: "Conversion Intent"
      };
}

export function HeroSection() {
  const { locale } = useLanguage();
  const copy = getHeroCopy(locale);

  return (
    <section className="section-gap relative overflow-hidden pb-20 pt-16 sm:pt-24" aria-labelledby="hero-heading">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-56 w-56 animate-pulse-glow rounded-full bg-accent-500/28 blur-3xl" />
        <div className="absolute right-6 top-12 h-44 w-44 rounded-full bg-gold/18 blur-3xl" />
      </div>

      <div className="shell grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
        <Reveal>
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-accent-400/85">{copy.eyebrow}</p>
          <h1
            id="hero-heading"
            className="max-w-4xl font-[var(--font-serif)] text-5xl leading-[0.92] text-ink sm:text-6xl lg:text-[5.45rem]"
          >
            {copy.headline}
          </h1>

          <p className="mt-5 max-w-3xl text-xl font-semibold text-ink/95 sm:text-2xl">{copy.lead}</p>
          <p className="mt-4 max-w-2xl text-base text-mist sm:text-lg">{copy.sub}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CtaLink href="https://edit.lamquoccuong.com" variant="primary" className="min-w-[230px]">
              {copy.primaryCta}
            </CtaLink>
            <CtaLink href="https://mxh.lamquoccuong.com" variant="secondary" className="min-w-[230px]">
              {copy.secondaryCta}
            </CtaLink>
          </div>

          <div className="mt-8 inline-flex flex-wrap items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.16em] text-mist">
            <span className="font-semibold text-accent-400">{copy.proofLabel}</span>
            <span className="h-1 w-1 rounded-full bg-white/30" aria-hidden />
            <span className="text-ink/90">{copy.proofValue}</span>
          </div>
        </Reveal>

        <div className="space-y-4">
          <Reveal delay={0.1} className="premium-card rounded-3xl p-6 shadow-soft sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-mist/85">{copy.outcomesTitle}</p>
            <div className="mt-5 space-y-4">
              {copy.outcomes.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent-400" aria-hidden />
                  <p className="text-sm leading-relaxed text-ink/95 sm:text-base">{item}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.16} className="grid gap-3 sm:grid-cols-3">
            {[copy.markerA, copy.markerB, copy.markerC].map((marker) => (
              <div key={marker} className="premium-card rounded-2xl p-4 text-center text-xs font-semibold uppercase tracking-[0.15em] text-ink/90">
                {marker}
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
