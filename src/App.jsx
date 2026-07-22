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
