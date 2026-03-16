"use client";

import { useLanguage } from "@/components/providers/language-provider";
import type { Locale } from "@/lib/locale";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

function getAboutCopy(locale: Locale) {
  return locale === "vi"
    ? {
        eyebrow: "Định Vị",
        title: "Đối Tác Sáng Tạo Cho Hình Ảnh Thương Hiệu, Không Chỉ Là Người Cắt Dựng.",
        description:
          "Tôi làm việc như một đối tác sáng tạo giúp thương hiệu kể đúng thông điệp qua ngôn ngữ hình ảnh: rõ định vị, đúng cảm xúc và giàu giá trị thẩm mỹ.",
        statement:
          "Mục tiêu của tôi là giúp thương hiệu của bạn xuất hiện chuyên nghiệp hơn, thu hút hơn và đáng tin hơn bằng video.",
        foundationLabel: "Nền Tảng Sáng Tạo",
        pillars: [
          "Định hướng hình ảnh bám chặt định vị thương hiệu",
          "Kể chuyện rõ thông điệp và cảm xúc",
          "Triển khai sẵn sàng cho môi trường số"
        ]
      }
    : {
        eyebrow: "Positioning",
        title: "A creative partner for brand image, not only an editor for timeline cuts.",
        description:
          "I operate as a creative partner who translates brand intent into visual language: stronger perception, clearer messaging, and higher audience trust.",
        statement:
          "The goal is simple: make your business look more professional, more attractive, and more memorable through strategic video assets.",
        foundationLabel: "Creative Foundations",
        pillars: [
          "Visual direction aligned with brand positioning",
          "Storytelling built around message and emotion",
          "Platform-ready execution for real digital impact"
        ]
      };
}

export function AboutSection() {
  const { locale } = useLanguage();
  const copy = getAboutCopy(locale);

  return (
    <section id="about" className="section-gap pt-6" aria-labelledby="about-title">
      <div className="shell grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
        <Reveal>
          <SectionHeading eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />

          <div className="mt-8 border-l border-accent-400/45 pl-5">
            <p className="max-w-3xl font-[var(--font-serif)] text-2xl leading-tight text-ink sm:text-3xl">{copy.statement}</p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="premium-card rounded-3xl p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-400/90">{copy.foundationLabel}</p>
            <div className="mt-5 space-y-4">
              {copy.pillars.map((pillar) => (
                <div key={pillar} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-gold" aria-hidden />
                  <p className="text-sm leading-relaxed text-ink/95 sm:text-base">{pillar}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
