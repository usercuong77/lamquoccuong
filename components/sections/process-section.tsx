"use client";

import { useLanguage } from "@/components/providers/language-provider";
import type { Locale } from "@/lib/locale";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

function getProcessCopy(locale: Locale) {
  return locale === "vi"
    ? {
        eyebrow: "Quy Trình",
        title: "Quy trình triển khai video tập trung vào chất lượng thương hiệu và hiệu quả truyền thông.",
        description:
          "Mỗi giai đoạn được thiết kế để đi từ hiểu biết thương hiệu đến phiên bản video hoàn chỉnh, sẵn sàng phục vụ mục tiêu kinh doanh.",
        steps: [
          {
            title: "Khám Phá",
            description: "Làm rõ định vị, khách hàng mục tiêu, tone thương hiệu và mục tiêu của video."
          },
          {
            title: "Định Hướng Sáng Tạo",
            description: "Xây concept hình ảnh, nhịp kể chuyện và tiêu chuẩn visual cần đạt cho dự án."
          },
          {
            title: "Triển Khai Dựng",
            description: "Dựng, tinh chỉnh và hoàn thiện với phản hồi rõ ràng theo từng vòng làm việc."
          },
          {
            title: "Bàn Giao",
            description: "Bàn giao phiên bản tối ưu cho từng nền tảng để triển khai truyền thông hoặc chiến dịch."
          }
        ]
      }
    : {
        eyebrow: "Process",
        title: "A video workflow built around brand quality and communication results.",
        description:
          "Each stage is structured to move from brand insight to finished video assets ready for real business use.",
        steps: [
          {
            title: "Discovery",
            description: "Clarify positioning, audience, tone, and the strategic role of the video." 
          },
          {
            title: "Creative Direction",
            description: "Define visual concept, narrative rhythm, and quality standards for the edit." 
          },
          {
            title: "Editing Execution",
            description: "Edit, refine, and polish with transparent feedback loops and controlled quality." 
          },
          {
            title: "Delivery",
            description: "Deliver platform-ready versions aligned with campaign or brand communication goals." 
          }
        ]
      };
}

export function ProcessSection() {
  const { locale } = useLanguage();
  const copy = getProcessCopy(locale);

  return (
    <section id="process" className="section-gap" aria-labelledby="process-title">
      <div className="shell space-y-10">
        <Reveal>
          <SectionHeading eyebrow={copy.eyebrow} title={copy.title} description={copy.description} />
        </Reveal>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {copy.steps.map((step, index) => (
            <Reveal key={step.title} delay={0.06 * index}>
              <article className="premium-card relative h-full rounded-2xl p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-accent-400/85">0{index + 1}</p>
                <h3 className="mt-3 text-xl font-semibold text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mist">{step.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
