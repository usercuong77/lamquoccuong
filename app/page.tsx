import { AboutSection } from "@/components/sections/about-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { HeroSection } from "@/components/sections/hero-section";
import { HighlightsSection } from "@/components/sections/highlights-section";
import { ProcessSection } from "@/components/sections/process-section";
import { ServiceSplitSection } from "@/components/sections/service-split-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { WhyWorkSection } from "@/components/sections/why-work-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="content">
        <HeroSection />
        <AboutSection />
        <HighlightsSection />
        <ServiceSplitSection />
        <WhyWorkSection />
        <ProcessSection />
        <TestimonialsSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
