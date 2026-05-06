import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoWineOutline, IoFlameOutline } from "react-icons/io5";
import { PiBeerSteinBold, PiLeafBold } from "react-icons/pi";
import { HiSparkles } from "react-icons/hi2";
import { RiArrowRightSLine } from "react-icons/ri";
import { MdOutlineLocalBar } from "react-icons/md";
import { GiMartini } from "react-icons/gi";
import AOS from 'aos';
import 'aos/dist/aos.css';
import "./barDrinks.css";
import "../style/z_style.css";
import { useMenu } from "../contexts/MenuContext";

/* ── MARQUEE ITEMS ───────────────────────────────────────── */
const MARQUEE_ITEMS = [
  "Craft Cocktails",
  "Natural Wines",
  "Artisan Beers",
  "Zero-Proof Creations",
  "Seasonal Ingredients",
  "Barrel-Aged Spirits",
  "Live Bar Every Friday",
  "Happy Hour 5–7PM",
];

// helper: normalize strings
function toSlug(value) {
  if (!value) return "";
  return value
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/* ── DRINK CARD ───────────────────────────────────────────── */
function DrinkCard({ drink, aos, aosDelay }) {
  const price =
    typeof drink.price === "string"
      ? drink.price.replace("₹", "")
      : drink.price;

  const abv = drink.cuisine || "ABV N/A";

  const catText =
    drink.drinkCategory || drink.categoryName || drink.category || "Bar";

  return (
    <div className="d_bar_card" data-aos={aos} data-aos-delay={aosDelay}>
      <div className="d_bar_card__img-wrap">
        <img
          src={drink.img}
          alt={drink.name}
          className="d_bar_card__img"
          loading="lazy"
        />
        <span className="d_bar_card__abv">{abv}</span>
      </div>

      <div className="d_bar_card__body">
        <span className="d_bar_card__cat">{catText}</span>
        <h3 className="d_bar_card__name">{drink.name}</h3>
        <p className="d_bar_card__desc">
          {drink.desc || drink.des || drink.short_des}
        </p>

        <div className="d_bar_card__tags">
          {(drink.tags || []).map((t) => (
            <span key={t} className="d_bar_card__tag">
              {t}
            </span>
          ))}
        </div>

        <div className="d_bar_card__footer">
          <span className="d_bar_card__price">
            <sup>₹</sup>
            {price}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── MARQUEE DIVIDER ──────────────────────────────────────── */
function BarMarquee() {
  const doubled = [
    ...MARQUEE_ITEMS,
    ...MARQUEE_ITEMS,
    ...MARQUEE_ITEMS,
    ...MARQUEE_ITEMS,
  ];
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
  const navigate = useNavigate();
  const { mappedDishes = [], loading } = useMenu();

  useEffect(() => {
    AOS.init({
      duration: 500,
      once: true,
      easing: 'ease-out',
    });
  }, []);

  // only Bar dishes (area ma "Bar")
  const barDishes = useMemo(
    () =>
      mappedDishes.filter((d) => {
        const areas = d.area || [];
        return areas.includes("Bar");
      }),
    [mappedDishes]
  );

  // drink categories normalize
  const normalized = useMemo(
    () =>
      barDishes.map((d) => {
        const rawCat =
          d.drinkCategory ||
          d.categoryName ||
          d.category ||
          "Cocktails";

        const slug = toSlug(rawCat); // cocktails / wine / beer / mocktails

        return {
          ...d,
          drinkCategory: rawCat,
          drinkCategorySlug: slug,
        };
      }),
    [barDishes]
  );

  // tabs with counts
  const TABS = useMemo(() => {
    const counts = {
      cocktails: 0,
      wine: 0,
      beer: 0,
      mocktails: 0,
    };

    normalized.forEach((d) => {
      if (counts[d.drinkCategorySlug] !== undefined) {
        counts[d.drinkCategorySlug]++;
      }
    });

    const total = normalized.length;

    return [
      {
        id: "all",
        label: "All Drinks",
        icon: <MdOutlineLocalBar />,
        count: total,
      },
      {
        id: "cocktails",
        label: "Cocktails",
        icon: <GiMartini />,
        count: counts.cocktails,
      },
      {
        id: "wine",
        label: "Wine",
        icon: <IoWineOutline />,
        count: counts.wine,
      },
      {
        id: "beer",
        label: "Beer",
        icon: <PiBeerSteinBold />,
        count: counts.beer,
      },
      {
        id: "mocktails",
        label: "Mocktails",
        icon: <PiLeafBold />,
        count: counts.mocktails,
      },
    ];
  }, [normalized]);

  // LIMIT: All = 4, each category = 4
  const filtered =
    activeTab === "all"
      ? normalized.slice(0, 4)
      : normalized
          .filter((d) => d.drinkCategorySlug === activeTab)
          .slice(0, 4);

  const handleExplore = () => navigate("/bar");
  const handleReserve = () => navigate("/bookTable");

  if (loading) {
    return (
      <section className="d_bar_section">
        <div className="d_wrapper">
          <div style={{ padding: "20px", textAlign: "center" }}>
            Loading bar menu...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="d_bar_section">
      <div className="d_wrapper">
        {/* HERO SPLIT */}
        <div className="d_bar_hero">
          {/* Right — hero media */}
          <div className="d_bar_hero__right" data-aos="fade-left">
            <div className="z_bar_media_container">
              <div className="z_bar_main_video">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  src="/video/kfhg.mp4"
                ></video>
              </div>
              <div className="z_bar_overlap_img z_slide_shape_arch" data-aos="zoom-in" data-aos-delay="200">
                <img
                  src="https://i.pinimg.com/736x/ff/32/47/ff32474e9817eda52b828c15c64c9620.jpg"
                  alt="Signature Cocktail"
                />
              </div>
            </div>
          </div>

          {/* Left — editorial copy */}
          <div className="d_bar_hero__left" data-aos="fade-right">
            <p className="d_bar_hero__eyebrow" data-aos="fade-down" data-aos-delay="100">
              <span className="d_bar_hero__eyebrow-gem">◆</span>
              The Bar at DineVerse
            </p>

            <div className="d_bar_hero__content">
              <h2 className="d_bar_hero__title" data-aos="zoom-in" data-aos-delay="200">
                Where Every Sip
                <em>Tells a Story</em>
              </h2>
              <p className="d_bar_hero__body" data-aos="fade-up" data-aos-delay="300">
                Step into our dimly lit sanctuary of crafted spirits, natural
                wines, and house-brewed ales. Our bartenders are artists — each
                pour a composition of flavour, memory, and mood.
              </p>

              <div className="d_bar_hero__stats" data-aos="fade-up" data-aos-delay="400">
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

              <button className="d_bar_hero__cta" onClick={handleExplore} data-aos="fade-up" data-aos-delay="500">
                <IoWineOutline style={{ fontSize: 16 }} />
                Explore Drinks
                <span className="d_bar_hero__cta-arrow">
                  <RiArrowRightSLine />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* MARQUEE */}
        <div data-aos="fade">
          <BarMarquee />
        </div>

        {/* TABS */}
        <div
          className="d_bar_tabs"
          role="tablist"
          aria-label="Filter drinks by category"
          data-aos="fade-up"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={
                "d_bar_tab" +
                (activeTab === tab.id ? " d_bar_tab--active" : "")
              }
              onClick={() => setActiveTab(tab.id)}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 13,
                }}
              >
                {tab.icon}
              </span>
              {tab.label}
              <span className="d_bar_tab__count">{tab.count}</span>
            </button>
          ))}
        </div>

        {/* CARDS GRID */}
        <div className="d_bar_grid" role="tabpanel">
          {filtered.map((drink, index) => (
            <DrinkCard key={drink.id} drink={drink} aos="fade-up" aosDelay={index * 50} />
          ))}
          {filtered.length === 0 && (
            <p style={{ padding: 16, textAlign: "center" }}>
              No drinks found for this category.
            </p>
          )}
        </div>

        {/* BOTTOM CTA BANNER */}
        <div className="d_bar_banner" data-aos="zoom-in">
          <div className="d_bar_banner__text">
            <span className="d_bar_banner__label">
              <HiSparkles
                style={{
                  fontSize: 8,
                  marginRight: 6,
                  verticalAlign: "middle",
                }}
              />
              Private Bar Hire
            </span>
            <h3 className="d_bar_banner__title">
              Host Your Next Event <em>in Style</em>
            </h3>
            <p className="d_bar_banner__sub">
              Exclusive bar buyouts, bespoke cocktail menus, and dedicated bar
              staff for your private celebration. From 20 to 120 guests.
            </p>
          </div>
          <div className="d_bar_banner__actions">
            <button
              className="d_bar_banner__btn-primary"
              onClick={handleReserve}
            >
              <MdOutlineLocalBar style={{ fontSize: 16 }} />
              Reserve the Bar
            </button>
            <button
              className="d_bar_banner__btn-secondary"
              onClick={handleExplore}
            >
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