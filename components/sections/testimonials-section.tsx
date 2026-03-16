"use client";

import { useLanguage } from "@/components/providers/language-provider";
import type { Locale } from "@/lib/locale";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

function getTestimonialsCopy(locale: Locale) {
  return locale === "vi"
    ? {
        eyebrow: "Độ Tin Cậy",
        title: "Phản hồi từ các dự án video tập trung vào chất lượng thương hiệu.",
        description: "Những nhận xét đại diện về khả năng nâng tầm hình ảnh, tăng sức hút và cải thiện hiệu quả nội dung.",
        items: [
          {
            quote:
              "Video edits đã thay đổi hoàn toàn cách khách hàng nhìn thương hiệu của chúng tôi. Mọi thứ trông chuyên nghiệp hơn và có sức hút rõ rệt.",
            name: "Founder, DTC Brand",
            region: "Singapore"
          },
          {
            quote:
              "Cuong không chỉ dựng video, mà còn giúp chúng tôi làm rõ thông điệp thương hiệu qua từng cảnh quay.",
            name: "Marketing Lead, Tech Startup",
            region: "Ho Chi Minh City"
          },
          {
            quote:
              "Output luôn đúng gu premium, đúng nhịp nền tảng và có thể đưa vào chiến dịch ngay lập tức.",
            name: "Personal Brand Client",
            region: "Australia"
          }
        ]
      }
    : {
        eyebrow: "Trust",
        title: "Feedback from projects focused on premium video-led brand growth.",
        description:
          "Representative testimonials on visual quality, stronger brand attraction, and clearer audience response.",
        items: [
          {
            quote:
              "The edits completely changed how clients perceived our brand. Everything looked more premium and far more compelling.",
            name: "Founder, DTC Brand",
            region: "Singapore"
          },
          {
            quote:
              "Cuong did more than edit footage. He clarified our message through the way each scene was structured and paced.",
            name: "Marketing Lead, Tech Startup",
            region: "Ho Chi Minh City"
          },
          {
            quote:
              "Outputs consistently matched a premium standard, were platform-ready, and could be deployed straight into campaigns.",
            name: "Personal Brand Client",
            region: "Australia"
          }
        ]
      };
}

export function TestimonialsSection() {
  const { locale } = useLanguage();
  const copy = getTestimonialsCopy(locale);

  return (
    <section id="testimonials" className="section-gap" aria-labelledby="testimonials-title">
      <div className="shell space-y-10">
        <Reveal>
          <SectionHeading eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
        </Reveal>

        <div className="grid gap-4 lg:grid-cols-3">
          {copy.items.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={0.08 * index}>
              <figure className="premium-card h-full rounded-2xl p-6 sm:p-7">
                <blockquote className="text-base leading-relaxed text-ink/95">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-4">
                  <p className="text-sm font-semibold text-ink">{testimonial.name}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-mist/85">{testimonial.region}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
