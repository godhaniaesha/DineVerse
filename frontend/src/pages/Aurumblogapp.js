import { useState, useEffect, useRef, useCallback } from "react";
import {
  FiArrowLeft, FiArrowRight, FiClock, FiEye, FiHeart,
  FiShare2, FiBookmark, FiSearch, FiX, FiChevronRight,
  FiCalendar, FiUser, FiTag, FiTrendingUp, FiZap
} from "react-icons/fi";
import { GiWineGlass, GiKnifeFork, GiCoffeeCup, GiVineLeaf, GiQuillInk } from "react-icons/gi";
import { TbSparkles, TbChefHat, TbFlame, TbQuote } from "react-icons/tb";

/* ═══════════════════════════════════════════
   ROOT CSS + FONT IMPORT
═══════════════════════════════════════════ */
const ROOT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

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
  --d-text-3:         #7a7060;
  --d-text-4:         #4a4438;
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
  --d-r-xs:4px; --d-r-sm:8px; --d-r-md:14px; --d-r-lg:22px; --d-r-xl:32px; --d-r-pill:999px;
  --d-font-serif: 'Cormorant Garamond','Georgia',serif;
  --d-font-sans:  'DM Sans',system-ui,sans-serif;
  --d-ease:   cubic-bezier(0.25,0.46,0.45,0.94);
  --d-spring: cubic-bezier(0.34,1.56,0.64,1);
  --d-dur:    0.30s;
  --d-header-h: 80px;
  --d-strip-h:  38px;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
`;

/* ═══════════════════════════════════════════
   DATA
═══════════════════════════════════════════ */
const AUTHORS = {
  arjun: {
    name: "Arjun Mehta", role: "Executive Chef",
    bio: "15 years across Michelin-starred kitchens in Paris and Tokyo. Back home to tell India's story through food.",
    avatar: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=120&q=80",
    accent: "var(--d-restaurant)",
  },
  leila: {
    name: "Leila Nair", role: "Head Mixologist",
    bio: "World Cocktail Champion 2022. She treats every glass as a canvas, every sip as a first sentence.",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&q=80",
    accent: "var(--d-bar)",
  },
  rohan: {
    name: "Rohan Shah", role: "Pastry & Café Lead",
    bio: "Trained in Vienna and Copenhagen. Spiced chai, cardamom and sourdough are his love languages.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&q=80",
    accent: "var(--d-cafe)",
  },
};

const POSTS = [
  {
    id: "wagyu-a5",
    tag: "Restaurant", tagColor: "var(--d-restaurant)", tagDim: "var(--d-restaurant-dim)",
    featured: true,
    title: "The Art of the Perfect Wagyu — What Makes A5 Different",
    subtitle: "We travelled to Miyazaki to understand the farmers, the cattle, and the aging that turns a cut of beef into emotional memory.",
    excerpt: "We travelled to the Miyazaki prefecture to understand the cattle, the farmers and the six‑month aging process that turns a cut of beef into an emotional experience on the plate.",
    author: "arjun",
    date: "12 June 2024", readTime: "8 min", views: "4.2k", likes: 318,
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=1400&q=85",
    thumbImg: "https://images.unsplash.com/photo-1544025162-d76694265947?w=700&q=80",
    content: [
      { type: "lead", text: "There is a moment, usually somewhere between the first and second bite of a properly prepared A5 Wagyu, when conversation stops. Not from rudeness — from reverence." },
      { type: "h2", text: "What 'A5' Actually Means" },
      { type: "p", text: "Japan's beef grading system is meticulous to the point of poetry. The 'A' in A5 refers to yield grade (how much usable meat from the carcass), and the '5' is the quality score — the maximum — assessed across four criteria: marbling, colour & brightness of meat, firmness & texture, and colour, lustre & quality of fat." },
      { type: "p", text: "Marbling is graded on the Beef Marbling Standard (BMS) from 1 to 12. An A5 must score 8 or above. The cattle we visited in Miyazaki prefecture were scoring consistent 10s and 11s — a result of genetics, feed, and a care regimen that would embarrass most wellness retreats." },
      { type: "quote", text: "You don't cook Wagyu. You warm it. The fat is so finely threaded through the muscle that the meat essentially bastes itself at low heat.", author: "Arjun Mehta, Executive Chef" },
      { type: "h2", text: "The Farmer's Philosophy" },
      { type: "p", text: "Yoshida-san has been raising Tajima cattle — the specific bloodline that Kobe Wagyu must come from — for 34 years. His farm outside Miyazaki is home to 40 cattle at any given time. He knows each one by name. He plays classical music in the barn because, he says with absolute seriousness, it reduces their cortisol." },
      { type: "p", text: "Low cortisol means less tension in the muscle. Less tension means finer marbling. The science checks out. The dedication is something else entirely." },
      { type: "h2", text: "How We Serve It at DineVerse" },
      { type: "p", text: "Our Wagyu Burnt Ends are 48-hour braised A5 short rib, finished in a josper oven with smoked bone marrow butter, served with pickled shallots that cut through the richness, and a reduction made from the braising liquor that took our kitchen two weeks to perfect. The plate exists to get out of the beef's way." },
      { type: "p", text: "It is, we believe, the most honest thing we've ever served." },
    ],
  },
  {
    id: "butterfly-pea-cocktail",
    tag: "Bar", tagColor: "var(--d-bar)", tagDim: "var(--d-bar-dim)",
    featured: false,
    title: "Butterfly Pea & Yuzu: Engineering Colour in a Glass",
    subtitle: "How our head mixologist uses pH-sensitive botanicals to create cocktails that shift colour as you sip them.",
    excerpt: "How our head mixologist Leila Nair uses pH-sensitive botanicals to create cocktails that shift colour as you sip them — science dressed as magic.",
    author: "leila",
    date: "28 May 2024", readTime: "6 min", views: "3.1k", likes: 241,
    img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1400&q=85",
    thumbImg: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=700&q=80",
    content: [
      { type: "lead", text: "The Midnight Empress starts deep indigo. By the time you finish it, it is soft violet. No sleight of hand — just chemistry, intention, and a flower that has been used in South-East Asian cuisine for centuries." },
      { type: "h2", text: "The Science of pH-Sensitive Colour" },
      { type: "p", text: "Butterfly pea (Clitoria ternatea) contains anthocyanins — pigments that shift colour in response to acidity. In a neutral solution, they appear deep blue. Add citrus (lower pH), and they turn violet, then pink. This isn't a trick. It's botany." },
      { type: "p", text: "We cold-steep the dried flowers in London Dry gin for 48 hours, then filter. The resulting infusion is a jewel-dark indigo. When we add yuzu — sharper and more floral than lemon — the glass begins its transition in real time." },
      { type: "quote", text: "A cocktail that changes as you drink it forces you to be present. You can't be on your phone if your drink is putting on a show.", author: "Leila Nair, Head Mixologist" },
      { type: "h2", text: "Building the Midnight Empress" },
      { type: "p", text: "Beyond the butterfly pea gin and yuzu, the Empress uses elderflower liqueur for a green, herbaceous sweetness, a salted egg-white foam for texture and a visual contrast of white against the indigo, and three drops of activated charcoal tincture that pool at the top before dispersing." },
      { type: "p", text: "The result is a cocktail that rewards patience. The longer you wait before stirring, the more dramatic the gradient. We recommend waiting until you can't." },
    ],
  },
  {
    id: "single-origin-coffee",
    tag: "Café", tagColor: "var(--d-cafe)", tagDim: "var(--d-cafe-dim)",
    featured: false,
    title: "Single-Origin or Blend? Our Honest Guide to Morning Coffee",
    subtitle: "Rohan breaks down the difference — and why neither answer is actually wrong.",
    excerpt: "Rohan breaks down the difference between a traceable Ethiopian Yirgacheffe and a house blend — and why neither answer is wrong.",
    author: "rohan",
    date: "14 May 2024", readTime: "5 min", views: "2.8k", likes: 192,
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1400&q=85",
    thumbImg: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80",
    content: [
      { type: "lead", text: "The coffee world has a single-origin snobbery problem. It implies that traceability is inherently more virtuous than craft blending — which is like saying a solo violinist is categorically better than an orchestra." },
      { type: "h2", text: "The Case for Single-Origin" },
      { type: "p", text: "A single-origin coffee tells you exactly where it came from — a specific farm, a specific region, sometimes a specific lot or processing method. Our current Ethiopian Yirgacheffe comes from the Kochere district at 1,900m elevation. It tastes of jasmine, bergamot and peach. You can taste the altitude in it." },
      { type: "p", text: "This specificity makes single-origins ideal for filter methods — pour-over, Chemex, AeroPress — where the coffee's individual character can express itself without the masking effect of milk or pressure." },
      { type: "quote", text: "Single-origin is a conversation with a place. A good blend is a conversation with a roaster's vision. Both are worth having.", author: "Rohan Shah, Café Lead" },
      { type: "h2", text: "The Case for Blending" },
      { type: "p", text: "Our house blend — DineVerse Morning — is a 60/40 split of Coorg Arabica and Colombian Huila. The Coorg brings body and a dark chocolate bass note. The Colombian brings the bright, acidic top notes and a caramel sweetness that survives milk and steam. Together they are something neither is alone." },
      { type: "p", text: "Blends are built for consistency and for espresso. When a coffee needs to cut through 200ml of steamed oat milk and still taste like coffee, you want a blend." },
    ],
  },
  {
    id: "truffle-risotto",
    tag: "Recipes", tagColor: "var(--d-gold)", tagDim: "var(--d-gold-subtle)",
    featured: false,
    title: "Truffle Risotto: The Carnaroli Secret Our Kitchen Swears By",
    subtitle: "Perfect risotto isn't about constant stirring — it's about temperature control and knowing when to stop.",
    excerpt: "Perfect risotto isn't about constant stirring — it's about temperature control, starch release and knowing when to stop.",
    author: "arjun",
    date: "2 May 2024", readTime: "10 min", views: "5.7k", likes: 439,
    img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=1400&q=85",
    thumbImg: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=700&q=80",
    content: [
      { type: "lead", text: "Every Italian grandmother will tell you something different about risotto. Which means either they're all wrong or they're all right, and the truth lives somewhere in the rice itself." },
      { type: "h2", text: "Why Carnaroli and Not Arborio" },
      { type: "p", text: "Arborio is the risotto rice you know. Carnaroli is the one Italian chefs actually use. It has a higher starch content, a firmer centre, and — crucially — a much longer window between perfectly cooked and overcooked. For a restaurant kitchen, that window is the difference between a beautiful plate and a catastrophe." },
      { type: "quote", text: "Arborio forgives you once. Carnaroli gives you time to think.", author: "Arjun Mehta, Executive Chef" },
      { type: "h2", text: "The Mantecatura — The Secret Step" },
      { type: "p", text: "Mantecatura is the final step: removing the risotto from heat, adding cold butter cut into small cubes, and vigorously stirring to emulsify. The temperature contrast — hot risotto, cold butter — creates a creamy, glossy sauce that coats every grain. This is what separates restaurant risotto from home risotto." },
      { type: "p", text: "Add the Parmigiano only after the butter is incorporated. Add the truffle shavings only after you've plated. Black truffle's volatile aromatics evaporate rapidly at heat — they belong in your nose, not your pan." },
    ],
  },
  {
    id: "sunday-brunch-philosophy",
    tag: "Culture", tagColor: "var(--d-cafe)", tagDim: "var(--d-cafe-dim)",
    featured: false,
    title: "Why We Banned the Clock During Sunday Brunch",
    subtitle: "Hospitality is the architecture of time. We changed our Sunday by removing all urgency.",
    excerpt: "Hospitality is the architecture of time. We changed our Sunday experience by simply removing all urgency — and here's what happened to our guests.",
    author: "arjun",
    date: "5 Apr 2024", readTime: "4 min", views: "6.2k", likes: 511,
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=85",
    thumbImg: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80",
    content: [
      { type: "lead", text: "For three years, we turned tables twice on Sunday lunch. We were efficient. We were profitable. And we were, we eventually realised, providing a fundamentally rushed experience in a space designed for the opposite." },
      { type: "h2", text: "The Experiment" },
      { type: "p", text: "In January 2024, we tried something terrifying: we told our Sunday lunch guests that there was no time limit on their table. We reduced covers from 64 to 32. We trained our team to follow the guest's pace, not the other way around. We removed the visible clock from our dining room." },
      { type: "quote", text: "The best hospitality is invisible. You only notice it when it's gone.", author: "Arjun Mehta, Executive Chef" },
      { type: "h2", text: "What Happened" },
      { type: "p", text: "Average table time went from 95 minutes to 2 hours 20 minutes. Revenue per table went up 34%. Review scores for 'atmosphere' and 'service' both jumped a full point on Google and Zomato. Three tables cried. One couple got engaged. One family told us it was the best meal they'd had in ten years." },
      { type: "p", text: "We haven't turned back. Sunday lunch at DineVerse is now unhurried by design. The kitchen knows. The team knows. The guests, most of the time, figure it out within the first course." },
    ],
  },
];

/* ═══════════════════════════════════════════
   SHARED HOOK: INTERSECTION REVEAL
═══════════════════════════════════════════ */
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

/* ═══════════════════════════════════════════
   SHARED NAVBAR
═══════════════════════════════════════════ */
function Navbar({ currentPage, onNavigate }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`x_navbar${scrolled ? " x_navbar--scrolled" : ""}`}>
      <div className="x_navbar_inner">
        <button className="x_nav_logo" onClick={() => onNavigate("blog-list")}>
          <GiVineLeaf className="x_nav_leaf" />
          <span>DineVerse</span>
          <GiVineLeaf className="x_nav_leaf x_nav_leaf--flip" />
        </button>
        <div className="x_nav_links">
          {[
            { key: "blog-list", label: "Journal" },
            { key: "history", label: "Our History" },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`x_nav_link${currentPage === key || (currentPage === "blog-detail" && key === "blog-list") ? " x_nav_link--active" : ""}`}
              onClick={() => onNavigate(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <button className="x_nav_reserve" onClick={() => {}}>
          Reserve a Table
        </button>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════
   PAGE: BLOG LIST
═══════════════════════════════════════════ */
function BlogListPage({ onNavigate }) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [heroVis, setHeroVis] = useState(false);
  const [likedIds, setLikedIds] = useState(new Set());

  useEffect(() => { window.scrollTo(0, 0); setTimeout(() => setHeroVis(true), 80); }, []);

  const tags = ["All", ...Array.from(new Set(POSTS.map((p) => p.tag)))];
  const filtered = POSTS.filter((p) => {
    const matchTag = activeTag === "All" || p.tag === activeTag;
    const q = search.toLowerCase();
    return matchTag && (!q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q));
  });
  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  const toggleLike = (id, e) => {
    e.stopPropagation();
    setLikedIds((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  return (
    <div className="x_page_wrapper">
      {/* HERO */}
      <header className="x_bl_hero">
        <div className="x_bl_hero_noise" />
        <div className="x_bl_hero_glow" />
        <div className="x_bl_hero_lines">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="x_bl_hero_line" style={{ animationDelay: `${i * 0.5}s`, left: `${8 + i * 13}%` }} />
          ))}
        </div>
        <div className={`x_bl_hero_content${heroVis ? " x_vis" : ""}`}>
          <div className="x_eyebrow">
            <span className="x_eyebrow_line" /><GiQuillInk className="x_eyebrow_icon" /><span>DineVerse Journal</span><span className="x_eyebrow_line" />
          </div>
          <h1 className="x_bl_hero_title">
            Stories of<br /><em>Taste & Craft</em>
          </h1>
          <p className="x_bl_hero_sub">Dispatches from our kitchen, bar and café — written by the people who make DineVerse.</p>

          <div className="x_bl_search_wrap">
            <FiSearch className="x_bl_search_icon" />
            <input className="x_bl_search" placeholder="Search articles…" value={search} onChange={(e) => setSearch(e.target.value)} />
            {search && <button className="x_bl_search_clear" onClick={() => setSearch("")}><FiX /></button>}
          </div>
        </div>

        {/* floating pills */}
        <div className={`x_bl_pills${heroVis ? " x_vis_delay" : ""}`}>
          {[{ icon: <GiKnifeFork />, l: "Restaurant" }, { icon: <GiWineGlass />, l: "Bar" }, { icon: <GiCoffeeCup />, l: "Café" }].map(({ icon, l }) => (
            <span key={l} className="x_bl_pill">{icon}{l}</span>
          ))}
        </div>
      </header>

      {/* TAG STRIP */}
      <nav className="x_bl_tag_strip">
        <div className="x_bl_tag_inner">
          {tags.map((t) => (
            <button key={t} className={`x_bl_tag_btn${activeTag === t ? " x_bl_tag_btn--on" : ""}`} onClick={() => setActiveTag(t)}>{t}</button>
          ))}
        </div>
      </nav>

      {/* CONTENT */}
      <main className="x_bl_main">

        {/* FEATURED */}
        {featured && (
          <section className="x_bl_section">
            <div className="x_bl_section_label"><TbSparkles /> Editor's Pick</div>
            <FeaturedCard post={featured} liked={likedIds.has(featured.id)} onLike={toggleLike} onRead={() => onNavigate("blog-detail", featured.id)} />
          </section>
        )}

        {/* GRID */}
        {rest.length > 0 && (
          <section className="x_bl_section">
            <div className="x_bl_section_label"><GiQuillInk /> {search ? `Results` : "Latest Articles"} <span className="x_bl_count">{rest.length}</span></div>
            <div className="x_bl_grid">
              {rest.map((post, i) => (
                <BlogCard key={post.id} post={post} delay={i * 0.08} liked={likedIds.has(post.id)} onLike={toggleLike} onRead={() => onNavigate("blog-detail", post.id)} />
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <div className="x_bl_empty">
            <span>📖</span><p>No articles match your filters.</p>
            <button className="x_btn_ghost" onClick={() => { setSearch(""); setActiveTag("All"); }}>Reset</button>
          </div>
        )}

        {/* SIDEBAR TRENDING */}
        <section className="x_bl_trending_section">
          <div className="x_bl_section_label"><FiTrendingUp /> Most Read</div>
          <div className="x_bl_trending_row">
            {[...POSTS].sort((a, b) => b.likes - a.likes).slice(0, 3).map((p, i) => (
              <button key={p.id} className="x_bl_trending_card" onClick={() => onNavigate("blog-detail", p.id)}>
                <span className="x_bl_trending_rank">{String(i + 1).padStart(2, "0")}</span>
                <img src={p.thumbImg} alt="" className="x_bl_trending_img" />
                <div className="x_bl_trending_info">
                  <span className="x_bl_trending_tag" style={{ color: p.tagColor }}>{p.tag}</span>
                  <p className="x_bl_trending_title">{p.title}</p>
                  <span className="x_bl_trending_meta"><FiClock />{p.readTime} read · {p.views} views</span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      <PageFooter />
    </div>
  );
}

/* FEATURED CARD */
function FeaturedCard({ post, liked, onLike, onRead }) {
  const [ref, vis] = useReveal(0.05);
  const author = AUTHORS[post.author];
  return (
    <article ref={ref} className={`x_feat_card${vis ? " x_vis" : ""}`} style={{ "--tc": post.tagColor, "--td": post.tagDim }}>
      <div className="x_fc_img_wrap" onClick={onRead}>
        <img src={post.thumbImg} alt={post.title} className="x_fc_img" loading="lazy" />
        <div className="x_fc_overlay" />
        <div className="x_fc_overlay_bot" />
        <span className="x_fc_tag_badge">{post.tag}</span>
      </div>
      <div className="x_fc_body">
        <div className="x_fc_meta"><FiClock />{post.readTime} read<span className="x_meta_dot">·</span><FiEye />{post.views}</div>
        <h2 className="x_fc_title" onClick={onRead}>{post.title}</h2>
        <p className="x_fc_subtitle">{post.subtitle}</p>
        <div className="x_fc_foot">
          <div className="x_fc_author">
            <img src={author.avatar} alt={author.name} className="x_avatar" />
            <div><p className="x_author_name">{author.name}</p><p className="x_author_sub">{author.role} · {post.date}</p></div>
          </div>
          <div className="x_fc_actions">
            <button className={`x_like_btn${liked ? " x_liked" : ""}`} onClick={(e) => onLike(post.id, e)}>
              <FiHeart /> {liked ? post.likes + 1 : post.likes}
            </button>
            <button className="x_read_btn" onClick={onRead}>Read <FiArrowRight /></button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* BLOG CARD */
function BlogCard({ post, delay, liked, onLike, onRead }) {
  const [ref, vis] = useReveal();
  const author = AUTHORS[post.author];
  return (
    <article ref={ref} className={`x_blog_card${vis ? " x_vis" : ""}`} style={{ "--tc": post.tagColor, "--td": post.tagDim, animationDelay: `${delay}s` }}>
      <div className="x_bcard_img_wrap" onClick={onRead}>
        <img src={post.thumbImg} alt={post.title} className="x_bcard_img" loading="lazy" />
        <span className="x_bcard_tag">{post.tag}</span>
        <div className="x_bcard_hover_line" />
      </div>
      <div className="x_bcard_body">
        <div className="x_bcard_meta"><FiClock />{post.readTime}<span className="x_meta_dot">·</span>{post.date}</div>
        <h3 className="x_bcard_title" onClick={onRead}>{post.title}</h3>
        <p className="x_bcard_excerpt">{post.excerpt}</p>
        <div className="x_bcard_foot">
          <div className="x_bcard_author">
            <img src={author.avatar} alt="" className="x_avatar x_avatar--sm" />
            <span className="x_author_name">{author.name}</span>
          </div>
          <button className={`x_like_btn x_like_btn--sm${liked ? " x_liked" : ""}`} onClick={(e) => onLike(post.id, e)}>
            <FiHeart />{liked ? post.likes + 1 : post.likes}
          </button>
        </div>
        <button className="x_bcard_read" onClick={onRead}>Read Article <FiChevronRight /></button>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════
   PAGE: BLOG DETAIL
═══════════════════════════════════════════ */
function BlogDetailPage({ postId, onNavigate }) {
  const [progress, setProgress] = useState(0);
  const [heroVis, setHeroVis] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const articleRef = useRef(null);

  const post = POSTS.find((p) => p.id === postId) || POSTS[0];
  const author = AUTHORS[post.author];
  const related = POSTS.filter((p) => p.id !== post.id && p.tag === post.tag).slice(0, 2);
  const moreRelated = related.length < 2 ? POSTS.filter((p) => p.id !== post.id).slice(0, 2 - related.length) : [];
  const allRelated = [...related, ...moreRelated];

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setHeroVis(true), 80);
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const read = Math.max(0, Math.min(1, -top / (height - window.innerHeight)));
      setProgress(read * 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [postId]);

  return (
    <div className="x_page_wrapper">
      {/* PROGRESS BAR */}
      <div className="x_progress_bar" style={{ width: `${progress}%` }} />

      {/* HERO */}
      <header className="x_bd_hero">
        <div className="x_bd_hero_img_wrap">
          <img src={post.img} alt={post.title} className="x_bd_hero_img" />
          <div className="x_bd_hero_overlay" />
        </div>
        <div className={`x_bd_hero_content${heroVis ? " x_vis" : ""}`}>
          <button className="x_bd_back_btn" onClick={() => onNavigate("blog-list")}>
            <FiArrowLeft /> Back to Journal
          </button>
          <div className="x_bd_tag_row">
            <span className="x_bd_tag" style={{ color: post.tagColor, background: post.tagDim }}>{post.tag}</span>
            <span className="x_bd_meta"><FiClock />{post.readTime} read</span>
            <span className="x_bd_meta"><FiEye />{post.views} views</span>
            <span className="x_bd_meta"><FiCalendar />{post.date}</span>
          </div>
          <h1 className="x_bd_title">{post.title}</h1>
          <p className="x_bd_subtitle">{post.subtitle}</p>
          <div className="x_bd_author_row">
            <img src={author.avatar} alt={author.name} className="x_avatar x_avatar--lg" />
            <div>
              <p className="x_author_name">{author.name}</p>
              <p className="x_author_sub">{author.role}</p>
            </div>
          </div>
        </div>
      </header>

      {/* ARTICLE */}
      <div className="x_bd_layout">
        <article className="x_bd_article" ref={articleRef}>
          {post.content.map((block, i) => <ContentBlock key={i} block={block} />)}

          {/* Tags / Share */}
          <div className="x_bd_article_foot">
            <div className="x_bd_tags">
              <FiTag className="x_bd_tag_icon" />
              {[post.tag, author.role.split(" ")[0]].map((t) => (
                <span key={t} className="x_bd_tag_chip">{t}</span>
              ))}
            </div>
            <div className="x_bd_foot_actions">
              <button className={`x_action_btn${liked ? " x_action_btn--active" : ""}`} onClick={() => setLiked((p) => !p)}>
                <FiHeart /> {liked ? post.likes + 1 : post.likes}
              </button>
              <button className={`x_action_btn${bookmarked ? " x_action_btn--active" : ""}`} onClick={() => setBookmarked((p) => !p)}>
                <FiBookmark />
              </button>
              <button className="x_action_btn" onClick={() => navigator.share?.({ title: post.title, url: window.location.href })}>
                <FiShare2 />
              </button>
            </div>
          </div>

          {/* Author bio */}
          <div className="x_author_bio_card" style={{ "--ac": author.accent }}>
            <img src={author.avatar} alt={author.name} className="x_avatar x_avatar--xl" />
            <div>
              <p className="x_author_bio_name">{author.name}</p>
              <p className="x_author_bio_role">{author.role}</p>
              <p className="x_author_bio_text">{author.bio}</p>
            </div>
          </div>
        </article>

        {/* STICKY SIDEBAR */}
        <aside className="x_bd_sidebar">
          <div className="x_bd_sidebar_inner">
            <div className="x_bd_sidebar_actions">
              <button className={`x_sb_action${liked ? " x_sb_action--liked" : ""}`} onClick={() => setLiked((p) => !p)} title="Like">
                <FiHeart />
              </button>
              <button className={`x_sb_action${bookmarked ? " x_sb_action--saved" : ""}`} onClick={() => setBookmarked((p) => !p)} title="Save">
                <FiBookmark />
              </button>
              <button className="x_sb_action" onClick={() => navigator.share?.({ title: post.title })} title="Share">
                <FiShare2 />
              </button>
            </div>
            <div className="x_sb_progress_wrap">
              <div className="x_sb_progress_track">
                <div className="x_sb_progress_fill" style={{ height: `${progress}%` }} />
              </div>
              <span className="x_sb_progress_label">{Math.round(progress)}%</span>
            </div>
          </div>
        </aside>
      </div>

      {/* RELATED */}
      {allRelated.length > 0 && (
        <section className="x_bd_related">
          <div className="x_bd_related_inner">
            <div className="x_bl_section_label"><TbSparkles /> Continue Reading</div>
            <div className="x_bl_grid x_bl_grid--related">
              {allRelated.map((p, i) => (
                <RelatedCard key={p.id} post={p} delay={i * 0.1} onRead={() => onNavigate("blog-detail", p.id)} />
              ))}
            </div>
          </div>
        </section>
      )}

      <PageFooter />
    </div>
  );
}

/* CONTENT BLOCK */
function ContentBlock({ block }) {
  const [ref, vis] = useReveal(0.08);
  if (block.type === "lead") return (
    <p ref={ref} className={`x_content_lead${vis ? " x_vis" : ""}`}>{block.text}</p>
  );
  if (block.type === "h2") return (
    <h2 ref={ref} className={`x_content_h2${vis ? " x_vis" : ""}`}>{block.text}</h2>
  );
  if (block.type === "p") return (
    <p ref={ref} className={`x_content_p${vis ? " x_vis" : ""}`}>{block.text}</p>
  );
  if (block.type === "quote") return (
    <blockquote ref={ref} className={`x_content_quote${vis ? " x_vis" : ""}`}>
      <TbQuote className="x_quote_icon" />
      <p className="x_quote_text">{block.text}</p>
      <cite className="x_quote_cite">— {block.author}</cite>
    </blockquote>
  );
  return null;
}

/* RELATED CARD */
function RelatedCard({ post, delay, onRead }) {
  const [ref, vis] = useReveal();
  return (
    <article ref={ref} className={`x_blog_card${vis ? " x_vis" : ""}`} style={{ "--tc": post.tagColor, "--td": post.tagDim, animationDelay: `${delay}s` }}>
      <div className="x_bcard_img_wrap" onClick={onRead}>
        <img src={post.thumbImg} alt={post.title} className="x_bcard_img" />
        <span className="x_bcard_tag">{post.tag}</span>
      </div>
      <div className="x_bcard_body">
        <div className="x_bcard_meta"><FiClock />{post.readTime}<span className="x_meta_dot">·</span>{post.date}</div>
        <h3 className="x_bcard_title" onClick={onRead}>{post.title}</h3>
        <button className="x_bcard_read" onClick={onRead}>Read <FiChevronRight /></button>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════
   PAGE: OUR HISTORY
═══════════════════════════════════════════ */
const TIMELINE = [
  { year: "2019", season: "March", title: "Three Doors, One Vision", icon: <TbSparkles />,
    desc: "DineVerse opens simultaneously as a restaurant, bar, and café in Surat's Vesu district. The premise is simple and terrifying: to run three distinct hospitality experiences under one roof without compromising any of them.",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80", color: "var(--d-restaurant)" },
  { year: "2019", season: "November", title: "First Chef's Table Event", icon: <TbChefHat />,
    desc: "Arjun Mehta hosts DineVerse's inaugural 8-course chef's table for 14 guests. The menu — a conversation between classical French technique and Indian flavour memory — receives its first standing ovation.",
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", color: "var(--d-gold)" },
  { year: "2020", season: "April", title: "Surviving the Shutdown", icon: <FiZap />,
    desc: "The pandemic closes our doors for four months. We launch DineVerse at Home — a delivery experience with mise en place kits, pre-recorded video plating guides, and handwritten notes from the kitchen team. 800 families cook with us.",
    img: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80", color: "var(--d-bar)" },
  { year: "2021", season: "February", title: "Gujarat Culinary Guild Award", icon: <TbSparkles />,
    desc: "DineVerse is named 'Best New Restaurant in Gujarat' by the Culinary Guild — two years into our existence, judged against restaurants that had been open for decades. We celebrated with a 12-course dinner for our entire team.",
    img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80", color: "var(--d-gold)" },
  { year: "2022", season: "January", title: "Leila Joins — The Bar Transforms", icon: <GiWineGlass />,
    desc: "Leila Nair, World Cocktail Champion 2022, joins as Head Mixologist. Within six months, our bar becomes a destination in its own right. The Midnight Empress cocktail goes viral. The bar is fully booked on weekends for the first time.",
    img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80", color: "var(--d-bar)" },
  { year: "2023", season: "March", title: "Expansion & Private Dining", icon: <GiKnifeFork />,
    desc: "We add a private dining suite (18 seats), a rooftop terrace for sundowners, and a dedicated pastry kitchen. Rohan Shah joins to lead the café and pastry program. The croissant waitlist becomes a local phenomenon.",
    img: "https://i.pinimg.com/736x/76/60/17/766017678c850c8b522adefa9a27eeaa.jpg", color: "var(--d-cafe)" },
  { year: "2024", season: "June", title: "12,000 Guests. Still Counting.", icon: <FiHeart />,
    desc: "DineVerse has now hosted over 12,000 guests across all three venues. A Michelin Guide inspector has visited twice (we know, because they always order the Wagyu). We still write handwritten birthday cards for every guest who books a celebration.",
    img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80", color: "var(--d-gold)" },
];

const VALUES = [
  { icon: <TbChefHat />, title: "Craft Without Compromise", text: "Every decision — from the rice variety in our risotto to the gin botanical in our house cocktail — is made with intention. We never cut corners on ingredients or technique.", accent: "var(--d-restaurant)" },
  { icon: <FiHeart />, title: "Hospitality as Love", text: "We believe that making someone feel genuinely welcomed is an act of care. Our team trains not just in service skills but in human perception — how to read a table, how to give people what they need before they ask.", accent: "var(--d-gold)" },
  { icon: <GiVineLeaf />, title: "Roots & Memory", text: "Indian food carries memory. We cook with one foot in classical tradition and one in India's extraordinary diversity of flavour. Every dish on our menu is a conversation between then and now.", accent: "var(--d-cafe)" },
  { icon: <TbSparkles />, title: "The Unhurried Moment", text: "We design for lingering. Our spaces, our pacing, our music — all of it is calibrated to slow time down. The best things in hospitality cannot be rushed.", accent: "var(--d-bar)" },
];

function HistoryPage({ onNavigate }) {
  const [heroVis, setHeroVis] = useState(false);
  const [activeYear, setActiveYear] = useState("2019");
  useEffect(() => { window.scrollTo(0, 0); setTimeout(() => setHeroVis(true), 80); }, []);
  const years = [...new Set(TIMELINE.map((t) => t.year))];

  return (
    <div className="x_page_wrapper">
      {/* HERO */}
      <header className="x_hist_hero">
        <div className="x_hist_noise" />
        <div className="x_hist_glow_top" />
        <div className="x_hist_glow_bot" />
        {/* diagonal rule */}
        <div className="x_hist_rule" />

        <div className={`x_hist_hero_content${heroVis ? " x_vis" : ""}`}>
          <div className="x_eyebrow">
            <span className="x_eyebrow_line" /><GiVineLeaf className="x_eyebrow_icon" /><span>Since 2019</span><GiVineLeaf className="x_eyebrow_icon x_eyebrow_flip" /><span className="x_eyebrow_line" />
          </div>
          <h1 className="x_hist_title">
            Our <em>History</em>
          </h1>
          <p className="x_hist_sub">Five years. Three venues. Thousands of moments. This is how DineVerse came to be.</p>
        </div>

        {/* large year display */}
        <div className={`x_hist_bg_year${heroVis ? " x_vis" : ""}`}>2019</div>
        <div className="x_hist_orb x_hist_orb--l" />
        <div className="x_hist_orb x_hist_orb--r" />
      </header>

      {/* YEAR NAV */}
      <nav className="x_hist_year_nav">
        <div className="x_hist_year_track" />
        <div className="x_hist_year_inner">
          {years.map((y) => (
            <button
              key={y}
              className={`x_hist_year_btn${activeYear === y ? " x_hist_year_btn--active" : ""}`}
              onClick={() => {
                setActiveYear(y);
                const el = document.getElementById(`x_year_${y}`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {y}
            </button>
          ))}
        </div>
      </nav>

      {/* TIMELINE */}
      <main className="x_hist_main">
        {years.map((year) => {
          const yearItems = TIMELINE.filter((t) => t.year === year);
          return (
            <div key={year} id={`x_year_${year}`} className="x_hist_year_block">
              <div className="x_hist_year_label">
                <span className="x_hist_year_num">{year}</span>
                <div className="x_hist_year_line" />
              </div>
              <div className="x_hist_events">
                {yearItems.map((item, idx) => (
                  <HistoryCard key={`${year}-${idx}`} item={item} idx={idx} />
                ))}
              </div>
            </div>
          );
        })}

        {/* VALUES */}
        <ValuesSection />

        {/* FOUNDERS NOTE */}
        <FoundersNote />

        {/* CTA */}
        <HistoryCTA onNavigate={onNavigate} />
      </main>

      <PageFooter />
    </div>
  );
}

function HistoryCard({ item, idx }) {
  const [ref, vis] = useReveal(0.1);
  const isEven = idx % 2 === 0;
  return (
    <article
      ref={ref}
      className={`x_hist_card${vis ? " x_vis" : ""}${isEven ? "" : " x_hist_card--rev"}`}
      style={{ "--hc": item.color, animationDelay: `${idx * 0.1}s` }}
    >
      <div className="x_hist_card_img_col">
        <div className="x_hist_card_img_wrap">
          <img src={item.img} alt={item.title} className="x_hist_card_img" loading="lazy" />
          <div className="x_hist_card_img_overlay" />
          <span className="x_hist_card_season">{item.season} {item.year}</span>
        </div>
      </div>
      <div className="x_hist_card_body">
        <span className="x_hist_card_icon" style={{ background: `color-mix(in srgb,${item.color} 15%,transparent)`, color: item.color }}>{item.icon}</span>
        <h3 className="x_hist_card_title">{item.title}</h3>
        <p className="x_hist_card_desc">{item.desc}</p>
        <div className="x_hist_card_accent_line" />
      </div>
    </article>
  );
}

function ValuesSection() {
  const [ref, vis] = useReveal(0.05);
  return (
    <section ref={ref} className={`x_values_section${vis ? " x_vis" : ""}`}>
      <div className="x_values_head">
        <span className="x_kicker">What We Believe</span>
        <h2 className="x_values_title">The Principles That<br /><em>Guide Everything</em></h2>
      </div>
      <div className="x_values_grid">
        {VALUES.map((v, i) => (
          <ValueCard key={v.title} value={v} delay={i * 0.1} />
        ))}
      </div>
    </section>
  );
}

function ValueCard({ value, delay }) {
  const [ref, vis] = useReveal();
  return (
    <div
      ref={ref}
      className="x_value_card"
      style={{ "--ac": value.accent, animationDelay: `${delay}s`, opacity: vis ? undefined : 0, animation: vis ? `x_fadeUp 0.6s var(--d-ease) ${delay}s both` : "none" }}
    >
      <span className="x_value_icon">{value.icon}</span>
      <h4 className="x_value_title">{value.title}</h4>
      <p className="x_value_text">{value.text}</p>
    </div>
  );
}

function FoundersNote() {
  const [ref, vis] = useReveal(0.08);
  return (
    <div ref={ref} className={`x_founders_note${vis ? " x_vis" : ""}`}>
      <div className="x_fn_glow" />
      <div className="x_fn_inner">
        <TbQuote className="x_fn_quote_icon" />
        <blockquote className="x_fn_quote">
          We didn't set out to build a 'restaurant brand'. We set out to build a home — a place where people could eat extraordinary food, drink interesting things, and feel genuinely cared for. Everything else followed from that.
        </blockquote>
        <div className="x_fn_sig">
          <img src="https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=80&q=80" alt="Arjun" className="x_avatar x_avatar--lg" />
          <div>
            <p className="x_fn_name">Arjun Mehta</p>
            <p className="x_fn_role">Founder & Executive Chef, DineVerse</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HistoryCTA({ onNavigate }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} className={`x_hist_cta${vis ? " x_vis" : ""}`}>
      <h3 className="x_hist_cta_title">Be Part of the<br /><em>Next Chapter</em></h3>
      <p className="x_hist_cta_sub">Book a table, read our journal, or simply come by for a coffee.</p>
      <div className="x_hist_cta_btns">
        <button className="x_btn_gold" onClick={() => {}}>Reserve a Table <FiArrowRight /></button>
        <button className="x_btn_ghost" onClick={() => onNavigate("blog-list")}>Read the Journal <GiQuillInk /></button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SHARED FOOTER
═══════════════════════════════════════════ */
function PageFooter() {
  return (
    <footer className="x_footer">
      <div className="x_footer_divider" />
      <p className="x_footer_text">© 2024 DineVerse · Restaurant, Bar & Café · Surat, India</p>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   APP ROUTER
═══════════════════════════════════════════ */
export default function DineVerseblog() {
  const [page, setPage] = useState("blog-list");
  const [postId, setPostId] = useState(null);

  const navigate = useCallback((target, id = null) => {
    setPage(target);
    if (id) setPostId(id);
  }, []);

  return (
    <>
      <style>{ROOT_CSS + STYLES}</style>
      <Navbar currentPage={page} onNavigate={navigate} />
      {page === "blog-list" && <BlogListPage onNavigate={navigate} />}
      {page === "blog-detail" && <BlogDetailPage postId={postId} onNavigate={navigate} />}
      {page === "history" && <HistoryPage onNavigate={navigate} />}
    </>
  );
}

/* ═══════════════════════════════════════════
   ALL STYLES
═══════════════════════════════════════════ */
const STYLES = `

/* ── GLOBAL ── */
body { background: var(--d-bg); font-family: var(--d-font-sans); color: var(--d-text-1); }
.x_page_wrapper { min-height: 100vh; }

/* ── NAVBAR ── */
.x_navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  padding: 0 32px; height: var(--d-header-h);
  display: flex; align-items: center;
  transition: background var(--d-dur), backdrop-filter var(--d-dur), border-color var(--d-dur);
  border-bottom: 1px solid transparent;
}
.x_navbar--scrolled {
  background: var(--d-surface-glass);
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border-bottom-color: var(--d-border);
}
.x_navbar_inner { display: flex; align-items: center; gap: 32px; width: 100%; max-width: 1200px; margin: 0 auto; }
.x_nav_logo {
  display: flex; align-items: center; gap: 8px;
  background: none; border: none; cursor: pointer;
  font-family: var(--d-font-serif); font-size: 24px; font-weight: 400;
  color: var(--d-gold-light); letter-spacing: 0.05em;
  transition: color var(--d-dur);
}
.x_nav_logo:hover { color: var(--d-gold-pale); }
.x_nav_leaf { font-size: 14px; animation: x_sway 4s ease-in-out infinite; }
.x_nav_leaf--flip { transform: scaleX(-1); animation-delay: -2s; }
.x_nav_links { display: flex; gap: 4px; margin-left: auto; }
.x_nav_link {
  background: none; border: none; cursor: pointer;
  font-family: var(--d-font-sans); font-size: 13px;
  color: var(--d-text-3); padding: 8px 16px; border-radius: var(--d-r-pill);
  transition: all var(--d-dur) var(--d-ease);
}
.x_nav_link:hover { color: var(--d-text-1); background: var(--d-surface-3); }
.x_nav_link--active { color: var(--d-gold); }
.x_nav_reserve {
  background: var(--d-gold); color: var(--d-bg);
  border: none; border-radius: var(--d-r-pill);
  font-family: var(--d-font-sans); font-size: 13px; font-weight: 500;
  padding: 10px 22px; cursor: pointer;
  transition: all var(--d-dur) var(--d-spring);
}
.x_nav_reserve:hover { background: var(--d-gold-light); transform: translateY(-1px); }

/* ── SHARED EYEBROW ── */
.x_eyebrow {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--d-gold); font-weight: 500; margin-bottom: 20px;
}
.x_eyebrow_line { flex: 0 0 44px; height: 1px; background: var(--d-border-strong); }
.x_eyebrow_icon { font-size: 14px; animation: x_sway 4s ease-in-out infinite; }
.x_eyebrow_flip { transform: scaleX(-1); animation-delay: -2s; }

/* ── SHARED: KICKER, SECTION LABELS ── */
.x_kicker {
  display: inline-block; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--d-gold); padding: 4px 12px; border: 1px solid var(--d-border-strong);
  border-radius: var(--d-r-pill); margin-bottom: 14px;
}
.x_bl_section_label {
  display: flex; align-items: center; gap: 8px; margin-bottom: 24px;
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--d-gold); font-weight: 500;
}
.x_bl_count {
  margin-left: auto; font-size: 11px; color: var(--d-text-4);
  border: 1px solid var(--d-border); border-radius: var(--d-r-pill); padding: 1px 9px;
}

/* ── SHARED: AVATAR ── */
.x_avatar { border-radius: 50%; object-fit: cover; border: 2px solid var(--d-border-strong); flex-shrink: 0; }
.x_avatar--sm { width: 28px; height: 28px; }
.x_avatar { width: 40px; height: 40px; }
.x_avatar--lg { width: 52px; height: 52px; }
.x_avatar--xl { width: 68px; height: 68px; }
.x_author_name { font-size: 13px; font-weight: 500; color: var(--d-text-2); }
.x_author_sub { font-size: 11px; color: var(--d-text-4); }
.x_meta_dot { margin: 0 4px; opacity: 0.4; }

/* ── SHARED: BUTTONS ── */
.x_btn_gold {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 13px 26px; border-radius: var(--d-r-pill);
  background: var(--d-gold); color: var(--d-bg); border: none;
  font-family: var(--d-font-sans); font-size: 14px; font-weight: 500; cursor: pointer;
  transition: all var(--d-dur) var(--d-spring);
}
.x_btn_gold:hover { background: var(--d-gold-light); transform: translateY(-2px); box-shadow: 0 8px 24px var(--d-gold-glow); }
.x_btn_ghost {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 13px 26px; border-radius: var(--d-r-pill);
  background: none; color: var(--d-gold); border: 1px solid var(--d-border-strong);
  font-family: var(--d-font-sans); font-size: 14px; font-weight: 500; cursor: pointer;
  transition: all var(--d-dur) var(--d-ease);
}
.x_btn_ghost:hover { background: var(--d-gold-subtle); transform: translateY(-2px); }
.x_like_btn {
  display: flex; align-items: center; gap: 6px;
  background: none; border: 1px solid var(--d-border); border-radius: var(--d-r-pill);
  color: var(--d-text-4); font-family: var(--d-font-sans); font-size: 12px;
  padding: 7px 13px; cursor: pointer;
  transition: all var(--d-dur) var(--d-ease);
}
.x_like_btn:hover { border-color: var(--d-border-hover); color: var(--d-text-2); }
.x_like_btn--sm { padding: 5px 10px; }
.x_liked { color: #e87070 !important; border-color: rgba(232,112,112,0.4) !important; background: rgba(232,112,112,0.06) !important; }
.x_read_btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 22px; border-radius: var(--d-r-pill);
  background: var(--d-gold); color: var(--d-bg); border: none;
  font-family: var(--d-font-sans); font-size: 13px; font-weight: 500; cursor: pointer;
  transition: all var(--d-dur) var(--d-spring);
}
.x_read_btn:hover { background: var(--d-gold-light); transform: translateY(-1px); }

/* ── SHARED FOOTER ── */
.x_footer { text-align: center; padding: 28px 24px 40px; }
.x_footer_divider { height: 1px; background: var(--d-border); max-width: 300px; margin: 0 auto 20px; }
.x_footer_text { font-size: 12px; color: var(--d-text-4); letter-spacing: 0.06em; }

/* ── ANIM VISIBILITY UTIL ── */
.x_vis { animation: x_fadeUp 0.6s var(--d-ease) both; }
.x_vis_delay { animation: x_fadeUp 0.6s var(--d-ease) 0.35s both; }

/* ════════════════════════════════════
   BLOG LIST PAGE
════════════════════════════════════ */
.x_bl_hero {
  position: relative; padding: 140px 24px 90px; text-align: center;
  background: var(--d-surface); border-bottom: 1px solid var(--d-border);
  overflow: hidden;
}
.x_bl_hero_noise {
  position: absolute; inset: 0; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.86' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.038'/%3E%3C/svg%3E");
}
.x_bl_hero_glow {
  position: absolute; top: -120px; left: 50%; transform: translateX(-50%);
  width: 900px; height: 400px; pointer-events: none;
  background: radial-gradient(ellipse, rgba(200,150,90,0.12) 0%, transparent 70%);
}
.x_bl_hero_lines { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.x_bl_hero_line {
  position: absolute; width: 1px; height: 140%; top: -20%;
  background: linear-gradient(to bottom, transparent, rgba(200,160,90,0.07), transparent);
  transform: rotate(12deg); transform-origin: top center;
  animation: x_line_drift 9s var(--d-ease) infinite;
}
.x_bl_hero_content { position: relative; z-index: 2; max-width: 680px; margin: 0 auto; opacity: 0; transform: translateY(28px); }
.x_bl_hero_content.x_vis { animation: x_fadeUp 0.85s var(--d-ease) both; }
.x_bl_hero_title {
  font-family: var(--d-font-serif);
  font-size: clamp(48px, 9vw, 100px);
  font-weight: 300; line-height: 1.0; letter-spacing: -0.02em; margin-bottom: 18px;
}
.x_bl_hero_title em { font-style: italic; color: var(--d-gold-light); text-shadow: 0 0 70px rgba(232,184,120,0.30); }
.x_bl_hero_sub { font-size: 15px; color: var(--d-text-3); max-width: 500px; margin: 0 auto 36px; line-height: 1.7; }
.x_bl_search_wrap { position: relative; max-width: 460px; margin: 0 auto; }
.x_bl_search_icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--d-text-3); font-size: 16px; pointer-events: none; }
.x_bl_search {
  width: 100%; background: var(--d-surface-3); border: 1px solid var(--d-border);
  border-radius: var(--d-r-pill); color: var(--d-text-1);
  font-family: var(--d-font-sans); font-size: 14px; padding: 14px 44px; outline: none;
  transition: border-color var(--d-dur), box-shadow var(--d-dur);
}
.x_bl_search::placeholder { color: var(--d-text-4); }
.x_bl_search:focus { border-color: var(--d-border-hover); box-shadow: 0 0 0 3px var(--d-gold-subtle); }
.x_bl_search_clear {
  position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: var(--d-text-3); cursor: pointer; font-size: 15px;
  display: flex; align-items: center;
}
.x_bl_pills {
  position: relative; z-index: 2; display: flex; justify-content: center; gap: 10px;
  margin-top: 36px; flex-wrap: wrap; opacity: 0;
}
.x_bl_pills.x_vis_delay { animation: x_fadeUp 0.7s var(--d-ease) 0.35s both; }
.x_bl_pill {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 7px 16px; border-radius: var(--d-r-pill);
  border: 1px solid var(--d-border); background: var(--d-surface-2);
  font-size: 12px; color: var(--d-text-3);
}
.x_bl_tag_strip {
  position: sticky; top: var(--d-header-h); z-index: 99;
  background: var(--d-surface-glass);
  backdrop-filter: blur(20px) saturate(1.4); -webkit-backdrop-filter: blur(20px) saturate(1.4);
  border-bottom: 1px solid var(--d-border);
}
.x_bl_tag_inner {
  display: flex; gap: 4px; max-width: 1200px; margin: 0 auto;
  padding: 10px 24px; overflow-x: auto; scrollbar-width: none;
}
.x_bl_tag_inner::-webkit-scrollbar { display: none; }
.x_bl_tag_btn {
  padding: 8px 20px; border-radius: var(--d-r-pill); border: 1px solid transparent;
  background: none; color: var(--d-text-3); font-family: var(--d-font-sans); font-size: 13px;
  cursor: pointer; white-space: nowrap; transition: all var(--d-dur) var(--d-ease);
}
.x_bl_tag_btn:hover { color: var(--d-text-1); border-color: var(--d-border); }
.x_bl_tag_btn--on { background: var(--d-surface-3); border-color: var(--d-border-strong); color: var(--d-gold); font-weight: 500; }
.x_bl_main { max-width: 1200px; margin: 0 auto; padding: 56px 24px 80px; display: flex; flex-direction: column; gap: 60px; }
.x_bl_section { display: flex; flex-direction: column; }

/* FEATURED CARD */
.x_feat_card {
  border-radius: var(--d-r-xl); overflow: hidden;
  background: var(--d-surface-2); border: 1px solid var(--d-border);
  opacity: 0; transform: translateY(28px);
  transition: border-color var(--d-dur), box-shadow var(--d-dur);
}
.x_feat_card.x_vis { animation: x_fadeUp 0.7s var(--d-ease) both; }
.x_feat_card:hover { border-color: var(--d-border-hover); box-shadow: var(--d-shadow-lg); }
.x_fc_img_wrap { position: relative; aspect-ratio: 21/9; overflow: hidden; cursor: pointer; }
.x_fc_img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s var(--d-ease); }
.x_feat_card:hover .x_fc_img { transform: scale(1.04); }
.x_fc_overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(8,7,5,0.5) 0%, transparent 60%); }
.x_fc_overlay_bot { position: absolute; inset: 0; background: linear-gradient(to top, var(--d-surface-2) 0%, transparent 55%); }
.x_fc_tag_badge {
  position: absolute; top: 16px; left: 16px;
  font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--tc); background: var(--td); backdrop-filter: blur(8px);
  padding: 4px 12px; border-radius: var(--d-r-pill); border: 1px solid color-mix(in srgb, var(--tc) 30%, transparent);
}
.x_fc_body { padding: 28px 32px 32px; }
.x_fc_meta { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--d-text-4); margin-bottom: 12px; }
.x_fc_title {
  font-family: var(--d-font-serif); font-size: clamp(26px, 3.5vw, 38px); font-weight: 400;
  color: var(--d-text-1); line-height: 1.2; margin-bottom: 10px; cursor: pointer;
  transition: color var(--d-dur);
}
.x_fc_title:hover { color: var(--d-gold-pale); }
.x_fc_subtitle { font-size: 14px; color: var(--d-text-3); line-height: 1.7; margin-bottom: 24px; }
.x_fc_foot { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
.x_fc_author { display: flex; align-items: center; gap: 12px; }
.x_fc_actions { display: flex; align-items: center; gap: 10px; }

/* BLOG GRID */
.x_bl_grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.x_bl_grid--related { grid-template-columns: repeat(2, 1fr); }
.x_blog_card {
  background: var(--d-surface-2); border: 1px solid var(--d-border);
  border-radius: var(--d-r-lg); overflow: hidden; display: flex; flex-direction: column;
  opacity: 0; transform: translateY(20px);
  transition: border-color var(--d-dur), box-shadow var(--d-dur);
}
.x_blog_card.x_vis { animation: x_fadeUp 0.55s var(--d-ease) both; }
.x_blog_card:hover { border-color: var(--d-border-hover); box-shadow: var(--d-shadow-md); }
.x_bcard_img_wrap { position: relative; aspect-ratio: 4/3; overflow: hidden; cursor: pointer; }
.x_bcard_img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s var(--d-ease); }
.x_blog_card:hover .x_bcard_img { transform: scale(1.06); }
.x_bcard_tag {
  position: absolute; bottom: 10px; left: 10px;
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--tc);
  background: var(--d-surface-glass); backdrop-filter: blur(8px);
  padding: 3px 10px; border-radius: var(--d-r-pill); border: 1px solid rgba(200,160,90,0.15);
}
.x_bcard_hover_line {
  position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
  background: var(--tc); transform: scaleX(0); transform-origin: left;
  transition: transform 0.4s var(--d-ease);
}
.x_blog_card:hover .x_bcard_hover_line { transform: scaleX(1); }
.x_bcard_body { padding: 18px 20px 20px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
.x_bcard_meta { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--d-text-4); }
.x_bcard_title {
  font-family: var(--d-font-serif); font-size: 19px; font-weight: 400;
  color: var(--d-text-1); line-height: 1.3; cursor: pointer; transition: color var(--d-dur);
}
.x_bcard_title:hover { color: var(--d-gold-pale); }
.x_bcard_excerpt { font-size: 13px; color: var(--d-text-3); line-height: 1.65; flex: 1; }
.x_bcard_foot {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 10px; border-top: 1px solid var(--d-border); margin-top: auto;
}
.x_bcard_author { display: flex; align-items: center; gap: 8px; }
.x_bcard_read {
  display: inline-flex; align-items: center; gap: 6px; margin-top: 8px;
  background: none; border: none; cursor: pointer; font-family: var(--d-font-sans);
  font-size: 12px; font-weight: 500; color: var(--d-gold);
  transition: gap var(--d-dur) var(--d-spring), color var(--d-dur);
  padding: 0;
}
.x_bcard_read:hover { gap: 10px; color: var(--d-gold-light); }

/* EMPTY */
.x_bl_empty { text-align: center; padding: 60px 24px; display: flex; flex-direction: column; align-items: center; gap: 14px; }
.x_bl_empty span { font-size: 44px; opacity: 0.4; }
.x_bl_empty p { color: var(--d-text-3); }

/* TRENDING */
.x_bl_trending_section { display: flex; flex-direction: column; }
.x_bl_trending_row { display: flex; flex-direction: column; gap: 2px; }
.x_bl_trending_card {
  display: flex; align-items: center; gap: 16px;
  padding: 14px 18px; border-radius: var(--d-r-md);
  background: var(--d-surface-2); border: 1px solid var(--d-border);
  cursor: pointer; text-align: left; transition: all var(--d-dur) var(--d-ease);
  margin-bottom: 8px;
}
.x_bl_trending_card:hover { border-color: var(--d-border-hover); background: var(--d-surface-3); }
.x_bl_trending_rank { font-family: var(--d-font-serif); font-size: 28px; font-weight: 600; color: var(--d-border-strong); width: 36px; flex-shrink: 0; }
.x_bl_trending_img { width: 64px; height: 64px; object-fit: cover; border-radius: var(--d-r-sm); flex-shrink: 0; }
.x_bl_trending_info { flex: 1; display: flex; flex-direction: column; gap: 3px; }
.x_bl_trending_tag { font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--tc, var(--d-gold)); font-weight: 500; }
.x_bl_trending_title { font-size: 13px; color: var(--d-text-2); line-height: 1.4; font-weight: 500; }
.x_bl_trending_meta { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--d-text-4); }

/* ════════════════════════════════════
   BLOG DETAIL PAGE
════════════════════════════════════ */
.x_progress_bar {
  position: fixed; top: 0; left: 0; height: 2px;
  background: linear-gradient(90deg, var(--d-gold-dark), var(--d-gold), var(--d-gold-light));
  z-index: 2000; transition: width 0.1s linear;
  box-shadow: 0 0 8px var(--d-gold-glow);
}
.x_bd_hero {
  position: relative; height: 90vh; min-height: 600px;
  display: flex; align-items: flex-end; overflow: hidden;
}
.x_bd_hero_img_wrap { position: absolute; inset: 0; }
.x_bd_hero_img { width: 100%; height: 100%; object-fit: cover; }
.x_bd_hero_overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(8,7,5,0.96) 0%, rgba(8,7,5,0.6) 40%, rgba(8,7,5,0.2) 100%);
}
.x_bd_hero_content {
  position: relative; z-index: 2;
  max-width: 860px; padding: 0 32px 64px; margin: 0 auto; width: 100%;
  opacity: 0; transform: translateY(24px);
}
.x_bd_hero_content.x_vis { animation: x_fadeUp 0.8s var(--d-ease) 0.1s both; }
.x_bd_back_btn {
  display: inline-flex; align-items: center; gap: 8px; margin-bottom: 28px;
  background: var(--d-surface-glass); backdrop-filter: blur(10px);
  border: 1px solid var(--d-border); border-radius: var(--d-r-pill);
  color: var(--d-text-2); font-family: var(--d-font-sans); font-size: 12px;
  padding: 8px 16px; cursor: pointer;
  transition: all var(--d-dur) var(--d-ease);
}
.x_bd_back_btn:hover { color: var(--d-text-1); border-color: var(--d-border-hover); }
.x_bd_tag_row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.x_bd_tag {
  font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
  padding: 4px 12px; border-radius: var(--d-r-pill); font-weight: 500;
}
.x_bd_meta { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--d-text-4); }
.x_bd_title {
  font-family: var(--d-font-serif);
  font-size: clamp(32px, 5.5vw, 62px);
  font-weight: 300; line-height: 1.1; color: var(--d-text-1); margin-bottom: 14px;
}
.x_bd_subtitle { font-size: 16px; color: var(--d-text-3); line-height: 1.65; margin-bottom: 28px; max-width: 600px; }
.x_bd_author_row { display: flex; align-items: center; gap: 12px; }

/* layout */
.x_bd_layout { max-width: 1100px; margin: 0 auto; padding: 64px 24px 80px; display: grid; grid-template-columns: 1fr 64px; gap: 60px; align-items: flex-start; }
.x_bd_article { max-width: 760px; display: flex; flex-direction: column; gap: 0; }

/* content blocks */
.x_content_lead {
  font-family: var(--d-font-serif); font-size: clamp(20px, 2.5vw, 26px);
  font-weight: 300; font-style: italic; line-height: 1.65;
  color: var(--d-text-2); margin-bottom: 36px;
  padding-left: 24px; border-left: 3px solid var(--d-gold);
  opacity: 0; transform: translateY(16px);
}
.x_content_lead.x_vis { animation: x_fadeUp 0.55s var(--d-ease) both; }
.x_content_h2 {
  font-family: var(--d-font-serif); font-size: clamp(24px, 3vw, 34px);
  font-weight: 400; color: var(--d-text-1); margin: 44px 0 20px;
  opacity: 0; transform: translateY(14px);
}
.x_content_h2.x_vis { animation: x_fadeUp 0.5s var(--d-ease) both; }
.x_content_p {
  font-size: 16px; color: var(--d-text-3); line-height: 1.85;
  margin-bottom: 22px; opacity: 0; transform: translateY(12px);
}
.x_content_p.x_vis { animation: x_fadeUp 0.5s var(--d-ease) both; }
.x_content_quote {
  margin: 40px 0; padding: 28px 32px;
  background: var(--d-surface-2); border: 1px solid var(--d-border);
  border-left: 3px solid var(--d-gold); border-radius: 0 var(--d-r-lg) var(--d-r-lg) 0;
  opacity: 0; transform: translateX(-16px);
}
.x_content_quote.x_vis { animation: x_slideRight 0.6s var(--d-ease) both; }
.x_quote_icon { font-size: 28px; color: var(--d-gold); opacity: 0.5; margin-bottom: 12px; display: block; }
.x_quote_text { font-family: var(--d-font-serif); font-size: clamp(18px, 2.2vw, 22px); font-style: italic; color: var(--d-gold-pale); line-height: 1.55; margin-bottom: 12px; }
.x_quote_cite { font-size: 12px; color: var(--d-text-4); letter-spacing: 0.08em; }

/* article footer */
.x_bd_article_foot {
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
  margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--d-border);
}
.x_bd_tags { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.x_bd_tag_icon { color: var(--d-text-4); }
.x_bd_tag_chip { font-size: 11px; padding: 4px 12px; border-radius: var(--d-r-pill); border: 1px solid var(--d-border); color: var(--d-text-4); }
.x_bd_foot_actions { display: flex; align-items: center; gap: 8px; }
.x_action_btn {
  display: flex; align-items: center; gap: 6px;
  background: none; border: 1px solid var(--d-border); border-radius: var(--d-r-pill);
  color: var(--d-text-4); font-family: var(--d-font-sans); font-size: 13px;
  padding: 8px 14px; cursor: pointer; transition: all var(--d-dur);
}
.x_action_btn:hover { border-color: var(--d-border-hover); color: var(--d-text-2); }
.x_action_btn--active { color: var(--d-gold) !important; border-color: var(--d-border-strong) !important; background: var(--d-gold-subtle) !important; }

/* author bio */
.x_author_bio_card {
  display: flex; align-items: flex-start; gap: 20px;
  margin-top: 40px; padding: 28px 28px;
  background: var(--d-surface-2); border: 1px solid var(--d-border);
  border-top: 2px solid var(--ac, var(--d-gold));
  border-radius: var(--d-r-lg);
}
.x_author_bio_name { font-weight: 600; color: var(--d-text-1); font-size: 15px; margin-bottom: 3px; }
.x_author_bio_role { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ac, var(--d-gold)); margin-bottom: 10px; }
.x_author_bio_text { font-size: 13px; color: var(--d-text-3); line-height: 1.7; }

/* sidebar */
.x_bd_sidebar { position: sticky; top: calc(var(--d-header-h) + 24px); }
.x_bd_sidebar_inner { display: flex; flex-direction: column; align-items: center; gap: 20px; }
.x_bd_sidebar_actions { display: flex; flex-direction: column; gap: 8px; }
.x_sb_action {
  width: 42px; height: 42px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: var(--d-surface-2); border: 1px solid var(--d-border);
  color: var(--d-text-4); cursor: pointer; font-size: 16px;
  transition: all var(--d-dur) var(--d-ease);
}
.x_sb_action:hover { border-color: var(--d-border-hover); color: var(--d-text-1); }
.x_sb_action--liked { color: #e87070 !important; border-color: rgba(232,112,112,0.4) !important; }
.x_sb_action--saved { color: var(--d-gold) !important; border-color: var(--d-border-strong) !important; }
.x_sb_progress_wrap { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.x_sb_progress_track { width: 2px; height: 120px; background: var(--d-border); border-radius: 2px; position: relative; overflow: hidden; }
.x_sb_progress_fill { position: absolute; top: 0; left: 0; right: 0; background: linear-gradient(to bottom, var(--d-gold), var(--d-gold-light)); border-radius: 2px; transition: height 0.15s linear; }
.x_sb_progress_label { font-size: 10px; color: var(--d-text-4); letter-spacing: 0.06em; }

/* related */
.x_bd_related { background: var(--d-surface); border-top: 1px solid var(--d-border); padding: 64px 24px 80px; }
.x_bd_related_inner { max-width: 1000px; margin: 0 auto; }

/* ════════════════════════════════════
   OUR HISTORY PAGE
════════════════════════════════════ */
.x_hist_hero {
  position: relative; min-height: 100svh;
  display: flex; align-items: center; justify-content: center; text-align: center;
  overflow: hidden; background: var(--d-surface);
  border-bottom: 1px solid var(--d-border);
}
.x_hist_noise {
  position: absolute; inset: 0; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.84' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
}
.x_hist_glow_top {
  position: absolute; top: -140px; left: 50%; transform: translateX(-50%);
  width: 1000px; height: 480px; pointer-events: none;
  background: radial-gradient(ellipse, rgba(200,150,90,0.12) 0%, transparent 65%);
}
.x_hist_glow_bot {
  position: absolute; bottom: -80px; left: 50%; transform: translateX(-50%);
  width: 700px; height: 300px; pointer-events: none;
  background: radial-gradient(ellipse, rgba(155,143,212,0.07) 0%, transparent 70%);
}
.x_hist_rule {
  position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--d-border-strong), transparent);
}
.x_hist_orb { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; }
.x_hist_orb--l { width: 360px; height: 360px; top: 10%; left: 2%; background: rgba(200,150,90,0.06); animation: x_orb_drift 13s ease-in-out infinite alternate; }
.x_hist_orb--r { width: 280px; height: 280px; bottom: 12%; right: 4%; background: rgba(155,143,212,0.07); animation: x_orb_drift 10s ease-in-out infinite alternate-reverse; }
.x_hist_hero_content { position: relative; z-index: 2; padding: 0 24px; max-width: 680px; opacity: 0; transform: translateY(28px); }
.x_hist_hero_content.x_vis { animation: x_fadeUp 0.9s var(--d-ease) both; }
.x_hist_title {
  font-family: var(--d-font-serif);
  font-size: clamp(54px, 11vw, 120px);
  font-weight: 300; line-height: 0.95; letter-spacing: -0.025em; margin-bottom: 20px;
}
.x_hist_title em { font-style: italic; color: var(--d-gold-light); text-shadow: 0 0 90px rgba(232,184,120,0.32); }
.x_hist_sub { font-size: 16px; color: var(--d-text-3); max-width: 480px; margin: 0 auto; line-height: 1.7; }
.x_hist_bg_year {
  position: absolute; bottom: -30px; left: 50%; transform: translateX(-50%);
  font-family: var(--d-font-serif); font-size: clamp(140px, 22vw, 260px);
  font-weight: 700; color: transparent;
  -webkit-text-stroke: 1px rgba(200,160,90,0.07);
  pointer-events: none; letter-spacing: -0.04em; line-height: 1;
  opacity: 0;
}
.x_hist_bg_year.x_vis { animation: x_fadeUp 1.2s var(--d-ease) 0.3s both; }

/* year nav */
.x_hist_year_nav {
  position: sticky; top: var(--d-header-h); z-index: 99;
  background: var(--d-surface-glass); backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  border-bottom: 1px solid var(--d-border);
}
.x_hist_year_track {
  position: absolute; bottom: 0; left: 24px; right: 24px; height: 1px;
  background: linear-gradient(90deg, transparent, var(--d-border), transparent);
}
.x_hist_year_inner {
  display: flex; gap: 4px; max-width: 900px; margin: 0 auto;
  padding: 10px 24px; overflow-x: auto; scrollbar-width: none;
}
.x_hist_year_inner::-webkit-scrollbar { display: none; }
.x_hist_year_btn {
  padding: 8px 24px; border-radius: var(--d-r-pill); border: 1px solid transparent;
  background: none; color: var(--d-text-3); font-family: var(--d-font-serif);
  font-size: 15px; cursor: pointer; white-space: nowrap;
  transition: all var(--d-dur) var(--d-ease);
}
.x_hist_year_btn:hover { color: var(--d-text-1); border-color: var(--d-border); }
.x_hist_year_btn--active { background: var(--d-surface-3); border-color: var(--d-border-strong); color: var(--d-gold); font-weight: 500; }

/* main */
.x_hist_main { max-width: 1100px; margin: 0 auto; padding: 72px 24px 80px; display: flex; flex-direction: column; gap: 80px; }

/* year block */
.x_hist_year_block { display: flex; flex-direction: column; gap: 40px; }
.x_hist_year_label {
  display: flex; align-items: center; gap: 20px;
  padding-bottom: 16px;
}
.x_hist_year_num { font-family: var(--d-font-serif); font-size: 52px; font-weight: 300; color: var(--d-gold); line-height: 1; flex-shrink: 0; }
.x_hist_year_line { flex: 1; height: 1px; background: linear-gradient(90deg, var(--d-border-strong), transparent); }
.x_hist_events { display: flex; flex-direction: column; gap: 32px; }

/* history card */
.x_hist_card {
  display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center;
  opacity: 0; transform: translateY(28px);
  transition: opacity 0.65s var(--d-ease), transform 0.65s var(--d-ease);
}
.x_hist_card.x_vis { opacity: 1; transform: none; }
.x_hist_card--rev { direction: rtl; }
.x_hist_card--rev > * { direction: ltr; }
.x_hist_card_img_wrap {
  position: relative; border-radius: var(--d-r-lg); overflow: hidden; aspect-ratio: 4/3;
  box-shadow: var(--d-shadow-lg);
}
.x_hist_card_img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s var(--d-ease); }
.x_hist_card:hover .x_hist_card_img { transform: scale(1.05); }
.x_hist_card_img_overlay {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, color-mix(in srgb, var(--hc) 20%, transparent) 0%, transparent 60%);
}
.x_hist_card_season {
  position: absolute; top: 14px; left: 14px;
  font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--d-gold-pale); background: var(--d-surface-glass);
  backdrop-filter: blur(8px); padding: 4px 12px; border-radius: var(--d-r-pill);
  border: 1px solid var(--d-border);
}
.x_hist_card_body { display: flex; flex-direction: column; gap: 14px; }
.x_hist_card_icon {
  width: 46px; height: 46px; border-radius: var(--d-r-md);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; border: 1px solid color-mix(in srgb, var(--hc) 25%, transparent);
}
.x_hist_card_title { font-family: var(--d-font-serif); font-size: clamp(24px, 3vw, 34px); font-weight: 400; color: var(--d-text-1); line-height: 1.2; }
.x_hist_card_desc { font-size: 14px; color: var(--d-text-3); line-height: 1.8; }
.x_hist_card_accent_line { height: 2px; width: 48px; background: var(--hc); border-radius: 2px; }

/* values */
.x_values_section {
  opacity: 0; transform: translateY(24px);
  transition: opacity 0.7s var(--d-ease), transform 0.7s var(--d-ease);
  padding: 64px 0;
  border-top: 1px solid var(--d-border);
}
.x_values_section.x_vis { opacity: 1; transform: none; }
.x_values_head { text-align: center; margin-bottom: 48px; }
.x_values_title { font-family: var(--d-font-serif); font-size: clamp(30px, 4vw, 46px); font-weight: 300; }
.x_values_title em { font-style: italic; color: var(--d-gold-light); }
.x_values_grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.x_value_card {
  background: var(--d-surface-2); border: 1px solid var(--d-border);
  border-top: 2px solid var(--ac); border-radius: var(--d-r-lg);
  padding: 28px 24px; display: flex; flex-direction: column; gap: 10px;
  transition: border-color var(--d-dur), box-shadow var(--d-dur), transform var(--d-dur) var(--d-spring);
}
.x_value_card:hover { border-color: var(--d-border-hover); transform: translateY(-4px); box-shadow: var(--d-shadow-md); }
.x_value_icon { font-size: 24px; color: var(--ac); }
.x_value_title { font-family: var(--d-font-serif); font-size: 20px; font-weight: 400; color: var(--d-text-1); }
.x_value_text { font-size: 13px; color: var(--d-text-3); line-height: 1.7; }

/* founders note */
.x_founders_note {
  position: relative; border-radius: var(--d-r-xl); overflow: hidden;
  background: var(--d-surface-2); border: 1px solid var(--d-border);
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.6s var(--d-ease), transform 0.6s var(--d-ease);
}
.x_founders_note.x_vis { opacity: 1; transform: none; }
.x_fn_glow {
  position: absolute; top: -60px; left: 50%; transform: translateX(-50%);
  width: 600px; height: 260px; pointer-events: none;
  background: radial-gradient(ellipse, var(--d-gold-glow) 0%, transparent 70%);
}
.x_fn_inner { position: relative; z-index: 1; padding: 56px 48px; text-align: center; }
.x_fn_quote_icon { font-size: 40px; color: var(--d-gold); opacity: 0.45; display: block; margin: 0 auto 20px; }
.x_fn_quote {
  font-family: var(--d-font-serif); font-style: italic;
  font-size: clamp(20px, 2.5vw, 28px); color: var(--d-gold-pale);
  line-height: 1.55; max-width: 760px; margin: 0 auto 32px;
}
.x_fn_sig { display: flex; align-items: center; justify-content: center; gap: 14px; }
.x_fn_name { font-weight: 600; color: var(--d-text-1); font-size: 15px; }
.x_fn_role { font-size: 12px; color: var(--d-text-4); letter-spacing: 0.06em; }

/* cta */
.x_hist_cta {
  text-align: center; padding: 64px 24px;
  background: var(--d-surface-2); border: 1px solid var(--d-border);
  border-radius: var(--d-r-xl);
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.6s var(--d-ease), transform 0.6s var(--d-ease);
}
.x_hist_cta.x_vis { opacity: 1; transform: none; }
.x_hist_cta_title { font-family: var(--d-font-serif); font-size: clamp(30px, 4.5vw, 48px); font-weight: 300; margin-bottom: 14px; }
.x_hist_cta_title em { font-style: italic; color: var(--d-gold-light); }
.x_hist_cta_sub { font-size: 15px; color: var(--d-text-3); margin-bottom: 36px; }
.x_hist_cta_btns { display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap; }

/* ── KEYFRAMES ── */
@keyframes x_fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
@keyframes x_slideRight { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
@keyframes x_sway { 0%,100%{transform:rotate(-7deg);}50%{transform:rotate(7deg);} }
@keyframes x_line_drift {
  0%{transform:rotate(12deg) translateY(-20%);opacity:0;}
  20%{opacity:1;}80%{opacity:1;}
  100%{transform:rotate(12deg) translateY(20%);opacity:0;}
}
@keyframes x_orb_drift { from{transform:translateY(0) translateX(0);}to{transform:translateY(-30px) translateX(20px);} }

/* ── RESPONSIVE ── */
@media(max-width:1024px){
  .x_bl_grid { grid-template-columns: repeat(2,1fr); }
  .x_values_grid { grid-template-columns: repeat(2,1fr); }
  .x_bd_layout { grid-template-columns: 1fr; }
  .x_bd_sidebar { display: none; }
  .x_hist_card, .x_hist_card--rev { grid-template-columns: 1fr; direction: ltr; gap: 28px; }
}
@media(max-width:680px){
  .x_bl_grid, .x_bl_grid--related { grid-template-columns: 1fr; }
  .x_values_grid { grid-template-columns: 1fr; }
  .x_nav_reserve { display: none; }
  .x_fc_body { padding: 20px; }
  .x_bd_hero_content { padding: 0 20px 48px; }
  .x_fn_inner { padding: 36px 24px; }
}
`;