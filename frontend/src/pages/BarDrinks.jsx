import { useState } from "react";
import { IoWineOutline, IoFlameOutline } from "react-icons/io5";
import { PiBeerSteinBold, PiLeafBold } from "react-icons/pi";
import { HiSparkles, HiHeart, HiOutlineHeart } from "react-icons/hi2";
import { RiArrowRightSLine } from "react-icons/ri";
import { MdOutlineLocalBar } from "react-icons/md";
import { TbEye } from "react-icons/tb";
import "./barDrinks.css";
import { GiMartini } from "react-icons/gi";   // cocktail glass replacement
/* ── DRINKS DATA ──────────────────────────────────────────── */
const DRINKS = [
  {
    id: 1,
    name: "Midnight Negroni",
    desc: "Barrel-aged gin, activated charcoal, vermouth rosso, Campari, orange smoke.",
    price: "16",
    category: "cocktails",
    abv: "28% ABV",
    tags: ["Stirred", "Spirit-forward", "Classic"],
    img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80",
  },
  {
    id: 2,
    name: "Château Margaux '18",
    desc: "Full-bodied Bordeaux, dark cherry, cedar, silky tannins. Served by the glass.",
    price: "22",
    category: "wine",
    abv: "13.5% ABV",
    tags: ["Red", "Bordeaux", "Reserve"],
    img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80",
  },
  {
    id: 3,
    name: "Elderflower Spritz",
    desc: "House elderflower cordial, prosecco, fresh cucumber, cracked black pepper.",
    price: "13",
    category: "cocktails",
    abv: "8% ABV",
    tags: ["Sparkling", "Light", "Floral"],
    img: "https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=600&q=80",
  },
  {
    id: 4,
    name: "Zero-Proof Sunrise",
    desc: "Cold-pressed blood orange, hibiscus, ginger shrub, sparkling water.",
    price: "9",
    category: "mocktails",
    abv: "0% ABV",
    tags: ["Non-alcoholic", "Citrus", "Refreshing"],
    img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80",
  },
  {
    id: 5,
    name: "Dark Matter IPA",
    desc: "House-brewed India Pale Ale. Citrus-forward hops, malt backbone, dry finish.",
    price: "10",
    category: "beer",
    abv: "6.8% ABV",
    tags: ["Craft", "IPA", "Hoppy"],
    img: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&q=80",
  },
  {
    id: 6,
    name: "Yuzu Paper Plane",
    desc: "Equal parts mezcal, amaro, yuzu Aperol, lemon. Balanced, bitter-sweet.",
    price: "17",
    category: "cocktails",
    abv: "22% ABV",
    tags: ["Shaken", "Citrus", "Smoky"],
    img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80",
  },
  {
    id: 7,
    name: "White Burgundy",
    desc: "Crisp Chardonnay, notes of green apple, toasted oak, lingering minerality.",
    price: "18",
    category: "wine",
    abv: "12.5% ABV",
    tags: ["White", "Burgundy", "Crisp"],
    img: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=600&q=80",
  },
  {
    id: 8,
    name: "Garden Gimlet",
    desc: "Cucumber-infused gin, fresh lime, Thai basil cordial, soda finish.",
    price: "14",
    category: "mocktails",
    abv: "0% ABV",
    tags: ["Non-alcoholic", "Herbal", "Garden"],
    img: "https://images.unsplash.com/photo-1541546006941-62b4e0b52d97?w=600&q=80",
  },
];

const MARQUEE_ITEMS = [
  "Craft Cocktails", "Natural Wines", "Artisan Beers",
  "Zero-Proof Creations", "Seasonal Ingredients", "Barrel-Aged Spirits",
  "Live Bar Every Friday", "Happy Hour 5–7PM",
];

const TABS = [
  { id: "all",       label: "All Drinks", icon: <MdOutlineLocalBar />, count: DRINKS.length },
  { id: "cocktails", label: "Cocktails",  icon: <GiMartini  />,       count: DRINKS.filter(d => d.category === "cocktails").length },
  { id: "wine",      label: "Wine",       icon: <IoWineOutline />,      count: DRINKS.filter(d => d.category === "wine").length },
  { id: "beer",      label: "Beer",       icon: <PiBeerSteinBold />,    count: DRINKS.filter(d => d.category === "beer").length },
  { id: "mocktails", label: "Mocktails",  icon: <PiLeafBold />,         count: DRINKS.filter(d => d.category === "mocktails").length },
];

/* ── DRINK CARD ───────────────────────────────────────────── */
function DrinkCard({ drink }) {
  const [faved, setFaved] = useState(false);

  return (
    <div className="d_bar_card">
      <div className="d_bar_card__img-wrap">
        <img
          src={drink.img}
          alt={drink.name}
          className="d_bar_card__img"
          loading="lazy"
        />
        <span className="d_bar_card__abv">{drink.abv}</span>

        {/* Hover overlay */}
        <div className="d_bar_card__overlay">
          <button className="d_bar_card__peek-btn">
            <TbEye style={{ fontSize: 13 }} />
            View Drink
          </button>
        </div>
      </div>

      <div className="d_bar_card__body">
        <span className="d_bar_card__cat">{drink.category}</span>
        <h3 className="d_bar_card__name">{drink.name}</h3>
        <p className="d_bar_card__desc">{drink.desc}</p>

        <div className="d_bar_card__tags">
          {drink.tags.map((t) => (
            <span key={t} className="d_bar_card__tag">{t}</span>
          ))}
        </div>

        <div className="d_bar_card__footer">
          <span className="d_bar_card__price">
            <sup>$</sup>{drink.price}
          </span>
          <button
            className={`d_bar_card__fav${faved ? " d_bar_card__fav--active" : ""}`}
            onClick={() => setFaved((v) => !v)}
            aria-label={faved ? "Remove from favourites" : "Add to favourites"}
          >
            {faved ? <HiHeart /> : <HiOutlineHeart />}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── MARQUEE DIVIDER ──────────────────────────────────────── */
function BarMarquee() {
  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="d_bar_marquee" aria-hidden="true">
      <div className="d_bar_marquee__track">
        {doubled.map((text, i) => (
          <span className="d_bar_marquee__item" key={i}>
            <span className="d_bar_marquee__gem">◆</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── MAIN SECTION ─────────────────────────────────────────── */
export default function BarDrinks() {
  const [activeTab, setActiveTab] = useState("all");
  const [favorites, setFavorites] = useState(new Set());

  const filtered =
    activeTab === "all"
      ? DRINKS
      : DRINKS.filter((d) => d.category === activeTab);

  const handleExplore = () => alert("Full drinks menu — connect your routing here.");
  const handleReserve = () => alert("Bar reservation — connect your modal here.");

  return (
    <section className="d_bar_section">
      <div className="d_wrapper">

        {/* ── HERO SPLIT ── */}
        <div className="d_bar_hero">

          {/* Left — editorial copy */}
          <div className="d_bar_hero__left">
            <p className="d_bar_hero__eyebrow">
              <span className="d_bar_hero__eyebrow-gem">◆</span>
              The Bar at Lumière
            </p>

            <div className="d_bar_hero__content">
              <h2 className="d_bar_hero__title">
                Where Every Sip
                <em>Tells a Story</em>
              </h2>
              <p className="d_bar_hero__body">
                Step into our dimly lit sanctuary of crafted spirits, natural
                wines, and house-brewed ales. Our bartenders are artists —
                each pour a composition of flavour, memory, and mood.
              </p>

              <div className="d_bar_hero__stats">
                <div className="d_bar_hero__stat">
                  <span className="d_bar_hero__stat-num">80+</span>
                  <span className="d_bar_hero__stat-label">Spirits</span>
                </div>
                <div className="d_bar_hero__stat">
                  <span className="d_bar_hero__stat-num">40</span>
                  <span className="d_bar_hero__stat-label">Wines</span>
                </div>
                <div className="d_bar_hero__stat">
                  <span className="d_bar_hero__stat-num">12</span>
                  <span className="d_bar_hero__stat-label">On Tap</span>
                </div>
              </div>

              <button className="d_bar_hero__cta" onClick={handleExplore}>
                <IoWineOutline style={{ fontSize: 16 }} />
                Explore Drinks
                <span className="d_bar_hero__cta-arrow">
                  <RiArrowRightSLine />
                </span>
              </button>
            </div>
          </div>

          {/* Right — hero image */}
          <div className="d_bar_hero__right">
            <img
              src="https://images.unsplash.com/photo-1575444758702-4a6b9222336e?w=900&q=80"
              alt="Bar at Lumière"
              className="d_bar_hero__img"
            />
            <div className="d_bar_hero__img-overlay" />
            <div className="d_bar_hero__float-tag">
              <span className="d_bar_hero__float-tag-name">Open until 2 AM</span>
              <span className="d_bar_hero__float-tag-sub">
                <IoFlameOutline style={{ fontSize: 9, verticalAlign: 'middle', marginRight: 4 }} />
                Happy Hour 5 – 7 PM
              </span>
            </div>
          </div>
        </div>

        {/* ── MARQUEE ── */}
        <BarMarquee />

        {/* ── TABS ── */}
        <div className="d_bar_tabs" role="tablist" aria-label="Filter drinks by category">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`d_bar_tab${activeTab === tab.id ? " d_bar_tab--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={{ display: "flex", alignItems: "center", fontSize: 13 }}>
                {tab.icon}
              </span>
              {tab.label}
              <span className="d_bar_tab__count">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* ── CARDS GRID ── */}
        <div className="d_bar_grid" role="tabpanel">
          {filtered.map((drink) => (
            <DrinkCard key={drink.id} drink={drink} />
          ))}
        </div>

        {/* ── BOTTOM CTA BANNER ── */}
        <div className="d_bar_banner">
          <div className="d_bar_banner__text">
            <span className="d_bar_banner__label">
              <HiSparkles style={{ fontSize: 8, marginRight: 6, verticalAlign: 'middle' }} />
              Private Bar Hire
            </span>
            <h3 className="d_bar_banner__title">
              Host Your Next Event <em>in Style</em>
            </h3>
            <p className="d_bar_banner__sub">
              Exclusive bar buyouts, bespoke cocktail menus, and dedicated
              bar staff for your private celebration. From 20 to 120 guests.
            </p>
          </div>
          <div className="d_bar_banner__actions">
            <button className="d_bar_banner__btn-primary" onClick={handleReserve}>
              <MdOutlineLocalBar style={{ fontSize: 16 }} />
              Reserve the Bar
            </button>
            <button className="d_bar_banner__btn-secondary" onClick={handleExplore}>
              View Full Drinks Menu
              <span className="d_bar_banner__btn-arrow">
                <RiArrowRightSLine />
              </span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}