import { useState, useEffect } from "react";
import { 
  FaStar, FaAward, FaGlassMartiniAlt, FaMusic, FaLinkedinIn, FaInstagram, FaTwitter,
  FaLeaf, FaWineBottle, FaRegLightbulb, FaGlobeAmericas, FaHandsHelping, FaConciergeBell
} from 'react-icons/fa';
import { IoRestaurantOutline, IoWineOutline, IoLeafOutline, IoMusicalNotesOutline } from 'react-icons/io5';
import { MdOutlineTheaterComedy, MdOutlineLocalFlorist, MdOutlineOutdoorGrill } from 'react-icons/md';
import { GiGrapes, GiWheat, GiSteak, GiCandleFlame } from 'react-icons/gi';
import { HiOutlineGlobeAlt } from 'react-icons/hi2';
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
    socials: { linkedin: "#", twitter: "#", instagram: "#" }
  },
  {
    id: 2,
    name: "Isabelle Laurent",
    title: "Pastry Chef",
    bio: "Award-winning pastry artist whose desserts are as beautiful as they are divine. Her signature dark chocolate soufflé has earned its own legendary status.",
    specialties: ["Pastry Arts", "Chocolate Work", "Dessert Pairing"],
    img: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=600&q=80",
    featured: false,
    socials: { linkedin: "#", twitter: "#", instagram: "#" }
  },
  {
    id: 3,
    name: "Marco Delacroix",
    title: "Head Mixologist",
    bio: "With a background spanning Tokyo, New York, and London's finest cocktail bars, Marco crafts liquid stories that complement every dining journey at La Noirè.",
    specialties: ["Craft Cocktails", "Barrel Ageing", "Botanical Infusions"],
    img: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=600&q=80",
    featured: false,
    socials: { linkedin: "#", twitter: "#", instagram: "#" }
  },
  {
    id: 4,
    name: "Sophie Renard",
    title: "Sommelier",
    bio: "One of France's youngest certified Master Sommeliers, Sophie's curated wine collection spans six continents and pairs perfectly with every course.",
    specialties: ["Wine Curation", "Food Pairing", "Natural Wines"],
    img: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=600&q=80",
    featured: false,
    socials: { linkedin: "#", twitter: "#", instagram: "#" }
  },
  {
    id: 5,
    name: "Antoine Leclerc",
    title: "Sous Chef",
    bio: "Antoine's mastery of fire and spice brings a bold, unconventional edge to the kitchen. Specialising in wood-fired preparations and smoky depth of flavour.",
    specialties: ["Wood-Fire Cooking", "Charcuterie", "Regional French"],
    img: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=600&q=80",
    featured: false,
    socials: { linkedin: "#", twitter: "#", instagram: "#" }
  },
  {
    id: 6,
    name: "Camille Voss",
    title: "Front-of-House Director",
    bio: "With an unparalleled eye for detail, Camille ensures every guest at La Noirè experiences an evening of impeccable, warm hospitality.",
    specialties: ["Guest Experience", "Event Curation", "Wine Service"],
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80",
    featured: false,
    socials: { linkedin: "#", twitter: "#", instagram: "#" }
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
  { icon: <IoLeafOutline />, title: "Farm to Table", text: "Every ingredient is sourced from trusted local farms and artisan producers. We visit our suppliers personally, ensuring the highest quality from soil to plate." },
  { icon: <IoWineOutline />, title: "Curated Cellars", text: "Our 800-bottle cellar spans celebrated châteaux and hidden gems. Each selection is curated to complement and elevate your dining experience." },
  { icon: <GiCandleFlame />, title: "Intimate Ambience", text: "Candlelit tables, bespoke acoustics, and a dedication to unhurried time. La Noirè is designed to make every evening feel like the only evening." },
  { icon: <MdOutlineTheaterComedy />, title: "Living Culture", text: "Monthly chef's table events, wine tastings, and culinary workshops ensure La Noirè remains a living, breathing cultural destination." },
  { icon: <HiOutlineGlobeAlt />, title: "Sustainable Craft", text: "From zero-waste kitchen practices to biodegradable packaging, our commitment to the planet is as serious as our commitment to flavour." },
  { icon: <FaConciergeBell />, title: "Exceptional Service", text: "Our team is trained to anticipate every need — warm, knowledgeable, and genuinely delighted to make your evening unforgettable." },
];

const AWARDS = [
  { icon: <FaStar />, name: "Michelin ★★", year: "2023 — 2024" },
  { icon: <FaAward />, name: "Best Restaurant", year: "Paris Eats 2022" },
  { icon: <FaGlassMartiniAlt />, name: "Top 50 Bars", year: "World's Best 2023" },
  { icon: <IoLeafOutline />, name: "Sustainable Dining", year: "Green Fork 2024" },
];

const AMBIENCE_IMAGES = [
  { img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80", label: "Main Dining Room" },
  { img: "https://images.unsplash.com/photo-1600210492090-a159ffa3aeaf?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", label: "Private Terrace" },
  { img: "https://images.unsplash.com/photo-1539639885136-56332d18071d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", label: "Bar Noirè" },
  { img: "https://images.unsplash.com/photo-1572715376701-98568319fd0b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDZ8fHxlbnwwfHx8fHw%3D", label: "Chef's Table" },
  { img: "https://images.unsplash.com/photo-1609238000857-303bf54099b1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", label: "Wine Cellar" },
  { img: "https://images.unsplash.com/photo-1759164955435-98462e76bfca?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", label: "Garden Terrace" },
];

const AMBIENCE_CARDS = [
  { icon: <GiCandleFlame />, title: "The Dining Room", text: "Vaulted ceilings, candlelit tables for two, and velvet booths for six. The main dining room seats 48 in an atmosphere of deep noir luxury, where every table feels like your own private world." },
  { icon: <MdOutlineLocalFlorist />, title: "The Open Terrace", text: "Draped in climbing jasmine and lit by a thousand fairy lights, our terrasse is Paris at its most romantic — the perfect setting for a summer evening beneath the stars." },
  { icon: <FaGlassMartiniAlt />, title: "Bar Noirè", text: "Low-lit and deeply seductive, the bar lounge is a late-night world of rare cognacs, smoked old fashioneds, and jazz so close you can feel the bass. Open until 2AM Wednesday through Sunday." },
];

// ─────────────────────────────────────────────
//  COMPONENT
// ─────────────────────────────────────────────
export default function About() {
  const [activeTeamFilter, setActiveTeamFilter] = useState("All");
  const filters = ["All", "Kitchen", "Bar", "Service"];

  useEffect(() => {
    window.scrollTo(0, 0);

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
  }, [activeTeamFilter]);

  const filteredTeam = TEAM.filter(m => {
    if (activeTeamFilter === "All") return true;
    if (activeTeamFilter === "Kitchen") return ["Executive Chef & Founder","Pastry Chef","Sous Chef"].includes(m.title);
    if (activeTeamFilter === "Bar") return ["Head Mixologist","Sommelier"].includes(m.title);
    if (activeTeamFilter === "Service") return ["Front-of-House Director"].includes(m.title);
    return true;
  });

  return (
    <div className="h_about_page">

      {/* ── Atmosphere ── */}
      <div className="h_ambient_bg" />
      <div className="h_grid_lines" />
      <div className="h_grain_overlay" />

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
            <div className="col-lg-5 reveal reveal-left">
              <div className="h_story_img_wrap" style={{ paddingBottom: "1.25rem", paddingRight: "1.25rem" }}>
                <div className="h_story_img_frame">
                  <img
                    src="https://plus.unsplash.com/premium_photo-1663840277963-17291c6a0086?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
            <div className="col-lg-7 reveal reveal-right">
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
                    { icon: <GiWheat />, text: "Locally Sourced Ingredients" },
                    { icon: <FaStar />, text: "Two Michelin Stars" },
                    { icon: <IoWineOutline />, text: "800-Bottle Wine Cellar" },
                    { icon: <HiOutlineGlobeAlt />, text: "Zero-Waste Kitchen" },
                    { icon: <FaMusic />, text: "Live Jazz — Thursdays" },
                    { icon: <GiSteak />, text: "Aged In-House Charcuterie" },
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
            <div className="col-xl-5 reveal reveal-left">
              <div className="h_section_head">
                <div className="h_section_eyebrow">Our Journey</div>
                <h2 className="h_section_title">
                  Two Decades of <em>Craft & Character</em>
                </h2>
                <p className="h_section_subtitle">
                  From a single-room cellar to a two-starred institution — the milestones that shaped who we are today.
                </p>
              </div>
              <div className="h_timeline">
                {TIMELINE.map((t, i) => (
                  <div className={`h_timeline_item reveal reveal-up delay-${(i % 5) + 1}`} key={t.year}>
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
            <div className="col-xl-7 reveal reveal-right" style={{ marginTop: "0" }}>
              <div className="h_section_head" style={{ marginTop: "0.5rem" }}>
                <div className="h_section_eyebrow">Our Philosophy</div>
                <h2 className="h_section_title">
                  The <em>Principles</em> We Live By
                </h2>
              </div>
              <div className="h_values_row">
                {VALUES.map((v, i) => (
                  <div
                    className={`h_value_card reveal reveal-up delay-${(i % 3) + 1}`}
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
          <div className="text-center mb-4 reveal reveal-up">
            <div className="h_section_eyebrow" style={{ justifyContent: "center" }}>Recognition</div>
            <h2 className="h_section_title" style={{ textAlign: "center" }}>
              Honoured by the <em>World's Best</em>
            </h2>
          </div>
          <div className="h_awards_row">
            {AWARDS.map((a, i) => (
              <div className={`h_award_item reveal reveal-up delay-${(i % 4) + 1}`} key={a.name}>
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
          <div className="h_section_head text-center reveal reveal-up">
            <div className="h_section_eyebrow" style={{ justifyContent: "center" }}>The People Behind the Magic</div>
            <h2 className="h_section_title" style={{ textAlign: "center" }}>
              Meet Our <em>Extraordinary Team</em>
            </h2>
            <p className="h_section_subtitle" style={{ margin: "0 auto", textAlign: "center", maxWidth: "600px" }}>
              Every great experience is built by extraordinary people. Ours combine classical training, bold creativity, and an unwavering passion for hospitality.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="d-flex justify-content-center gap-2 flex-wrap mb-5 reveal reveal-up delay-2">
            {filters.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveTeamFilter(f)}
                className={`h_filter_btn ${activeTeamFilter === f ? 'h_active' : ''}`}>
                {f}
              </button>
            ))}
          </div>

          <div className="h_team_grid">
            {filteredTeam.map((member, i) => (
              <div
                className={`h_chef_card reveal reveal-up delay-${(i % 3) + 1} ${member.featured ? "h_featured" : ""}`}
                key={member.id}
              >
                <div className="h_chef_img_wrap">
                  <div className="h_chef_hover_overlay" />
                  <span className="h_chef_role_tag">{member.title}</span>
                  <img src={member.img} alt={member.name} />
                  {member.featured && (
                    <div className="h_chef_featured_badge">
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
                    <a href={member.socials.linkedin} className="h_social_btn"><FaLinkedinIn /></a>
                    <a href={member.socials.twitter} className="h_social_btn"><FaTwitter /></a>
                    <a href={member.socials.instagram} className="h_social_btn"><FaInstagram /></a>
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
          <div className="h_section_head text-center reveal reveal-up">
            <div className="h_section_eyebrow" style={{ justifyContent: "center" }}>The Space</div>
            <h2 className="h_section_title" style={{ textAlign: "center" }}>
              An Atmosphere Like <em>Nowhere Else</em>
            </h2>
            <p className="h_section_subtitle" style={{ margin: "0 auto", textAlign: "center" }}>
              Designed by award-winning studio Atelier Fontenay, our space balances intimacy with drama — a place that feels unmistakably alive.
            </p>
          </div>

          {/* Photo Mosaic */}
          <div className="h_ambience_grid reveal reveal-scale">
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
                className={`h_amb_desc_card reveal reveal-up delay-${(i % 3) + 1}`}
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

    </div>
  );
}