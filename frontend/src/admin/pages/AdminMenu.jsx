import { useEffect, useRef, useState } from "react";
import { FiClock } from "react-icons/fi";
import "../../style/x_style.css";
import {
  BADGE_META,
  BAR_SUBCATEGORIES,
  CAFE_SUBCATEGORIES,
  CATEGORIES,
  MENU_ITEMS,
  RESTAURANT_SUBCATEGORIES,
} from "../../pages/Menu";

function MenuCard({ item, hovered, visible, onHover, registerRef }) {
  const accent = item.category === "bar" ? "var(--d-bar)" : "var(--d-restaurant)";

  return (
    <article
      ref={registerRef}
      data-id={item.id}
      className={`x_menu_card${visible ? " x_visible" : ""}${hovered ? " x_hovered" : ""}`}
      style={{ "--accent": accent }}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="x_mc_img_wrap">
        <img src={item.img} alt={item.name} className="x_mc_img" loading="lazy" />
        <span className="x_mc_tag">{item.tag}</span>
      </div>
      <div className="x_mc_body">
        <div className="x_mc_top">
          <h3 className="x_mc_name">{item.name}</h3>
          <span className="x_mc_price">{item.price}</span>
        </div>
        <p className="x_mc_desc">{item.desc}</p>
        <div className="x_mc_foot">
          <div className="x_mc_badges">
            {item.badges.map((badge) => (
              <span
                key={badge}
                className="x_badge x_badge--sm"
                style={{ color: BADGE_META[badge]?.color, background: BADGE_META[badge]?.bg }}
              >
                {BADGE_META[badge]?.label}
              </span>
            ))}
          </div>
          <div className="x_mc_meta">
            <span><FiClock /> {item.time}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function AdminMenu() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [visibleIds, setVisibleIds] = useState(new Set());
  const cardRefs = useRef({});

  useEffect(() => {
    setActiveSubcategory(null);
  }, [activeCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleIds((previous) => new Set([...previous, Number(entry.target.dataset.id)]));
          }
        });
      },
      { threshold: 0.12 }
    );

    Object.values(cardRefs.current).forEach((element) => element && observer.observe(element));
    return () => observer.disconnect();
  }, [activeCategory, activeSubcategory]);

  const getCurrentSubcategories = () => {
    if (activeCategory === "restaurant") return RESTAURANT_SUBCATEGORIES;
    if (activeCategory === "bar") return BAR_SUBCATEGORIES;
    if (activeCategory === "cafe") return CAFE_SUBCATEGORIES;
    return [];
  };

  const filteredItems = MENU_ITEMS.filter((item) => {
    const categoryMatch = activeCategory === "all" || item.category === activeCategory;
    const subcategoryMatch = !activeSubcategory || item.subcategory === activeSubcategory;
    return categoryMatch && subcategoryMatch;
  });

  return (
    <div className="x_wrapper">
      <nav className="x_cat_strip">
        <div className="x_cat_inner">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              className={`x_cat_btn${activeCategory === category.id ? " x_cat_btn--active" : ""}`}
              style={activeCategory === category.id && category.accent ? { "--cat-accent": category.accent } : {}}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="x_cat_btn_icon">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
      </nav>

      {activeCategory !== "all" && getCurrentSubcategories().length > 0 && (
        <nav className="x_subcat_strip">
          <div className="x_subcat_inner">
            <button
              className={`x_subcat_btn${!activeSubcategory ? " x_subcat_btn--active" : ""}`}
              onClick={() => setActiveSubcategory(null)}
            >
              All {activeCategory === "restaurant" ? "Kitchen" : activeCategory === "cafe" ? "Cafe" : "Bar"} Items
            </button>
            {getCurrentSubcategories().map((subcategory) => (
              <button
                key={subcategory.id}
                className={`x_subcat_btn${activeSubcategory === subcategory.id ? " x_subcat_btn--active" : ""}`}
                onClick={() => setActiveSubcategory(subcategory.id)}
              >
                <span className="x_subcat_btn_icon">{subcategory.icon}</span>
                {subcategory.label}
              </button>
            ))}
          </div>
        </nav>
      )}

      <main className="x_main">
        <section className="x_section">
          <div className="x_section_head">
            <span className="x_section_kicker">Admin Menu</span>
            <h2 className="x_section_title">
              {activeCategory === "bar"
                ? "Drinks & Cocktails"
                : activeCategory === "restaurant"
                  ? "Kitchen Selections"
                  : activeCategory === "cafe"
                    ? "Cafe Delights"
                    : "All Items"}
            </h2>
            <span className="x_section_count">{filteredItems.length} items</span>
          </div>

          <div className="x_menu_grid">
            {filteredItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                hovered={hoveredId === item.id}
                visible={visibleIds.has(item.id)}
                onHover={setHoveredId}
                registerRef={(element) => {
                  cardRefs.current[item.id] = element;
                }}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}