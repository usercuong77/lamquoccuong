"use client";

import { CtaLink } from "@/components/ui/cta-link";
import { useLanguage } from "@/components/providers/language-provider";
import type { Locale } from "@/lib/locale";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

function getServiceCopy(locale: Locale) {
  return locale === "vi"
    ? {
        eyebrow: "Dịch Vụ",
        title: "Video Editing Là Dịch Vụ Cốt Lõi. Social Media Là Lớp Hỗ Trợ.",
        description:
          "Phân cấp dưới đây thể hiện rõ định vị: dịch vụ video là trung tâm tạo giá trị hình ảnh và chuyển đổi; dịch vụ mạng xã hội giữ vai trò bổ trợ.",
        primary: {
          label: "Dịch Vụ Chính",
          title: "Video Editing Cao Cấp",
          body:
            "Dịch vụ dựng video tập trung nâng tầm cảm nhận thương hiệu, tăng sức hút và xây dựng niềm tin bằng tiêu chuẩn triển khai hình ảnh cao cấp.",
          points: [
            "Kể chuyện theo định vị thương hiệu, không chỉ cắt nối kỹ thuật",
            "Nhịp dựng, âm nhạc, chuyển cảnh và màu sắc theo mục tiêu hình ảnh",
            "Đầu ra tối ưu cho social và các chiến dịch tạo khách hàng"
          ],
          cta: "Xem Portfolio Video"
        },
        secondary: {
          label: "Dịch Vụ Phụ Trợ",
          title: "Dịch Vụ Mạng Xã Hội",
          body: "Dịch vụ bổ trợ giúp tổ chức nhịp đăng tải và đồng bộ hệ thống nội dung sau khi đã có trục video mạnh.",
          cta: "Xem Dịch Vụ MXH"
        }
      }
    : {
        eyebrow: "Services",
        title: "Video editing is the core offer. Social media is strategic support.",
        description:
          "The hierarchy below is intentional: video editing drives brand perception and attraction first, while social services support consistency after the core visual system is in place.",
        primary: {
          label: "Primary Offer",
          title: "Premium Video Editing",
          body:
            "A video service built to elevate brand perception, increase attraction, and generate trust through high-standard visual execution.",
          points: [
            "Brand-led storytelling beyond technical cutting",
            "Pacing, transitions, music, and grading aligned to positioning",
            "Platform-ready outputs designed for attention and conversion"
          ],
          cta: "Go to Video Portfolio"
        },
        secondary: {
          label: "Secondary Support",
          title: "Social Media Services",
          body:
            "A supporting service to maintain publishing rhythm and content structure once your core video identity is established.",
          cta: "Explore Social Services"
        }
      };
}

export function ServiceSplitSection() {
  const { locale } = useLanguage();
  const copy = getServiceCopy(locale);

  return (
    <section id="services" className="section-gap" aria-labelledby="services-title">
      <div className="shell space-y-10">
        <Reveal>
          <SectionHeading eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
          <Reveal>
            <article className="premium-card rounded-[1.8rem] p-7 shadow-soft sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent-400/90">{copy.primary.label}</p>
              <h3 className="mt-4 font-[var(--font-serif)] text-4xl leading-tight text-ink sm:text-5xl">{copy.primary.title}</h3>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-mist sm:text-lg">{copy.primary.body}</p>

              <ul className="mt-6 space-y-3 text-sm text-ink/95 sm:text-base">
                {copy.primary.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-2 h-[7px] w-[7px] rounded-full bg-accent-400" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <CtaLink href="https://edit.lamquoccuong.com" variant="primary" className="mt-8 min-w-[220px]">
                {copy.primary.cta}
              </CtaLink>
            </article>
          </Reveal>

          <Reveal delay={0.1}>
            <article className="premium-card rounded-3xl p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{copy.secondary.label}</p>
              <h3 className="mt-3 text-2xl font-semibold text-ink">{copy.secondary.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist sm:text-base">{copy.secondary.body}</p>

              <CtaLink href="https://mxh.lamquoccuong.com" variant="secondary" className="mt-6 w-full justify-center sm:w-auto">
                {copy.secondary.cta}
              </CtaLink>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
