import { useState, useEffect, useRef } from "react";
import {
  FiChevronDown, FiChevronUp, FiX,
  FiArrowRight, FiMail, FiPhone, FiMessageCircle
} from "react-icons/fi";
import {
  GiWineGlass, GiKnifeFork, GiCoffeeCup, GiVineLeaf
} from "react-icons/gi";
import { TbSparkles, TbChefHat, TbHelp } from "react-icons/tb";
import { MdOutlineLocalBar } from "react-icons/md";

/* ─────────────────── DATA ─────────────────── */
const CATEGORIES = [
  { id: "all",        label: "All Questions", icon: <TbSparkles /> },
  { id: "restaurant", label: "Restaurant",    icon: <GiKnifeFork />,  accent: "var(--d-restaurant)" },
  { id: "bar",        label: "Bar",           icon: <MdOutlineLocalBar />, accent: "var(--d-bar)" },
  { id: "cafe",       label: "Café",          icon: <GiCoffeeCup />,  accent: "var(--d-cafe)" },
  { id: "reservations", label: "Reservations", icon: <TbChefHat />,  accent: "var(--d-gold)" },
  { id: "policies",  label: "Policies",       icon: <FiMessageCircle />, accent: "var(--d-room)" },
];

const FAQS = [
  /* ── RESERVATIONS ── */
  {
    id: 1, cat: "reservations",
    q: "How do I make a reservation at DineVerse?",
    a: "You can book a table directly through our website's reservation page, call us on +91 98765 43210, or send us a WhatsApp message. We recommend booking at least 48 hours in advance for weekends and festive days. For large groups of 10 or more, please call us directly.",
    popular: true,
  },
  {
    id: 2, cat: "reservations",
    q: "Is there a minimum spend per person for reservations?",
    a: "The restaurant has a soft minimum spend of ₹1,500 per person during dinner service on Fridays and Saturdays. There is no minimum spend for the café or bar. Private dining packages are quoted separately.",
    popular: false,
  },
  {
    id: 3, cat: "reservations",
    q: "Can I modify or cancel my reservation?",
    a: "You can modify or cancel up to 4 hours before your reservation time with no charge. Cancellations within 4 hours may attract a ₹500 per head no-show fee. Please call or WhatsApp us to make changes.",
    popular: true,
  },
  {
    id: 4, cat: "reservations",
    q: "Do you accept walk-in guests?",
    a: "Yes! We welcome walk-ins at all three venues subject to availability. The café is generally more accommodating for walk-ins. The restaurant and bar tend to fill up quickly on weekends — we always recommend reserving.",
    popular: false,
  },
  /* ── RESTAURANT ── */
  {
    id: 5, cat: "restaurant",
    q: "Is there a dress code at the restaurant?",
    a: "We have a smart casual dress code in the restaurant — think well-fitted clothes, clean footwear, and the confidence to be dressed for the occasion. We gently discourage sportswear, flip-flops, and overly casual attire during dinner service.",
    popular: true,
  },
  {
    id: 6, cat: "restaurant",
    q: "Can you accommodate dietary restrictions and allergies?",
    a: "Absolutely. Our kitchen team can adapt most dishes for vegetarian, vegan, gluten-intolerant, Jain, and other dietary needs. Please inform us at the time of booking or alert your server before ordering. We take allergen information seriously.",
    popular: true,
  },
  {
    id: 7, cat: "restaurant",
    q: "How long does a typical dinner at DineVerse take?",
    a: "A full tasting experience typically runs 2.5 to 3 hours. À la carte dinners average around 90 minutes. We never rush our guests — DineVerse is designed for unhurried dining. If you have a time constraint, let us know and we'll pace the meal accordingly.",
    popular: false,
  },
  {
    id: 8, cat: "restaurant",
    q: "Do you offer private dining or event hosting?",
    a: "Yes. We have a private dining suite that seats up to 18 guests, as well as options for full restaurant buyouts for 64+ guests. Our events team will work with you on a bespoke menu, florals, and entertainment. Contact us at events@dineverse.in.",
    popular: true,
  },
  {
    id: 9, cat: "restaurant",
    q: "Are children welcome at the restaurant?",
    a: "Children are welcome during lunch and early dinner (until 8pm). After 8pm, the restaurant transitions to a quieter ambience that is better suited to adult dining. We have a small children's menu available on request.",
    popular: false,
  },
  /* ── BAR ── */
  {
    id: 10, cat: "bar",
    q: "What is the minimum age to enter the bar?",
    a: "The bar is strictly 21+ with valid government-issued photo ID required at entry. This applies to all guests regardless of whether they intend to consume alcohol. Our bar team reserves the right to refuse entry without a valid ID.",
    popular: true,
  },
  {
    id: 11, cat: "bar",
    q: "Do you serve non-alcoholic cocktails?",
    a: "We have an extensive zero-proof menu crafted with the same care and complexity as our alcoholic cocktails. Highlights include the Saffron Sunrise, the Cardamom Cloud, and our seasonal botanical series. Ask your server for the full mocktail list.",
    popular: true,
  },
  {
    id: 12, cat: "bar",
    q: "Can I request a custom cocktail or bottle service?",
    a: "Our head mixologist Leila Nair and her team are delighted to craft bespoke cocktails tailored to your palate. Bottle service is available for spirits and champagne with advance notice. Please call ahead for bottle service arrangements.",
    popular: false,
  },
  {
    id: 13, cat: "bar",
    q: "Is there live music or entertainment at the bar?",
    a: "We host live jazz on Friday evenings from 8pm and occasional special performances. Follow @dineversesurat on Instagram for upcoming events. The bar also features a curated vinyl playlist on other evenings.",
    popular: false,
  },
  /* ── CAFÉ ── */
  {
    id: 14, cat: "cafe",
    q: "What coffee origins do you serve?",
    a: "We rotate our single-origin offerings quarterly, working with roasters from Coorg, Chikmagalur, Ethiopia (Yirgacheffe), and Colombia. Our house blend is a medium-roast balance of Indian and South American beans. All coffees are roasted fresh and shipped weekly.",
    popular: true,
  },
  {
    id: 15, cat: "cafe",
    q: "Do you have vegan or gluten-free pastry options?",
    a: "Yes! Our pastry chef Rohan maintains a dedicated selection of vegan croissants, gluten-free banana bread, and seasonal fruit tarts. These are baked in a separate oven to minimise cross-contamination — please still alert us if your allergy is severe.",
    popular: false,
  },
  {
    id: 16, cat: "cafe",
    q: "Can I work from the café?",
    a: "The café is a relaxed space during weekday mornings. We welcome laptop workers until 1pm on weekdays. After 1pm and on weekends, we ask that tables be shared during peak hours. We have free Wi-Fi and two dedicated plug sockets per table.",
    popular: true,
  },
  /* ── POLICIES ── */
  {
    id: 17, cat: "policies",
    q: "Is there parking available?",
    a: "Complimentary valet parking is available from 6pm daily at the main entrance on Ring Road. Daytime visitors can use the adjacent Vesu Mall parking (approximately 100m away). The café validates parking for visits of 90 minutes or more.",
    popular: false,
  },
  {
    id: 18, cat: "policies",
    q: "What is your policy on outside food and beverages?",
    a: "Outside food and beverages are not permitted in any of our venues except for special occasion cakes (with prior notice and a ₹500 plating fee). Outside alcohol is strictly not permitted in the restaurant or bar.",
    popular: false,
  },
  {
    id: 19, cat: "policies",
    q: "Do you accept all major credit cards and digital payments?",
    a: "We accept all major credit and debit cards, UPI (Google Pay, PhonePe, Paytm), and cash. We do not add a surcharge for card payments. American Express is accepted at the restaurant and bar but not at the café.",
    popular: true,
  },
  {
    id: 20, cat: "policies",
    q: "Can I purchase a gift card for DineVerse?",
    a: "Yes, DineVerse gift cards are available in denominations of ₹1,000, ₹2,500, ₹5,000, and ₹10,000. They can be purchased at the host desk, via email, or through our website. Gift cards are valid for 12 months from the date of issue.",
    popular: false,
  },
];

/* ─────────────────── HOOK ─────────────────── */
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

/* ─────────────────── FAQ ITEM ─────────────────── */
function FaqItem({ item, isOpen, onToggle, delay = 0 }) {
  const [ref, vis] = useReveal();
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      ref={ref}
      className={`x_faq_item${isOpen ? " x_faq_item--open" : ""}${vis ? " x_faq_item--visible" : ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <button className="x_faq_q_btn" onClick={onToggle} aria-expanded={isOpen}>
        <div className="x_faq_q_left">
          {item.popular && <span className="x_popular_dot" title="Popular question" />}
          <span className="x_faq_q_text">{item.q}</span>
        </div>
        <span className="x_faq_chevron">
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </span>
      </button>
      <div
        className="x_faq_body"
        style={{ maxHeight: height, overflow: "hidden", transition: "max-height 0.42s cubic-bezier(0.25,0.46,0.45,0.94)" }}
      >
        <div ref={bodyRef} className="x_faq_answer">
          {item.a}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── STAT CARD ─────────────────── */
function StatCard({ value, label, icon, delay }) {
  const [ref, vis] = useReveal();
  return (
    <div
      ref={ref}
      className="x_faq_stat"
      style={{ animationDelay: delay, opacity: vis ? undefined : 0, animation: vis ? `x_fadeUp 0.6s var(--d-ease) ${delay} both` : "none" }}
    >
      <span className="x_faq_stat_icon">{icon}</span>
      <span className="x_faq_stat_value">{value}</span>
      <span className="x_faq_stat_label">{label}</span>
    </div>
  );
}

/* ─────────────────── CONTACT BLOCK ─────────────────── */
function ContactCTA() {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} className={`x_faq_cta${vis ? " x_faq_cta--vis" : ""}`}>
      <div className="x_faq_cta_glow" />
      <div className="x_faq_cta_inner">
        <TbHelp className="x_faq_cta_icon" />
        <h3 className="x_faq_cta_title">Still have a <em>question?</em></h3>
        <p className="x_faq_cta_sub">Our team is available daily from 9am to 11pm.</p>
        <div className="x_faq_cta_btns">
          <a href="mailto:hello@dineverse.in" className="x_cta_btn x_cta_btn--gold">
            <FiMail /> Email Us
          </a>
          <a href="tel:+919876543210" className="x_cta_btn x_cta_btn--ghost">
            <FiPhone /> Call Now
          </a>
          <a href="https://wa.me/919876543210" className="x_cta_btn x_cta_btn--wa" target="_blank" rel="noreferrer">
            <FiMessageCircle /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── MAIN PAGE ─────────────────── */
export default function Faq() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState(null);
  const [heroVis, setHeroVis] = useState(false);
  const [showPopular, setShowPopular] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setHeroVis(true), 80);

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [activeCategory, search, showPopular]);

  const filtered = FAQS.filter((f) => {
    const matchCat = activeCategory === "all" || f.cat === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
    const matchPop = !showPopular || f.popular;
    return matchCat && matchSearch && matchPop;
  });

  const toggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  /* group by category for "all" view */
  const groupedView = activeCategory === "all" && !search;
  const groupedCats = CATEGORIES.filter((c) => c.id !== "all");

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
      <div className="x_faq_wrapper">

        {/* ── HERO ── */}
        <header className="x_faq_hero">
          <div className="x_fh_grain" />
          <div className="x_fh_glow" />

          {/* radial rings */}
          <div className="x_fh_rings">
            {[1, 2, 3].map((r) => (
              <div key={r} className="x_fh_ring" style={{ animationDelay: `${r * 0.8}s` }} />
            ))}
          </div>

          <div className={`x_fh_inner${heroVis ? " x_fh_anim" : ""}`}>
            <div className="x_fh_eyebrow">
              <span className="x_fh_line" />
              <GiVineLeaf className="x_fh_leaf" />
              <span>Help Centre</span>
              <GiVineLeaf className="x_fh_leaf x_fh_leaf--flip" />
              <span className="x_fh_line" />
            </div>
            <h1 className="x_fh_title">
              Frequently Asked
              <br /><em>Questions</em>
            </h1>
            <p className="x_fh_sub">
              Everything you need to know before your visit. Can't find your answer? We're just a message away.
            </p>

            {/* popular toggle */}
            <button
              className={`x_popular_toggle${showPopular ? " x_popular_toggle--active" : ""}`}
              onClick={() => setShowPopular((p) => !p)}
            >
              <span className="x_popular_badge">★</span>
              {showPopular ? "Showing popular questions" : "Show popular questions only"}
            </button>
          </div>
        </header>

        {/* ── STATS ── */}
        <div className="x_faq_stats_wrap ">
          <div className="x_faq_stats_grid">
            <StatCard value={`${FAQS.length}+`}   label="Questions Answered"  icon={<TbHelp />}       delay="0s" />
            <StatCard value="5"      label="Topic Categories"   icon={<GiKnifeFork />}   delay="0.10s" />
            <StatCard value="9am–11pm" label="Team Available"  icon={<FiPhone />}        delay="0.20s" />
            <StatCard value="< 2hr"  label="Email Response"    icon={<FiMail />}         delay="0.30s" />
          </div>
        </div>

        {/* ── CATEGORY STRIP ── */}
        <nav className="x_faq_nav reveal reveal-up delay-3">
          <div className="x_faq_nav_inner">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`x_faq_cat_btn${activeCategory === c.id ? " x_faq_cat_btn--active" : ""}`}
                style={activeCategory === c.id && c.accent ? { "--cat-accent": c.accent } : {}}
                onClick={() => { setActiveCategory(c.id); setOpenId(null); }}
              >
                <span className="x_faq_cat_icon">{c.icon}</span>
                {c.label}
                <span className="x_faq_cat_count">
                  {c.id === "all" ? FAQS.length : FAQS.filter((f) => f.cat === c.id).length}
                </span>
              </button>
            ))}
          </div>
        </nav>

        {/* ── FAQ CONTENT ── */}
        <main className="x_faq_main">

          {/* GROUPED VIEW (all + no search) */}
          {groupedView && !showPopular && (
            <div className="x_faq_groups">
              {groupedCats.map((cat) => {
                const items = FAQS.filter((f) => f.cat === cat.id);
                return (
                  <section key={cat.id} className="x_faq_group" style={{ "--cat-accent": cat.accent || "var(--d-gold)" }}>
                    <div className="x_faq_group_head">
                      <span className="x_faq_group_icon">{cat.icon}</span>
                      <div>
                        <h2 className="x_faq_group_title">{cat.label}</h2>
                        <span className="x_faq_group_count">{items.length} questions</span>
                      </div>
                    </div>
                    <div className="x_faq_list">
                      {items.map((item, i) => (
                        <FaqItem
                          key={item.id}
                          item={item}
                          isOpen={openId === item.id}
                          onToggle={() => toggle(item.id)}
                          delay={i * 0.06}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}

          {/* FILTERED / SEARCH VIEW */}
          {(!groupedView || showPopular) && (
            <div className="x_faq_flat">
              {filtered.length > 0 ? (
                <>
                  <div className="x_faq_flat_head">
                    <span className="x_faq_flat_count">{filtered.length} question{filtered.length !== 1 ? "s" : ""}</span>
                    {(search || activeCategory !== "all") && (
                      <button
                        className="x_faq_reset_btn"
                        onClick={() => { setSearch(""); setActiveCategory("all"); setShowPopular(false); }}
                      >
                        Clear filters <FiX />
                      </button>
                    )}
                  </div>
                  <div className="x_faq_list">
                    {filtered.map((item, i) => (
                      <FaqItem
                        key={item.id}
                        item={item}
                        isOpen={openId === item.id}
                        onToggle={() => toggle(item.id)}
                        delay={i * 0.05}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="x_faq_empty">
                  <span className="x_faq_empty_icon">🔍</span>
                  <p>No questions match "<strong>{search || activeCategory}</strong>".</p>
                  <button
                    className="x_faq_reset_btn"
                    onClick={() => { setSearch(""); setActiveCategory("all"); setShowPopular(false); }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          )}
          {/* CONTACT CTA */}
          <ContactCTA />
        </main>
      </div>
    </>
  );
}
