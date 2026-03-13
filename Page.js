import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["Services", "Locations", "Gallery", "Contact"];

const SERVICES = [
  {
    title: "Window Tinting",
    sub: "Carbon / Ceramic Series",
    desc: "Block up to 99% of UV rays with industry-leading carbon and ceramic films. Heat rejection, clarity, and lifetime warranty.",
    tag: "Most Popular",
    accent: "#E53935",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth="1.5">
        <rect x="6" y="12" width="36" height="24" rx="3"/>
        <path d="M6 18h36M14 12v24M34 12v24"/>
      </svg>
    ),
  },
  {
    title: "PPF Protection",
    sub: "XPEL Ultimate Plus",
    desc: "Self-healing paint protection film that guards against rock chips, scratches, and road debris. Invisible armor for your investment.",
    tag: "Premium",
    accent: "#E53935",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth="1.5">
        <path d="M24 6L8 14v10c0 10 7 19 16 22 9-3 16-12 16-22V14L24 6z"/>
        <path d="M17 24l5 5 9-9"/>
      </svg>
    ),
  },
  {
    title: "Ceramic Coating",
    sub: "9H Nano-Crystal Formula",
    desc: "Permanent hydrophobic protection with mirror-like gloss enhancement. Say goodbye to swirl marks and contaminants forever.",
    tag: "Best Value",
    accent: "#E53935",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth="1.5">
        <circle cx="24" cy="24" r="16"/>
        <path d="M16 32c4-8 12-8 16 0"/>
        <circle cx="24" cy="20" r="3"/>
      </svg>
    ),
  },
  {
    title: "Vinyl Wraps",
    sub: "Full & Partial Wraps",
    desc: "Transform your vehicle with premium 3M and Avery Dennison films. Matte, satin, chrome, color-shift — the possibilities are endless.",
    tag: "Custom",
    accent: "#E53935",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 32l6-14 10 6 8-12 8 20"/>
        <path d="M6 38h36"/>
        <circle cx="14" cy="18" r="3"/>
      </svg>
    ),
  },
];

const LOCATIONS = [
  { city: "Brampton", address: "123 Queen St W, Brampton, ON", phone: "(905) 555-0101", hours: "Mon–Sat 9am–7pm" },
  { city: "Mississauga", address: "456 Hurontario St, Mississauga, ON", phone: "(905) 555-0202", hours: "Mon–Sat 9am–7pm" },
  { city: "Hamilton", address: "789 King St E, Hamilton, ON", phone: "(905) 555-0303", hours: "Mon–Sat 9am–6pm" },
];

const GALLERY = [
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80",
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80",
  "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=600&q=80",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80",
];

const STATS = [
  { value: "4,200+", label: "Vehicles Completed" },
  { value: "9 Years", label: "In Business" },
  { value: "3", label: "GTA Locations" },
  { value: "99%", label: "5-Star Reviews" },
];

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { role: "ai", text: "👋 Welcome to Car Cafe Canada! I'm your AI styling concierge. Ask me about tinting, PPF, coatings, pricing, or book an appointment." }
  ]);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const chatEndRef = useRef(null);

  const [heroRef, heroIn] = useInView(0.1);
  const [statsRef, statsIn] = useInView(0.2);
  const [servicesRef, servicesIn] = useInView(0.1);
  const [locRef, locIn] = useInView(0.15);
  const [galRef, galIn] = useInView(0.1);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, chatOpen]);

  async function sendChat() {
    if (!chatMsg.trim() || loading) return;
    const userMsg = chatMsg.trim();
    setChatMsg("");
    setChatHistory(h => [...h, { role: "user", text: userMsg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...chatHistory.filter(m => m.role !== "ai").map(m => ({ role: "user", content: m.text })),
            { role: "user", content: userMsg },
          ],
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setChatHistory(h => [...h, { role: "ai", text: data.reply }]);
    } catch {
      setChatHistory(h => [...h, { role: "ai", text: "Sorry, I'm having trouble connecting. Please call us at (905) 555-0101 or visit any location!" }]);
    }
    setLoading(false);
  }

  return (
    <div style={{ fontFamily: "'Barlow', sans-serif", background: "#0a0a0a", color: "#f0f0f0", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600&family=Barlow+Condensed:wght@500;600;700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --red: #E53935;
          --red-dim: #c62828;
          --bg: #0a0a0a;
          --surface: #141414;
          --surface2: #1c1c1c;
          --border: rgba(255,255,255,0.07);
          --text: #f0f0f0;
          --muted: #888;
        }

        html { scroll-behavior: smooth; }

        .condensed { font-family: 'Barlow Condensed', sans-serif; }

        .fade-up {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1);
        }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .fade-up.d1 { transition-delay: 0.1s; }
        .fade-up.d2 { transition-delay: 0.2s; }
        .fade-up.d3 { transition-delay: 0.3s; }
        .fade-up.d4 { transition-delay: 0.4s; }

        .hero-bg {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(229,57,53,0.12) 0%, transparent 50%, rgba(10,10,10,0.9) 100%),
            url('https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1800&q=85') center/cover no-repeat;
        }
        .hero-bg::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.7) 60%, #0a0a0a 100%);
        }

        .accent-line {
          display: inline-block;
          width: 48px; height: 3px;
          background: var(--red);
          margin-bottom: 16px;
        }

        .service-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 2px;
          padding: 32px 28px;
          transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        .service-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--red);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }
        .service-card:hover { transform: translateY(-6px); border-color: rgba(229,57,53,0.3); box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
        .service-card:hover::before { transform: scaleX(1); }

        .tag {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 3px 10px;
          background: rgba(229,57,53,0.15);
          color: var(--red);
          border: 1px solid rgba(229,57,53,0.3);
          border-radius: 2px;
          display: inline-block;
        }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 32px;
          background: var(--red);
          color: white;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: none; cursor: pointer;
          border-radius: 2px;
          transition: background 0.25s, transform 0.2s;
          text-decoration: none;
        }
        .btn-primary:hover { background: var(--red-dim); transform: translateY(-1px); }

        .btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 30px;
          background: transparent;
          color: white;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: 1px solid rgba(255,255,255,0.3); cursor: pointer;
          border-radius: 2px;
          transition: border-color 0.25s, background 0.25s;
          text-decoration: none;
        }
        .btn-outline:hover { border-color: white; background: rgba(255,255,255,0.05); }

        .loc-card {
          border: 1px solid var(--border);
          border-radius: 2px;
          padding: 32px;
          background: var(--surface);
          transition: border-color 0.3s;
        }
        .loc-card:hover { border-color: rgba(229,57,53,0.4); }

        .stat-item { text-align: center; }
        .stat-value {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(40px, 5vw, 64px);
          font-weight: 800;
          color: var(--red);
          line-height: 1;
          letter-spacing: -0.01em;
        }
        .stat-label {
          font-size: 13px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-top: 6px;
        }

        .gallery-item {
          overflow: hidden;
          border-radius: 2px;
          aspect-ratio: 4/3;
          position: relative;
        }
        .gallery-item img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.6s ease;
          filter: brightness(0.85) saturate(0.9);
        }
        .gallery-item:hover img { transform: scale(1.06); filter: brightness(1) saturate(1.1); }
        .gallery-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(229,57,53,0.6) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s;
          display: flex; align-items: flex-end; padding: 16px;
        }
        .gallery-item:hover .gallery-overlay { opacity: 1; }

        .chat-bubble {
          position: fixed; bottom: 28px; right: 28px; z-index: 1000;
          width: 56px; height: 56px;
          background: var(--red);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 24px rgba(229,57,53,0.5);
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .chat-bubble:hover { transform: scale(1.1); box-shadow: 0 6px 32px rgba(229,57,53,0.7); }

        .chat-panel {
          position: fixed; bottom: 96px; right: 28px; z-index: 999;
          width: min(380px, calc(100vw - 40px));
          background: #141414;
          border: 1px solid rgba(229,57,53,0.2);
          border-radius: 4px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.7);
          display: flex; flex-direction: column;
          height: 460px;
          transform-origin: bottom right;
          animation: chatIn 0.25s cubic-bezier(.22,1,.36,1);
        }
        @keyframes chatIn {
          from { opacity: 0; transform: scale(0.9) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .chat-messages {
          flex: 1; overflow-y: auto; padding: 16px;
          display: flex; flex-direction: column; gap: 10px;
          scrollbar-width: thin; scrollbar-color: #333 transparent;
        }
        .chat-msg-ai { align-self: flex-start; max-width: 85%; }
        .chat-msg-user { align-self: flex-end; max-width: 85%; }
        .chat-bubble-msg {
          padding: 10px 14px;
          border-radius: 2px;
          font-size: 13.5px;
          line-height: 1.55;
        }
        .chat-msg-ai .chat-bubble-msg { background: #1e1e1e; color: #e0e0e0; border: 1px solid rgba(255,255,255,0.06); }
        .chat-msg-user .chat-bubble-msg { background: var(--red); color: white; }

        .divider { width: 100%; height: 1px; background: var(--border); }

        .nav-link {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-link:hover { color: white; }

        .section-label {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--red);
          margin-bottom: 8px;
        }

        .noise-overlay {
          position: fixed; inset: 0; pointer-events: none; z-index: 9999;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 150px;
        }

        @media (max-width: 768px) {
          .service-grid { grid-template-columns: 1fr !important; }
          .loc-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-btns { flex-direction: column !important; }
        }
      `}</style>

      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 32px",
        background: scrolled ? "rgba(10,10,10,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        transition: "all 0.4s ease",
        height: "68px",
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", background: "var(--red)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span className="condensed" style={{ fontSize: "14px", fontWeight: 800, color: "white", letterSpacing: "-0.02em" }}>CC</span>
          </div>
          <div>
            <div className="condensed" style={{ fontSize: "16px", fontWeight: 700, letterSpacing: "0.05em", lineHeight: 1 }}>CAR CAFE</div>
            <div style={{ fontSize: "9px", letterSpacing: "0.2em", color: "var(--muted)", textTransform: "uppercase", lineHeight: 1, marginTop: "2px" }}>& INSTA TINTS</div>
          </div>
        </div>

        {/* Desktop nav */}
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }} className="desktop-nav">
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>
          ))}
          <a href="#quote" className="btn-primary" style={{ padding: "10px 24px", fontSize: "13px" }}>Get a Quote</a>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div className="hero-bg" />
        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px", maxWidth: "900px" }}>
          <div className={`fade-up ${heroIn ? "visible" : ""}`}>
            <div className="section-label" style={{ marginBottom: "20px" }}>Car Cafe Canada × Insta Tints</div>
          </div>
          <h1 className={`condensed fade-up ${heroIn ? "visible d1" : ""}`} style={{
            fontSize: "clamp(48px, 9vw, 96px)",
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: "-0.01em",
            marginBottom: "24px",
            textTransform: "uppercase"
          }}>
            GTA's Premier<br />
            <span style={{ color: "var(--red)", position: "relative" }}>
              Auto Styling
              <span style={{ position: "absolute", bottom: "-4px", left: 0, right: 0, height: "3px", background: "var(--red)", opacity: 0.4 }} />
            </span>
            <br />&amp; Protection
          </h1>
          <p className={`fade-up ${heroIn ? "visible d2" : ""}`} style={{
            fontSize: "clamp(15px, 2vw, 18px)",
            color: "rgba(255,255,255,0.65)",
            maxWidth: "560px",
            margin: "0 auto 36px",
            lineHeight: 1.7,
            fontWeight: 300
          }}>
            Window tinting, PPF, ceramic coatings, and vinyl wraps — precision-applied by certified specialists across three GTA locations.
          </p>
          <div className={`fade-up hero-btns ${heroIn ? "visible d3" : ""}`} style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#quote" className="btn-primary">
              Get an Instant Quote
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#services" className="btn-outline">Explore Services</a>
          </div>
          <div className={`fade-up ${heroIn ? "visible d4" : ""}`} style={{ display: "flex", gap: "32px", justifyContent: "center", marginTop: "56px" }}>
            {["XPEL Certified", "3M Authorized", "Lifetime Warranty"].map(b => (
              <div key={b} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--red)" }} />
                {b}
              </div>
            ))}
          </div>
        </div>

        {/* scroll indicator */}
        <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", opacity: 0.4 }}>
          <div style={{ width: "1px", height: "48px", background: "linear-gradient(to bottom, transparent, white)", animation: "pulse 2s infinite" }} />
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} style={{ background: "#0f0f0f", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "48px 32px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px" }}>
            {STATS.map((s, i) => (
              <div key={i} className={`stat-item fade-up ${statsIn ? `visible d${i + 1}` : ""}`}>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" ref={servicesRef} style={{ padding: "100px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className={`fade-up ${servicesIn ? "visible" : ""}`} style={{ marginBottom: "56px" }}>
            <div className="section-label">What We Do</div>
            <div className="accent-line" />
            <h2 className="condensed" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, textTransform: "uppercase", lineHeight: 1, letterSpacing: "-0.01em" }}>
              Protection.<br />Style. Precision.
            </h2>
          </div>

          <div className="service-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1px", background: "var(--border)" }}>
            {SERVICES.map((s, i) => (
              <div key={i} className={`service-card fade-up ${servicesIn ? `visible d${i + 1}` : ""}`} style={{ borderRadius: 0, border: "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <div style={{ color: "var(--red)" }}>{s.icon}</div>
                  <span className="tag">{s.tag}</span>
                </div>
                <h3 className="condensed" style={{ fontSize: "28px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: "4px" }}>{s.title}</h3>
                <div style={{ fontSize: "12px", color: "var(--red)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px", fontWeight: 600 }}>{s.sub}</div>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "24px" }}>{s.desc}</p>
                <a href="#quote" style={{ color: "var(--red)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  Learn More <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY / INSTAGRAM */}
      <section id="gallery" ref={galRef} style={{ padding: "80px 32px", background: "#0a0a0a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className={`fade-up ${galIn ? "visible" : ""}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div className="section-label">Instagram</div>
              <div className="accent-line" />
              <h2 className="condensed" style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, textTransform: "uppercase", lineHeight: 1 }}>Fresh Off<br />The Shop</h2>
            </div>
            <a href="https://instagram.com/insta.tints" target="_blank" rel="noreferrer" className="btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
              @insta.tints
            </a>
          </div>

          <div className="gallery-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
            {GALLERY.map((img, i) => (
              <div key={i} className={`gallery-item fade-up ${galIn ? `visible d${Math.min(i + 1, 4)}` : ""}`}>
                <img src={img} alt={`Car ${i + 1}`} loading="lazy" />
                <div className="gallery-overlay">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section id="locations" ref={locRef} style={{ padding: "100px 32px", background: "#0f0f0f", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className={`fade-up ${locIn ? "visible" : ""}`} style={{ marginBottom: "56px" }}>
            <div className="section-label">Find Us</div>
            <div className="accent-line" />
            <h2 className="condensed" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 800, textTransform: "uppercase", lineHeight: 1 }}>
              Three Locations.<br />One Standard.
            </h2>
          </div>

          <div className="loc-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {LOCATIONS.map((loc, i) => (
              <div key={i} className={`loc-card fade-up ${locIn ? `visible d${i + 1}` : ""}`}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <div style={{ width: "40px", height: "40px", background: "rgba(229,57,53,0.1)", border: "1px solid rgba(229,57,53,0.3)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="1.8"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <h3 className="condensed" style={{ fontSize: "24px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.03em" }}>{loc.city}</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.8" style={{ marginTop: "2px", flexShrink: 0 }}><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/></svg>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{loc.address}</span>
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z"/></svg>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>{loc.phone}</span>
                  </div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>{loc.hours}</span>
                  </div>
                </div>
                <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
                  <a href="#" style={{ color: "var(--red)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    Get Directions <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE CTA */}
      <section id="quote" style={{ padding: "100px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1a0a0a 0%, #0a0a0a 50%, #0f0a0a 100%)" }} />
        <div style={{ position: "absolute", top: "-50%", left: "-20%", width: "80%", height: "200%", background: "radial-gradient(ellipse, rgba(229,57,53,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <div className="section-label">Ready?</div>
          <div className="accent-line" />
          <h2 className="condensed" style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 800, textTransform: "uppercase", lineHeight: 0.95, marginBottom: "20px" }}>
            Start Your<br />
            <span style={{ color: "var(--red)" }}>Transformation</span>
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", marginBottom: "36px", lineHeight: 1.7, fontWeight: 300 }}>
            Get a free, no-obligation quote for any of our services. Our specialists will assess your vehicle and recommend the perfect protection package.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ fontSize: "16px", padding: "16px 40px" }}>Get an Instant Quote</button>
            <a href="tel:9055550101" className="btn-outline">Call Brampton HQ</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#080808", borderTop: "1px solid var(--border)", padding: "40px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div className="condensed" style={{ fontSize: "18px", fontWeight: 700 }}>CAR CAFE CANADA <span style={{ color: "var(--red)" }}>×</span> INSTA TINTS</div>
            <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "4px" }}>© {new Date().getFullYear()} All rights reserved. GTA's Auto Styling Experts.</div>
          </div>
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            {["Privacy", "Terms", "Instagram"].map(l => (
              <a key={l} href="#" style={{ fontSize: "12px", color: "var(--muted)", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase", transition: "color 0.2s" }}
                onMouseOver={e => e.target.style.color = "white"}
                onMouseOut={e => e.target.style.color = "var(--muted)"}>{l}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* CHAT PANEL */}
      {chatOpen && (
        <div className="chat-panel">
          <div style={{ padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4caf50", boxShadow: "0 0 6px #4caf50" }} />
              <span className="condensed" style={{ fontWeight: 700, fontSize: "15px", letterSpacing: "0.05em" }}>AI CONCIERGE</span>
            </div>
            <button onClick={() => setChatOpen(false)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "4px" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <div className="chat-messages">
            {chatHistory.map((m, i) => (
              <div key={i} className={`chat-msg-${m.role}`}>
                <div className="chat-bubble-msg">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg-ai">
                <div className="chat-bubble-msg" style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                  {[0, 1, 2].map(j => (
                    <div key={j} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--muted)", animation: `bounce 1.2s ${j * 0.2}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", gap: "8px" }}>
            <input
              value={chatMsg}
              onChange={e => setChatMsg(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendChat()}
              placeholder="Ask about pricing, services…"
              style={{
                flex: 1, background: "#1e1e1e", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "2px", padding: "10px 14px", color: "white",
                fontSize: "13px", outline: "none",
                fontFamily: "'Barlow', sans-serif"
              }}
            />
            <button onClick={sendChat} className="btn-primary" style={{ padding: "10px 16px", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* CHAT BUBBLE */}
      <div className="chat-bubble" onClick={() => setChatOpen(o => !o)} title="AI Assistant">
        {chatOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
