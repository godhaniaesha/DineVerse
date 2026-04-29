import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiCoffeeBold, PiKnifeBold } from "react-icons/pi";
import { IoWineOutline, IoFlameOutline } from "react-icons/io5";
import { RiRestaurantLine, RiArrowRightSLine } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi2";
import { MdStar } from "react-icons/md";
import { BADGE_META } from "./Menu";
import { useMenu } from "../contexts/MenuContext";
import "./featuredMenu.css";

const TABS = [
  { id: "all",        label: "All",        icon: <HiSparkles /> },
  { id: "restaurant", label: "Restaurant", icon: <RiRestaurantLine /> },
  { id: "cafe",       label: "Café",       icon: <PiCoffeeBold /> },
  { id: "bar",        label: "Bar",        icon: <IoWineOutline /> },
];

// helper: string ne category slug ma convert
function toSlug(value) {
  if (!value) return "";
  return value
    .toString()
    .toLowerCase()
    .normalize("NFD") // accents remove
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/**
 * All tab mate category wise cards pick karva:
 * restaurant: 3, cafe: 2, bar: 3  => total 8
 * tame numbers niche object ma change kari shako.
 */
function pickForAllTab(items) {
  const LIMITS = {
    restaurant: 3,
    cafe: 2,
    bar: 3,
  };

  const byCat = {
    restaurant: [],
    cafe: [],
    bar: [],
    other: [],
  };

  // group
  for (const item of items) {
    if (byCat[item._catSlug]) {
      byCat[item._catSlug].push(item);
    } else {
      byCat.other.push(item);
    }
  }

  const result = [];

  // restaurant → cafe → bar order ma push karie
  Object.entries(LIMITS).forEach(([slug, limit]) => {
    const arr = byCat[slug] || [];
    for (let i = 0; i < arr.length && i < limit; i++) {
      result.push(arr[i]);
    }
  });

  // joiye to: agar koi category ma items ochha hoy to,
  // baki categories/other mathi fill kari sakay (optional).
  // Havar mate tame j kahyu e pramane fixed distribution rakhiye.

  return result;
}

/* ── STAR RATING ──────────────────────────────────────────── */
function StarRating({ rating }) {
  return (
    <span className="d_featured__rating">
      <MdStar className="d_featured__rating-star" />
      {rating}
    </span>
  );
}

/* ── BADGE ────────────────────────────────────────────────── */
function Badge({ type }) {
  if (!type || !BADGE_META[type]) return null;
  const meta = BADGE_META[type];
  return (
    <span
      className={`d_featured__badge d_featured__badge--${type}`}
      style={{ color: meta.color, background: meta.bg }}
    >
      {type === "signature" && <HiSparkles style={{ fontSize: 9 }} />}
      {type === "bestseller" && <IoFlameOutline style={{ fontSize: 9 }} />}
      {meta.label}
    </span>
  );
}

/* ── MENU CARD ────────────────────────────────────────────── */
function MenuCard({ item }) {
  const navigate = useNavigate();
  const price =
    typeof item.price === "string"
      ? item.price.replace("₹", "")
      : item.price;
  const rating = item.featured ? 4.9 : 4.7;
  const badge = item.badges?.[0] || (item.featured ? "signature" : null);

  const catName = (
    item.categoryName ||
    item.category ||
    "menu"
  ).toString();

  const catSlug = toSlug(catName); // restaurant / cafe / bar

  return (
    <div className="d_featured__card">
      <Badge type={badge} />

      {/* Image */}
      <div className="d_featured__img-wrap">
        <img
          src={item.img}
          alt={item.name}
          className="d_featured__img"
          loading="lazy"
        />
        {/* Hover quick-view */}
        <div className="d_featured__overlay">
          <button
            className="d_featured__overlay-btn"
            onClick={() => navigate(`/dish/${item.id}`)}
          >
            <PiKnifeBold style={{ fontSize: 13 }} />
            View Details
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="d_featured__body">
        <span className={`d_featured__cat d_featured__cat--${catSlug}`}>
          <span className="d_featured__cat-dot" />
          {catName.charAt(0).toUpperCase() + catName.slice(1)}
        </span>

        <h3 className="d_featured__name">{item.name}</h3>
        <p className="d_featured__desc">{item.desc || item.short_des}</p>

        <div className="d_featured__footer">
          <span className="d_featured__price">
            <span className="d_featured__price-currency">₹</span>
            {price}
          </span>
          <StarRating rating={rating} />
        </div>
      </div>
    </div>
  );
}

/* ── MAIN SECTION ─────────────────────────────────────────── */
export default function FeaturedMenu() {
  const [activeTab, setActiveTab] = useState("all");
  const { mappedDishes: MENU_ITEMS = [], loading } = useMenu();

  // category normalize: restaurant / cafe / bar
  const normalized = useMemo(
    () =>
      MENU_ITEMS.map((item) => {
        const rawCat =
          item.category ||
          item.categoryName ||
          (item.area && item.area[0]) ||
          "restaurant";

        const slug = toSlug(rawCat);

        return {
          ...item,
          _catSlug: slug,
          _catName: rawCat,
        };
      }),
    [MENU_ITEMS]
  );

  const filtered = useMemo(() => {
    if (activeTab === "all") {
      // Restaurant 3, Cafe 2, Bar 3
      return pickForAllTab(normalized);
    }
    // Individual tab: max 8 of that category
    return normalized
      .filter((item) => item._catSlug === activeTab)
      .slice(0, 8);
  }, [normalized, activeTab]);

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Loading menu...
      </div>
    );
  }

  return (
    <section className="d_featured">
      <div className="d_wrapper">
        {/* Header */}
        <div className="d_featured__header">
          <p className="d_featured__eyebrow">
            <span className="d_featured__eyebrow-line" />
            Our Menu
            <span className="d_featured__eyebrow-line" />
          </p>
          <h2 className="d_featured__title">
            Discover <em>Delicious</em> Dishes
          </h2>
          <p className="d_featured__subtitle">
            Explore our complete menu — crafted with seasonal ingredients and
            artisan passion.
          </p>
        </div>

        {/* Filter Tabs */}
        <div
          className="d_featured__tabs"
          role="tablist"
          aria-label="Filter menu by category"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={
                "d_featured__tab" +
                (activeTab === tab.id ? " d_featured__tab--active" : "")
              }
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="d_featured__tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="d_featured__grid" role="tabpanel">
          {filtered.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>

        {/* CTA */}
        <div className="d_featured__cta-row">
          <Link
            to="/menu"
            className="d_featured__cta"
            aria-label="View the full menu"
            style={{ textDecoration: "none" }}
          >
            View Full Menu
            <span className="d_featured__cta-icon">
              <RiArrowRightSLine />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}