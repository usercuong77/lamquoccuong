"use client";

import { useLanguage } from "@/components/providers/language-provider";
import type { Locale } from "@/lib/locale";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

function getWhyCopy(locale: Locale) {
  return locale === "vi"
    ? {
        eyebrow: "Lý Do Chọn Tôi",
        title: "Sự kết hợp giữa gu thị giác, tư duy thương hiệu và chuẩn triển khai thực chiến.",
        description:
          "Tôi tập trung vào các yếu tố giúp thương hiệu hiện diện mạnh mẽ bằng video, không chỉ ở phần kỹ thuật dựng mà còn ở chiến lược hình ảnh.",
        items: [
          { title: "Gu Thẩm Mỹ", text: "Gu thẩm mỹ sắc nét giúp video có độ cao cấp và khác biệt ngay từ khung hình đầu." },
          { title: "Tư Duy Thương Hiệu", text: "Mọi quyết định hình ảnh đều bám định vị thương hiệu, không làm theo cảm hứng ngẫu nhiên." },
          { title: "Cảm Quan Kể Chuyện", text: "Biết cách sắp xếp nhịp kể chuyện để người xem hiểu nhanh và nhớ lâu." },
          { title: "Chuẩn Nền Tảng Số", text: "Tối ưu cho các nền tảng social hiện đại mà vẫn giữ tiêu chuẩn visual cao." },
          { title: "Giao Tiếp Rõ Ràng", text: "Làm việc rõ brief, rõ tiến độ, rõ kỳ vọng để tiết kiệm thời gian cho cả hai bên." },
          { title: "Bàn Giao Chất Lượng", text: "Ưu tiên chất lượng đầu ra có thể dùng ngay cho mục tiêu thương hiệu và kinh doanh." }
        ]
      }
    : {
        eyebrow: "Why Work With Me",
        title: "A blend of visual taste, brand awareness, and execution discipline.",
        description:
          "I focus on the factors that make video content strengthen real brand presence, beyond technical editing alone.",
        items: [
          { title: "Visual Taste", text: "A sharp aesthetic standard that makes content feel premium from the first frame." },
          { title: "Brand Awareness", text: "Every visual decision supports positioning, not random style choices." },
          { title: "Storytelling Sense", text: "Narrative pacing designed to make the message clear, memorable, and persuasive." },
          { title: "Platform-Ready", text: "Execution optimized for modern social channels without sacrificing quality." },
          { title: "Clear Communication", text: "Transparent workflow, clear milestones, and decisive collaboration." },
          { title: "Quality Delivery", text: "Outputs delivered with standards suitable for business-facing brand growth." }
        ]
      };
}

export function WhyWorkSection() {
  const { locale } = useLanguage();
  const copy = getWhyCopy(locale);

  return (
    <section id="why-work" className="section-gap" aria-labelledby="why-work-title">
      <div className="shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
        <Reveal>
          <SectionHeading eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2">
          {copy.items.map((item, index) => (
            <Reveal key={item.title} delay={0.05 * index}>
              <article className="premium-card h-full rounded-2xl p-5 transition duration-300 hover:border-white/30 hover:bg-white/[0.06]">
                <p className="text-xs uppercase tracking-[0.16em] text-accent-400/85">0{index + 1}</p>
                <h3 className="mt-3 text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">{item.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
