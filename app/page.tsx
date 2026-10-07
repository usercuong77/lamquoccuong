"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { ExperienceLayer } from "@/components/ui/experience-layer";

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
    visitTank: "Play now",
    visitContact: "Find my contact details",
    visitSupport: "Visit Feed Me",
    midEyebrow: "There is more to explore",
    midTitle: "Don’t stop here. The other websites are part of the fun.",
    midText: "One place is for video, one is for my little tank game, one is for contact and one is for... keeping me fed. It is a small internet, but it has a lot going on.",
    midCta: "Explore the other sites",
    badge: "Currently creating",
    badgeText: "visual things & questionable jokes",
    aboutEyebrow: "The serious bit",
    aboutTitle: "Serious about the work. Not always serious about the pose.",
    aboutText: "I’m Lâm Quốc Cường — better known online as Cuonglq. My playground sits at the intersection of video editing, motion graphics, 3D, AI and a mildly dangerous amount of curiosity.",
    aboutText2: "When a project needs focus, I lock in. When a moment needs a joke, I have a few ready. Somewhere between the timeline and the pull-up bar, I’m usually trying to make something better.",
    funFact: "Fun fact",
    funFactText: "I always think I look handsome. The evidence is currently under review.",
    funFactHint: "(tap to verify)",
    playgroundEyebrow: "My playground",
    playgroundTitle: "Things I enjoy making move",
    tankPreviewEyebrow: "A tiny playable detour",
    tankPreviewTitle: "Take the tank for a spin.",
    tankPreviewText: "I built this little 2D battle game myself. Tap the preview and watch it expand into the full-screen battlefield.",
    tankPreviewLoad: "Play full screen",
    tankPreviewHint: "One tap to expand. The demo opens here; the full game is one click away.",
    tankPreviewFull: "Open the full game",
    tankPreviewFrameTitle: "Playable preview of Cuong's Tank Battle 2D game",
    tankFullscreenClose: "Back to page",
    tankFullscreenLoading: "Deploying your tank...",
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
    tank: "Play Tank 2D",
    tankText: "My own little 2D tank game. Pick a tank, jump into battle, and see how long you last.",
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
    visitTank: "Vào chơi ngay",
    visitContact: "Xem thông tin liên hệ",
    visitSupport: "Ghé trang Nuôi Tôi",
    midEyebrow: "Còn nhiều thứ để xem",
    midTitle: "Đừng dừng ở đây. Các website khác cũng là một phần cuộc vui.",
    midText: "Một trang để xem video, một chỗ để chơi game xe tăng mình tự làm, một trang để liên hệ và một trang để... nuôi mình. Internet của mình nhỏ thôi, nhưng cũng lắm trò.",
    midCta: "Xem các trang khác",
    badge: "Đang làm việc",
    badgeText: "video, motion và vài trò nghịch ngợm",
    aboutEyebrow: "Nói nghiêm túc một chút",
    aboutTitle: "Mình nghiêm túc với công việc, nhưng không nghiêm túc khi tạo dáng.",
    aboutText: "Mình là Lâm Quốc Cường, mọi người thường gọi là Cuonglq. Mình làm video và thích khám phá motion graphic, 3D, AI cùng những ý tưởng mới.",
    aboutText2: "Khi làm việc, mình tập trung vào chất lượng. Ngoài giờ làm, mình tập calisthenics, thử công nghệ mới và nghĩ ra những câu đùa không phải lúc nào cũng hay.",
    funFact: "Một sự thật vui",
    funFactText: "Mình luôn thấy mình đẹp trai. Nếu bạn chưa đồng ý thì chắc chúng ta cần nói chuyện thêm.",
    funFactHint: "(bấm để kiểm chứng)",
    playgroundEyebrow: "Mình thích làm",
    playgroundTitle: "Những thứ mình thường làm chuyển động",
    tankPreviewEyebrow: "Rẽ vào chơi một chút",
    tankPreviewTitle: "Thử lái xe tăng nhé.",
    tankPreviewText: "Mình tự làm game xe tăng 2D này. Bấm vào hình xem thử, nó sẽ phóng lớn thành chiến trường toàn màn hình và vào game luôn.",
    tankPreviewLoad: "Chơi toàn màn hình",
    tankPreviewHint: "Bấm một cái để mở rộng. Bản demo chạy ngay tại đây, còn game đầy đủ ở ngay bên cạnh.",
    tankPreviewFull: "Chơi bản đầy đủ",
    tankPreviewFrameTitle: "Bản chơi thử game Tank Battle 2D của Cường",
    tankFullscreenClose: "Về trang cá nhân",
    tankFullscreenLoading: "Đang triển khai xe tăng...",
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
    tank: "Game Tank 2D",
    tankText: "Game xe tăng 2D do mình tự làm. Chọn xe, vào trận rồi xem bạn trụ được bao lâu nhé.",
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

function ScrollWords({ text, className, id }: { text: string; className?: string; id?: string }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.h2 id={id} className={className} aria-label={text}>
      {text.split(/\s+/).map((word, index) => (
        <motion.span
          key={`${index}-${word}`}
          className="scroll-word"
          aria-hidden="true"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18, filter: "blur(5px)" }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.75 }}
          transition={{ duration: 0.48, delay: index * 0.035, ease: "easeOut" }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h2>
  );
}

export default function Home() {
  const { locale, setLocale } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const t = copy[locale];
  const [reps, setReps] = useState(7);
  const tankPosterRef = useRef<HTMLDivElement>(null);
  const [tankFullscreen, setTankFullscreen] = useState<{ left: number; top: number; width: number; height: number; id: number } | null>(null);
  const [tankFullscreenClosing, setTankFullscreenClosing] = useState(false);
  const [tankGameReady, setTankGameReady] = useState(false);
  const [handsomeMode, setHandsomeMode] = useState(false);
  const [easterEgg, setEasterEgg] = useState<{ x: number; y: number; width: number; height: number; id: number } | null>(null);
  const [messageForm, setMessageForm] = useState({ name: "", contact: "", message: "" });
  const [messageState, setMessageState] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    if (!handsomeMode) return;
    const timeout = window.setTimeout(() => {
      setHandsomeMode(false);
      setEasterEgg(null);
    }, prefersReducedMotion ? 850 : 2450);
    return () => window.clearTimeout(timeout);
  }, [handsomeMode, prefersReducedMotion]);

  useEffect(() => {
    if (!tankFullscreen) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = oldOverflow; };
  }, [tankFullscreen]);

  const launchTankFullscreen = () => {
    const bounds = tankPosterRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setTankGameReady(false);
    setTankFullscreenClosing(false);
    setTankFullscreen({ left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height, id: Date.now() });
  };

  const closeTankFullscreen = () => setTankFullscreenClosing(true);

  const triggerHandsomeEgg = (event: React.MouseEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    setHandsomeMode(false);
    window.requestAnimationFrame(() => {
      setHandsomeMode(true);
      setEasterEgg({ x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2, width: window.innerWidth, height: window.innerHeight, id: Date.now() });
    });
  };

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
      <ExperienceLayer />
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
        {tankFullscreen &&
          <motion.div
            key="tank-fullscreen"
            className="tank-fullscreen-overlay"
            initial={{ left: tankFullscreen.left, top: tankFullscreen.top, width: tankFullscreen.width, height: tankFullscreen.height, borderRadius: 24, opacity: .88 }}
            animate={tankFullscreenClosing
              ? { left: tankFullscreen.left, top: tankFullscreen.top, width: tankFullscreen.width, height: tankFullscreen.height, borderRadius: 24, opacity: 0 }
              : { left: 0, top: 0, width: "100vw", height: "100dvh", borderRadius: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 105, damping: 24, mass: .85, opacity: { duration: .72, ease: [0.42, 0, 1, 1] } }}
            onAnimationComplete={() => { if (tankFullscreenClosing) setTankFullscreen(null); }}
            role="dialog"
            aria-modal="true"
            aria-label={t.tankPreviewFrameTitle}
          >
            {!tankGameReady && <div className="tank-fullscreen-loading">{t.tankFullscreenLoading}<span>✦</span></div>}
            <iframe className={`tank-fullscreen-frame${tankGameReady ? " ready" : ""}`} src={`/tank/index.html?preview=1&fullscreen=1&run=${tankFullscreen.id}`} title={t.tankPreviewFrameTitle} allow="fullscreen" onLoad={() => setTankGameReady(true)} />
            <button className="tank-fullscreen-close" type="button" onClick={closeTankFullscreen} aria-label={t.tankFullscreenClose}><span aria-hidden="true">×</span>{t.tankFullscreenClose}</button>
          </motion.div>}
        </AnimatePresence>,
        document.body
      )}
      {easterEgg && <div className={`handsome-burst${prefersReducedMotion ? " reduced" : ""}`} key={easterEgg.id} aria-hidden="true" style={{ "--burst-x": `${easterEgg.x}px`, "--burst-y": `${easterEgg.y}px` } as React.CSSProperties}>
        {!prefersReducedMotion && <motion.div className="handsome-flash" initial={{ opacity: .65, scale: .1 }} animate={{ opacity: 0, scale: 1 }} transition={{ duration: .65, ease: "easeOut" }} />}
        {prefersReducedMotion && Array.from({ length: 36 }, (_, index) => <span key={index} className={`handsome-confetti reduced-piece confetti-${index % 5}`} style={{ left: `${(index * 47 + 8) % 96}vw`, top: `${(index * 67 + 11) % 90}vh` }}>{["✦", "◆", "●", "✳", "★"][index % 5]}</span>)}
        {!prefersReducedMotion && Array.from({ length: 64 }, (_, index) => {
          const angle = (index / 64) * Math.PI * 2 + (index % 3) * .08;
          const distance = Math.max(easterEgg.width, easterEgg.height) * (.35 + (index % 5) * .095);
          return <motion.span key={index} className={`handsome-confetti confetti-${index % 5}`} initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: .2 }} animate={{ opacity: [0, 1, 1, 0], x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, rotate: index % 2 ? 600 : -600, scale: [0, 1.35, 1, .45] }} transition={{ duration: 2.15, delay: (index % 8) * .012, ease: [0.12, 0.72, 0.22, 1] }}>{["✦", "◆", "●", "✳", "★"][index % 5]}</motion.span>;
        })}
        <motion.span className="handsome-shades" style={{ left: easterEgg.x, top: easterEgg.y }} initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: .15, rotate: -70 }} animate={prefersReducedMotion ? { opacity: 1 } : { opacity: [0, 1, 1, 0], scale: [.15, 1.9, 1.55, 1.2], rotate: [-70, 15, -8, 20], y: [0, -24, 0, 80] }} transition={{ duration: 1.9, times: [0, .32, .72, 1], ease: "easeOut" }}>😎</motion.span>
      </div>}
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

        <section id="explore" className="explore-section shell section-anchor" aria-labelledby="explore-title">
          <div className="explore-heading"><motion.div className="section-kicker" initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .45 }}><span>✳</span><span>{t.exploreLabel}</span></motion.div><ScrollWords id="explore-title" text={t.exploreTitle} /><motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .5, delay: .12 }}>{t.exploreHint}</motion.p></div>
          <div className="explore-links">
            <motion.a className="portal-card portal-edit" href="https://edit.lamquoccuong.com" target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 24, rotate: -3 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: .35 }} whileHover={{ y: -8, rotate: -1.5, scale: 1.02 }} whileTap={{ scale: .97 }} transition={{ duration: .55, delay: .04, ease: "easeOut" }}><span>01</span><strong>EDIT</strong><em>{t.visitWork} ↗</em><div className="portal-art" aria-hidden="true"><i /><i /><i /><b>▶</b></div></motion.a>
            <motion.a className="portal-card portal-tank" href="/tank/index.html" initial={{ opacity: 0, y: 24, rotate: 3 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: .35 }} whileHover={{ y: -8, rotate: 1.5, scale: 1.02 }} whileTap={{ scale: .97 }} transition={{ duration: .55, delay: .12, ease: "easeOut" }}><span>02</span><strong>TANK 2D</strong><em>{t.visitTank} ↗</em><div className="portal-art" aria-hidden="true"><i /><i /><i /><b>▰</b></div></motion.a>
            <motion.a className="portal-card portal-bio" href="https://bio.lamquoccuong.com" target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 24, rotate: -3 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: .35 }} whileHover={{ y: -8, rotate: -1.5, scale: 1.02 }} whileTap={{ scale: .97 }} transition={{ duration: .55, delay: .2, ease: "easeOut" }}><span>03</span><strong>BIO</strong><em>{t.visitContact} ↗</em><div className="portal-art" aria-hidden="true"><i /><b>☺</b></div></motion.a>
            <motion.a className="portal-card portal-feed" href="https://nuoitoi.lamquoccuong.com" target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 24, rotate: 3 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: .35 }} whileHover={{ y: -8, rotate: 1.5, scale: 1.02 }} whileTap={{ scale: .97 }} transition={{ duration: .55, delay: .28, ease: "easeOut" }}><span>04</span><strong>FEED</strong><em>{t.visitSupport} ↗</em><div className="portal-art" aria-hidden="true"><i /><b>♥</b></div></motion.a>
          </div>
        </section>

        <section id="about" className="about-section shell section-anchor">
          <motion.div className="section-kicker" initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .45 }}><span>01</span><span>{t.aboutEyebrow}</span></motion.div>
          <div className="about-layout"><ScrollWords text={t.aboutTitle} /><div className="about-copy"><motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .5 }} transition={{ duration: .52 }}>{t.aboutText}</motion.p><motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .5 }} transition={{ duration: .52, delay: .1 }}>{t.aboutText2}</motion.p></div></div>
          <motion.div className={`fact-card${handsomeMode ? " handsome-mode" : ""}`} initial={{ opacity: 0, x: 42, rotate: 7 }} whileInView={{ opacity: 1, x: 0, rotate: 2 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.8, delay: 0.18, ease: "easeOut" }} whileHover={{ y: -8, rotate: -2 }}>
            <span>{t.funFact}</span>
            <button className="handsome-trigger" type="button" onClick={triggerHandsomeEgg} aria-label={`${t.funFactText} ${t.funFactHint}`}>
              “{t.funFactText}” <small>{t.funFactHint}</small>
            </button>
            <i>— Cuong, probably</i>
          </motion.div>
        </section>

        <section className="mid-portal shell" aria-label={t.midEyebrow}>
          <div><motion.p className="eyebrow" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .45 }}>{t.midEyebrow}</motion.p><ScrollWords text={t.midTitle} /><motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .6 }} transition={{ duration: .5, delay: .1 }}>{t.midText}</motion.p></div>
          <motion.a className="button button-primary" href="#links" initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .5, delay: .16 }}>{t.midCta} <span>↓</span></motion.a>
        </section>

        <section id="playground" className="playground-section section-anchor"><div className="shell"><motion.div className="section-kicker" initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .45 }}><span>02</span><span>{t.playgroundEyebrow}</span></motion.div><ScrollWords className="playground-title" text={t.playgroundTitle} /><div className="skill-grid" id="skills">{t.skills.map(([number, title, text], index) => <motion.article key={number} className={`skill-card skill-card-${index + 1}`} initial={{ opacity: 0, y: 34, rotate: index % 2 ? 2 : -2 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: 0.22 }} whileHover={{ y: -10, rotate: index % 2 ? 1 : -1 }} transition={{ type: "spring", stiffness: 210, damping: 18, delay: index * 0.1 }}><span className="skill-number">{number}</span><span className="skill-arrow">↗</span><h3>{title}</h3><p>{text}</p><div className="skill-blob" aria-hidden="true" /><div className="skill-ring" aria-hidden="true" /><span className="skill-glyph" aria-hidden="true">{["CUT", "MOVE", "3D", "AI"][index]}</span><span className="skill-trail" aria-hidden="true">✦ · ✦ · ✦</span></motion.article>)}</div></div></section>

        <section id="tank-preview" className="tank-preview-section shell section-anchor" aria-labelledby="tank-preview-title">
          <div className="tank-preview-copy">
            <motion.div className="section-kicker" initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .45 }}><span>✳</span><span>{t.tankPreviewEyebrow}</span></motion.div>
            <ScrollWords id="tank-preview-title" text={t.tankPreviewTitle} />
            <motion.p initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .5 }} transition={{ duration: .5, delay: .1 }}>{t.tankPreviewText}</motion.p>
            <div className="tank-preview-actions">
              <button className="button button-primary" type="button" onClick={launchTankFullscreen}>{t.tankPreviewLoad} <span>↗</span></button>
              <a className="tank-full-link" href="/tank/index.html" target="_blank" rel="noreferrer">{t.tankPreviewFull} <span>↗</span></a>
            </div>
            <p className="tank-preview-hint">{t.tankPreviewHint}</p>
          </div>
          <motion.div ref={tankPosterRef} className="tank-frame-shell" initial={{ opacity: 0, y: 28, rotate: 1.5 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: .65, delay: .12 }}>
            <button className="tank-frame-placeholder" type="button" onClick={launchTankFullscreen} aria-label={t.tankPreviewLoad}>
              <div className="tank-demo-art" aria-hidden="true"><span className="tank-demo-star">✦</span><span className="tank-demo-shell">•</span><span className="tank-demo-vehicle"><i /><b /></span><span className="tank-demo-target">✹</span><span className="tank-demo-ground" /></div>
              <span className="tank-poster-play" aria-hidden="true">▶</span>
              <span className="tank-frame-label">TANK BATTLE 2D <i>CLICK TO DEPLOY</i></span>
            </button>
            <span className="tank-frame-index" aria-hidden="true">01 / PLAY</span>
          </motion.div>
        </section>

        <section id="fitness" className="fitness-section shell section-anchor">
          <motion.div className="section-kicker" initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .45 }}><span>03</span><span>{t.fitnessEyebrow}</span></motion.div>
          <div className="fitness-layout">
            <div><ScrollWords text={t.fitnessTitle} /><motion.p className="fitness-text" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .5 }} transition={{ duration: .5, delay: .08 }}>{t.fitnessText}</motion.p><motion.div className="fitness-tags" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .8 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: .09 } } }}>{["CALISTHENICS", "BODYWEIGHT", "NO EXCUSES*"].map((tag) => <motion.span key={tag} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} transition={{ duration: .35 }}>{tag}</motion.span>)}</motion.div></div>
            <motion.div className="rep-card" initial={{ opacity: 0, x: 48, rotate: 9 }} whileInView={{ opacity: 1, x: 0, rotate: 4 }} viewport={{ once: true, amount: 0.32 }} transition={{ duration: 0.82, delay: 0.14, ease: "easeOut" }} whileHover={{ rotate: 2, scale: 1.02 }}><div className="rep-card-top"><span>{t.repLabel}</span><span>● LIVE-ish</span></div><motion.strong key={reps} initial={{ scale: .65, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}>{reps}</motion.strong><span className="rep-text">{t.repText}</span><div className="rep-actions"><button type="button" className="rep-button" onClick={() => setReps((value) => value + 1)}>{t.repButton}</button><button type="button" className="reset-button" onClick={() => setReps(0)}>{t.reset}</button></div><p>{t.repNote}</p></motion.div>
          </div>
        </section>

        <section id="links" className="links-section section-anchor" aria-labelledby="links-title">
          <div className="shell">
            <motion.div className="section-kicker" initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .45 }}><span>04</span><span>{t.linkEyebrow}</span></motion.div>
            <ScrollWords id="links-title" className="links-title" text={t.linkTitle} />
            <div className="link-grid">
              <motion.a className="link-card link-edit" href="https://edit.lamquoccuong.com" target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 28, rotate: -2 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .55, delay: .04 }} whileHover={{ y: -10, rotate: -2 }}><span>01 / {t.products}</span><strong>EDIT<span>↗</span></strong><p>{t.productsText}</p></motion.a>
              <motion.a className="link-card link-tank" href="/tank/index.html" initial={{ opacity: 0, y: 28, rotate: 2 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .55, delay: .12 }} whileHover={{ y: -10, rotate: 2 }}><span>02 / {t.tank}</span><strong>TANK 2D<span>↗</span></strong><p>{t.tankText}</p></motion.a>
              <motion.a className="link-card link-bio" href="https://bio.lamquoccuong.com" target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 28, rotate: -2 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .55, delay: .2 }} whileHover={{ y: -10, rotate: -2 }}><span>03 / {t.contact}</span><strong>BIO<span>↗</span></strong><p>{t.contactText}</p></motion.a>
              <motion.a className="link-card link-support" href="https://nuoitoi.lamquoccuong.com" target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 28, rotate: 2 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .55, delay: .28 }} whileHover={{ y: -10, rotate: 2 }}><span>04 / {t.support}</span><strong>{t.supportName}<span>↗</span></strong><p>{t.supportText}</p></motion.a>
            </div>
          </div>
        </section>

        <section id="message" className="message-section shell section-anchor" aria-labelledby="message-title">
          <div className="message-copy"><motion.div className="section-kicker" initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .45 }}><span>05</span><span>{t.message.eyebrow}</span></motion.div><ScrollWords id="message-title" text={t.message.title} /><motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .5 }} transition={{ duration: .5, delay: .12 }}>{t.message.text}</motion.p><motion.span className="message-delivery" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: .5, delay: .18 }}>{t.message.delivery}</motion.span></div>
          <form className="message-form" onSubmit={handleMessageSubmit}>
            <motion.label initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .35 }} transition={{ duration: .42 }}><span>{t.message.name}</span><input required name="name" value={messageForm.name} onChange={(event) => setMessageForm({ ...messageForm, name: event.target.value })} placeholder={t.message.namePlaceholder} /></motion.label>
            <motion.label initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .35 }} transition={{ duration: .42, delay: .08 }}><span>{t.message.contact}</span><input name="contact" value={messageForm.contact} onChange={(event) => setMessageForm({ ...messageForm, contact: event.target.value })} placeholder={t.message.contactPlaceholder} /></motion.label>
            <motion.label className="message-field-wide" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .35 }} transition={{ duration: .42, delay: .16 }}><span>{t.message.body}</span><textarea required name="message" rows={5} value={messageForm.message} onChange={(event) => setMessageForm({ ...messageForm, message: event.target.value })} placeholder={t.message.bodyPlaceholder} /></motion.label>
            <div className="message-submit-row"><motion.button className="button button-primary" type="submit" disabled={messageState === "sending"} initial={{ opacity: 0, scale: .94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: .4, delay: .2 }}>{messageState === "sending" ? t.message.sending : t.message.submit} <span>↗</span></motion.button><p className={`message-status message-status-${messageState}`} role="status" aria-live="polite">{messageStatus}</p></div>
          </form>
        </section>
      </main>

      <footer className="fun-footer shell"><Link className="brand-mark" href="#top"><span className="brand-dot" /><span>CUONGLQ</span></Link><p>{t.footer}</p><a href="https://bio.lamquoccuong.com" target="_blank" rel="noreferrer">bio.lamquoccuong.com ↗</a></footer>
    </div>
  );
}
