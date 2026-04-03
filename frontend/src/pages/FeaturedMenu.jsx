import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiCoffeeBold, PiKnifeBold } from "react-icons/pi";
import { IoWineOutline } from "react-icons/io5";
import { RiRestaurantLine } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi2";
import { RiArrowRightSLine } from "react-icons/ri";
import { MdStar, MdOutlineStarOutline } from "react-icons/md";
import { IoFlameOutline } from "react-icons/io5";
import "./featuredMenu.css";

/* ── MENU DATA ────────────────────────────────────────────── */
const MENU_ITEMS = [
  {
    id: 1,
    name: "Truffle Risotto",
    desc: "Aged Arborio, black truffle shavings, parmesan foam, microherbs.",
    price: "28",
    category: "restaurant",
    categoryLabel: "Restaurant",
    badge: "signature",
    badgeLabel: "Signature",
    rating: 4.9,
    reviews: 214,
    img: "https://i.pinimg.com/736x/76/60/17/766017678c850c8b522adefa9a27eeaa.jpg",
  },
  {
    id: 2,
    name: "Single Origin Pour Over",
    desc: "Ethiopian Yirgacheffe, hand-brewed, floral & citrus notes.",
    price: "7",
    category: "cafe",
    categoryLabel: "Café",
    badge: "popular",
    badgeLabel: "Popular",
    rating: 4.8,
    reviews: 189,
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
  },
  {
    id: 3,
    name: "Smoked Duck Breast",
    desc: "Cherry gastrique, wild mushroom duxelles, potato gratin.",
    price: "36",
    category: "restaurant",
    categoryLabel: "Restaurant",
    badge: "signature",
    badgeLabel: "Signature",
    rating: 4.9,
    reviews: 97,
    img: "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=600&q=80",
  },
  {
    id: 4,
    name: "Midnight Negroni",
    desc: "Barrel-aged gin, vermouth rosso, activated charcoal, orange peel.",
    price: "16",
    category: "bar",
    categoryLabel: "Bar",
    badge: "new",
    badgeLabel: "New",
    rating: 4.7,
    reviews: 63,
    img: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600&q=80",
  },
];

const TABS = [
  { id: "all",        label: "All",        icon: <HiSparkles /> },
  { id: "restaurant", label: "Restaurant", icon: <RiRestaurantLine /> },
  { id: "cafe",       label: "Café",       icon: <PiCoffeeBold /> },
  { id: "bar",        label: "Bar",        icon: <IoWineOutline /> },
];

/* ── STAR RATING ──────────────────────────────────────────── */
function StarRating({ rating }) {
  return (
    <span className="d_featured__rating">
      <MdStar className="d_featured__rating-star" />
      {rating.toFixed(1)}
    </span>
  );
}

/* ── BADGE ────────────────────────────────────────────────── */
function Badge({ type, label }) {
  if (!type) return null;
  return (
    <span className={`d_featured__badge d_featured__badge--${type}`}>
      {type === "signature" && <HiSparkles style={{ fontSize: 9 }} />}
      {type === "popular"   && <IoFlameOutline style={{ fontSize: 9 }} />}
      {label}
    </span>
  );
}

/* ── MENU CARD ────────────────────────────────────────────── */
function MenuCard({ item }) {
  const navigate = useNavigate();
  return (
    <div className="d_featured__card">
      <Badge type={item.badge} label={item.badgeLabel} />

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
          <button className="d_featured__overlay-btn" onClick={() => navigate(`/dish/${item.id}`)}>
            <PiKnifeBold style={{ fontSize: 13 }} />
            View Details
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="d_featured__body">
        <span className={`d_featured__cat d_featured__cat--${item.category}`}>
          <span className="d_featured__cat-dot" />
          {item.categoryLabel}
        </span>

        <h3 className="d_featured__name">{item.name}</h3>
        <p className="d_featured__desc">{item.desc}</p>

        <div className="d_featured__footer">
          <span className="d_featured__price">
            <span className="d_featured__price-currency">$</span>
            {item.price}
          </span>
          <StarRating rating={item.rating} />
        </div>
      </div>
    </div>
  );
}

/* ── MAIN SECTION ─────────────────────────────────────────── */
export default function FeaturedMenu() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered =
    activeTab === "all"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === activeTab);

  return (
    <section className="d_featured">
      <div className="d_wrapper">

        {/* Header */}
        <div className="d_featured__header">
          <p className="d_featured__eyebrow">
            <span className="d_featured__eyebrow-line" />
            Seasonal Selection
            <span className="d_featured__eyebrow-line" />
          </p>
          <h2 className="d_featured__title">
            Chef's <em>Signature</em> Dishes
          </h2>
          <p className="d_featured__subtitle">
            Handpicked favourites from our kitchen — crafted with seasonal
            ingredients and artisan passion.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="d_featured__tabs" role="tablist" aria-label="Filter menu by category">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`d_featured__tab${activeTab === tab.id ? " d_featured__tab--active" : ""}`}
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
            style={{ textDecoration: 'none' }}
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