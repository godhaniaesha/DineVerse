import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiAward,
  FiHeart,
  FiUsers,
  FiStar,
  FiChevronDown,
  FiCoffee,
  FiZap,
} from "react-icons/fi";
import {
  GiWineGlass,
  GiKnifeFork,
  GiCoffeeCup,
  GiVineLeaf,
  GiCook,
  GiLaurelCrown,
} from "react-icons/gi";
import {
  TbSparkles,
  TbChefHat,
  TbFlame,
  TbQuote,
  TbBuildingStore,
  TbStar,
} from "react-icons/tb";
import { MdOutlineLocalBar } from "react-icons/md";

/* ══════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════ */

const TIMELINE = [
  {
    year: "2019",
    quarter: "Q1 — March",
    color: "var(--d-restaurant)",
    dim: "var(--d-restaurant-dim)",
    icon: <TbBuildingStore />,
    title: "Three Doors. One Obsession.",
    body: "On a sun-drenched March morning in Surat's Vesu district, DineVerse opened its doors simultaneously as a fine-dining restaurant, a craft cocktail bar, and a neighbourhood café. The premise was audacious — to run three distinct world-class experiences under one roof without compromising any of them.",
    detail: "64 restaurant covers · 36 bar seats · 28 café seats",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=85",
    stat: { value: "128", label: "Opening Night Guests" },
  },
  {
    year: "2019",
    quarter: "Q4 — November",
    color: "var(--d-gold)",
    dim: "var(--d-gold-subtle)",
    icon: <TbChefHat />,
    title: "The First Chef's Table",
    body: "Eight courses. Fourteen guests. A dining room that fell silent between every plate. Arjun Mehta's inaugural chef's table was a manifesto — classical French technique dismantled and rebuilt with Indian flavour memory at its core. It received its first standing ovation that evening.",
    detail:
      "8-course tasting menu · Hand-foraged ingredients · 4-hour experience",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85",
    stat: { value: "4.9★", label: "Average Rating" },
  },
  {
    year: "2020",
    quarter: "Q2 — April",
    color: "var(--d-bar)",
    dim: "var(--d-bar-dim)",
    icon: <FiZap />,
    title: "Surviving the Shutdown",
    body: "The pandemic closed our doors for four months. Rather than pause, we launched DineVerse at Home — curated mise en place kits, video guides filmed in our empty restaurant, and handwritten notes from every chef. Eight hundred families cooked with us through the lockdown.",
    detail: "800 households served · Zero staff laid off · Pivoted in 11 days",
    img: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=900&q=85",
    stat: { value: "800", label: "Families Fed" },
  },
  {
    year: "2021",
    quarter: "Q1 — February",
    color: "var(--d-gold)",
    dim: "var(--d-gold-subtle)",
    icon: <GiLaurelCrown />,
    title: "Best New Restaurant in Gujarat",
    body: "The Gujarat Culinary Guild named DineVerse 'Best New Restaurant' — remarkable for an establishment just two years old, competing against institutions that had earned their reputations over decades. We celebrated the only way we know: a 12-course dinner for our entire team.",
    detail: "Gujarat Culinary Guild Award · 2021 · All three venues recognised",
    img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=900&q=85",
    stat: { value: "#1", label: "Gujarat Culinary Guild" },
  },
  {
    year: "2022",
    quarter: "Q1 — January",
    color: "var(--d-bar)",
    dim: "var(--d-bar-dim)",
    icon: <GiWineGlass />,
    title: "Leila & The Bar Reborn",
    body: "Leila Nair — World Cocktail Champion 2022 — joined as Head Mixologist. The Midnight Empress debuted: a butterfly-pea gin cocktail that shifts colour as you drink it. Within three months the bar had a waitlist. Within six, it was a destination for guests flying in from Mumbai and Bengaluru.",
    detail:
      "Midnight Empress viral · Bar fully booked Fri–Sat · 3 national awards",
    img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=900&q=85",
    stat: { value: "3", label: "National Bar Awards" },
  },
  {
    year: "2023",
    quarter: "Q1 — March",
    color: "var(--d-cafe)",
    dim: "var(--d-cafe-dim)",
    icon: <GiCoffeeCup />,
    title: "Expansion & The Pastry Kitchen",
    body: "We added a private dining suite seating 18, a rooftop terrace for sundowners, and — most crucially — a dedicated pastry kitchen. Rohan Shah joined from Copenhagen. His cardamom croissant created Surat's first pastry waitlist. The city had not seen this before.",
    detail:
      "Private suite · Rooftop terrace · Pastry kitchen · Croissant waitlist",
    img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=900&q=85",
    stat: { value: "6hr", label: "Average Croissant Queue" },
  },
  {
    year: "2024",
    quarter: "Q2 — Present",
    color: "var(--d-gold)",
    dim: "var(--d-gold-subtle)",
    icon: <TbStar />,
    title: "12,000 Guests. Still Counting.",
    body: "Five years in, DineVerse has hosted over 12,000 guests. A Michelin Guide inspector has visited twice — we noticed both times. We still write handwritten birthday notes for every celebration booking. The croissant waitlist is now two weeks long. We are proud of every single day.",
    detail: "12,000+ guests · 7 awards · Michelin Guide noted · Est. 2019",
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=85",
    stat: { value: "12K+", label: "Happy Guests" },
  },
];

const VALUES = [
  {
    icon: <TbChefHat />,
    accent: "var(--d-restaurant)",
    title: "Craft Without Compromise",
    body: "Every decision — from rice variety to gin botanical — is made with obsessive intention. We never choose convenience over quality.",
  },
  {
    icon: <FiHeart />,
    accent: "var(--d-gold)",
    title: "Hospitality as Love",
    body: "We train our team in human perception — how to read a table, how to anticipate, how to make guests feel genuinely seen.",
  },
  {
    icon: <GiVineLeaf />,
    accent: "var(--d-cafe)",
    title: "Roots & Memory",
    body: "Indian food carries memory. We cook with one foot in classical tradition, one in India's extraordinary diversity of flavour.",
  },
  {
    icon: <TbSparkles />,
    accent: "var(--d-bar)",
    title: "The Unhurried Moment",
    body: "Our spaces, pacing, and music are calibrated to slow time down. The best things in hospitality cannot be rushed.",
  },
];

/* ══════════════════════════════════════════════════════
   HOOKS
══════════════════════════════════════════════════════ */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useCountUp(target, inView, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const isNum = !isNaN(parseFloat(target));
    if (!isNum) {
      setCount(target);
      return;
    }
    const num = parseFloat(target);
    const start = performance.now();
    const raf = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * num));
      if (progress < 1) requestAnimationFrame(raf);
      else setCount(num);
    };
    requestAnimationFrame(raf);
  }, [inView, target, duration]);
  return count;
}

/* ══════════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════════ */

/* Parallax grain overlay */
function GrainLayer({ opacity = 0.04 }) {
  return (
    <div
      className="x_grain"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='${opacity}'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

/* Stat card with count-up */
function StatCard({ icon, value, label, delay }) {
  const [ref, inView] = useInView(0.2);
  const isNumber =
    !isNaN(parseFloat(value)) &&
    !value.includes("K") &&
    !value.includes("★") &&
    !value.includes("yr");
  const count = useCountUp(isNumber ? parseFloat(value) : 0, inView);

  return (
    <div
      ref={ref}
      className="x_stat_card"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(24px)",
        transition: `opacity 0.6s var(--d-ease) ${delay}s, transform 0.6s var(--d-ease) ${delay}s`,
      }}
    >
      <span className="x_stat_icon">{icon}</span>
      <span className="x_stat_value">
        {isNumber ? count + (value.includes("+") ? "+" : "") : value}
      </span>
      <span className="x_stat_label">{label}</span>
    </div>
  );
}

/* Timeline card */
function TimelineCard({ item, index }) {
  const [ref, inView] = useInView(0.1);
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`x_tl_card${isEven ? "" : " x_tl_card--rev"}${inView ? " x_tl_card--visible" : ""}`}
      style={{
        "--tc": item.color,
        "--td": item.dim,
        transitionDelay: `${index * 0.05}s`,
      }}
    >
      {/* Image column */}
      <div className="x_tl_img_col">
        <div className="x_tl_img_frame">
          <img
            src={item.img}
            alt={item.title}
            className="x_tl_img"
            loading="lazy"
          />
          <div className="x_tl_img_color_wash" />
          <div className="x_tl_img_grad" />

          {/* floating stat */}
          <div className="x_tl_stat_bubble">
            <span className="x_tl_stat_value">{item.stat.value}</span>
            <span className="x_tl_stat_label">{item.stat.label}</span>
          </div>

          {/* quarter badge */}
          <span className="x_tl_quarter">{item.quarter}</span>
        </div>
      </div>

      {/* Content column */}
      <div className="x_tl_body">
        <div className="x_tl_icon_wrap">{item.icon}</div>
        <div className="x_tl_year_badge">{item.year}</div>
        <h3 className="x_tl_title">{item.title}</h3>
        <p className="x_tl_body_text">{item.body}</p>
        <div className="x_tl_detail">
          <span className="x_tl_detail_dot" />
          {item.detail}
        </div>
        <div className="x_tl_accent_bar" />
      </div>
    </div>
  );
}

/* Value card */
function ValueCard({ value, delay }) {
  const [ref, inView] = useInView(0.15);
  return (
    <div
      ref={ref}
      className="x_value_card"
      style={{
        "--ac": value.accent,
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(28px)",
        transition: `opacity 0.6s var(--d-ease) ${delay}s, transform 0.6s var(--d-ease) ${delay}s`,
      }}
    >
      <div className="x_value_icon_wrap">{value.icon}</div>
      <h4 className="x_value_title">{value.title}</h4>
      <p className="x_value_body">{value.body}</p>
      <div className="x_value_shimmer" />
    </div>
  );
}

/* Team card */
function TeamCard({ member, delay }) {
  const [ref, inView] = useInView(0.12);
  return (
    <div
      ref={ref}
      className="x_team_card"
      style={{
        "--ac": member.accent,
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(32px)",
        transition: `opacity 0.65s var(--d-ease) ${delay}s, transform 0.65s var(--d-ease) ${delay}s`,
      }}
    >
      <div className="x_team_img_wrap">
        <img
          src={member.img}
          alt={member.name}
          className="x_team_img"
          loading="lazy"
        />
        <div className="x_team_img_overlay" />
        <div className="x_team_accent_bar" />
      </div>
      <div className="x_team_body">
        <h4 className="x_team_name">{member.name}</h4>
        <span className="x_team_role">{member.role}</span>
        <p className="x_team_bio">{member.bio}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
export default function OurHistory() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeYear, setActiveYear] = useState("2019");
  const navRef = useRef(null);

  // Hero entrance
  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Parallax scroll
  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Active year tracking
  useEffect(() => {
    const years = ["2019", "2020", "2021", "2022", "2023", "2024"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveYear(e.target.dataset.year);
        });
      },
      { threshold: 0.3 },
    );
    years.forEach((y) => {
      const el = document.getElementById(`x_year_anchor_${y}`);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollToYear = (year) => {
    const el = document.getElementById(`x_year_anchor_${year}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const years = [...new Set(TIMELINE.map((t) => t.year))];

  return (
    <div className="x_history_wrapper">
      {/* ══ HERO ══ */}
      <section className="x_hero">
        <GrainLayer opacity={0.045} />
        <div className="x_hero_bg_mesh" />
        <div className="x_hero_radial_top" />
        <div className="x_hero_radial_bot" />

        {/* Parallax background year */}
        <div
          className="x_hero_bg_year"
          style={{
            transform: `translateX(-50%) translateY(${scrollY * 0.25}px)`,
          }}
        >
          2019
        </div>

        {/* Animated diagonal lines */}
        <div className="x_hero_lines" aria-hidden="true">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="x_hero_line"
              style={{
                left: `${6 + i * 12.5}%`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>

        {/* Floating orbs */}
        <div className="x_orb x_orb--gold" />
        <div className="x_orb x_orb--bar" />
        <div className="x_orb x_orb--cafe" />

        {/* Hero content */}
        <div
          className="x_hero_content"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "none" : "translateY(36px)",
            transition: "opacity 1s var(--d-ease), transform 1s var(--d-ease)",
          }}
        >
          <div className="x_hero_eyebrow">
            <span className="x_eyebrow_rule" />
            <GiVineLeaf className="x_eyebrow_leaf" />
            <span className="x_eyebrow_text">Since 2019 · Surat, India</span>
            <GiVineLeaf className="x_eyebrow_leaf x_eyebrow_leaf--flip" />
            <span className="x_eyebrow_rule" />
          </div>

          <h1 className="x_hero_title">
            <span className="x_hero_title_line x_hero_title_line--1">Our</span>
            <em className="x_hero_title_line x_hero_title_line--2">History</em>
          </h1>

          <p className="x_hero_sub">
            Five years. Three venues. Thousands of moments that
            <br />
            reminded us why we opened our doors in the first place.
          </p>
        </div>
      </section>

      {/* ══ YEAR NAV ══ */}
      <nav className="x_year_nav" ref={navRef}>
        <div className="x_year_nav_track" />
        <div className="x_year_nav_inner">
          {years.map((y) => (
            <button
              key={y}
              className={`x_year_btn${activeYear === y ? " x_year_btn--active" : ""}`}
              onClick={() => scrollToYear(y)}
            >
              {y}
            </button>
          ))}
        </div>
      </nav>

      {/* ══ OPENING STATEMENT ══ */}
      <section className="x_opening_section">
        <div className="x_opening_inner">
          <OpeningStatement />
        </div>
      </section>

      {/* ══ TIMELINE ══ */}
      <main className="x_timeline_section">
        <div className="x_timeline_inner">
          {years.map((year) => {
            const items = TIMELINE.filter((t) => t.year === year);
            return (
              <div
                key={year}
                className="x_year_group"
                id={`x_year_anchor_${year}`}
                data-year={year}
              >
                {/* Year marker */}
                <div className="x_year_marker">
                  <span className="x_year_marker_num">{year}</span>
                  <div className="x_year_marker_line" />
                  <span className="x_year_marker_dot" />
                </div>

                {/* Cards for this year */}
                <div className="x_year_cards">
                  {items.map((item, i) => {
                    const globalIdx = TIMELINE.indexOf(item);
                    return (
                      <TimelineCard
                        key={`${year}-${i}`}
                        item={item}
                        index={globalIdx}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* ══ FOUNDER'S NOTE ══ */}
      <FoundersNote />

      {/* ══ OUR VALUES ══ */}
      <section className="x_values_section">
        <div className="x_values_inner">
          <div className="x_section_head x_section_head--center">
            <span className="x_kicker">What We Stand For</span>
            <h2 className="x_section_title">
              The Principles That
              <br />
              <em>Guide Everything</em>
            </h2>
          </div>
          <div className="x_values_grid">
            {VALUES.map((v, i) => (
              <ValueCard key={v.title} value={v} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <HistoryCTA />

      {/* ══ STYLES ══ */}
      <style>{STYLES}</style>
    </div>
  );
}

/* ── Opening Statement ── */
function OpeningStatement() {
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      className="x_opening"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(32px)",
        transition: "opacity 0.8s var(--d-ease), transform 0.8s var(--d-ease)",
      }}
    >
      <TbQuote className="x_opening_quote_icon" />
      <p className="x_opening_text">
        We didn't set out to build a restaurant brand. We set out to build a
        home — a place where people could eat extraordinary food, drink
        interesting things, and feel genuinely cared for.{" "}
        <em>Everything else followed from that.</em>
      </p>
      <div className="x_opening_sig">
        <img
          src="https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=80&q=80"
          alt="Arjun Mehta"
          className="x_opening_avatar"
        />
        <div>
          <p className="x_opening_name">Arjun Mehta</p>
          <p className="x_opening_role">Founder & Executive Chef</p>
        </div>
      </div>
    </div>
  );
}

/* ── Founder's Note ── */
function FoundersNote() {
  const [ref, inView] = useInView(0.08);
  return (
    <section
      ref={ref}
      className="x_founders_section"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(28px)",
        transition:
          "opacity 0.75s var(--d-ease), transform 0.75s var(--d-ease)",
      }}
    >
      <GrainLayer opacity={0.035} />
      <div className="x_founders_glow" />
      <div className="x_founders_inner">
        <div className="x_founders_img_col">
          <div className="x_founders_img_frame">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&q=85"
              alt="DineVerse dining room"
              className="x_founders_img"
              loading="lazy"
            />
            <div className="x_founders_img_overlay" />
          </div>
          <div className="x_founders_img_accent">
            <span>Est. 2019</span>
          </div>
        </div>
        <div className="x_founders_text_col">
          <span className="x_kicker">A Note from the Kitchen</span>
          <TbQuote className="x_fn_quote_mark" />
          <blockquote className="x_fn_blockquote">
            Food is memory. Every dish we serve carries a fingerprint — of the
            farmer who grew it, the chef who cooked it, and the guest who
            receives it. We cook so you never forget.
          </blockquote>
          <p className="x_fn_body">
            Five years ago we made a promise to ourselves: that DineVerse would
            never be a place where excellence was rationed. The restaurant would
            be as extraordinary as the bar. The café would be as considered as
            both. Not one of them a compromise for the others.
          </p>
          <p className="x_fn_body">
            We have kept that promise. We intend to keep it for the next fifty
            years.
          </p>
          <div className="x_fn_sig">
            <div className="x_fn_sig_line" />
            <span className="x_fn_sig_name">Arjun Mehta · Executive Chef</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── History CTA ── */
function HistoryCTA() {
  const [ref, inView] = useInView(0.15);
  return (
    <section
      ref={ref}
      className="x_cta_section"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(24px)",
        transition: "opacity 0.7s var(--d-ease), transform 0.7s var(--d-ease)",
      }}
    >
      <div className="x_cta_glow" />
      <div className="x_cta_inner">
        <TbSparkles className="x_cta_spark" />
        <h2 className="x_cta_title">
          Be Part of the
          <br />
          <em>Next Chapter</em>
        </h2>
        <p className="x_cta_sub">
          Book a table, explore the bar, or start your morning at the café.
        </p>
        <div className="x_cta_btns">
          <Link to="/bookTable" className="x_btn x_btn--gold">
            Reserve a Table <FiArrowRight />
          </Link>
          <Link to="/menu" className="x_btn x_btn--ghost">
            Explore Our Menu <GiKnifeFork />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --d-bg:             #080705;
  --d-surface:        #100e0b;
  --d-surface-2:      #181510;
  --d-surface-3:      #201c16;
  --d-surface-glass:  rgba(16,14,11,0.82);
  --d-border:         rgba(200,160,90,0.10);
  --d-border-hover:   rgba(200,160,90,0.28);
  --d-border-strong:  rgba(200,160,90,0.50);
  --d-gold:           #c8965a;
  --d-gold-light:     #e8b878;
  --d-gold-pale:      #f2d4a8;
  --d-gold-dark:      #9a6e3a;
  --d-gold-glow:      rgba(200,150,90,0.22);
  --d-gold-subtle:    rgba(200,150,90,0.08);
  --d-text-1:         #f5f0e8;
  --d-text-2:         #b8b0a0;
  --d-text-3:         #9e988c;
  --d-text-4:         #ebd19f;
  --d-cafe:           #7ab898;
  --d-cafe-dim:       rgba(122,184,152,0.10);
  --d-restaurant:     #c8965a;
  --d-restaurant-dim: rgba(200,150,90,0.10);
  --d-bar:            #9b8fd4;
  --d-bar-dim:        rgba(155,143,212,0.10);
  --d-room:           #d48fb5;
  --d-room-dim:       rgba(212,143,181,0.10);
  --d-shadow-sm:   0 2px 12px rgba(0,0,0,0.40);
  --d-shadow-md:   0 8px 32px  rgba(0,0,0,0.55);
  --d-shadow-lg:   0 20px 60px rgba(0,0,0,0.70);
  --d-glow-gold:   0 0 40px rgba(200,150,90,0.12);
  --d-r-xs:4px; --d-r-sm:8px; --d-r-md:14px; --d-r-lg:22px;
  --d-r-xl:32px; --d-r-pill:999px;
  --d-font-serif:'Cormorant Garamond','Georgia',serif;
  --d-font-sans:'DM Sans',system-ui,sans-serif;
  --d-ease:cubic-bezier(0.25,0.46,0.45,0.94);
  --d-spring:cubic-bezier(0.34,1.56,0.64,1);
  --d-dur:0.30s;
  --d-header-h: 70px; --d-strip-h:38px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── WRAPPER ── */
.x_history_wrapper {
  font-family: var(--d-font-sans);
  background: var(--d-bg);
  color: var(--d-text-1);
}

/* ══ HERO ══ */
.x_hero {
  position: relative;
  padding: 100px 24px 80px;
  display: flex; align-items: center; justify-content: center;
  text-align: center;
  overflow: hidden;
  background: var(--d-surface);
  border-bottom: 1px solid var(--d-border);
}

/* mesh gradient background */
.x_hero_bg_mesh {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 70% 50% at 20% 30%, rgba(200,150,90,0.07) 0%, transparent 60%),
    radial-gradient(ellipse 60% 70% at 80% 70%, rgba(155,143,212,0.06) 0%, transparent 60%),
    radial-gradient(ellipse 80% 40% at 50% 90%, rgba(122,184,152,0.04) 0%, transparent 60%);
}
.x_hero_radial_top {
  position: absolute; top: -150px; left: 50%; transform: translateX(-50%);
  width: 1000px; height: 500px; pointer-events: none;
  background: radial-gradient(ellipse, rgba(200,150,90,0.13) 0%, transparent 65%);
}
.x_hero_radial_bot {
  position: absolute; bottom: -80px; left: 50%; transform: translateX(-50%);
  width: 700px; height: 280px; pointer-events: none;
  background: radial-gradient(ellipse, rgba(155,143,212,0.06) 0%, transparent 70%);
}

/* huge ghost year */
.x_hero_bg_year {
  position: absolute;
  bottom: -10px; left: 50%;
  font-family: var(--d-font-serif);
  font-size: clamp(160px, 26vw, 320px);
  font-weight: 700;
  color: transparent;
  -webkit-text-stroke: 1px rgba(200,160,90,0.06);
  pointer-events: none; letter-spacing: -0.04em; line-height: 1;
  white-space: nowrap; user-select: none;
  animation: x_ghost_in 1.4s var(--d-ease) 0.3s both;
}

/* diagonal shimmer lines */
.x_hero_lines { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.x_hero_line {
  position: absolute; width: 1px; height: 160%; top: -30%;
  background: linear-gradient(to bottom, transparent 0%, rgba(200,160,90,0.07) 30%, rgba(200,160,90,0.07) 70%, transparent 100%);
  transform: rotate(14deg); transform-origin: top center;
  animation: x_line_slide 10s var(--d-ease) infinite;
}

/* floating orbs */
.x_orb {
  position: absolute; border-radius: 50%;
  filter: blur(90px); pointer-events: none;
}
.x_orb--gold {
  width: 420px; height: 420px; top: 5%; left: 3%;
  background: rgba(200,150,90,0.07);
  animation: x_orb_float 14s ease-in-out infinite alternate;
}
.x_orb--bar {
  width: 300px; height: 300px; bottom: 8%; right: 4%;
  background: rgba(155,143,212,0.07);
  animation: x_orb_float 11s ease-in-out infinite alternate-reverse;
}
.x_orb--cafe {
  width: 200px; height: 200px; top: 40%; right: 18%;
  background: rgba(122,184,152,0.05);
  animation: x_orb_float 8s ease-in-out infinite alternate;
  animation-delay: -3s;
}

/* hero content */
.x_hero_content {
  position: relative; z-index: 2;
  padding: 0 24px;
  max-width: 780px;
}
.x_hero_eyebrow {
  display: flex; align-items: center; justify-content: center; gap: 12px;
  margin-bottom: 28px;
  font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--d-gold); font-weight: 500;
}
.x_eyebrow_rule { flex: 0 0 50px; height: 1px; background: var(--d-border-strong); }
.x_eyebrow_leaf { font-size: 15px; animation: x_sway 4s ease-in-out infinite; }
.x_eyebrow_leaf--flip { transform: scaleX(-1); animation-delay: -2s; }
.x_eyebrow_text { white-space: nowrap; }

.x_hero_title {
  font-family: var(--d-font-serif);
  line-height: 0.92; letter-spacing: -0.03em;
  margin-bottom: 24px;
  display: flex; flex-direction: column;
}
.x_hero_title_line--1 {
  font-size: clamp(72px, 14vw, 100px);
  font-weight: 300; color: var(--d-text-1);
  animation: x_fade_up 0.9s var(--d-ease) 0.1s both;
}
.x_hero_title_line--2 {
  font-size: clamp(78px, 15vw, 100px);
  font-weight: 400; font-style: italic;
  color: var(--d-gold-light);
  text-shadow: 0 0 100px rgba(232,184,120,0.35);
  animation: x_fade_up 0.9s var(--d-ease) 0.2s both;
}

.x_hero_sub {
  font-size: clamp(15px, 2vw, 18px);
  color: var(--d-text-3); line-height: 1.7;
  margin-bottom: 36px;
  animation: x_fade_up 0.9s var(--d-ease) 0.35s both;
}

/* ══ YEAR NAV ══ */
.x_year_nav {
  position: sticky; top: 0; z-index: 100;
  background: var(--d-surface-glass);
  backdrop-filter: blur(24px) saturate(1.5);
  -webkit-backdrop-filter: blur(24px) saturate(1.5);
  border-bottom: 1px solid var(--d-border);
}
.x_year_nav_track {
  position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--d-border-strong), transparent);
}
.x_year_nav_inner {
  display: flex; align-items: center; gap: 0;
  max-width: 900px; margin: 0 auto; padding: 0 24px;
  overflow-x: auto; scrollbar-width: none;
}
.x_year_nav_inner::-webkit-scrollbar { display: none; }
.x_year_btn {
  padding: 16px 28px; border: none; background: none; cursor: pointer;
  font-family: var(--d-font-serif); font-size: 18px; font-weight: 300;
  color: var(--d-text-4); white-space: nowrap; position: relative;
  transition: color var(--d-dur);
}
.x_year_btn::after {
  content: ''; position: absolute; bottom: 0; left: 50%; right: 50%;
  height: 2px; background: var(--d-gold);
  transition: left var(--d-dur) var(--d-spring), right var(--d-dur) var(--d-spring);
}
.x_year_btn:hover { color: var(--d-text-2); }
.x_year_btn--active { color: var(--d-gold); }
.x_year_btn--active::after { left: 0; right: 0; }

/* ══ OPENING STATEMENT ══ */
.x_opening_section {
  padding: 55px 24px;
  background: var(--d-surface);
  border-bottom: 1px solid var(--d-border);
}
.x_opening_inner { max-width: 760px; margin: 0 auto; }
.x_opening {
  text-align: center; display: flex; flex-direction: column;
  align-items: center; gap: 28px;
}
.x_opening_quote_icon {
  font-size: 44px; color: var(--d-gold); opacity: 0.35;
  animation: x_pulse 4s ease-in-out infinite;
}
.x_opening_text {
  font-family: var(--d-font-serif);
  font-size: clamp(22px, 3vw, 32px);
  font-weight: 300; line-height: 1.6; color: var(--d-text-2);
}
.x_opening_text em { font-style: italic; color: var(--d-gold-pale); }
.x_opening_sig { display: flex; align-items: center; gap: 14px; }
.x_opening_avatar {
  width: 52px; height: 52px; border-radius: 50%;
  object-fit: cover; border: 2px solid var(--d-border-strong);
}
.x_opening_name { font-size: 14px; font-weight: 500; color: var(--d-text-1); }
.x_opening_role { font-size: 12px; color: var(--d-text-4); letter-spacing: 0.06em; }

/* ══ TIMELINE ══ */
.x_timeline_section {
  padding: 80px 24px 100px;
  background: var(--d-bg);
}
.x_timeline_inner {
  max-width: 1160px; margin: 0 auto;
  display: flex; flex-direction: column; gap: 80px;
}

/* year group */
.x_year_group { display: flex; flex-direction: column; gap: 32px; }
.x_year_marker {
  display: flex; align-items: center; gap: 20px;
}
.x_year_marker_num {
  font-family: var(--d-font-serif); font-size: 64px;
  font-weight: 300; color: var(--d-gold); line-height: 1; flex-shrink: 0;
  text-shadow: 0 0 40px rgba(200,150,90,0.2);
}
.x_year_marker_line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, var(--d-border-strong), transparent);
}
.x_year_marker_dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: var(--d-gold); flex-shrink: 0;
  box-shadow: 0 0 12px var(--d-gold-glow);
}
.x_year_cards { display: flex; flex-direction: column; gap: 28px; }

/* timeline card */
.x_tl_card {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 64px; align-items: center;
  opacity: 0; transform: translateY(36px);
  transition: opacity 0.7s var(--d-ease), transform 0.7s var(--d-ease);
}
.x_tl_card--visible { opacity: 1; transform: none; }
.x_tl_card--rev { direction: rtl; }
.x_tl_card--rev > * { direction: ltr; }

/* image column */
.x_tl_img_col {}
.x_tl_img_frame {
  position: relative; border-radius: var(--d-r-xl);
  overflow: hidden; aspect-ratio: 4/3;
  box-shadow: var(--d-shadow-lg);
}
.x_tl_img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.7s var(--d-ease);
}
.x_tl_card:hover .x_tl_img { transform: scale(1.05); }
.x_tl_img_color_wash {
  position: absolute; inset: 0;
  background: color-mix(in srgb, var(--tc) 12%, transparent);
  mix-blend-mode: multiply;
  transition: opacity var(--d-dur);
}
.x_tl_img_grad {
  position: absolute; inset: 0;
  background: linear-gradient(
    to top,
    rgba(8,7,5,0.75) 0%,
    rgba(8,7,5,0.2) 40%,
    transparent 65%
  );
}
.x_tl_stat_bubble {
  position: absolute; bottom: 18px; left: 18px;
  background: var(--d-surface-glass);
  backdrop-filter: blur(12px);
  border: 1px solid var(--d-border-hover);
  border-radius: var(--d-r-lg); padding: 12px 18px;
  display: flex; flex-direction: column; gap: 2px;
  transition: transform var(--d-dur) var(--d-spring);
}
.x_tl_card:hover .x_tl_stat_bubble { transform: translateY(-3px); }
.x_tl_stat_value {
  font-family: var(--d-font-serif); font-size: 22px;
  font-weight: 600; color: var(--tc); line-height: 1;
}
.x_tl_stat_label { font-size: 10px; color: var(--d-text-4); letter-spacing: 0.1em; }
.x_tl_quarter {
  position: absolute; top: 14px; left: 14px;
  font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--d-gold-pale);
  background: var(--d-surface-glass); backdrop-filter: blur(8px);
  padding: 4px 12px; border-radius: var(--d-r-pill);
  border: 1px solid var(--d-border);
}

/* body column */
.x_tl_body { display: flex; flex-direction: column; gap: 16px; }
.x_tl_icon_wrap {
  width: 48px; height: 48px; border-radius: var(--d-r-md);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; color: var(--tc);
  background: color-mix(in srgb, var(--tc) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--tc) 25%, transparent);
}
.x_tl_year_badge {
  font-family: var(--d-font-serif); font-size: 13px;
  color: var(--tc); letter-spacing: 0.1em; font-weight: 500;
}
.x_tl_title {
  font-family: var(--d-font-serif);
  font-size: clamp(26px, 3.2vw, 40px);
  font-weight: 400; line-height: 1.2; color: var(--d-text-1);
}
.x_tl_body_text {
  font-size: 15px; color: var(--d-text-3); line-height: 1.8;
}
.x_tl_detail {
  display: flex; align-items: flex-start; gap: 10px;
  font-size: 12px; color: var(--d-text-4);
  letter-spacing: 0.04em; padding: 10px 0;
  border-top: 1px solid var(--d-border);
}
.x_tl_detail_dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--tc); flex-shrink: 0; margin-top: 4px;
}
.x_tl_accent_bar {
  height: 2px; width: 52px; border-radius: 2px;
  background: linear-gradient(90deg, var(--tc), transparent);
}

/* ══ FOUNDER'S NOTE ══ */
.x_founders_section {
  position: relative; overflow: hidden;
  background: var(--d-surface);
  border-top: 1px solid var(--d-border);
  border-bottom: 1px solid var(--d-border);
  padding: 96px 24px;
}
.x_founders_glow {
  position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
  width: 800px; height: 400px; pointer-events: none;
  background: radial-gradient(ellipse, var(--d-gold-glow) 0%, transparent 70%);
}
.x_founders_inner {
  position: relative; z-index: 2;
  max-width: 1100px; margin: 0 auto;
  display: grid; grid-template-columns: 1fr 1fr; gap: 80px;
  align-items: center;
}

/* image stack */
.x_founders_img_col { position: relative; }
.x_founders_img_frame {
  border-radius: var(--d-r-xl); overflow: hidden;
  aspect-ratio: 3/4; box-shadow: var(--d-shadow-lg);
}
.x_founders_img { width: 100%; height: 100%; object-fit: cover; }
.x_founders_img_overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(8,7,5,0.5) 0%, transparent 50%);
}
.x_founders_img_accent {
  position: absolute; bottom: -16px; right: -16px;
  background: var(--d-gold); color: var(--d-bg);
  font-family: var(--d-font-serif); font-size: 14px;
  font-weight: 600; letter-spacing: 0.08em;
  padding: 12px 22px; border-radius: var(--d-r-lg);
  box-shadow: var(--d-shadow-md);
}

/* text col */
.x_founders_text_col { display: flex; flex-direction: column; gap: 20px; }
.x_fn_quote_mark {
  font-size: 50px; color: var(--d-gold); opacity: 0.35;
}
.x_fn_blockquote {
  font-family: var(--d-font-serif);
  font-size: clamp(20px, 2.5vw, 28px);
  font-style: italic; font-weight: 300;
  color: var(--d-gold-pale); line-height: 1.6;
  padding-left: 24px; border-left: 3px solid var(--d-gold);
}
.x_fn_body {
  font-size: 15px; color: var(--d-text-3); line-height: 1.8;
}
.x_fn_sig {
  display: flex; align-items: center; gap: 14px;
  padding-top: 16px; border-top: 1px solid var(--d-border);
}
.x_fn_sig_line { flex: 0 0 44px; height: 1px; background: var(--d-border-strong); }
.x_fn_sig_name { font-size: 12px; color: var(--d-text-4); letter-spacing: 0.08em; }

/* ══ SHARED COMPONENTS ══ */
.x_kicker {
  display: inline-block; font-size: 10px; letter-spacing: 0.22em;
  text-transform: uppercase; color: var(--d-gold);
  padding: 4px 14px; border: 1px solid var(--d-border-strong);
  border-radius: var(--d-r-pill); margin-bottom: 14px;
}
.x_section_head { margin-bottom: 52px; }
.x_section_head--center { text-align: center; }
.x_section_title {
  font-family: var(--d-font-serif);
  font-size: clamp(32px, 5vw, 54px);
  font-weight: 300; line-height: 1.15; color: var(--d-text-1);
}
.x_section_title em { font-style: italic; color: var(--d-gold-light); }

/* ══ VALUES ══ */
.x_values_section {
  padding: 70px 24px;
  background: var(--d-bg);
  border-bottom: 1px solid var(--d-border);
}
.x_values_inner { max-width: 1100px; margin: 0 auto; }
.x_values_grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
}
.x_value_card {
  position: relative; overflow: hidden;
  background: var(--d-surface-2);
  border: 1px solid var(--d-border);
  border-top: 3px solid var(--ac);
  border-radius: var(--d-r-lg);
  padding: 32px 26px; display: flex; flex-direction: column; gap: 12px;
  transition: border-color var(--d-dur), transform var(--d-dur) var(--d-spring), box-shadow var(--d-dur);
  cursor: default;
}
.x_value_card:hover {
  border-color: var(--d-border-hover);
  transform: translateY(-5px);
  box-shadow: var(--d-shadow-md), 0 0 24px color-mix(in srgb, var(--ac) 12%, transparent);
}
.x_value_shimmer {
  position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent);
  transition: left 0.8s var(--d-ease);
}
.x_value_card:hover .x_value_shimmer { left: 150%; }
.x_value_icon_wrap {
  width: 44px; height: 44px; border-radius: var(--d-r-md);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; color: var(--ac);
  background: color-mix(in srgb, var(--ac) 12%, transparent);
  border: 1px solid color-mix(in srgb, var(--ac) 22%, transparent);
}
.x_value_title {
  font-family: var(--d-font-serif); font-size: 22px;
  font-weight: 400; color: var(--d-text-1);
}
.x_value_body { font-size: 13px; color: var(--d-text-3); line-height: 1.75; }

/* ══ CTA ══ */
.x_cta_section {
  position: relative; overflow: hidden;
  text-align: center; padding: 80px 24px;
  background: var(--d-surface-2);
  border-top: 1px solid var(--d-border);
}
.x_cta_glow {
  position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
  width: 700px; height: 350px; pointer-events: none;
  background: radial-gradient(ellipse, var(--d-gold-glow) 0%, transparent 70%);
}
.x_cta_inner { position: relative; z-index: 1; max-width: 600px; margin: 0 auto; }
.x_cta_spark {
  font-size: 32px; color: var(--d-gold); display: block;
  margin: 0 auto 20px; animation: x_spin_slow 9s linear infinite;
}
.x_cta_title {
  font-family: var(--d-font-serif);
  font-size: clamp(36px, 6vw, 62px);
  font-weight: 300; margin-bottom: 16px;
}
.x_cta_title em { font-style: italic; color: var(--d-gold-light); }
.x_cta_sub { font-size: 15px; color: var(--d-text-3); margin-bottom: 44px; line-height: 1.65; }
.x_cta_btns { display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap; }
.x_btn {
  display: inline-flex; align-items: center; gap: 9px;
  padding: 14px 30px; border-radius: var(--d-r-pill);
  font-family: var(--d-font-sans); font-size: 14px; font-weight: 500;
  text-decoration: none; cursor: pointer; border: none;
  transition: all var(--d-dur) var(--d-spring);
}
.x_btn--gold { background: var(--d-gold); color: var(--d-bg); }
.x_btn--gold:hover { background: var(--d-gold-light); transform: translateY(-2px); box-shadow: 0 10px 28px var(--d-gold-glow); }
.x_btn--ghost { background: none; color: var(--d-gold); border: 1px solid var(--d-border-strong); }
.x_btn--ghost:hover { background: var(--d-gold-subtle); transform: translateY(-2px); border-color: var(--d-gold); }

/* ══ KEYFRAMES ══ */
@keyframes x_fade_up { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes x_ghost_in { from { opacity: 0; transform: translateX(-50%) scale(0.96); } to { opacity: 1; transform: translateX(-50%) scale(1); } }
@keyframes x_line_slide {
  0%  { transform: rotate(14deg) translateY(-20%); opacity: 0; }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100%{ transform: rotate(14deg) translateY(20%); opacity: 0; }
}
@keyframes x_orb_float { from { transform: translateY(0) translateX(0); } to { transform: translateY(-40px) translateX(24px); } }
@keyframes x_sway { 0%,100%{ transform: rotate(-8deg); } 50%{ transform: rotate(8deg); } }
@keyframes x_bounce { 0%,100%{ transform: translateY(0); } 50%{ transform: translateY(8px); } }
@keyframes x_spin_slow { to { transform: rotate(360deg); } }
@keyframes x_pulse { 0%,100%{ opacity: 0.35; } 50%{ opacity: 0.65; } }

/* ══ RESPONSIVE ══ */
@media (max-width: 1100px) {
  .x_stats_inner { grid-template-columns: repeat(3, 1fr); }
  .x_stat_card:nth-child(n+4) { border-top: 1px solid var(--d-border); }
  .x_values_grid { grid-template-columns: repeat(2, 1fr); }
  .x_tl_card, .x_tl_card--rev { grid-template-columns: 1fr; direction: ltr; gap: 32px; }
  .x_founders_inner { grid-template-columns: 1fr; gap: 48px; }
  .x_founders_img_frame { aspect-ratio: 16/9; }
  .x_founders_img_accent { bottom: -12px; right: 16px; }
}
@media (max-width: 768px) {
  .x_stats_inner { grid-template-columns: repeat(2, 1fr); }
  .x_team_grid { grid-template-columns: 1fr; }
  .x_year_marker_num { font-size: 44px; }
  .x_hero_title_line--1 { font-size: clamp(56px, 13vw, 100px); }
  .x_hero_title_line--2 { font-size: clamp(60px, 15vw, 110px); }
  .x_values_section,.x_cta_section,.x_timeline_section {
    padding:45px 24px;
  }
    .x_section_head {
    margin-bottom: 30px;
}
    .x_timeline_inner{gap: 37px}
    .x_hero{
        padding: 62px 24px 62px;
    }
    .x_hero_bg_year {   bottom:-19px; font-size: clamp(134px, 26vw, 320px);}
}
    @media (max-width: 576px){
    .x_hero_bg_year {   bottom:15px;}
    }
@media (max-width: 480px) {
.x_hero_eyebrow{
font-size: 11px;
    letter-spacing: 0;
}
  .x_values_grid { grid-template-columns: 1fr; }
    .x_section_head {
        justify-content: center;

  }

  .x_stats_inner { grid-template-columns: repeat(2, 1fr); }
  .x_cta_btns { flex-direction: column; }
  .x_btn { width: 100%; justify-content: center; }
  .x_founders_section { padding: 60px 20px; }
  .x_fn_blockquote { font-size: 18px; }
}
`;
