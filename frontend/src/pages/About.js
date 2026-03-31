import { useState } from "react";
import "../style/h_style.css";

// ─────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────
const TEAM = [
  {
    id: 1,
    name: "Étienne Moreau",
    title: "Executive Chef & Founder",
    bio: "Trained under Michelin-starred mentors in Lyon and Paris, Chef Étienne brings 22 years of culinary mastery to every plate at La Noirè. His philosophy: let the finest seasonal ingredients speak for themselves.",
    specialties: ["French Cuisine", "Molecular Gastronomy", "Seasonal Menus"],
    img: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=80",
    featured: true,
  },
  {
    id: 2,
    name: "Isabelle Laurent",
    title: "Pastry Chef",
    bio: "Award-winning pastry artist whose desserts are as beautiful as they are divine. Her signature dark chocolate soufflé has earned its own legendary status.",
    specialties: ["Pastry Arts", "Chocolate Work", "Dessert Pairing"],
    img: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=600&q=80",
    featured: false,
  },
  {
    id: 3,
    name: "Marco Delacroix",
    title: "Head Mixologist",
    bio: "With a background spanning Tokyo, New York, and London's finest cocktail bars, Marco crafts liquid stories that complement every dining journey at La Noirè.",
    specialties: ["Craft Cocktails", "Barrel Ageing", "Botanical Infusions"],
    img: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=600&q=80",
    featured: false,
  },
  {
    id: 4,
    name: "Sophie Renard",
    title: "Sommelier",
    bio: "One of France's youngest certified Master Sommeliers, Sophie's curated wine collection spans six continents and pairs perfectly with every course.",
    specialties: ["Wine Curation", "Food Pairing", "Natural Wines"],
    img: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&q=80",
    featured: false,
  },
  {
    id: 5,
    name: "Antoine Leclerc",
    title: "Sous Chef",
    bio: "Antoine's mastery of fire and spice brings a bold, unconventional edge to the kitchen. Specialising in wood-fired preparations and smoky depth of flavour.",
    specialties: ["Wood-Fire Cooking", "Charcuterie", "Regional French"],
    img: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=600&q=80",
    featured: false,
  },
  {
    id: 6,
    name: "Camille Voss",
    title: "Front-of-House Director",
    bio: "With an unparalleled eye for detail, Camille ensures every guest at La Noirè experiences an evening of impeccable, warm hospitality.",
    specialties: ["Guest Experience", "Event Curation", "Wine Service"],
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80",
    featured: false,
  },
];

const TIMELINE = [
  { year: "2006", title: "A Dream Takes Shape", desc: "Chef Étienne returns from Paris with a singular vision — a place where French tradition meets contemporary soul, tucked away on a quiet Parisian side street." },
  { year: "2009", title: "First Michelin Recognition", desc: "Just three years in, La Noirè earned its first Michelin star, heralding a new era of prestige and drawing guests from across the globe." },
  { year: "2014", title: "The Bar Lounge Opens", desc: "The iconic Bar Noirè — a low-lit world of rare spirits and artisan cocktails — extended our hospitality into the night, becoming one of the city's most celebrated cocktail destinations." },
  { year: "2018", title: "Renovation & Reinvention", desc: "A full redesign unveiled La Noirè's signature dark-luxe interior — emerald accents, vaulted ceilings, and the bespoke lighting that guests now photograph from every angle." },
  { year: "2023", title: "The Second Star", desc: "Our proudest moment: a second Michelin star awarded, placing La Noirè among the finest restaurants in Europe and fulfilling a dream years in the making." },
];

const VALUES = [
  { icon: "🌿", title: "Farm to Table", text: "Every ingredient is sourced from trusted local farms and artisan producers. We visit our suppliers personally, ensuring the highest quality from soil to plate." },
  { icon: "🍷", title: "Curated Cellars", text: "Our 800-bottle cellar spans celebrated châteaux and hidden gems. Each selection is curated to complement and elevate your dining experience." },
  { icon: "🕯️", title: "Intimate Ambience", text: "Candlelit tables, bespoke acoustics, and a dedication to unhurried time. La Noirè is designed to make every evening feel like the only evening." },
  { icon: "🎭", title: "Living Culture", text: "Monthly chef's table events, wine tastings, and culinary workshops ensure La Noirè remains a living, breathing cultural destination." },
  { icon: "🌍", title: "Sustainable Craft", text: "From zero-waste kitchen practices to biodegradable packaging, our commitment to the planet is as serious as our commitment to flavour." },
  { icon: "✨", title: "Exceptional Service", text: "Our team is trained to anticipate every need — warm, knowledgeable, and genuinely delighted to make your evening unforgettable." },
];

const AWARDS = [
  { icon: "⭐", name: "Michelin ★★", year: "2023 — 2024" },
  { icon: "🏆", name: "Best Restaurant", year: "Paris Eats 2022" },
  { icon: "🍸", name: "Top 50 Bars", year: "World's Best 2023" },
  { icon: "🌿", name: "Sustainable Dining", year: "Green Fork 2024" },
];

const TESTIMONIALS = [
  { text: "An evening at La Noirè doesn't just satisfy the palate — it nourishes the soul. The most extraordinary restaurant experience of my life.", author: "Juliette M.", source: "TripAdvisor — 5 Stars", stars: "★★★★★" },
  { text: "Chef Étienne's tasting menu is a journey through emotion and memory. Every course arrived as a surprise, every bite a revelation.", author: "Thomas B.", source: "Google Reviews — 5 Stars", stars: "★★★★★" },
  { text: "The bar alone is worth the visit. Marco's cocktails are pure theatre. I've been back four times this year and will return for a fifth.", author: "Céline D.", source: "Yelp — 5 Stars", stars: "★★★★★" },
];

const AMBIENCE_IMAGES = [
  { img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80", label: "Main Dining Room" },
  { img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", label: "Private Terrace" },
  { img: "https://images.unsplash.com/photo-1550966871-3ed3cfd6fac9?w=800&q=80", label: "Bar Noirè" },
  { img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80", label: "Chef's Table" },
  { img: "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800&q=80", label: "Wine Cellar" },
  { img: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80", label: "Garden Terrace" },
];

const AMBIENCE_CARDS = [
  { icon: "🕯️", title: "The Dining Room", text: "Vaulted ceilings, candlelit tables for two, and velvet booths for six. The main dining room seats 48 in an atmosphere of deep noir luxury, where every table feels like your own private world." },
  { icon: "🌿", title: "The Open Terrace", text: "Draped in climbing jasmine and lit by a thousand fairy lights, our terrasse is Paris at its most romantic — the perfect setting for a summer evening beneath the stars." },
  { icon: "🥂", title: "Bar Noirè", text: "Low-lit and deeply seductive, the bar lounge is a late-night world of rare cognacs, smoked old fashioneds, and jazz so close you can feel the bass. Open until 2AM Wednesday through Sunday." },
];

// ─────────────────────────────────────────────
//  COMPONENT
// ─────────────────────────────────────────────
export default function About() {
  const [activeTeamFilter, setActiveTeamFilter] = useState("All");
  const filters = ["All", "Kitchen", "Bar", "Service"];

  const filteredTeam = TEAM.filter(m => {
    if (activeTeamFilter === "All") return true;
    if (activeTeamFilter === "Kitchen") return ["Executive Chef & Founder","Pastry Chef","Sous Chef"].includes(m.title);
    if (activeTeamFilter === "Bar") return ["Head Mixologist","Sommelier"].includes(m.title);
    if (activeTeamFilter === "Service") return ["Front-of-House Director"].includes(m.title);
    return true;
  });

  return (
    <div className="h_about_page" style={{ backgroundColor: "#060c10" }}>

      {/* ── Atmosphere ── */}
      <div className="h_ambient_bg" />
      <div className="h_grid_lines" />
      <div className="h_grain_overlay" />

      {/* ══════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════ */}
      <nav className="h_navbar navbar navbar-expand-lg">
        <div className="container">
          <a className="h_nav_brand" href="#">La <span>Noirè</span></a>
          <button className="h_nav_toggler navbar-toggler" type="button"
            data-bs-toggle="collapse" data-bs-target="#navMenu">
            <div className="h_toggler_icon"><span /><span /><span /></div>
          </button>
          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-auto gap-4 py-3 py-lg-0">
              {["Menu", "Cocktails", "Events", "Reserve", "Contact"].map(n => (
                <li key={n} className="nav-item">
                  <a className="h_nav_link nav-link" href="#">{n}</a>
                </li>
              ))}
              <li className="nav-item">
                <a className="h_nav_link h_active nav-link" href="#">About</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="h_about_hero">
        <div className="h_hero_img_bg" />
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-xl-7">
              <div className="h_hero_content">
                <div className="h_hero_eyebrow h_anim_in">
                  <span className="h_eyebrow_line" />
                  Est. 2006 · Paris
                </div>
                <h1 className="h_hero_title h_anim_up h_d1">
                  More Than a Meal —<br />
                  <em>A Story Worth Tasting</em>
                </h1>
                <p className="h_hero_tagline h_anim_up h_d2">
                  "We don't just cook food. We craft moments that linger long after the last course, long after the last sip, long after you've left our door."
                </p>
                <p className="h_anim_up h_d2" style={{ fontSize: "0.72rem", color: "var(--h-muted)", letterSpacing: "0.1em" }}>
                  — Chef Étienne Moreau, Founder
                </p>

                <div className="h_hero_stats h_anim_up h_d3" style={{ marginTop: "2.5rem" }}>
                  {[
                    { num: "18+", label: "Years of Excellence" },
                    { num: "★★",  label: "Michelin Stars" },
                    { num: "42k", label: "Guests Per Year" },
                    { num: "800", label: "Label Wine Cellar" },
                  ].map(s => (
                    <div className="h_stat_item" key={s.label}>
                      <span className="h_stat_number">{s.num}</span>
                      <span className="h_stat_label">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h_scroll_indicator">
          <div className="h_scroll_line" />
          <div className="h_scroll_dot" />
        </div>
      </section>

      {/* ══════════════════════════════════════
          OUR STORY
      ══════════════════════════════════════ */}
      <section className="h_section">
        <div className="container">
          <div className="row g-5 align-items-center">
            {/* Images */}
            <div className="col-lg-5 h_anim_right h_d1">
              <div className="h_story_img_wrap" style={{ paddingBottom: "1.25rem", paddingRight: "1.25rem" }}>
                <div className="h_story_img_frame">
                  <img
                    src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80"
                    alt="La Noirè dining room"
                  />
                </div>
                <div className="h_img_badge">
                  <span className="h_img_badge_num">★★</span>
                  <span className="h_img_badge_text">Michelin Stars</span>
                </div>
              </div>
            </div>

            {/* Story text */}
            <div className="col-lg-7 h_anim_up h_d2">
              <div className="h_story_body">
                <div className="h_section_head">
                  <div className="h_section_eyebrow">Our Story</div>
                  <h2 className="h_section_title">
                    Born from a Passion for <em>Authentic Flavour</em>
                  </h2>
                  <div className="h_ornament">
                    <span className="h_ornament_line" />
                    <span className="h_ornament_dot" />
                    <span className="h_ornament_diamond" />
                    <span className="h_ornament_dot" />
                    <span className="h_ornament_line h_rev" />
                  </div>
                </div>

                <p className="h_story_lead">
                  "I didn't open a restaurant. I opened a place where time slows down and every detail matters."
                </p>

                <p className="h_story_text">
                  La Noirè was born in 2006 from Chef Étienne Moreau's singular obsession: to create a space that felt like the best dinner party you'd ever been to — intimate, unexpected, and unforgettable. Starting with just 18 covers in a candlelit stone cellar, our first guests became our greatest advocates.
                </p>
                <p className="h_story_text">
                  Over nearly two decades, La Noirè has evolved from a beloved neighbourhood secret into one of Paris's most celebrated dining destinations. Our tasting menus rotate with the seasons, our bar programme rivals the world's finest, and our private dining room has hosted proposals, anniversaries, and quiet celebrations of life's most precious moments.
                </p>
                <p className="h_story_text">
                  What has never changed: the belief that exceptional food, great wine, and genuine hospitality — offered without pretension — remain the most radical act of generosity a chef can offer.
                </p>

                <div className="h_story_features h_d3">
                  {[
                    { icon: "🌾", text: "Locally Sourced Ingredients" },
                    { icon: "🏅", text: "Two Michelin Stars" },
                    { icon: "🍷", text: "800-Bottle Wine Cellar" },
                    { icon: "🌍", text: "Zero-Waste Kitchen" },
                    { icon: "🎶", text: "Live Jazz — Thursdays" },
                    { icon: "🥩", text: "Aged In-House Charcuterie" },
                  ].map(f => (
                    <div className="h_story_feat" key={f.text}>
                      <span className="h_story_feat_icon">{f.icon}</span>
                      <span>{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TIMELINE
      ══════════════════════════════════════ */}
      <section className="h_section h_section_alt">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 h_anim_up">
              <div className="h_section_head">
                <div className="h_section_eyebrow">Our Journey</div>
                <h2 className="h_section_title">
                  Two Decades of <em>Craft & Character</em>
                </h2>
                <p className="h_section_subtitle">
                  From a single-room cellar to a two-starred institution — the milestones that shaped who we are today.
                </p>
              </div>
              <div className="h_timeline h_anim_up h_d2">
                {TIMELINE.map((t, i) => (
                  <div className="h_timeline_item" key={t.year}>
                    <div className="h_timeline_dot">
                      <div className="h_timeline_dot_inner" />
                    </div>
                    <div>
                      <div className="h_timeline_year">{t.year}</div>
                      <div className="h_timeline_event">
                        <strong>{t.title}</strong>
                        {t.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Values */}
            <div className="col-lg-7 h_anim_up h_d2" style={{ marginTop: "0" }}>
              <div className="h_section_head" style={{ marginTop: "0.5rem" }}>
                <div className="h_section_eyebrow">Our Philosophy</div>
                <h2 className="h_section_title">
                  The <em>Principles</em> We Live By
                </h2>
              </div>
              <div className="h_values_row">
                {VALUES.map((v, i) => (
                  <div
                    className={`h_value_card h_anim_up`}
                    style={{ animationDelay: `${0.08 * (i + 1)}s` }}
                    key={v.title}
                  >
                    <div className="h_value_icon_wrap">{v.icon}</div>
                    <div className="h_value_title">{v.title}</div>
                    <p className="h_value_text">{v.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          AWARDS
      ══════════════════════════════════════ */}
      <section className="h_section" style={{ padding: "3rem 0" }}>
        <div className="container">
          <div className="text-center mb-4 h_anim_up">
            <div className="h_section_eyebrow" style={{ justifyContent: "center" }}>Recognition</div>
            <h2 className="h_section_title" style={{ textAlign: "center" }}>
              Honoured by the <em>World's Best</em>
            </h2>
          </div>
          <div className="h_awards_row h_anim_up h_d2">
            {AWARDS.map(a => (
              <div className="h_award_item" key={a.name}>
                <span className="h_award_icon">{a.icon}</span>
                <div className="h_award_name">{a.name}</div>
                <div className="h_award_year">{a.year}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TEAM / CHEFS
      ══════════════════════════════════════ */}
      <section className="h_section h_section_alt">
        <div className="container">
          <div className="h_section_head text-center h_anim_up">
            <div className="h_section_eyebrow" style={{ justifyContent: "center" }}>The People Behind the Magic</div>
            <h2 className="h_section_title" style={{ textAlign: "center" }}>
              Meet Our <em>Extraordinary Team</em>
            </h2>
            <p className="h_section_subtitle" style={{ margin: "0 auto", textAlign: "center" }}>
              Every great experience is built by extraordinary people. Ours combine classical training, bold creativity, and an unwavering passion for hospitality.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="d-flex justify-content-center gap-2 flex-wrap mb-4 h_anim_up h_d2">
            {filters.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveTeamFilter(f)}
                style={{
                  padding: "0.4rem 1.2rem",
                  borderRadius: "100px",
                  border: `1px solid ${activeTeamFilter === f ? "var(--h-em)" : "rgba(0,201,138,0.16)"}`,
                  background: activeTeamFilter === f ? "var(--h-em-dim)" : "transparent",
                  color: activeTeamFilter === f ? "var(--h-em)" : "var(--h-muted)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.25s",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 400,
                  boxShadow: activeTeamFilter === f ? "0 0 12px rgba(0,201,138,0.15)" : "none",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="h_team_grid">
            {filteredTeam.map((member, i) => (
              <div
                className={`h_chef_card h_anim_up ${member.featured ? "h_featured" : ""}`}
                style={{ animationDelay: `${0.1 * (i + 1)}s` }}
                key={member.id}
              >
                <div className="h_chef_img_wrap">
                  <div className="h_chef_hover_overlay" />
                  <span className="h_chef_role_tag">{member.title}</span>
                  <img src={member.img} alt={member.name} />
                  {member.featured && (
                    <div style={{
                      position: "absolute", bottom: "1rem", right: "1rem",
                      zIndex: 5,
                      background: "var(--h-em)",
                      color: "var(--h-bg-root)",
                      padding: "0.25rem 0.7rem",
                      borderRadius: "100px",
                      fontSize: "0.58rem",
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}>
                      Featured
                    </div>
                  )}
                </div>
                <div className="h_chef_info">
                  <div className="h_chef_name">{member.name}</div>
                  <div className="h_chef_title">{member.title}</div>
                  <p className="h_chef_bio">{member.bio}</p>
                  <div className="h_chef_specialty">
                    {member.specialties.map(s => (
                      <span className="h_chef_tag" key={s}>{s}</span>
                    ))}
                  </div>
                  <div className="h_chef_social">
                    {["in", "tw", "ig"].map(s => (
                      <a key={s} href="#" className="h_social_btn">{s === "in" ? "𝐢𝐧" : s === "tw" ? "𝕏" : "📷"}</a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          AMBIENCE
      ══════════════════════════════════════ */}
      <section className="h_section">
        <div className="container">
          <div className="h_section_head text-center h_anim_up">
            <div className="h_section_eyebrow" style={{ justifyContent: "center" }}>The Space</div>
            <h2 className="h_section_title" style={{ textAlign: "center" }}>
              An Atmosphere Like <em>Nowhere Else</em>
            </h2>
            <p className="h_section_subtitle" style={{ margin: "0 auto", textAlign: "center" }}>
              Designed by award-winning studio Atelier Fontenay, our space balances intimacy with drama — a place that feels unmistakably alive.
            </p>
          </div>

          {/* Photo Mosaic */}
          <div className="h_ambience_grid h_anim_up h_d1">
            {AMBIENCE_IMAGES.map((item, i) => (
              <div className={`h_amb_item h_amb_${i + 1}`} key={i}>
                <img src={item.img} alt={item.label} />
                <span className="h_amb_label">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Ambience description cards */}
          <div className="h_ambience_cards">
            {AMBIENCE_CARDS.map((c, i) => (
              <div
                className={`h_amb_desc_card h_anim_up`}
                style={{ animationDelay: `${0.12 * (i + 1)}s` }}
                key={c.title}
              >
                <span className="h_amb_desc_icon">{c.icon}</span>
                <div className="h_amb_desc_title">{c.title}</div>
                <p className="h_amb_desc_text">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════ */}
      <section className="h_section h_section_alt">
        <div className="container">
          <div className="h_section_head text-center h_anim_up">
            <div className="h_section_eyebrow" style={{ justifyContent: "center" }}>Guest Stories</div>
            <h2 className="h_section_title" style={{ textAlign: "center" }}>
              Words That <em>Mean Everything</em>
            </h2>
          </div>
          <div className="h_testimonials">
            {TESTIMONIALS.map((t, i) => (
              <div
                className={`h_testi_card h_anim_up`}
                style={{ animationDelay: `${0.12 * (i + 1)}s` }}
                key={i}
              >
                <div className="h_testi_quote">"</div>
                <div className="h_testi_stars">{t.stars}</div>
                <p className="h_testi_text">{t.text}</p>
                <div className="h_testi_author">
                  <img
                    className="h_testi_avatar"
                    src={`https://i.pravatar.cc/80?img=${10 + i}`}
                    alt={t.author}
                  />
                  <div>
                    <div className="h_testi_name">{t.author}</div>
                    <div className="h_testi_source">{t.source}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BAND
      ══════════════════════════════════════ */}
      <div className="h_cta_band">
        <div className="container">
          <h2 className="h_cta_title h_anim_up">
            Ready for Your <em>La Noirè Evening</em>?
          </h2>
          <p className="h_cta_subtitle h_anim_up h_d2">
            Reserve your table today. Tasting menu available nightly — advance booking recommended.
          </p>
          <div className="h_cta_btns h_anim_up h_d3">
            <a href="#" className="h_btn_primary">Reserve a Table →</a>
            <a href="#" className="h_btn_secondary">View Our Menu</a>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="h_footer">
        <div className="h_footer_brand">La Noirè</div>
        <div className="h_footer_text">© 2025 La Noirè · 12 Rue de la Paix, Paris</div>
        <div className="h_footer_links">
          {["Privacy", "Terms", "Accessibility", "Sitemap"].map(l => (
            <a key={l} href="#" className="h_footer_link">{l}</a>
          ))}
        </div>
      </footer>

    </div>
  );
}