import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { MdTableRestaurant, MdHotel } from "react-icons/md";
import { IoWineOutline } from "react-icons/io5";
import { PiCoffeeBold, PiKnifeBold } from "react-icons/pi";
import { RiRestaurantLine } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi2";
import { RiArrowRightSLine } from "react-icons/ri";
import "./header.css";

/* ── DATA ─────────────────────────────────────────────────── */

const NAV_LINKS = [
  {
    id: "cafe",
    label: "Café",
    href: "/cafe",
    icon: <PiCoffeeBold />,
    sub: "Artisan coffee & pastries",
  },
  {
    id: "restaurant",
    label: "Restaurant",
    href: "/restaurant",
    icon: <RiRestaurantLine />,
    sub: "Fine dining experience",
  },
  {
    id: "bar",
    label: "Bar",
    href: "/bar",
    icon: <IoWineOutline />,
    sub: "Craft cocktails & wine",
  },
  {
    id: "room",
    label: "Rooms",
    href: "/rooms",
    icon: <MdHotel />,
    sub: "Luxury stays",
  },
  {
    id: "menu",
    label: "Menu",
    href: "/menu",
    icon: <PiKnifeBold />,
    sub: "Full seasonal menu",
  },
];

const STRIP_ITEMS = [
  "Open Daily 8AM – 2AM",
  "Café · Restaurant · Bar · Rooms",
  "Reserve Your Table",
  "Luxury Rooms Available",
  "Craft Cocktails & Wine",
  "Private Dining Events",
  "Book Your Stay Tonight",
  "Seasonal Tasting Menu",
];

const SEARCH_TAGS = [
  "Espresso", "Pasta", "Cocktails",
  "Brunch", "Fine Wine", "Suite", "Vegan", "Tasting Menu",
];

/* ── LOGO ─────────────────────────────────────────────────── */
function Logo({ onClick }) {
  return (
    <Link to="/" className="d_logo" onClick={onClick} aria-label="DineVerse home">
      <div className="d_logo__emblem">
        <div className="d_logo__emblem-bg">
          <span className="d_logo__emblem-icon"><HiSparkles /></span>
        </div>
      </div>
      <div className="d_logo__wordmark">
        <span className="d_logo__name">DineVerse</span>
        <span className="d_logo__sub">Café · Dining · Bar · Rooms</span>
      </div>
    </Link>
  );
}

/* ── HAMBURGER ────────────────────────────────────────────── */
function Hamburger({ open, onClick }) {
  return (
    <button
      className={`d_hamburger${open ? " d_hamburger--open" : ""}`}
      onClick={onClick}
      aria-label={open ? "Close navigation" : "Open navigation"}
      aria-expanded={open}
      aria-controls="d-drawer"
    >
      <span className="d_hamburger__bar" />
      <span className="d_hamburger__bar" />
      <span className="d_hamburger__bar" />
    </button>
  );
}

/* ── SEARCH OVERLAY ───────────────────────────────────────── */
function SearchOverlay({ open, onClose }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 90);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <div
      className={`d_search${open ? " d_search--open" : ""}`}
      role="dialog"
      aria-label="Search"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="d_search__panel">
        <div className="d_search__row">
          <span className="d_search__icon"><FiSearch /></span>
          <input
            ref={inputRef}
            className="d_search__input"
            placeholder="Search menus, dishes, rooms, drinks…"
            aria-label="Search query"
          />
          <button
            className="d_btn-ghost"
            onClick={onClose}
            aria-label="Close search"
            style={{ fontSize: "18px" }}
          >
            ✕
          </button>
        </div>
        <div className="d_search__tags">
          {SEARCH_TAGS.map((tag) => (
            <button key={tag} className="d_search__tag">
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── MOBILE DRAWER ────────────────────────────────────────── */
function Drawer({ open, onClose, onBookTable, onBookRoom }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`d_backdrop${open ? " d_backdrop--open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        id="d-drawer"
        className={`d_drawer${open ? " d_drawer--open" : ""}`}
        aria-label="Site navigation"
      >
        {/* Header */}
        <div className="d_drawer__head">
          <Logo onClick={onClose} />
          <button
            className="d_btn-ghost"
            onClick={onClose}
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        {/* Nav links — NO dots, icon cards */}
        <nav className="d_drawer__body">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              to={link.href}
              className="d_drawer__link"
              onClick={onClose}
            >
              <div className={`d_drawer__link-icon d_drawer__link-icon--${link.id}`}>
                {link.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div className="d_drawer__link-text">{link.label}</div>
                <div className="d_drawer__link-sub">{link.sub}</div>
              </div>
              <RiArrowRightSLine className="d_drawer__link-arrow" />
            </Link>
          ))}

          <div className="d_drawer__sep" />
        </nav>

        {/* Footer CTAs */}
        <div className="d_drawer__foot">
          <button
            className="d_drawer__cta d_drawer__cta--table"
            onClick={() => { onClose(); onBookTable(); }}
          >
            <MdTableRestaurant size={18} />
            Reserve a Table
          </button>
          <button
            className="d_drawer__cta d_drawer__cta--room"
            onClick={() => { onClose(); onBookRoom(); }}
          >
            <MdHotel size={18} />
            Book a Room
          </button>
        </div>
      </aside>
    </>
  );
}

/* ── MARQUEE STRIP ────────────────────────────────────────── */
function Strip() {
  const doubled = [...STRIP_ITEMS, ...STRIP_ITEMS];
  return (
    <div className="d_strip" aria-hidden="true">
      <div className="d_strip__track">
        {doubled.map((text, i) => (
          <span className="d_strip__item" key={i}>
            <span className="d_strip__gem">◆</span>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── MAIN HEADER ──────────────────────────────────────────── */
export default function Header() {
  const [scrolled,    setScrolled]    = useState(false);
  const [activeNav,   setActiveNav]   = useState("");
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  /* Scroll listener */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;
    const activeLink = NAV_LINKS.find(link => link.href === currentPath);
    if (activeLink) {
      setActiveNav(activeLink.id);
    } else {
      setActiveNav("");
    }
  }, [location.pathname]);

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = (searchOpen || drawerOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [searchOpen, drawerOpen]);

  /* Escape key */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setDrawerOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleBookTable = () => navigate("/bookTable");
  const handleBookRoom  = () => navigate("/bookRoom");

  return (
    <>
      {/* ── FIXED HEADER ── */}
      <header className={`d_header${scrolled ? " d_header--scrolled" : ""}`}>
        <div className="d_header__bar">

          {/* Logo */}
          <Logo />

          {/* Desktop nav — NO dots, underline reveal */}
          <nav className="d_nav" aria-label="Main navigation">
            <ul className="d_nav" style={{ padding: 0 }}>
              {NAV_LINKS.map((link, i) => (
                <React.Fragment key={link.id}>
                  <li className="d_nav__item">
                    <Link
                      to={link.href}
                      className={[
                        "d_nav__link",
                        `d_nav__link--${link.id}`,
                        activeNav === link.id ? "d_nav__link--active" : "",
                      ].filter(Boolean).join(" ")}
                      aria-current={activeNav === link.id ? "page" : undefined}
                    >
                      <span className="d_nav__link-icon" aria-hidden="true">
                        {link.icon}
                      </span>
                      {link.label}
                    </Link>
                  </li>
                  {/* Separator between items, not after last */}
                  {i < NAV_LINKS.length - 1 && (
                    <li key={`sep-${i}`} aria-hidden="true">
                      <div className="d_nav__sep" />
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="d_actions">
            {/* Search */}
            <button
              className="d_btn-ghost"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              title="Search"
            >
              <FiSearch />
            </button>

            {/* Book Room — outlined, desktop only */}
            <button
              className="d_btn-room"
              onClick={handleBookRoom}
              aria-label="Book a room"
            >
              <MdHotel size={16} />
              <span className="d_btn-label">Book Room</span>
            </button>

            {/* Book Table — gold, desktop only */}
            <button
              className="d_btn-table"
              onClick={handleBookTable}
              aria-label="Reserve a table"
            >
              <MdTableRestaurant size={16} />
              <span className="d_btn-label">Reserve Table</span>
            </button>

            {/* Hamburger — mobile only */}
            <Hamburger
              open={drawerOpen}
              onClick={() => setDrawerOpen((v) => !v)}
            />
          </div>
        </div>
      </header>

      {/* ── MARQUEE STRIP ── */}
      <Strip />

      {/* ── SEARCH ── */}
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* ── MOBILE DRAWER ── */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onBookTable={handleBookTable}
        onBookRoom={handleBookRoom}
      />

      {/* Page content pusher */}
      <div className="d_spacer" aria-hidden="true" />
    </>
  );
}