"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { useLanguage } from "@/components/providers/language-provider";

const copy = {
  en: {
    nav: ["About", "Playground", "Calisthenics", "Links", "Message"],
    eyebrow: "Personal website / pixels with a pulse",
    title: "Hi, I’m Cuong. I make things move.",
    lead: "Video editor, motion nerd, AI explorer, calisthenics enthusiast, and a man who has never doubted his own handsomeness.",
    intro: "I turn ideas, pixels, keyframes and occasional chaos into visual things worth stopping for.",
    work: "See my video work",
    links: "Explore my universe",
    exploreLabel: "Explore the full Cuonglq universe",
    exploreTitle: "Want to see more of what I make?",
    exploreHint: "Pick a destination. I have a few corners of the internet to show you.",
    visitWork: "Watch the video work",
    visitSocial: "Visit the social lab",
    visitContact: "Find my contact details",
    visitSupport: "Visit Feed Me",
    midEyebrow: "There is more to explore",
    midTitle: "Don’t stop here. The other websites are part of the fun.",
    midText: "One place is for video, one is for social media, one is for contact and one is for... keeping me fed. It is a small internet, but it has a lot going on.",
    midCta: "Explore the other sites",
    badge: "Currently creating",
    badgeText: "visual things & questionable jokes",
    aboutEyebrow: "The serious bit",
    aboutTitle: "Serious about the work. Not always serious about the pose.",
    aboutText: "I’m Lâm Quốc Cường — better known online as Cuonglq. My playground sits at the intersection of video editing, motion graphics, 3D, AI and a mildly dangerous amount of curiosity.",
    aboutText2: "When a project needs focus, I lock in. When a moment needs a joke, I have a few ready. Somewhere between the timeline and the pull-up bar, I’m usually trying to make something better.",
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
    fitnessEyebrow: "Off-screen activity",
    fitnessTitle: "I also have a complicated relationship with gravity.",
    fitnessText: "Calisthenics keeps me humble. The floor is always there for me, especially after a confident handstand attempt.",
    repLabel: "Questionable rep counter",
    repText: "Reps completed today",
    repButton: "+1 rep",
    reset: "Reset ego",
    repNote: "Not scientifically verified. The confidence is.",
    linkEyebrow: "Pick a portal",
    linkTitle: "Four doors. One very online human.",
    products: "Watch the work",
    productsText: "Edits, experiments and short-form videos live here.",
    social: "Explore the social lab",
    socialText: "Facebook support, growth and platform-side solutions.",
    contact: "Find me",
    contactText: "My contact details and social links, neatly gathered in one place.",
    support: "Feed the chaos",
    supportName: "FEED ME",
    supportText: "If this website made you smile, this is the charmingly suspicious button.",
    message: {
      eyebrow: "Leave a note",
      title: "Say hi. I will read it before the coffee goes cold.",
      text: "A hello, an idea, a question or a completely unnecessary joke is welcome. I read every message myself and will get back to you.",
      name: "Your name",
      namePlaceholder: "What should I call you?",
      contact: "Email or contact link",
      contactPlaceholder: "Optional: email, Facebook, or another way to reach you...",
      body: "Your message",
      bodyPlaceholder: "Write a few lines for me...",
      submit: "Send the message",
      sending: "Sending...",
      success: "Sent. I will take a look and get back to you soon.",
      error: "It did not go through. Please try again in a moment.",
      required: "Please add your name and a message first.",
      delivery: "A NOTE FOR CUONG  ✦  HUMAN-READ  ✦  NO BORING FORM"
    },
    energyLabel: "ENERGY MODE",
    energyCaption: "No boring pixels. No boring reps. No boring human.",
    strip: "GOOD ENERGY  ✦  GOOD TRANSITIONS  ✦  GOOD FORM  ✦  GOOD ENERGY  ✦  GOOD TRANSITIONS  ✦  GOOD FORM  ✦",
    footer: "Made with curiosity, caffeine, muscle soreness and an unreasonable belief in good transitions.",
  },
  vi: {
    nav: ["Giới thiệu", "Mình làm gì", "Calisthenics", "Liên hệ", "Nhắn mình"],
    eyebrow: "Website cá nhân của Cường / có hơi nhiều trò vui",
    title: "Xin chào, mình là Cường. Mình thích làm mọi thứ chuyển động.",
    lead: "Mình làm video, thích motion graphic, mê AI, tập calisthenics và luôn tin rằng mình đẹp trai.",
    intro: "Mình biến ý tưởng và những đoạn video thô thành nội dung dễ xem, có nhịp điệu và có chút hài hước.",
    work: "Xem video mình đã làm",
    links: "Xem các trang của mình",
    exploreLabel: "Khám phá các trang của Cường",
    exploreTitle: "Muốn xem thêm những gì mình đang làm?",
    exploreHint: "Chọn một điểm đến nhé. Mình có vài góc nhỏ trên internet muốn khoe.",
    visitWork: "Xem portfolio video",
    visitSocial: "Xem dịch vụ mạng xã hội",
    visitContact: "Xem thông tin liên hệ",
    visitSupport: "Ghé trang Nuôi Tôi",
    midEyebrow: "Còn nhiều thứ để xem",
    midTitle: "Đừng dừng ở đây. Các website khác cũng là một phần cuộc vui.",
    midText: "Một trang để xem video, một trang về mạng xã hội, một trang để liên hệ và một trang để... nuôi mình. Internet của mình nhỏ thôi, nhưng khá nhiều chuyện.",
    midCta: "Xem các trang khác",
    badge: "Đang làm việc",
    badgeText: "video, motion và vài trò nghịch ngợm",
    aboutEyebrow: "Nói nghiêm túc một chút",
    aboutTitle: "Mình nghiêm túc với công việc, nhưng không nghiêm túc khi tạo dáng.",
    aboutText: "Mình là Lâm Quốc Cường, mọi người thường gọi là Cuonglq. Mình làm video và thích khám phá motion graphic, 3D, AI cùng những ý tưởng mới.",
    aboutText2: "Khi làm việc, mình tập trung vào chất lượng. Ngoài giờ làm, mình tập calisthenics, thử công nghệ mới và nghĩ ra những câu đùa không phải lúc nào cũng hay.",
    funFact: "Một sự thật vui",
    funFactText: "Mình luôn thấy mình đẹp trai. Nếu bạn chưa đồng ý thì chắc chúng ta cần nói chuyện thêm.",
    playgroundEyebrow: "Mình thích làm",
    playgroundTitle: "Những thứ mình thường làm chuyển động",
    skills: [
      ["01", "Video Editing", "Dựng video rõ ràng, có nhịp và khiến người xem muốn xem tiếp."],
      ["02", "Motion Graphics", "Làm chữ, hình ảnh và hiệu ứng chuyển động để video sinh động hơn."],
      ["03", "3D & Animation", "Tạo ra những vật thể biết xoay, bay, phát sáng và đôi khi hơi bướng."],
      ["04", "AI & Công nghệ sáng tạo", "Thử các công cụ mới để làm việc nhanh hơn và có thêm nhiều ý tưởng."],
    ],
    fitnessEyebrow: "Ngoài màn hình",
    fitnessTitle: "Mình cũng hay vật lộn với trọng lực.",
    fitnessText: "Mình tập calisthenics để khỏe hơn và bớt ngồi lì trước máy tính. Handstand vẫn đang trong quá trình thương lượng với mặt đất.",
    repLabel: "Bộ đếm rep vui thôi",
    repText: "Số rep hôm nay",
    repButton: "+1 rep",
    reset: "Reset sự tự tin",
    repNote: "Con số này chưa được kiểm chứng. Nhưng tinh thần thì có.",
    linkEyebrow: "Các trang của mình",
    linkTitle: "Bạn muốn ghé đâu trước?",
    products: "Xem video",
    productsText: "Video, sản phẩm edit và những thử nghiệm hình ảnh của mình.",
    social: "Dịch vụ mạng xã hội",
    socialText: "Hỗ trợ Facebook, quảng cáo và các giải pháp phát triển mạng xã hội.",
    contact: "Liên hệ",
    contactText: "Thông tin liên hệ và các mạng xã hội của mình.",
    support: "Ủng hộ",
    supportName: "NUÔI TÔI",
    supportText: "Nếu thấy website vui, bạn có thể ghé qua đây để tiếp sức cho mình.",
    message: {
      eyebrow: "Để lại lời nhắn",
      title: "Có gì muốn nói với mình không?",
      text: "Một lời chào, một ý tưởng, một câu hỏi hay một câu đùa hơi vô tri đều được. Mình sẽ tự đọc và phản hồi bạn sớm nhé.",
      name: "Tên của bạn",
      namePlaceholder: "Mình nên gọi bạn là gì?",
      contact: "Email hoặc cách liên hệ",
      contactPlaceholder: "Không bắt buộc: email, Facebook hoặc cách khác để liên hệ với bạn...",
      body: "Lời nhắn",
      bodyPlaceholder: "Viết vài dòng cho mình nhé...",
      submit: "Gửi lời nhắn",
      sending: "Đang gửi...",
      success: "Gửi rồi nhé. Mình sẽ đọc và phản hồi sớm.",
      error: "Chưa gửi được. Bạn thử lại sau một chút nhé.",
      required: "Bạn điền tên và lời nhắn giúp mình trước nhé.",
      delivery: "NHẮN CƯỜNG  ✦  MÌNH TỰ ĐỌC  ✦  FORM KHÔNG NHÀM CHÁN"
    },
    energyLabel: "CHẾ ĐỘ NĂNG LƯỢNG",
    energyCaption: "Không pixel nhàm chán. Không rep nhàm chán. Không ngày nào quá tẻ nhạt.",
    strip: "NĂNG LƯỢNG TỐT  ✦  CHUYỂN ĐỘNG ĐẸP  ✦  TẬP LUYỆN ĐỀU  ✦  NĂNG LƯỢNG TỐT  ✦  CHUYỂN ĐỘNG ĐẸP  ✦  TẬP LUYỆN ĐỀU  ✦",
    footer: "Được làm bằng sự tò mò, caffeine, cơ bắp đau nhức và vài chuyển cảnh đẹp.",
  },
} as const;

export default function Home() {
  const { locale, setLocale } = useLanguage();
  const t = copy[locale];
  const [reps, setReps] = useState(7);
  const [messageForm, setMessageForm] = useState({ name: "", contact: "", message: "" });
  const [messageState, setMessageState] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleMessageSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = messageForm.name.trim();
    const contact = messageForm.contact.trim();
    const message = messageForm.message.trim();

    if (!name || !message) {
      setMessageState("error");
      return;
    }

    setMessageState("sending");
    const payload = {
      source: "lamquoccuong.com",
      formId: "personalMessageForm",
      submittedAt: new Date().toISOString(),
      name,
      phone: contact || "Khong cung cap",
      service: "Personal website message",
      note: message
    };

    try {
      const webhookBase = process.env.NEXT_PUBLIC_LEAD_WEBHOOK_URL
        || (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
          ? "http://localhost:8000"
          : "https://clean-webhook-checker.onrender.com");
      const response = await fetch(`${webhookBase.replace(/\/$/, "")}/webhook/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        mode: "cors",
        keepalive: true
      });
      if (!response.ok) throw new Error(`Webhook status ${response.status}`);
      const result = await response.json().catch(() => null);
      if (result?.ok === false) throw new Error(result.error || "Webhook returned ok=false");
      setMessageForm({ name: "", contact: "", message: "" });
      setMessageState("success");
    } catch (error) {
      console.error("Personal message webhook submit failed:", error);
      setMessageState("error");
    }
  };

  const messageStatus = messageState === "sending"
    ? t.message.sending
    : messageState === "success"
      ? t.message.success
      : messageState === "error"
        ? (messageForm.name.trim() && messageForm.message.trim() ? t.message.error : t.message.required)
        : "";

  return (
    <div className="fun-site">
      <header className="fun-header shell">
        <Link className="brand-mark" href="#top" aria-label="Cuonglq home"><span className="brand-dot" /><span>CUONGLQ</span></Link>
          <nav className="fun-nav" aria-label="Main navigation">
          <a href="#about">{t.nav[0]}</a><a href="#playground">{t.nav[1]}</a><a href="#fitness">{t.nav[2]}</a><a href="#links">{t.nav[3]}</a><a href="#message">{t.nav[4]}</a>
        </nav>
        <a className="header-explore" href="#explore">{t.exploreLabel} <span>↘</span></a>
        <button className="language-switch" type="button" onClick={() => setLocale(locale === "en" ? "vi" : "en")} aria-label="Switch language">{locale === "en" ? "VI" : "EN"}</button>
      </header>

      <main id="top">
        <section className="fun-hero shell" aria-labelledby="hero-title">
          <div className="hero-copy">
            <motion.p className="eyebrow" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>{t.eyebrow}</motion.p>
            <motion.h1 id="hero-title" className="hero-title-drop" aria-label={t.title} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.04 }}>
              {t.title.split(" ").map((word, index) => <span className="title-word" key={`${locale}-${index}-${word}`} style={{ animationDelay: `${0.12 + index * 0.065}s` }}>{word}</span>)}
            </motion.h1>
            <motion.p className="hero-lead" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.16 }}>{t.lead}</motion.p>
            <motion.p className="hero-intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>{t.intro}</motion.p>
            <motion.div className="hero-actions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
              <a className="button button-primary" href="https://edit.lamquoccuong.com" target="_blank" rel="noreferrer">{t.work} <span>↗</span></a>
              <a className="button button-quiet" href="#links">{t.links} <span>↓</span></a>
            </motion.div>
          </div>
          <motion.div className="hero-toy" initial={{ opacity: 0, scale: 0.8, rotate: 4 }} animate={{ opacity: 1, scale: 1, rotate: -3 }} transition={{ duration: 0.9, delay: 0.25, type: "spring" }} whileHover={{ rotate: 2, scale: 1.04 }}>
            <motion.div className="portrait-card" animate={{ y: [0, -10, 0], rotate: [-7, -4, -7] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}><Image src="/cuong-photo.jpg" alt="Lâm Quốc Cường" width={168} height={168} priority /><span>THE GUY BEHIND<br />THE PIXELS</span></motion.div>
            <div className="toy-orbit orbit-one" /><div className="toy-orbit orbit-two" />
            <div className="toy-card"><span className="toy-label">{t.badge}</span><strong>CUONGLQ</strong><span className="toy-caption">{t.badgeText}</span><div className="toy-face" aria-hidden="true">⌁</div><span className="toy-sticker sticker-top">WOW</span><span className="toy-sticker sticker-bottom">100% REAL</span></div>
            <motion.span className="floating-chip chip-one" animate={{ y: [0, -13, 0], rotate: [0, 4, 0] }} transition={{ duration: 3, repeat: Infinity }}>EDIT</motion.span>
            <motion.span className="floating-chip chip-two" animate={{ y: [0, 12, 0], rotate: [0, -5, 0] }} transition={{ duration: 3.8, repeat: Infinity }}>PULL UP</motion.span>
          </motion.div>
        </section>

        <div className="energy-showcase" aria-label={t.energyCaption}>
          <motion.div className="energy-spark spark-left" animate={{ rotate: 360 }} transition={{ duration: 9, repeat: Infinity, ease: "linear" }}>✳</motion.div>
          <div className="energy-rail rail-back"><span className="energy-phrase">{t.strip}  ✦  {t.strip}</span></div>
          <motion.div className="energy-orb" animate={{ rotate: [0, 7, -7, 0], y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}><span>{t.energyLabel}</span><strong>ON</strong><i>✦</i></motion.div>
          <div className="energy-rail rail-front"><span className="energy-phrase">{t.strip}  ✦  {t.strip}</span></div>
          <motion.div className="energy-spark spark-right" animate={{ rotate: -360 }} transition={{ duration: 11, repeat: Infinity, ease: "linear" }}>✦</motion.div>
          <span className="energy-caption">{t.energyCaption}</span>
        </div>

        <motion.section id="explore" className="explore-section shell section-anchor" aria-labelledby="explore-title" initial={{ opacity: 0, x: -42, y: 20 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.78, ease: "easeOut" }}>
          <div className="explore-heading"><span className="section-kicker"><span>✳</span><span>{t.exploreLabel}</span></span><h2 id="explore-title">{t.exploreTitle}</h2><p>{t.exploreHint}</p></div>
          <div className="explore-links">
            <motion.a className="portal-card portal-edit" href="https://edit.lamquoccuong.com" target="_blank" rel="noreferrer" whileHover={{ y: -8, rotate: -1.5, scale: 1.02 }} whileTap={{ scale: .97 }} animate={{ y: [0, -4, 0] }} transition={{ duration: 3.8, delay: .1, repeat: Infinity, ease: "easeInOut" }}><span>01</span><strong>EDIT</strong><em>{t.visitWork} ↗</em><div className="portal-art" aria-hidden="true"><i /><i /><i /><b>▶</b></div></motion.a>
            <motion.a className="portal-card portal-social" href="https://mxh.lamquoccuong.com" target="_blank" rel="noreferrer" whileHover={{ y: -8, rotate: 1.5, scale: 1.02 }} whileTap={{ scale: .97 }} animate={{ y: [0, -4, 0] }} transition={{ duration: 4.2, delay: .5, repeat: Infinity, ease: "easeInOut" }}><span>02</span><strong>SOCIAL</strong><em>{t.visitSocial} ↗</em><div className="portal-art" aria-hidden="true"><i /><i /><i /><b>+</b></div></motion.a>
            <motion.a className="portal-card portal-bio" href="https://bio.lamquoccuong.com" target="_blank" rel="noreferrer" whileHover={{ y: -8, rotate: -1.5, scale: 1.02 }} whileTap={{ scale: .97 }} animate={{ y: [0, -4, 0] }} transition={{ duration: 4.6, delay: .9, repeat: Infinity, ease: "easeInOut" }}><span>03</span><strong>BIO</strong><em>{t.visitContact} ↗</em><div className="portal-art" aria-hidden="true"><i /><b>☺</b></div></motion.a>
            <motion.a className="portal-card portal-feed" href="https://nuoitoi.lamquoccuong.com" target="_blank" rel="noreferrer" whileHover={{ y: -8, rotate: 1.5, scale: 1.02 }} whileTap={{ scale: .97 }} animate={{ y: [0, -4, 0] }} transition={{ duration: 4, delay: 1.2, repeat: Infinity, ease: "easeInOut" }}><span>04</span><strong>FEED</strong><em>{t.visitSupport} ↗</em><div className="portal-art" aria-hidden="true"><i /><b>♥</b></div></motion.a>
          </div>
        </motion.section>

        <motion.section id="about" className="about-section shell section-anchor" initial={{ opacity: 0, x: 42, y: 20 }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.82, ease: "easeOut" }}>
          <div className="section-kicker"><span>01</span><span>{t.aboutEyebrow}</span></div>
          <div className="about-layout"><h2>{t.aboutTitle}</h2><div className="about-copy"><p>{t.aboutText}</p><p>{t.aboutText2}</p></div></div>
          <motion.div className="fact-card" initial={{ opacity: 0, x: 42, rotate: 7 }} whileInView={{ opacity: 1, x: 0, rotate: 2 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.8, delay: 0.18, ease: "easeOut" }} whileHover={{ y: -8, rotate: -2 }}><span>{t.funFact}</span><strong>“{t.funFactText}”</strong><i>— Cuong, probably</i></motion.div>
        </motion.section>

        <motion.section className="mid-portal shell" aria-label={t.midEyebrow} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.7 }}>
          <div><p className="eyebrow">{t.midEyebrow}</p><h2>{t.midTitle}</h2><p>{t.midText}</p></div>
          <a className="button button-primary" href="#links">{t.midCta} <span>↓</span></a>
        </motion.section>

        <motion.section id="playground" className="playground-section section-anchor" initial={{ opacity: 0, y: 58 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.14 }} transition={{ duration: 0.82, ease: "easeOut" }}><div className="shell"><div className="section-kicker"><span>02</span><span>{t.playgroundEyebrow}</span></div><h2 className="playground-title">{t.playgroundTitle}</h2><div className="skill-grid" id="skills">{t.skills.map(([number, title, text], index) => <motion.article key={number} className={`skill-card skill-card-${index + 1}`} initial={{ opacity: 0, y: 42, rotate: index % 2 ? 3 : -3 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: 0.22 }} whileHover={{ y: -10, rotate: index % 2 ? 1 : -1 }} transition={{ type: "spring", stiffness: 210, damping: 18, delay: index * 0.09 }}><span className="skill-number">{number}</span><span className="skill-arrow">↗</span><h3>{title}</h3><p>{text}</p><div className="skill-blob" aria-hidden="true" /><div className="skill-ring" aria-hidden="true" /><span className="skill-glyph" aria-hidden="true">{["CUT", "MOVE", "3D", "AI"][index]}</span><span className="skill-trail" aria-hidden="true">✦ · ✦ · ✦</span></motion.article>)}</div></div></motion.section>

        <motion.section id="fitness" className="fitness-section shell section-anchor" initial={{ opacity: 0, x: -46 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.82, ease: "easeOut" }}>
          <div className="section-kicker"><span>03</span><span>{t.fitnessEyebrow}</span></div>
          <div className="fitness-layout">
            <div><h2>{t.fitnessTitle}</h2><p className="fitness-text">{t.fitnessText}</p><div className="fitness-tags"><span>CALISTHENICS</span><span>BODYWEIGHT</span><span>NO EXCUSES*</span></div></div>
            <motion.div className="rep-card" initial={{ opacity: 0, x: 48, rotate: 9 }} whileInView={{ opacity: 1, x: 0, rotate: 4 }} viewport={{ once: true, amount: 0.32 }} transition={{ duration: 0.82, delay: 0.14, ease: "easeOut" }} whileHover={{ rotate: 2, scale: 1.02 }}><div className="rep-card-top"><span>{t.repLabel}</span><span>● LIVE-ish</span></div><motion.strong key={reps} initial={{ scale: .65, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}>{reps}</motion.strong><span className="rep-text">{t.repText}</span><div className="rep-actions"><button type="button" className="rep-button" onClick={() => setReps((value) => value + 1)}>{t.repButton}</button><button type="button" className="reset-button" onClick={() => setReps(0)}>{t.reset}</button></div><p>{t.repNote}</p></motion.div>
          </div>
        </motion.section>

        <motion.section id="links" className="links-section section-anchor" initial={{ opacity: 0, x: 48 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.14 }} transition={{ duration: 0.82, ease: "easeOut" }}><div className="shell"><div className="section-kicker"><span>04</span><span>{t.linkEyebrow}</span></div><h2 className="links-title">{t.linkTitle}</h2><div className="link-grid"><motion.a className="link-card link-edit" href="https://edit.lamquoccuong.com" target="_blank" rel="noreferrer" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.6, delay: 0.08 }} whileHover={{ y: -10, rotate: -2 }}><span>01 / {t.products}</span><strong>EDIT<span>↗</span></strong><p>{t.productsText}</p></motion.a><motion.a className="link-card link-mxh" href="https://mxh.lamquoccuong.com" target="_blank" rel="noreferrer" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.6, delay: 0.16 }} whileHover={{ y: -10, rotate: 2 }}><span>02 / {t.social}</span><strong>SOCIAL<span>↗</span></strong><p>{t.socialText}</p></motion.a><motion.a className="link-card link-bio" href="https://bio.lamquoccuong.com" target="_blank" rel="noreferrer" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.6, delay: 0.24 }} whileHover={{ y: -10, rotate: -2 }}><span>03 / {t.contact}</span><strong>BIO<span>↗</span></strong><p>{t.contactText}</p></motion.a><motion.a className="link-card link-support" href="https://nuoitoi.lamquoccuong.com" target="_blank" rel="noreferrer" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.6, delay: 0.32 }} whileHover={{ y: -10, rotate: 2 }}><span>04 / {t.support}</span><strong>{t.supportName}<span>↗</span></strong><p>{t.supportText}</p></motion.a></div></div></motion.section>

        <motion.section id="message" className="message-section shell section-anchor" aria-labelledby="message-title" initial={{ opacity: 0, y: 52 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.82, ease: "easeOut" }}>
          <div className="message-copy"><div className="section-kicker"><span>05</span><span>{t.message.eyebrow}</span></div><h2 id="message-title">{t.message.title}</h2><p>{t.message.text}</p><span className="message-delivery">{t.message.delivery}</span></div>
          <form className="message-form" onSubmit={handleMessageSubmit}>
            <label><span>{t.message.name}</span><input required name="name" value={messageForm.name} onChange={(event) => setMessageForm({ ...messageForm, name: event.target.value })} placeholder={t.message.namePlaceholder} /></label>
            <label><span>{t.message.contact}</span><input name="contact" value={messageForm.contact} onChange={(event) => setMessageForm({ ...messageForm, contact: event.target.value })} placeholder={t.message.contactPlaceholder} /></label>
            <label className="message-field-wide"><span>{t.message.body}</span><textarea required name="message" rows={5} value={messageForm.message} onChange={(event) => setMessageForm({ ...messageForm, message: event.target.value })} placeholder={t.message.bodyPlaceholder} /></label>
            <div className="message-submit-row"><button className="button button-primary" type="submit" disabled={messageState === "sending"}>{messageState === "sending" ? t.message.sending : t.message.submit} <span>↗</span></button><p className={`message-status message-status-${messageState}`} role="status" aria-live="polite">{messageStatus}</p></div>
          </form>
        </motion.section>
      </main>

      <footer className="fun-footer shell"><Link className="brand-mark" href="#top"><span className="brand-dot" /><span>CUONGLQ</span></Link><p>{t.footer}</p><a href="https://bio.lamquoccuong.com" target="_blank" rel="noreferrer">bio.lamquoccuong.com ↗</a></footer>
    </div>
  );
}
