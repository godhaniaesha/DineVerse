import { useState, useEffect } from "react";
import { HiSparkles } from "react-icons/hi2";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import { TbMaximize } from "react-icons/tb";
import { PiFrameCornersBold } from "react-icons/pi";
import { MdOutlinePhotoLibrary } from "react-icons/md";
import "./gallery.css";

/* ── GALLERY DATA ─────────────────────────────────────────── */
const GALLERY = [
  {
    id: 1, title: "The Dining Room at Dusk",
    category: "Ambiance", tag: "ambiance",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  },
  {
    id: 2, title: "Truffle Risotto",
    category: "Signature Dish", tag: "food",
    img: "https://recipes.net/wp-content/uploads/2023/05/chanterelle-mushroom-risotto_f34effca58384b447accde25b8a6adc1.jpeg",
  },
  {
    id: 3, title: "The Midnight Bar",
    category: "Bar", tag: "bar",
    img: "https://images.unsplash.com/photo-1575444758702-4a6b9222336e?w=700&q=80",
  },
  {
    id: 4, title: "Anniversary Celebration",
    category: "Special Event", tag: "events",
    img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=700&q=80",
  },
  {
    id: 5, title: "Midnight Negroni",
    category: "Bar", tag: "bar",
    img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80",
  },
  {
    id: 6, title: "The Grand Lumière Suite",
    category: "Rooms", tag: "ambiance",
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
  },
];

const TABS = [
  { id: "all",      label: "All",        icon: <MdOutlinePhotoLibrary /> },
  { id: "food",     label: "Dishes",     icon: <HiSparkles /> },
  { id: "bar",      label: "Bar",        icon: <PiFrameCornersBold /> },
  { id: "ambiance", label: "Ambiance",   icon: <HiSparkles /> },
  { id: "events",   label: "Events",     icon: <HiSparkles /> },
];

/* ── LIGHTBOX ─────────────────────────────────────────────── */
function Lightbox({ items, index, onClose, onNav }) {
  const item = items[index];

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft")  onNav(-1);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose, onNav]);

  if (!item) return null;

  return (
    <div
      className="d_gal_lightbox d_gal_lightbox--open"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button className="d_gal_lightbox__close" onClick={onClose} aria-label="Close">✕</button>

      <div className="d_gal_lightbox__panel">
        {/* Prev */}
        <button
          className="d_gal_lightbox__nav d_gal_lightbox__nav--prev"
          onClick={() => onNav(-1)}
          aria-label="Previous"
        >
          <RiArrowLeftSLine />
        </button>

        <div className="d_gal_lightbox__img-wrap">
          <img src={item.img} alt={item.title} className="d_gal_lightbox__img" />
        </div>

        <div className="d_gal_lightbox__info">
          <div>
            <div className="d_gal_lightbox__title">{item.title}</div>
            <div className="d_gal_lightbox__cat">{item.category}</div>
          </div>
          <span className="d_gal_lightbox__counter">
            {index + 1} / {items.length}
          </span>
        </div>

        {/* Next */}
        <button
          className="d_gal_lightbox__nav d_gal_lightbox__nav--next"
          onClick={() => onNav(1)}
          aria-label="Next"
        >
          <RiArrowRightSLine />
        </button>
      </div>
    </div>
  );
}

/* ── MAIN SECTION ─────────────────────────────────────────── */
export default function Gallery() {
  const [activeTab, setActiveTab]     = useState("all");
  const [lightboxIdx, setLightboxIdx] = useState(null);

  const filtered = activeTab === "all"
    ? GALLERY
    : GALLERY.filter(g => g.tag === activeTab);

  const openLightbox = (idx) => { setLightboxIdx(idx); document.body.style.overflow = "hidden"; };
  const closeLightbox = () => { setLightboxIdx(null); document.body.style.overflow = ""; };
  const navLightbox = (dir) =>
    setLightboxIdx(i => (i + dir + filtered.length) % filtered.length);

  return (
    <section className="d_gal_section">
      <div className="d_wrapper">

        {/* Header */}
        <div className="d_gal_header">
          <div className="d_gal_header__left">
            <p className="d_gal_header__eyebrow">
              <span className="d_gal_header__eyebrow-gem">◆</span>
              A Visual Journey
              <span className="d_gal_header__eyebrow-gem">◆</span>
            </p>
            <h2 className="d_gal_header__title">
              Life at <em>Lumière</em>
            </h2>
          </div>
          <div className="d_gal_header__right">
            <p className="d_gal_header__sub">
              Every corner of Lumière is a composition — see the spaces, dishes,
              and moments that define us.
            </p>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="d_gal_tabs" role="tablist">
          {TABS.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`d_gal_tab${activeTab === tab.id ? " d_gal_tab--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={{ display: "flex", alignItems: "center", fontSize: 12 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Masonry grid */}
        <div className="d_gal_grid" role="tabpanel">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              className="d_gal_item"
              onClick={() => openLightbox(idx)}
              role="button"
              tabIndex={0}
              aria-label={`View ${item.title}`}
              onKeyDown={(e) => e.key === "Enter" && openLightbox(idx)}
            >
              <img
                src={item.img}
                alt={item.title}
                className="d_gal_item__img"
                loading="lazy"
              />
              <div className="d_gal_item__overlay">
                <div className="d_gal_item__caption">
                  <span className="d_gal_item__caption-title">{item.title}</span>
                  <span className="d_gal_item__caption-cat">{item.category}</span>
                </div>
              </div>
              <span className="d_gal_item__expand" aria-hidden="true">
                <TbMaximize />
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="d_gal_cta_row">
          <button
            className="d_gal_cta"
            onClick={() => alert("Full gallery — connect your router here.")}
          >
            <MdOutlinePhotoLibrary style={{ fontSize: 17 }} />
            View Full Gallery
            <RiArrowRightSLine style={{ fontSize: 18 }} />
          </button>
        </div>

      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          items={filtered}
          index={lightboxIdx}
          onClose={closeLightbox}
          onNav={navLightbox}
        />
      )}
    </section>
  );
}