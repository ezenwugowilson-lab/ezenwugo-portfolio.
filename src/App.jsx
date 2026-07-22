import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Menu, X, ArrowRight, ArrowUpRight, Github, ExternalLink, Mail, Phone,
  MapPin, MessageCircle, Instagram, Linkedin, Twitter, CheckCircle2, Star,
  Sparkles, Zap, Smartphone, Layout, Palette, Calendar, RefreshCw,
  Building2, Scissors, Shirt, Code2, Braces, Atom, Wind, Triangle, Send,
} from "lucide-react";

const GOLD = "#D4AF37";
const BG = "#050505";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useScrolled(offset = 30) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);
  return scrolled;
}

function useLoader(duration = 1900) {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(true);
  useEffect(() => {
    const t1 = setTimeout(() => setLoading(false), duration);
    return () => clearTimeout(t1);
  }, [duration]);
  useEffect(() => {
    if (!loading) {
      const t2 = setTimeout(() => setMounted(false), 800);
      return () => clearTimeout(t2);
    }
  }, [loading]);
  return { loading, mounted };
}

function ParticleField({ count = 34 }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: 20 + Math.random() * 80,
        size: 1.5 + Math.random() * 2.5,
        duration: 10 + Math.random() * 14,
        delay: Math.random() * -20,
        dx: (Math.random() - 0.5) * 60,
        pmax: 0.25 + Math.random() * 0.4,
      })),
    [count]
  );
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: GOLD,
            boxShadow: `0 0 6px 1px ${GOLD}`,
            animation: `driftUp ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            ["--dx"]: `${p.dx}px`,
            ["--pmax"]: p.pmax,
          }}
        />
      ))}
    </div>
  );
}

function GlowOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div
        className="absolute rounded-full"
        style={{
          width: 560, height: 560, top: "-10%", left: "-10%",
          background: "radial-gradient(circle, rgba(212,175,55,0.10) 0%, transparent 70%)",
          animation: "glowPulse 9s ease-in-out infinite",
          filter: "blur(20px)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 480, height: 480, top: "40%", right: "-8%",
          background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)",
          animation: "glowPulse 11s ease-in-out infinite 2s",
          filter: "blur(20px)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 420, height: 420, bottom: "-8%", left: "20%",
          background: "radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)",
          animation: "glowPulse 13s ease-in-out infinite 4s",
          filter: "blur(20px)",
        }}
      />
    </div>
  );
}

function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (!window.matchMedia || !window.matchMedia("(pointer: fine)").matches) return;

    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };
    window.addEventListener("mousemove", move);

    let raf;
    const animate = () => {
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const addHover = () => ringRef.current && (ringRef.current.style.width = ringRef.current.style.height = "48px");
    const removeHover = () => ringRef.current && (ringRef.current.style.width = ringRef.current.style.height = "28px");
    const interactive = document.querySelectorAll("a, button, input, textarea, select");
    interactive.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
      interactive.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
    };
  }, []);

  return (
    <div className="hidden md:block">
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[999]"
        style={{ background: GOLD, marginLeft: -3, marginTop: -3 }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[998] border transition-[width,height] duration-200"
        style={{
          width: 28, height: 28, borderColor: "rgba(212,175,55,0.5)",
          marginLeft: -14, marginTop: -14,
        }}
      />
    </div>
  );
}

function LoadingScreen({ loading, mounted }) {
  const [barWidth, setBarWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setBarWidth(100), 80);
    return () => clearTimeout(t);
  }, []);
  if (!mounted) return null;
  return (
    <div
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center transition-opacity duration-700"
      style={{ background: BG, opacity: loading ? 1 : 0, pointerEvents: loading ? "auto" : "none" }}
    >
      <div className="font-display italic text-3xl tracking-wide" style={{ color: "#F5F5F3" }}>
        Ezenwugo<span style={{ color: GOLD }}>.</span>
      </div>
      <div className="w-48 h-px mt-8 overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
        <div
          className="h-full transition-all ease-out"
          style={{ width: `${barWidth}%`, background: GOLD, transitionDuration: "1600ms" }}
        />
      </div>
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase mt-4" style={{ color: "#6E6E68" }}>
        Loading Experience
      </div>
    </div>
  );
}

function Reveal({ children, delay = 0, y = 26, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${inView ? "opacity-100" : "opacity-0"} ${className}`}
      style={{
        transitionDuration: "900ms",
        transitionDelay: `${delay}ms`,
        transform: inView ? "translateY(0px)" : `translateY(${y}px)`,
      }}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <Sparkles size={13} style={{ color: GOLD }} />
      <span className="font-mono text-[11px] tracking-[0.3em] uppercase" style={{ color: GOLD }}>
        {children}
      </span>
    </div>
  );
}

function GoldButton({ children, onClick, href, className = "", target }) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      target={target}
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 font-body text-[13px] font-semibold overflow-hidden rounded-full transition-transform duration-300 hover:scale-[1.03] ${className}`}
      style={{ background: GOLD, color: "#050505" }}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)", backgroundSize: "200% 100%", animation: "shimmer 1.4s linear infinite" }}
      />
    </Tag>
  );
}

function GhostButton({ children, onClick, href, className = "", target }) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      target={target}
      onClick={onClick}
      className={`group inline-flex items-center justify-center gap-2 px-8 py-3.5 font-body text-[13px] font-semibold rounded-full border transition-all duration-300 hover:scale-[1.03] ${className}`}
      style={{ borderColor: "rgba(255,255,255,0.18)", color: "#F5F5F3" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = GOLD)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)")}
    >
      {children}
    </Tag>
  );
}

function SectionHeading({ eyebrow, title, center = true }) {
  return (
    <Reveal className={center ? "text-center max-w-2xl mx-auto mb-16" : "mb-16"}>
      <div className={center ? "flex justify-center" : ""}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <h2
        className="font-display leading-[1.1]"
        style={{ color: "#F5F5F3", fontSize: "clamp(2rem, 4.2vw, 3rem)" }}
      >
        {title}
      </h2>
    </Reveal>
  );
}

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const SERVICES = [
  { icon: Building2, title: "Business Websites", copy: "Polished, credible sites that establish trust from the first scroll and convert visitors into clients." },
  { icon: Shirt, title: "Fashion Websites", copy: "Editorial-grade storefronts and lookbooks built to showcase collections the way they deserve." },
  { icon: Scissors, title: "Salon Websites", copy: "Booking-ready sites with a mood that matches your chair — elegant, warm, effortless to navigate." },
  { icon: Calendar, title: "Event Planning Websites", copy: "Portfolio-driven sites that turn inquiries into signed contracts, with galleries that sell the experience." },
  { icon: Layout, title: "Landing Pages", copy: "Focused, high-conversion single pages built for launches, campaigns, and paid traffic." },
  { icon: RefreshCw, title: "Website Redesign", copy: "A full rebuild of your existing site — faster, sharper, and aligned with where your brand is headed." },
];

const PROJECTS = [
  {
    title: "Goody Fashion & Designer",
    tag: "Fashion / E-Commerce",
    copy: "A full storefront and lookbook redesign for a contemporary fashion label, built around large imagery and a frictionless checkout.",
    tech: ["React", "Tailwind CSS", "TypeScript"],
  },
  {
    title: "Luxury Barber Shop",
    tag: "Salon / Booking",
    copy: "A moody, editorial site for a premium barbershop with live booking, service menus, and a gallery of finished cuts.",
    tech: ["React", "Tailwind CSS", "Vercel"],
  },
  {
    title: "Event Planning Website",
    tag: "Events",
    copy: "A portfolio-first site for a boutique event studio, designed to turn browsing couples and corporate clients into consultations.",
    tech: ["React", "JavaScript", "CSS"],
  },
  {
    title: "Restaurant Website",
    tag: "Hospitality",
    copy: "A fast, appetite-driven site with an interactive menu, reservation flow, and location details built for mobile-first diners.",
    tech: ["React", "Tailwind CSS", "GitHub"],
  },
];

const SKILLS = [
  { icon: Code2, label: "HTML" },
  { icon: Palette, label: "CSS" },
  { icon: Braces, label: "JavaScript" },
  { icon: Atom, label: "React" },
  { icon: Wind, label: "Tailwind CSS" },
  { icon: Github, label: "GitHub" },
  { icon: Triangle, label: "Vercel" },
  { icon: Smartphone, label: "Responsive Design" },
];

const WHY_CHOOSE = [
  { icon: Sparkles, title: "Modern Designs", copy: "Every layout is built fresh for your brand — never a recycled template." },
  { icon: Zap, title: "Fast Loading", copy: "Optimized code and assets so your site feels instant on any connection." },
  { icon: Smartphone, title: "Mobile Responsive", copy: "Flawless on phone, tablet, and desktop — where most of your customers are." },
  { icon: Layout, title: "Clean UI / UX", copy: "Interfaces designed around how people actually browse and decide to buy." },
  { icon: CheckCircle2, title: "Reliable Support", copy: "Clear communication during the build, and support after launch when you need it." },
];

const TESTIMONIALS = [
  { quote: "Our new site finally looks as premium as our product. Bookings from the website alone doubled in the first month.", name: "Amara Chukwu", role: "Founder, Noir & Co. Salon" },
  { quote: "Wilson understood exactly what a fashion brand needed — elegant, fast, and effortless to shop from a phone.", name: "Sofia Herrera", role: "Creative Director, Goody Fashion" },
  { quote: "Professional from the first call to launch day. The site is fast, beautiful, and it just works.", name: "Daniel Okafor", role: "Owner, Everwood Restaurant" },
];

function Nav({ menuOpen, setMenuOpen }) {
  const scrolled = useScrolled(20);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 pt-4">
      <div
        className="max-w-6xl mx-auto flex items-center justify-between h-16 px-5 md:px-7 rounded-full transition-all duration-500"
        style={{
          background: scrolled ? "rgba(10,10,10,0.55)" : "rgba(10,10,10,0.25)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: scrolled ? "0 8px 30px rgba(0,0,0,0.35)" : "none",
        }}
      >
        <a href="#home" className="font-display text-lg tracking-tight" style={{ color: "#F5F5F3" }}>
          Ezenwugo<span style={{ color: GOLD }}>.</span>
        </a>

        <nav className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-body text-[13px] transition-colors duration-300"
              style={{ color: "#C9C9C4" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#C9C9C4")}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <GoldButton href="#contact" className="hidden md:inline-flex !py-2.5 !px-6 text-[12px]">
          Hire Me
        </GoldButton>

        <button className="md:hidden" style={{ color: "#F5F5F3" }} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className="md:hidden max-w-6xl mx-auto overflow-hidden transition-all duration-500 rounded-3xl mt-2"
        style={{
          maxHeight: menuOpen ? "340px" : "0px",
          background: "rgba(10,10,10,0.75)",
          backdropFilter: "blur(18px)",
          border: menuOpen ? "1px solid rgba(255,255,255,0.08)" : "none",
        }}
      >
        <div className="flex flex-col px-6 py-6 gap-5">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className="font-body text-sm" style={{ color: "#F5F5F3" }}>
              {l.label}
            </a>
          ))}
          <GoldButton href="#contact" onClick={() => setMenuOpen(false)} className="justify-center mt-1">
            Hire Me
          </GoldButton>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto text-center pt-28">
        <Reveal>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8" style={{ border: "1px solid rgba(212,175,55,0.35)", background: "rgba(212,175,55,0.06)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
            <span className="font-mono text-[11px] tracking-[0.2em] uppercase" style={{ color: GOLD }}>
              Available for New Projects
            </span>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="font-display leading-[0.98]" style={{ color: "#F5F5F3", fontSize: "clamp(2.6rem, 8vw, 5.2rem)", fontWeight: 700 }}>
            Ezenwugo Wilson
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="font-mono text-[13px] tracking-[0.25em] uppercase mt-5" style={{ color: GOLD }}>
            Web Designer &amp; Frontend Developer
          </p>
        </Reveal>

        <Reveal delay={300}>
          <p className="font-display mt-8" style={{ color: "#EDEDEA", fontSize: "clamp(1.3rem, 3vw, 1.9rem)", fontWeight: 500, lineHeight: 1.25 }}>
            I Build Premium Websites That Help Businesses Grow.
          </p>
        </Reveal>

        <Reveal delay={400}>
          <p className="font-body max-w-xl mx-auto mt-6 text-[15px] leading-relaxed" style={{ color: "#8C8C86" }}>
            I design beautiful, modern, and high-performing websites for
            fashion brands, salons, event planners, restaurants, hotels, and
            businesses that want a strong online presence.
          </p>
        </Reveal>

        <Reveal delay={500}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-11">
            <GoldButton href="#contact">
              Hire Me <ArrowRight size={15} />
            </GoldButton>
            <GhostButton href="#contact">Contact Me</GhostButton>
          </div>
        </Reveal>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2" style={{ animation: "floatY 3.5s ease-in-out infinite" }}>
        <div className="w-5 h-8 rounded-full border flex items-start justify-center pt-1.5" style={{ borderColor: "rgba(255,255,255,0.25)" }}>
          <div className="w-1 h-1.5 rounded-full" style={{ background: GOLD }} />
        </div>
      </div>
    </section>
  );
}

function About() {
  const points = ["Quality-first builds", "Performance obsessed", "Fully responsive", "Human-centered UX"];
  return (
    <section id="about" className="relative py-28 md:py-36 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <Reveal>
          <div className="relative w-full max-w-md mx-auto md:mx-0" style={{ animation: "floatY 7s ease-in-out infinite" }}>
            <div
              className="relative aspect-[4/5] rounded-3xl overflow-hidden flex items-center justify-center"
              style={{ background: "linear-gradient(160deg, #121210 0%, #050505 100%)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div
                className="absolute w-48 h-48 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%)", filter: "blur(10px)" }}
              />
              <span className="font-display text-5xl relative z-10" style={{ color: "rgba(212,175,55,0.5)" }}>
                EW
              </span>
              <span className="absolute bottom-5 left-5 font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: "#5A5A55" }}>
                Profile Portrait
              </span>
            </div>
            <div
              className="absolute -bottom-5 -right-5 w-24 h-24 rounded-2xl flex items-center justify-center"
              style={{ background: GOLD, color: "#050505" }}
            >
              <div className="text-center leading-none">
                <div className="font-display text-2xl font-bold">30+</div>
                <div className="font-mono text-[9px] tracking-[0.1em] uppercase mt-1">Projects</div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <Eyebrow>About Me</Eyebrow>
          <h2 className="font-display leading-tight mb-6" style={{ color: "#F5F5F3", fontSize: "clamp(2rem, 4vw, 2.8rem)" }}>
            Building Websites That Feel As Premium As Your Brand
          </h2>
          <p className="font-body text-[15px] leading-relaxed mb-4" style={{ color: "#8C8C86" }}>
            I'm Ezenwugo Wilson, a web designer and frontend developer
            focused on one thing: building modern websites that businesses
            are proud to send their customers to.
          </p>
          <p className="font-body text-[15px] leading-relaxed mb-8" style={{ color: "#8C8C86" }}>
            Every project is built around quality, speed, responsiveness, and
            genuine user experience — clean code underneath a design that
            feels considered on every screen size.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {points.map((p) => (
              <div key={p} className="flex items-center gap-2.5">
                <CheckCircle2 size={16} style={{ color: GOLD }} />
                <span className="font-body text-[13.5px]" style={{ color: "#C9C9C4" }}>{p}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function GlassCard({ children, className = "", hoverGlow = true }) {
  return (
    <div
      className={`group relative rounded-2xl p-8 transition-all duration-500 ${className}`}
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)";
        e.currentTarget.style.transform = "translateY(-6px)";
        if (hoverGlow) e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,55,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {children}
    </div>
  );
}

function Services() {
  return (
    <section id="services" className="relative py-28 md:py-36 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="My Services" title="Crafted for Businesses That Sell an Experience" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={i * 80}>
                <GlassCard>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110"
                    style={{ background: "rgba(212,175,55,0.1)" }}
                  >
                    <Icon size={20} style={{ color: GOLD }} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-xl mb-2.5" style={{ color: "#F5F5F3" }}>{s.title}</h3>
                  <p className="font-body text-[13.5px] leading-relaxed" style={{ color: "#8C8C86" }}>{s.copy}</p>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ p, i }) {
  return (
    <Reveal delay={i * 100}>
      <div
        className="group relative rounded-3xl overflow-hidden transition-all duration-500"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div
          className="relative aspect-[16/10] overflow-hidden flex items-center justify-center"
          style={{ background: "linear-gradient(150deg, #131210 0%, #050505 100%)" }}
        >
          <div className="absolute top-4 left-4 flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#4A4A45" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#4A4A45" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#4A4A45" }} />
          </div>
          <span
            className="font-display text-6xl transition-transform duration-700 group-hover:scale-105"
            style={{ color: "rgba(255,255,255,0.06)" }}
          >
            {p.title.split(" ")[0]}
          </span>
          <div
            className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: "rgba(5,5,5,0.65)" }}
          >
            <GoldButton href="#" target="_blank" className="!py-2.5 !px-5 text-[11px]">
              Live Demo <ExternalLink size={12} />
            </GoldButton>
            <GhostButton href="#" target="_blank" className="!py-2.5 !px-5 text-[11px] !bg-black/30">
              <Github size={13} /> GitHub
            </GhostButton>
          </div>
        </div>

        <div className="p-8">
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: GOLD }}>{p.tag}</span>
          <h3 className="font-display text-2xl mt-2 mb-3" style={{ color: "#F5F5F3" }}>{p.title}</h3>
          <p className="font-body text-[13.5px] leading-relaxed mb-5" style={{ color: "#8C8C86" }}>{p.copy}</p>
          <div className="flex flex-wrap gap-2">
            {p.tech.map((t) => (
              <span key={t} className="font-mono text-[10.5px] px-3 py-1.5 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#C9C9C4" }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function Projects() {
  return (
    <section id="projects" className="relative py-28 md:py-36 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Featured Projects" title="Selected Work" />
        <div className="grid sm:grid-cols-2 gap-8">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} p={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="relative py-28 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Skills" title="Tools I Build With" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {SKILLS.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.label} delay={i * 60}>
                <GlassCard className="text-center py-9">
                  <Icon
                    size={26}
                    strokeWidth={1.4}
                    className="mx-auto mb-4 transition-transform duration-500 group-hover:-translate-y-1"
                    style={{ color: GOLD }}
                  />
                  <div className="font-body text-[13px]" style={{ color: "#C9C9C4" }}>{s.label}</div>
                </GlassCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WhyChooseMe() {
  return (
    <section className="relative py-28 md:py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <SectionHeading eyebrow="Why Choose Me" title="A Website Built to Perform, Not Just Look Good" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {WHY_CHOOSE.map((w, i) => {
            const Icon = w.icon;
            return (
              <Reveal key={w.title} delay={i * 80}>
                <div className="text-center sm:text-left">
                  <Icon size={22} style={{ color: GOLD }} strokeWidth={1.5} className="mx-auto sm:mx-0 mb-4" />
                  <h4 className="font-display text-base mb-2" style={{ color: "#F5F5F3" }}>{w.title}</h4>
                  <p className="font-body text-[12.5px] leading-relaxed" style={{ color: "#8C8C86" }}>{w.copy}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="relative py-28 md:py-36 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading eyebrow="Testimonials" title="What Clients Say" />
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 100}>
              <GlassCard hoverGlow={false} className="h-full flex flex-col">
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} size={13} fill={GOLD} style={{ color: GOLD }} />
                  ))}
                </div>
                <p className="font-body text-[14px] leading-relaxed mb-7 flex-1" style={{ color: "#C9C9C4" }}>
                  "{t.quote}"
                </p>
                <div>
                  <div className="font-display text-[15px]" style={{ color: "#F5F5F3" }}>{t.name}</div>
                  <div className="font-mono text-[11px] mt-0.5" style={{ color: "#6E6E68" }}>{t.role}</div>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const fieldStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#F5F5F3",
};

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="font-mono text-[10.5px] tracking-[0.15em] uppercase block mb-2" style={{ color: "#8C8C86" }}>
        {label}
      </span>
      {React.cloneElement(children, {
        className: `${children.props.className || ""} w-full px-4 py-3 rounded-xl font-body text-sm outline-none transition-colors duration-300 focus:!border-[#D4AF37]`,
      })}
    </label>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!form.name || !form.email || !form.message) return;

      const text =
        `Hello, my name is ${form.name}.\n\n` +
        `Email: ${form.email}\n` +
        `Phone: ${form.phone || "Not provided"}\n\n` +
        `Message: ${form.message}`;

      const waUrl = `https://wa.me/2348140370092?text=${encodeURIComponent(text)}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");
      setSent(true);
    },
    [form]
  );

  const infoItems = [
    { icon: Mail, label: "Email", value: "ezenwugowilson@gmail.com" },
    { icon: Phone, label: "Phone", value: "0814 037 0092" },
    { icon: MapPin, label: "Location", value: "Enugu, Nigeria — Remote Worldwide" },
  ];

  return (
    <section id="contact" className="relative py-28 md:py-36 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-14">
        <div className="lg:col-span-2">
          <Reveal>
            <Eyebrow>Contact</Eyebrow>
            <h2 className="font-display leading-tight mb-6" style={{ color: "#F5F5F3", fontSize: "clamp(2rem, 4vw, 2.6rem)" }}>
              Let's Build Something Unforgettable
            </h2>
            <p className="font-body text-[14.5px] leading-relaxed mb-10" style={{ color: "#8C8C86" }}>
              Tell me about your business and what you need — I typically
              reply within 24 hours with next steps.
            </p>

            <div className="space-y-5 mb-10">
              {infoItems.map((it) => {
                const Icon = it.icon;
                return (
                  <div key={it.label} className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(212,175,55,0.1)" }}>
                      <Icon size={16} style={{ color: GOLD }} />
                    </div>
                    <div>
                      <div className="font-mono text-[10px] tracking-[0.15em] uppercase" style={{ color: "#6E6E68" }}>{it.label}</div>
                      <div className="font-body text-[14px]" style={{ color: "#F5F5F3" }}>{it.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <GoldButton href="https://wa.me/2348140370092" target="_blank">
              <MessageCircle size={15} /> Chat on WhatsApp
            </GoldButton>
          </Reveal>
        </div>

        <div className="lg:col-span-3">
          <Reveal delay={100}>
            {sent ? (
              <div className="flex flex-col items-center justify-center text-center py-24 px-6 rounded-2xl" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                <MessageCircle size={34} style={{ color: GOLD }} />
                <p className="font-display text-2xl mt-5" style={{ color: "#F5F5F3" }}>Opening WhatsApp…</p>
                <p className="font-body text-[13.5px] mt-2 max-w-xs" style={{ color: "#8C8C86" }}>
                  Thank you, {form.name.split(" ")[0]}. A new tab should have opened with your
                  message ready to send. If it didn't, tap the button below.
                </p>
                <GhostButton
                  href={`https://wa.me/2348140370092?text=${encodeURIComponent(
                    `Hello, my name is ${form.name}.\n\nEmail: ${form.email}\nPhone: ${form.phone || "Not provided"}\n\nMessage: ${form.message}`
                  )}`}
                  target="_blank"
                  className="mt-6"
                >
                  Open WhatsApp <ArrowUpRight size={14} />
                </GhostButton>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <Field label="Full Name">
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={fieldStyle} placeholder="Jane Doe" />
                  </Field>
                  <Field label="Email">
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required style={fieldStyle} placeholder="jane@brand.com" />
                  </Field>
                </div>
                <Field label="Phone">
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={fieldStyle} placeholder="+1 (000) 000-0000" />
                </Field>
                <Field label="Message">
                  <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={5} style={fieldStyle} className="resize-none" placeholder="Tell me about your business and what you're looking for..." />
                </Field>
                <GoldButton className="w-full">
                  Send Message via WhatsApp <Send size={14} />
                </GoldButton>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/2348140370092"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110"
      style={{ background: GOLD, boxShadow: "0 8px 24px rgba(212,175,55,0.35)" }}
    >
      <MessageCircle size={24} style={{ color: "#050505" }} />
    </a>
  );
}

function Footer() {
  const socials = [Instagram, Linkedin, Github, Twitter];
  return (
    <footer className="relative pt-20 pb-10 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="font-display text-lg" style={{ color: "#F5F5F3" }}>
          Ezenwugo<span style={{ color: GOLD }}>.</span>
        </div>
        <p className="font-body text-[12px] order-3 md:order-2" style={{ color: "#6E6E68" }}>
          © {new Date().getFullYear()} Ezenwugo Wilson. All rights reserved.
        </p>
        <div className="flex items-center gap-3 order-2 md:order-3">
          {socials.map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: "#8C8C86" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#8C8C86"; }}
            >
              <Icon size={15} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { loading, mounted } = useLoader();

  return (
    <div className="font-body relative cursor-none-desktop" style={{ background: BG, minHeight: "100vh" }}>
      <LoadingScreen loading={loading} mounted={mounted} />
      <CustomCursor />
      <GlowOrbs />
      <ParticleField />

      <div className="relative z-10">
        <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <Hero />
        <About />
        <Services />
        <Projects />
        <Skills />
        <WhyChooseMe />
        <Testimonials />
        <Contact />
        <Footer />
      </div>

      <WhatsAppButton />
    </div>
  );
}
