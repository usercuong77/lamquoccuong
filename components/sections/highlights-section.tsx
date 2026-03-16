"use client";

import { useLanguage } from "@/components/providers/language-provider";
import type { Locale } from "@/lib/locale";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

function getHighlightsCopy(locale: Locale) {
  return locale === "vi"
    ? {
        eyebrow: "Dự Án Video Nổi Bật",
        title: "Nơi chất lượng hình ảnh và tư duy thương hiệu tạo khác biệt rõ ràng.",
        description:
          "Các khối dưới đây thể hiện cách triển khai video theo hướng nâng tầm cảm nhận thương hiệu, giữ chú ý và tăng mức độ quan tâm của khách hàng mục tiêu.",
        main: {
          label: "Kết Quả Tiêu Biểu",
          title: "Tôi biến footage thô thành tài sản video cao cấp, có chủ đích và hướng đến chuyển đổi.",
          body:
            "Từng nhịp cắt, chuyển cảnh, tone màu và nhịp kể chuyện đều được cân chỉnh để thương hiệu trông đắt giá hơn, đáng tin hơn và dễ được nhớ hơn.",
          chip: "Nâng Tầm Thương Hiệu Bằng Video"
        },
        side: [
          {
            label: "Tác Động Short-Form",
            title: "Cấu trúc dựng giữ người xem từ hook đến retention",
            body: "Mở đầu hút mắt, nhịp giữa rõ thông điệp và điểm rơi cuối tối ưu cho hành động tiếp theo."
          },
          {
            label: "Độ Nhất Quán Hình Ảnh",
            title: "Ngôn ngữ thương hiệu đồng nhất qua nhiều chiến dịch",
            body: "Giữ một ngôn ngữ hình ảnh thống nhất xuyên suốt để thương hiệu có dấu ấn riêng và chuyên nghiệp hơn."
          }
        ],
        strip: ["Nhịp dựng tạo tác động", "Kể chuyện theo thương hiệu", "Bàn giao chuẩn nền tảng"]
      }
    : {
        eyebrow: "Featured Video Work",
        title: "Where visual quality and brand intent become a measurable advantage.",
        description:
          "This section showcases how I approach editing as brand building: lifting perception, capturing attention, and driving qualified interest.",
        main: {
          label: "Signature Output",
          title: "I turn raw footage into premium brand assets that feel intentional and conversion-aware.",
          body:
            "Every pacing decision, transition choice, color treatment, and story beat is crafted to make your business look sharper, more trustworthy, and easier to remember.",
          chip: "Video-First Brand Lift"
        },
        side: [
          {
            label: "Short-Form Impact",
            title: "Hook-to-retention edit structure",
            body: "A compelling opening, clear middle narrative, and deliberate close designed to move viewers toward interest."
          },
          {
            label: "Visual Consistency",
            title: "Cohesive brand look across campaigns",
            body: "A unified visual language across outputs so your brand looks premium and recognizable at every touchpoint."
          }
        ],
        strip: ["High-impact pacing", "Brand-led storytelling", "Platform-ready delivery"]
      };
}

export function HighlightsSection() {
  const { locale } = useLanguage();
  const copy = getHighlightsCopy(locale);

  return (
    <section id="highlights" className="section-gap pt-16" aria-labelledby="highlights-title">
      <div className="shell space-y-10">
        <Reveal>
          <SectionHeading eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="premium-card rounded-[1.8rem] p-7 sm:p-10">
            <p className="text-xs uppercase tracking-[0.22em] text-gold">{copy.main.label}</p>
            <h3 className="mt-4 max-w-3xl font-[var(--font-serif)] text-4xl leading-[1.02] text-ink sm:text-5xl">{copy.main.title}</h3>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-mist sm:text-lg">{copy.main.body}</p>
            <span className="mt-7 inline-flex rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-ink">
              {copy.main.chip}
            </span>
          </Reveal>

          <div className="grid gap-4">
            {copy.side.map((card, index) => (
              <Reveal key={card.title} delay={0.08 * (index + 1)} className="premium-card rounded-3xl p-6 sm:p-7">
                <p className="text-xs uppercase tracking-[0.2em] text-gold">{card.label}</p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight text-ink">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist sm:text-base">{card.body}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.2}>
          <div className="premium-card grid gap-3 rounded-2xl p-4 sm:grid-cols-3 sm:p-5">
            {copy.strip.map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-ink/90">
                {item}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
