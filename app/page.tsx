"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/providers/language-provider";

const copy = {
  en: {
    nav: ["About", "My playground", "Skills", "Say hi"],
    eyebrow: "A personal website with unnecessary amounts of personality",
    title: "Hi, I’m Cuong. I make things move.",
    lead: "Video editor, motion enthusiast, AI explorer, and a man who has never questioned his own handsomeness.",
    intro: "I turn ideas, pixels, keyframes and occasional chaos into videos that make people stop scrolling.",
    work: "See my video work",
    hello: "Say hello",
    badge: "Currently creating",
    badgeText: "visual things & questionable jokes",
    aboutEyebrow: "The serious bit",
    aboutTitle: "Serious about the work. Not always serious about the pose.",
    aboutText: "I’m Lâm Quốc Cường — better known online as Cuonglq. My playground is where video editing meets motion graphics, 3D, AI and a slightly dangerous amount of curiosity.",
    aboutText2: "When a project needs focus, I focus. When the moment needs a joke, I have several ready. The result is visual work that feels polished, alive and unmistakably human.",
    funFact: "Fun fact",
    funFactText: "I always think I look handsome. The evidence is currently under review.",
    playgroundEyebrow: "My playground",
    playgroundTitle: "Things I enjoy making move",
    skills: [
      ["01", "Video Editing", "Turning raw footage into something people actually want to watch."],
      ["02", "Motion Graphics", "Keyframes, kinetic type and little details with big energy."],
      ["03", "3D & Animation", "Making objects spin, glow, float and occasionally obey physics."],
      ["04", "AI & Creative Tech", "Testing new tools before they become everyone’s new tool."],
    ],
    strip: "NO BORING PIXELS  ✦  JUST GOOD ENERGY  ✦  NO BORING PIXELS  ✦  JUST GOOD ENERGY  ✦",
    contactEyebrow: "You made it this far",
    contactTitle: "Let’s make something that deserves a replay.",
    contactText: "Have a video, idea or beautifully chaotic brief? Send it over. I’ll bring the timeline, the keyframes and probably one bad joke.",
    contact: "Email me",
    social: "Find me at bio.lamquoccuong.com",
    footer: "Made with curiosity, caffeine and an unreasonable belief in good transitions.",
  },
  vi: {
    nav: ["Giới thiệu", "Sân chơi", "Kỹ năng", "Liên hệ"],
    eyebrow: "Một website cá nhân có hơi nhiều cá tính",
    title: "Xin chào, mình là Cường. Mình làm mọi thứ chuyển động.",
    lead: "Video Editor, người mê motion, nhà thám hiểm AI và một người chưa bao giờ nghi ngờ vẻ đẹp trai của mình.",
    intro: "Mình biến ý tưởng, pixel, keyframe và một chút hỗn loạn thành những video khiến người ta dừng lướt.",
    work: "Xem sản phẩm video",
    hello: "Gửi lời chào",
    badge: "Đang sáng tạo",
    badgeText: "những thứ có hình ảnh & vài câu đùa",
    aboutEyebrow: "Đoạn nghiêm túc",
    aboutTitle: "Nghiêm túc với công việc. Không phải lúc nào cũng nghiêm túc khi tạo dáng.",
    aboutText: "Mình là Lâm Quốc Cường — trên mạng thường được gọi là Cuonglq. Sân chơi của mình là nơi video editing gặp motion graphic, 3D, AI và một lượng tò mò hơi nguy hiểm.",
    aboutText2: "Khi dự án cần tập trung, mình tập trung. Khi thời điểm cần một câu đùa, mình luôn có sẵn vài câu. Kết quả là những sản phẩm hình ảnh chỉn chu, có sức sống và rất con người.",
    funFact: "Sự thật thú vị",
    funFactText: "Mình luôn thấy mình đẹp trai. Bằng chứng vẫn đang được hội đồng thẩm định.",
    playgroundEyebrow: "Sân chơi của mình",
    playgroundTitle: "Những thứ mình thích làm chuyển động",
    skills: [
      ["01", "Video Editing", "Biến footage thô thành thứ mà người ta thật sự muốn xem."],
      ["02", "Motion Graphics", "Keyframe, kinetic type và những chi tiết nhỏ đầy năng lượng."],
      ["03", "3D & Animation", "Làm cho vật thể xoay, phát sáng, bay và đôi khi nghe lời vật lý."],
      ["04", "AI & Công nghệ sáng tạo", "Thử các công cụ mới trước khi chúng trở thành công cụ của tất cả mọi người."],
    ],
    strip: "KHÔNG CÓ PIXEL NHÀM CHÁN  ✦  CHỈ CÓ NĂNG LƯỢNG TỐT  ✦  KHÔNG CÓ PIXEL NHÀM CHÁN  ✦  CHỈ CÓ NĂNG LƯỢNG TỐT  ✦",
    contactEyebrow: "Bạn đã đọc đến đây",
    contactTitle: "Cùng làm thứ gì đó đáng để xem lại nhé.",
    contactText: "Có video, ý tưởng hay một brief hơi hỗn loạn? Gửi mình. Mình sẽ mang theo timeline, keyframe và có thể thêm một câu đùa hơi tệ.",
    contact: "Gửi email cho mình",
    social: "Tìm mình tại bio.lamquoccuong.com",
    footer: "Được làm bằng sự tò mò, caffeine và niềm tin hơi quá mức vào những chuyển cảnh đẹp.",
  },
} as const;

export default function Home() {
  const { locale, setLocale } = useLanguage();
  const t = copy[locale];

  return (
    <div className="fun-site">
      <header className="fun-header shell">
        <Link className="brand-mark" href="#top" aria-label="Cuonglq home">
          <span className="brand-dot" />
          <span>CUONGLQ</span>
        </Link>
        <nav className="fun-nav" aria-label="Main navigation">
          <a href="#about">{t.nav[0]}</a>
          <a href="#playground">{t.nav[1]}</a>
          <a href="#skills">{t.nav[2]}</a>
          <a href="#contact">{t.nav[3]}</a>
        </nav>
        <button className="language-switch" type="button" onClick={() => setLocale(locale === "en" ? "vi" : "en")} aria-label="Switch language">
          {locale === "en" ? "VI" : "EN"}
        </button>
      </header>

      <main id="top">
        <section className="fun-hero shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <motion.p className="eyebrow" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {t.eyebrow}
            </motion.p>
            <motion.h1 id="hero-title" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08 }}>
              {t.title}
            </motion.h1>
            <motion.p className="hero-lead" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.16 }}>
              {t.lead}
            </motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}>
              <a className="button button-primary" href="https://edit.lamquoccuong.com" target="_blank" rel="noreferrer">{t.work} <span>↗</span></a>
              <a className="button button-quiet" href="#contact">{t.hello} <span>↓</span></a>
            </motion.div>
          </div>
          <motion.div className="hero-toy" initial={{ opacity: 0, scale: 0.8, rotate: 4 }} animate={{ opacity: 1, scale: 1, rotate: -3 }} transition={{ duration: 0.9, delay: 0.25, type: "spring" }} whileHover={{ rotate: 2, scale: 1.03 }}>
            <div className="toy-orbit orbit-one" />
            <div className="toy-orbit orbit-two" />
            <div className="toy-card">
              <span className="toy-label">{t.badge}</span>
              <strong>CUONGLQ</strong>
              <span className="toy-caption">{t.badgeText}</span>
              <div className="toy-face" aria-hidden="true">⌁</div>
              <span className="toy-sticker sticker-top">WOW</span>
              <span className="toy-sticker sticker-bottom">100% REAL</span>
            </div>
          </motion.div>
        </section>

        <div className="fun-strip" aria-hidden="true"><span>{t.strip}</span></div>

        <section id="about" className="about-section shell section-anchor">
          <div className="section-kicker"><span>01</span><span>{t.aboutEyebrow}</span></div>
          <div className="about-layout">
            <h2>{t.aboutTitle}</h2>
            <div className="about-copy"><p>{t.aboutText}</p><p>{t.aboutText2}</p></div>
          </div>
          <motion.div className="fact-card" whileHover={{ y: -6, rotate: -1 }}>
            <span>{t.funFact}</span><strong>“{t.funFactText}”</strong><i>— Cuong, probably</i>
          </motion.div>
        </section>

        <section id="playground" className="playground-section section-anchor">
          <div className="shell">
            <div className="section-kicker"><span>02</span><span>{t.playgroundEyebrow}</span></div>
            <h2 className="playground-title">{t.playgroundTitle}</h2>
            <div id="skills" className="skill-grid">
              {t.skills.map(([number, title, text], index) => (
                <motion.article key={number} className={`skill-card skill-card-${index + 1}`} whileHover={{ y: -8, rotate: index % 2 ? 1 : -1 }} transition={{ type: "spring", stiffness: 260 }}>
                  <span className="skill-number">{number}</span><span className="skill-arrow">↗</span><h3>{title}</h3><p>{text}</p><div className="skill-blob" aria-hidden="true" />
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section shell section-anchor">
          <div className="contact-card">
            <div><p className="eyebrow">{t.contactEyebrow}</p><h2>{t.contactTitle}</h2><p className="contact-text">{t.contactText}</p></div>
            <div className="contact-actions"><a className="button button-primary" href="mailto:lamquoccuong.f@gmail.com">{t.contact} <span>↗</span></a><a className="social-link" href="https://bio.lamquoccuong.com" target="_blank" rel="noreferrer">{t.social} <span>↗</span></a></div>
          </div>
        </section>
      </main>

      <footer className="fun-footer shell"><Link className="brand-mark" href="#top"><span className="brand-dot" /><span>CUONGLQ</span></Link><p>{t.footer}</p><a href="mailto:lamquoccuong.f@gmail.com">lamquoccuong.f@gmail.com</a></footer>
    </div>
  );
}
