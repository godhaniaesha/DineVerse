import { useEffect, useRef, useState } from "react";
import { forwardRef } from "react";
import {
  FiAward, FiUsers, FiCoffee, FiStar,
  FiArrowRight, FiChevronDown
} from "react-icons/fi";
import {
  GiWineGlass, GiKnifeFork, GiCoffeeCup,
  GiCook, GiVineLeaf
} from "react-icons/gi";
import { TbSparkles, TbChefHat, TbFlame } from "react-icons/tb";
import { MdOutlineLocalBar } from "react-icons/md";

/* ─── DATA ─── */
const STATS = [
  { icon: <FiStar />, value: "4.9", label: "Guest Rating", suffix: "★" },
  { icon: <FiUsers />, value: "12K+", label: "Happy Guests", suffix: "" },
  { icon: <TbChefHat />, value: "18", label: "Expert Chefs", suffix: "" },
  { icon: <FiAward />, value: "7", label: "Awards Won", suffix: "" },
];

const VENUES = [
  {
    id: "restaurant",
    icon: <GiKnifeFork />,
    accent: "var(--d-restaurant)",
    dim: "var(--d-restaurant-dim)",
    name: "The Restaurant",
    tagline: "Fine Dining Redefined",
    desc: "A temple of flavour where classical French technique meets bold Indian soul. Every plate is a conversation between heritage and modernity, served in a setting that breathes elegance.",
    details: ["Seats 64 guests", "Open 12pm – 11pm", "Private dining available"],
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80",
  },
  {
    id: "bar",
    icon: <MdOutlineLocalBar />,
    accent: "var(--d-bar)",
    dim: "var(--d-bar-dim)",
    name: "The Bar",
    tagline: "Crafted Pour by Pour",
    desc: "A dimly lit sanctuary of rare spirits and bespoke cocktails. Our mixologists are storytellers—every glass holds a narrative, from smoked Old Fashioneds to floral zero-proof creations.",
    details: ["Seats 36 guests", "Open 5pm – 1am", "Live jazz on Fridays"],
    img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=900&q=80",
  },
  {
    id: "cafe",
    icon: <GiCoffeeCup />,
    accent: "var(--d-cafe)",
    dim: "var(--d-cafe-dim)",
    name: "The Café",
    tagline: "Mornings Worth Waking For",
    desc: "Sun-drenched and serene, our café is the city's best-kept secret. Single-origin brews, house-baked pastries and a menu that celebrates the unhurried joy of a slow morning.",
    details: ["Seats 28 guests", "Open 7am – 6pm", "Weekend brunch specials"],
    img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&q=80",
  },
];

const TEAM = [
  {
    name: "Arjun Mehta", role: "Executive Chef",
    bio: "15 years across Michelin-starred kitchens in Paris and Tokyo. Back home to tell India's story through food.",
    img: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400&q=80",
    accent: "var(--d-restaurant)",
  },
  {
    name: "Leila Nair", role: "Head Mixologist",
    bio: "World Cocktail Champion 2022. She treats every glass like a canvas, every sip like the first sentence of a novel.",
    img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    accent: "var(--d-bar)",
  },
  {
    name: "Rohan Shah", role: "Pastry & Café Lead",
    bio: "Trained in Vienna and Copenhagen. Brings European pastry mastery with a deep love for spiced chai and cardamom.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    accent: "var(--d-cafe)",
  },
];

const MILESTONES = [
  { year: "2019", title: "The Dream Begins", desc: "Aurum opens its doors in Surat — three spaces, one vision." },
  { year: "2020", title: "Survived & Thrived", desc: "Adapted to the world's shift. Launched cloud kitchen & delivery." },
  { year: "2021", title: "First Award", desc: "Named 'Best New Restaurant' by Gujarat Culinary Guild." },
  { year: "2022", title: "The Bar Blooms", desc: "Leila joins. The bar earns national recognition in Spirited Awards." },
  { year: "2023", title: "Expansion", desc: "Private dining suite & rooftop terrace added. Capacity doubled." },
  { year: "2024", title: "A Decade Dream", desc: "12,000+ guests hosted. Michelin Guide informal listing noted." },
];

/* ─── HOOK: intersection observer ─── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ─── STAT CARD ─── */
function StatCard({ icon, value, label, delay }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className="x_stat_card" style={{ animationDelay: delay, opacity: visible ? undefined : 0, animation: visible ? `x_fadeUp 0.6s var(--d-ease) ${delay} both` : "none" }}>
      <span className="x_stat_icon">{icon}</span>
      <span className="x_stat_value">{value}</span>
      <span className="x_stat_label">{label}</span>
    </div>
  );
}

/* ─── VENUE CARD ─── */
function VenueCard({ venue, reverse }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`x_venue_card${reverse ? " x_venue_card--rev" : ""}${visible ? " x_visible" : ""}`}
      style={{ "--accent": venue.accent, "--dim": venue.dim }}
    >
      <div className="x_venue_img_wrap">
        <img src={venue.img} alt={venue.name} className="x_venue_img" loading="lazy" />
        <div className="x_venue_img_overlay" />
        <span className="x_venue_icon_badge">{venue.icon}</span>
      </div>
      <div className="x_venue_body">
        <span className="x_venue_kicker">{venue.tagline}</span>
        <h3 className="x_venue_name">{venue.name}</h3>
        <p className="x_venue_desc">{venue.desc}</p>
        <ul className="x_venue_details">
          {venue.details.map((d) => (
            <li key={d} className="x_venue_detail_item">
              <FiArrowRight className="x_venue_detail_arrow" /> {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─── TEAM CARD ─── */
function TeamCard({ member, delay }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className="x_team_card" style={{ "--accent": member.accent, animationDelay: delay, opacity: visible ? undefined : 0, animation: visible ? `x_fadeUp 0.6s var(--d-ease) ${delay} both` : "none" }}>
      <div className="x_team_img_wrap">
        <img src={member.img} alt={member.name} className="x_team_img" loading="lazy" />
        <div className="x_team_img_glow" />
      </div>
      <div className="x_team_body">
        <h4 className="x_team_name">{member.name}</h4>
        <span className="x_team_role">{member.role}</span>
        <p className="x_team_bio">{member.bio}</p>
      </div>
    </div>
  );
}

/* ─── TIMELINE ITEM ─── */
function TimelineItem({ item, idx }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`x_tl_item${visible ? " x_visible" : ""}`} style={{ animationDelay: `${idx * 0.1}s` }}>
      <div className="x_tl_year">{item.year}</div>
      <div className="x_tl_dot" />
      <div className="x_tl_content">
        <h4 className="x_tl_title">{item.title}</h4>
        <p className="x_tl_desc">{item.desc}</p>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function About() {
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => { setTimeout(() => setHeroVisible(true), 80); }, []);

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
      <div className="x_about_wrapper">

        {/* ── HERO ── */}
        <section className="x_hero">
          <div className="x_hero_bg" />
          <div className="x_hero_grain" />
          <div className="x_hero_radial" />
          <div className={`x_hero_inner${heroVisible ? " x_visible" : ""}`}>
            <div className="x_hero_eyebrow">
              <span className="x_hero_line" />
              <GiVineLeaf className="x_hero_leaf" />
              <span>Our Story</span>
              <GiVineLeaf className="x_hero_leaf x_hero_leaf--flip" />
              <span className="x_hero_line" />
            </div>
            <h1 className="x_hero_title">
              Where <em>Craft</em><br />Meets <em>Soul</em>
            </h1>
            <p className="x_hero_sub">
              Three venues. One philosophy. The relentless pursuit of moments that linger long after the last sip.
            </p>
            <a href="#story" className="x_hero_scroll">
              <FiChevronDown className="x_scroll_icon" />
            </a>
          </div>

          {/* floating orbs */}
          <div className="x_orb x_orb--1" />
          <div className="x_orb x_orb--2" />
          <div className="x_orb x_orb--3" />
        </section>

        {/* ── STATS ── */}
        <section className="x_stats_section">
          <div className="x_stats_grid">
            {STATS.map((s, i) => <StatCard key={s.label} {...s} delay={`${i * 0.12}s`} />)}
          </div>
        </section>

        {/* ── STORY ── */}
        <section id="story" className="x_story_section">
          <div className="x_story_inner">
            <div className="x_story_text_col">
              <span className="x_kicker">The Beginning</span>
              <h2 className="x_section_title">A Space Born from<br /><em>Obsession</em></h2>
              <p className="x_body_text">
                Aurum was never meant to be just a restaurant. It was the answer to a question we kept asking: why should extraordinary food, exceptional cocktails, and the warmth of a neighbourhood café live in separate worlds?
              </p>
              <p className="x_body_text">
                In 2019, we opened three doors under one roof in the heart of Surat. Each space has its own personality, its own light, its own pulse — but they share the same obsessive attention to quality, the same reverence for ingredients, and the same belief that hospitality is a form of love made tangible.
              </p>
              <div className="x_story_quote">
                <span className="x_quote_mark">"</span>
                <blockquote>Food is memory. We cook so you never forget.</blockquote>
                <cite>— Arjun Mehta, Executive Chef</cite>
              </div>
            </div>
            <div className="x_story_img_col">
              <div className="x_story_img_stack">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700&q=80"
                  alt="Aurum interior"
                  className="x_story_img x_story_img--main"
                />
                <img
                  src="https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400&q=80"
                  alt="Aurum detail"
                  className="x_story_img x_story_img--accent"
                />
                <div className="x_story_badge">Est. 2019</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── VENUES ── */}
        <section className="x_venues_section">
          <div className="x_venues_inner">
            <div className="x_section_head_center">
              <span className="x_kicker">Our Spaces</span>
              <h2 className="x_section_title">Three Worlds,<br /><em>One Address</em></h2>
            </div>
            <div className="x_venues_list">
              {VENUES.map((v, i) => <VenueCard key={v.id} venue={v} reverse={i % 2 !== 0} />)}
            </div>
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section className="x_timeline_section">
          <div className="x_timeline_inner">
            <div className="x_section_head_center">
              <span className="x_kicker">Our Journey</span>
              <h2 className="x_section_title">Five Years of<br /><em>Milestones</em></h2>
            </div>
            <div className="x_timeline">
              <div className="x_tl_track" />
              {MILESTONES.map((m, i) => <TimelineItem key={m.year} item={m} idx={i} />)}
            </div>
          </div>
        </section>

        {/* ── TEAM ── */}
        <section className="x_team_section">
          <div className="x_team_inner">
            <div className="x_section_head_center">
              <span className="x_kicker">The People</span>
              <h2 className="x_section_title">Faces Behind<br /><em>the Flavours</em></h2>
            </div>
            <div className="x_team_grid">
              {TEAM.map((m, i) => <TeamCard key={m.name} member={m} delay={`${i * 0.15}s`} />)}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="x_cta_section">
          <div className="x_cta_glow" />
          <div className="x_cta_inner">
            <TbSparkles className="x_cta_spark" />
            <h2 className="x_cta_title">Come Experience <em>Aurum</em></h2>
            <p className="x_cta_sub">Reserve your table, explore the bar, or start your morning right.</p>
            <div className="x_cta_btns">
              <a href="#" className="x_btn x_btn--gold">Book a Table <FiArrowRight /></a>
              <a href="#" className="x_btn x_btn--ghost">View Menu <GiKnifeFork /></a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="x_footer">
          <div className="x_footer_divider" />
          <p className="x_footer_text">© 2024 Aurum · Restaurant, Bar & Café · Surat, India</p>
        </footer>

        <style>{STYLES}</style>
      </div>
    </>
  );
}

/* ─── STYLES ─── */
const STYLES = `
:root {
  --d-bg:             #080705;
  --d-surface:        #100e0b;
  --d-surface-2:      #181510;
  --d-surface-3:      #201c16;
  --d-surface-glass:  rgba(16, 14, 11, 0.82);
  --d-border:         rgba(200, 160, 90, 0.10);
  --d-border-hover:   rgba(200, 160, 90, 0.28);
  --d-border-strong:  rgba(200, 160, 90, 0.50);
  --d-gold:           #c8965a;
  --d-gold-light:     #e8b878;
  --d-gold-pale:      #f2d4a8;
  --d-gold-dark:      #9a6e3a;
  --d-gold-glow:      rgba(200, 150, 90, 0.22);
  --d-gold-subtle:    rgba(200, 150, 90, 0.08);
  --d-text-1:         #f5f0e8;
  --d-text-2:         #b8b0a0;
  --d-text-3:         #7a7060;
  --d-text-4:         #4a4438;
  --d-cafe:           #7ab898;
  --d-cafe-dim:       rgba(122, 184, 152, 0.10);
  --d-restaurant:     #c8965a;
  --d-restaurant-dim: rgba(200, 150, 90, 0.10);
  --d-bar:            #9b8fd4;
  --d-bar-dim:        rgba(155, 143, 212, 0.10);
  --d-room:           #d48fb5;
  --d-room-dim:       rgba(212, 143, 181, 0.10);
  --d-shadow-sm:   0 2px 12px rgba(0,0,0,0.40);
  --d-shadow-md:   0 8px 32px  rgba(0,0,0,0.55);
  --d-shadow-lg:   0 20px 60px rgba(0,0,0,0.70);
  --d-glow-gold:   0 0 40px rgba(200,150,90,0.12);
  --d-r-xs:   4px;
  --d-r-sm:   8px;
  --d-r-md:   14px;
  --d-r-lg:   22px;
  --d-r-xl:   32px;
  --d-r-pill: 999px;
  --d-font-serif: 'Cormorant Garamond','Georgia',serif;
  --d-font-sans:  'DM Sans',system-ui,sans-serif;
  --d-ease:   cubic-bezier(0.25,0.46,0.45,0.94);
  --d-spring: cubic-bezier(0.34,1.56,0.64,1);
  --d-dur:    0.30s;
  --d-header-h: 80px;
  --d-strip-h:  38px;
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

/* ── WRAPPER ── */
.x_about_wrapper{
  font-family:var(--d-font-sans);
  background:var(--d-bg);
  color:var(--d-text-1);
  min-height:100vh;
  overflow-x:hidden;
}

/* ── HERO ── */
.x_hero{
  position:relative;
  min-height:100svh;
  display:flex; align-items:center; justify-content:center;
  text-align:center;
  overflow:hidden;
}
.x_hero_bg{
  position:absolute;inset:0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,150,90,0.10) 0%, transparent 60%),
    radial-gradient(ellipse 60% 80% at 20% 100%, rgba(155,143,212,0.07) 0%, transparent 60%),
    var(--d-surface);
}
.x_hero_grain{
  position:absolute;inset:0;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events:none;
}
.x_hero_radial{
  position:absolute;bottom:-100px;left:50%;transform:translateX(-50%);
  width:800px;height:400px;
  background:radial-gradient(ellipse,rgba(200,150,90,0.08) 0%,transparent 70%);
  pointer-events:none;
}

/* orbs */
.x_orb{
  position:absolute;border-radius:50%;
  filter:blur(80px);pointer-events:none;
  animation:x_orb_drift 12s ease-in-out infinite alternate;
}
.x_orb--1{width:340px;height:340px;top:5%;left:8%;background:rgba(200,150,90,0.07);animation-delay:0s;}
.x_orb--2{width:260px;height:260px;bottom:10%;right:6%;background:rgba(155,143,212,0.07);animation-delay:-4s;}
.x_orb--3{width:180px;height:180px;top:40%;right:20%;background:rgba(122,184,152,0.05);animation-delay:-8s;}

.x_hero_inner{
  position:relative;z-index:2;
  padding:0 24px;
  opacity:0;transform:translateY(30px);
  transition:opacity 0.9s var(--d-ease),transform 0.9s var(--d-ease);
}
.x_hero_inner.x_visible{opacity:1;transform:translateY(0);}

.x_hero_eyebrow{
  display:flex;align-items:center;justify-content:center;gap:10px;
  margin-bottom:24px;
  font-size:11px;letter-spacing:0.22em;text-transform:uppercase;
  color:var(--d-gold);font-weight:500;
}
.x_hero_line{flex:0 0 50px;height:1px;background:var(--d-border-strong);}
.x_hero_leaf{font-size:14px;animation:x_leaf_sway 4s ease-in-out infinite;}
.x_hero_leaf--flip{transform:scaleX(-1);animation-delay:-2s;}

.x_hero_title{
  font-family:var(--d-font-serif);
  font-size:clamp(52px,10vw,110px);
  font-weight:300;line-height:1.0;
  letter-spacing:-0.02em;
  margin-bottom:22px;
}
.x_hero_title em{
  font-style:italic;color:var(--d-gold-light);
  text-shadow:0 0 80px rgba(232,184,120,0.35);
}
.x_hero_sub{
  font-size:clamp(14px,2vw,17px);
  color:var(--d-text-3);
  max-width:500px;margin:0 auto 48px;
  line-height:1.7;
}
.x_hero_scroll{
  display:inline-flex;align-items:center;justify-content:center;
  width:44px;height:44px;border-radius:50%;
  border:1px solid var(--d-border-strong);
  color:var(--d-gold);text-decoration:none;
  animation:x_bounce 2.2s ease-in-out infinite;
  transition:background var(--d-dur),border-color var(--d-dur);
}
.x_hero_scroll:hover{background:var(--d-gold-subtle);border-color:var(--d-gold);}
.x_scroll_icon{font-size:18px;}

/* ── STATS ── */
.x_stats_section{
  padding:0 24px;
  transform:translateY(-40px);
}
.x_stats_grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:16px;
  max-width:900px;margin:0 auto;
}
.x_stat_card{
  background:var(--d-surface-2);
  border:1px solid var(--d-border);
  border-radius:var(--d-r-lg);
  padding:28px 20px;
  text-align:center;
  transition:border-color var(--d-dur),box-shadow var(--d-dur);
}
.x_stat_card:hover{border-color:var(--d-border-hover);box-shadow:var(--d-shadow-md),var(--d-glow-gold);}
.x_stat_icon{display:block;font-size:20px;color:var(--d-gold);margin-bottom:10px;}
.x_stat_value{display:block;font-family:var(--d-font-serif);font-size:36px;font-weight:600;color:var(--d-gold-light);line-height:1;}
.x_stat_label{display:block;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:var(--d-text-4);margin-top:6px;}

/* ── STORY ── */
.x_story_section{padding:80px 24px 100px;}
.x_story_inner{
  display:grid;grid-template-columns:1fr 1fr;gap:80px;
  max-width:1100px;margin:0 auto;align-items:center;
}
.x_kicker{
  display:inline-block;
  font-size:10px;letter-spacing:0.22em;text-transform:uppercase;
  color:var(--d-gold);
  padding:4px 12px;border:1px solid var(--d-border-strong);border-radius:var(--d-r-pill);
  margin-bottom:16px;
}
.x_section_title{
  font-family:var(--d-font-serif);
  font-size:clamp(30px,4.5vw,50px);
  font-weight:300;line-height:1.15;
  color:var(--d-text-1);margin-bottom:24px;
}
.x_section_title em{font-style:italic;color:var(--d-gold-light);}
.x_body_text{
  font-size:15px;color:var(--d-text-3);line-height:1.75;margin-bottom:16px;
}
.x_story_quote{
  margin-top:32px;
  padding:24px 24px 24px 32px;
  border-left:2px solid var(--d-gold);
  background:var(--d-gold-subtle);
  border-radius:0 var(--d-r-md) var(--d-r-md) 0;
  position:relative;
}
.x_quote_mark{
  position:absolute;top:-8px;left:20px;
  font-family:var(--d-font-serif);font-size:60px;
  color:var(--d-gold);line-height:1;opacity:0.5;
}
.x_story_quote blockquote{
  font-family:var(--d-font-serif);font-style:italic;
  font-size:18px;color:var(--d-gold-pale);line-height:1.5;
  margin-bottom:8px;
}
.x_story_quote cite{font-size:12px;color:var(--d-text-4);letter-spacing:0.08em;}

/* story images */
.x_story_img_stack{position:relative;height:520px;}
.x_story_img--main{
  position:absolute;top:0;right:0;
  width:85%;height:420px;object-fit:cover;
  border-radius:var(--d-r-lg);
  box-shadow:var(--d-shadow-lg);
}
.x_story_img--accent{
  position:absolute;bottom:0;left:0;
  width:55%;height:230px;object-fit:cover;
  border-radius:var(--d-r-md);
  border:3px solid var(--d-surface-2);
  box-shadow:var(--d-shadow-md);
}
.x_story_badge{
  position:absolute;bottom:60px;right:20px;
  background:var(--d-gold);color:var(--d-bg);
  font-family:var(--d-font-serif);font-size:13px;font-weight:600;
  padding:8px 16px;border-radius:var(--d-r-pill);
  letter-spacing:0.06em;
}

/* ── VENUES ── */
.x_venues_section{
  background:var(--d-surface);
  padding:100px 24px;
  border-top:1px solid var(--d-border);
  border-bottom:1px solid var(--d-border);
}
.x_venues_inner{max-width:1100px;margin:0 auto;}
.x_section_head_center{text-align:center;margin-bottom:64px;}
.x_venues_list{display:flex;flex-direction:column;gap:64px;}

.x_venue_card{
  display:grid;grid-template-columns:1fr 1fr;gap:60px;
  align-items:center;
  opacity:0;transform:translateY(32px);
  transition:opacity 0.6s var(--d-ease),transform 0.6s var(--d-ease);
}
.x_venue_card.x_visible{opacity:1;transform:none;}
.x_venue_card--rev{direction:rtl;}
.x_venue_card--rev>*{direction:ltr;}

.x_venue_img_wrap{
  position:relative;border-radius:var(--d-r-lg);overflow:hidden;
  aspect-ratio:4/3;
}
.x_venue_img{width:100%;height:100%;object-fit:cover;transition:transform 0.6s var(--d-ease);}
.x_venue_card:hover .x_venue_img{transform:scale(1.05);}
.x_venue_img_overlay{
  position:absolute;inset:0;
  background:linear-gradient(135deg,var(--accent) 0%,transparent 50%);
  opacity:0.15;
}
.x_venue_icon_badge{
  position:absolute;bottom:16px;left:16px;
  background:var(--accent);color:#fff;
  width:42px;height:42px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-size:18px;box-shadow:var(--d-shadow-sm);
}

.x_venue_body{display:flex;flex-direction:column;gap:12px;}
.x_venue_kicker{
  font-size:10px;letter-spacing:0.20em;text-transform:uppercase;
  color:var(--accent);font-weight:500;
}
.x_venue_name{
  font-family:var(--d-font-serif);
  font-size:clamp(28px,3.5vw,42px);font-weight:300;
  color:var(--d-text-1);
}
.x_venue_desc{font-size:14px;color:var(--d-text-3);line-height:1.75;}
.x_venue_details{list-style:none;display:flex;flex-direction:column;gap:8px;margin-top:8px;}
.x_venue_detail_item{
  display:flex;align-items:center;gap:8px;
  font-size:13px;color:var(--d-text-2);
}
.x_venue_detail_arrow{color:var(--accent);font-size:13px;flex-shrink:0;}

/* ── TIMELINE ── */
.x_timeline_section{padding:100px 24px;}
.x_timeline_inner{max-width:800px;margin:0 auto;}
.x_timeline{position:relative;margin-top:56px;}
.x_tl_track{
  position:absolute;left:90px;top:0;bottom:0;width:1px;
  background:linear-gradient(to bottom,transparent,var(--d-border-strong) 10%,var(--d-border-strong) 90%,transparent);
}
.x_tl_item{
  display:grid;grid-template-columns:90px 16px 1fr;gap:0 20px;
  align-items:flex-start;margin-bottom:48px;
  opacity:0;transform:translateX(-20px);
  transition:opacity 0.55s var(--d-ease),transform 0.55s var(--d-ease);
}
.x_tl_item.x_visible{opacity:1;transform:none;}
.x_tl_year{
  font-family:var(--d-font-serif);font-size:22px;font-weight:600;
  color:var(--d-gold);text-align:right;padding-top:2px;line-height:1;
}
.x_tl_dot{
  width:16px;height:16px;border-radius:50%;
  background:var(--d-surface-2);border:2px solid var(--d-gold);
  margin-top:4px;position:relative;z-index:1;flex-shrink:0;
  transition:background var(--d-dur),box-shadow var(--d-dur);
}
.x_tl_item:hover .x_tl_dot{background:var(--d-gold);box-shadow:0 0 12px var(--d-gold-glow);}
.x_tl_content{padding-bottom:4px;}
.x_tl_title{
  font-family:var(--d-font-serif);font-size:20px;font-weight:400;
  color:var(--d-text-1);margin-bottom:6px;
}
.x_tl_desc{font-size:13px;color:var(--d-text-3);line-height:1.65;}

/* ── TEAM ── */
.x_team_section{
  background:var(--d-surface);
  padding:100px 24px;
  border-top:1px solid var(--d-border);
}
.x_team_inner{max-width:1000px;margin:0 auto;}
.x_team_grid{
  display:grid;grid-template-columns:repeat(3,1fr);gap:28px;
  margin-top:56px;
}
.x_team_card{
  background:var(--d-surface-2);
  border:1px solid var(--d-border);
  border-radius:var(--d-r-lg);overflow:hidden;
  transition:border-color var(--d-dur),transform var(--d-dur) var(--d-spring),box-shadow var(--d-dur);
}
.x_team_card:hover{
  border-color:var(--accent);
  transform:translateY(-5px);
  box-shadow:var(--d-shadow-lg),0 0 30px color-mix(in srgb,var(--accent) 20%,transparent);
}
.x_team_img_wrap{position:relative;aspect-ratio:1/1;overflow:hidden;}
.x_team_img{width:100%;height:100%;object-fit:cover;transition:transform 0.5s var(--d-ease);}
.x_team_card:hover .x_team_img{transform:scale(1.06);}
.x_team_img_glow{
  position:absolute;inset:0;
  background:linear-gradient(to top,var(--d-surface-2) 0%,transparent 50%);
}
.x_team_body{padding:20px 22px 24px;display:flex;flex-direction:column;gap:6px;}
.x_team_name{
  font-family:var(--d-font-serif);font-size:22px;font-weight:400;
  color:var(--d-text-1);
}
.x_team_role{
  font-size:10px;letter-spacing:0.18em;text-transform:uppercase;
  color:var(--accent);font-weight:500;
}
.x_team_bio{font-size:13px;color:var(--d-text-3);line-height:1.65;margin-top:4px;}

/* ── CTA ── */
.x_cta_section{
  position:relative;
  text-align:center;
  padding:100px 24px;
  overflow:hidden;
  background:var(--d-surface-2);
  border-top:1px solid var(--d-border);
}
.x_cta_glow{
  position:absolute;top:-60px;left:50%;transform:translateX(-50%);
  width:600px;height:300px;
  background:radial-gradient(ellipse,var(--d-gold-glow) 0%,transparent 70%);
  pointer-events:none;
}
.x_cta_inner{position:relative;z-index:1;max-width:600px;margin:0 auto;}
.x_cta_spark{font-size:28px;color:var(--d-gold);margin-bottom:16px;display:block;animation:x_spin_slow 8s linear infinite;}
.x_cta_title{font-family:var(--d-font-serif);font-size:clamp(34px,5vw,56px);font-weight:300;margin-bottom:16px;}
.x_cta_title em{font-style:italic;color:var(--d-gold-light);}
.x_cta_sub{font-size:15px;color:var(--d-text-3);margin-bottom:40px;line-height:1.65;}
.x_cta_btns{display:flex;align-items:center;justify-content:center;gap:16px;flex-wrap:wrap;}

.x_btn{
  display:inline-flex;align-items:center;gap:8px;
  padding:14px 28px;border-radius:var(--d-r-pill);
  font-family:var(--d-font-sans);font-size:14px;font-weight:500;
  text-decoration:none;cursor:pointer;
  transition:all var(--d-dur) var(--d-spring);
}
.x_btn--gold{background:var(--d-gold);color:var(--d-bg);}
.x_btn--gold:hover{background:var(--d-gold-light);transform:translateY(-2px);box-shadow:0 8px 24px var(--d-gold-glow);}
.x_btn--ghost{background:none;color:var(--d-gold);border:1px solid var(--d-border-strong);}
.x_btn--ghost:hover{background:var(--d-gold-subtle);border-color:var(--d-gold);transform:translateY(-2px);}

/* ── FOOTER ── */
.x_footer{text-align:center;padding:28px 24px 40px;}
.x_footer_divider{height:1px;background:var(--d-border);max-width:300px;margin:0 auto 20px;}
.x_footer_text{font-size:12px;color:var(--d-text-4);letter-spacing:0.06em;}

/* ── KEYFRAMES ── */
@keyframes x_fadeUp{
  from{opacity:0;transform:translateY(24px);}
  to{opacity:1;transform:translateY(0);}
}
@keyframes x_orb_drift{
  from{transform:translateY(0) translateX(0);}
  to{transform:translateY(-30px) translateX(20px);}
}
@keyframes x_bounce{
  0%,100%{transform:translateY(0);}
  50%{transform:translateY(8px);}
}
@keyframes x_leaf_sway{
  0%,100%{transform:rotate(-8deg);}
  50%{transform:rotate(8deg);}
}
@keyframes x_spin_slow{
  from{transform:rotate(0deg);}
  to{transform:rotate(360deg);}
}

/* ── RESPONSIVE ── */
@media(max-width:900px){
  .x_stats_grid{grid-template-columns:repeat(2,1fr);}
  .x_story_inner{grid-template-columns:1fr;gap:48px;}
  .x_story_img_stack{height:340px;}
  .x_team_grid{grid-template-columns:1fr 1fr;}
  .x_venue_card,.x_venue_card--rev{grid-template-columns:1fr;direction:ltr;}
}
@media(max-width:600px){
  .x_stats_grid{grid-template-columns:repeat(2,1fr);}
  .x_team_grid{grid-template-columns:1fr;}
  .x_hero_title{font-size:clamp(40px,12vw,60px);}
  .x_tl_track,.x_tl_year{display:none;}
  .x_tl_item{grid-template-columns:16px 1fr;}
}
`;