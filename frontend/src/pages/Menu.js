import { useState, useEffect, useRef } from "react";
import { FiSearch, FiX, FiStar, FiClock, FiLeaf, FiArrowRight } from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import { GiWineGlass, GiCoffeeCup, GiKnifeFork, GiBeerStein } from "react-icons/gi";
import { TbSparkles, TbChefHat } from "react-icons/tb";
import { MdOutlineLocalBar } from "react-icons/md";
import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMenu } from "../contexts/MenuContext";

/* ─────────── DATA ─────────── */
export const CATEGORIES = [
    { id: "all", label: "All", icon: <TbSparkles /> },
    { id: "restaurant", label: "Restaurant", icon: <GiKnifeFork />, accent: "var(--d-restaurant)" },
    { id: "bar", label: "Bar", icon: <MdOutlineLocalBar />, accent: "var(--d-bar)" },
    { id: "cafe", label: "Cafe", icon: <GiCoffeeCup />, accent: "var(--d-cafe)" },
];

export const RESTAURANT_SUBCATEGORIES = [
    { id: "appetizers", label: "Appetizers", icon: <GiKnifeFork /> },
    { id: "mains", label: "Mains", icon: <GiKnifeFork /> },
    { id: "sides", label: "Sides", icon: <GiKnifeFork /> },
    { id: "desserts", label: "Desserts", icon: <GiKnifeFork /> },
    { id: "drinks", label: "Drinks", icon: <GiWineGlass /> },
];

export const BAR_SUBCATEGORIES = [
    { id: "cocktails", label: "Cocktails", icon: <MdOutlineLocalBar /> },
    { id: "spirits", label: "Spirits", icon: <GiBeerStein /> },
    { id: "wine", label: "Wine", icon: <GiWineGlass /> },
    { id: "beer", label: "Beer", icon: <GiBeerStein /> },
    { id: "mocktails", label: "Mocktails", icon: <GiCoffeeCup /> },
    { id: "signature", label: "Signature", icon: <TbSparkles /> },
];

export const CAFE_SUBCATEGORIES = [
    { id: "toasts", label: "Toasts", icon: <GiCoffeeCup /> },
    { id: "light-meals", label: "Light Meals", icon: <GiCoffeeCup /> },
    { id: "salads", label: "Salads", icon: <GiCoffeeCup /> },
    { id: "snacks", label: "Snacks", icon: <GiCoffeeCup /> },
    { id: "tonics", label: "Tonics", icon: <GiCoffeeCup /> },
];

export const BADGE_META = {
    signature: { label: "Signature", color: "var(--d-gold)", bg: "var(--d-gold-subtle)" },
    spicy: { label: "🌶 Spicy", color: "#e87070", bg: "rgba(232,112,112,0.10)" },
    veg: { label: "🌿 Veg", color: "var(--d-cafe)", bg: "var(--d-cafe-dim)" },
    sweet: { label: "🍫 Sweet", color: "#d48fb5", bg: "var(--d-room-dim)" },
    bestseller: { label: "⭐ Best", color: "#e8c878", bg: "rgba(232,200,120,0.10)" },
    "alcohol-free": { label: "🧃 AF", color: "var(--d-cafe)", bg: "var(--d-cafe-dim)" },
};

/* ─────────── COMPONENT ─────────── */
export default function Menu() {
    const navigate = useNavigate();
    const { mappedDishes: mappedItems, loading: menuLoading } = useMenu();
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeSubcategory, setActiveSubcategory] = useState(null);
    const [search, setSearch] = useState("");
    const [hoveredId, setHoveredId] = useState(null);
    const [visibleIds, setVisibleIds] = useState(new Set());
    const cardRefs = useRef({});

    // Reset subcategory when main category changes
    useEffect(() => {
        setActiveSubcategory(null);
    }, [activeCategory]);

    /* intersection observer for staggered reveal */
    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        setVisibleIds((prev) => new Set([...prev, e.target.dataset.id]));
                    }
                });
            },
            { threshold: 0.12 }
        );
        Object.values(cardRefs.current).forEach((el) => el && obs.observe(el));
        return () => obs.disconnect();
    }, [activeCategory, activeSubcategory, search, mappedItems]);

    const filtered = mappedItems.filter((item) => {
        const matchCat = activeCategory === "all" || item.category === activeCategory;
        const matchSubCat = !activeSubcategory || item.subcategory === activeSubcategory;
        const q = search.toLowerCase();
        const matchSearch =
            !q ||
            item.name.toLowerCase().includes(q) ||
            item.desc.toLowerCase().includes(q) ||
            item.tag.toLowerCase().includes(q);
        return matchCat && matchSubCat && matchSearch;
    });

    const featured = filtered.filter((i) => i.featured);
    const regular = filtered.filter((i) => !i.featured);

    const getCurrentSubcategories = () => {
        if (activeCategory === "restaurant") return RESTAURANT_SUBCATEGORIES;
        if (activeCategory === "bar") return BAR_SUBCATEGORIES;
        if (activeCategory === "cafe") return CAFE_SUBCATEGORIES;
        return [];
    };

    if (menuLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--d-bg)' }}>
                <div className="x_title" style={{ fontSize: '2rem' }}>Loading Menu...</div>
            </div>
        );
    }

    return (
        <>
            {/* Google Fonts */}
            <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');`}</style>

            <div className="x_wrapper">
                {/* ── HERO HEADER ── */}
                <header className="x_header">
                    <div className="x_header_noise" />
                    <div className="x_header_glow" />
                    <div className="x_header_inner">
                        <div className="x_eyebrow">
                            <span className="x_eyebrow_line" />
                            <TbChefHat className="x_eyebrow_icon" />
                            <span>Est. 2019 · Surat</span>
                            <span className="x_eyebrow_line" />
                        </div>
                        <h1 className="x_title">
                            <em>DineVerse</em> Menu
                        </h1>
                        <p className="x_subtitle">
                            Restaurant &amp; Bar — curated with intention
                        </p>

                    </div>
                </header>

                {/* ── CATEGORY STRIP ── */}
                <nav className="x_cat_strip">
                    <div className="x_cat_inner">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                className={`x_cat_btn${activeCategory === cat.id ? " x_cat_btn--active" : ""}`}
                                style={activeCategory === cat.id && cat.accent ? { "--cat-accent": cat.accent } : {}}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                <span className="x_cat_btn_icon">{cat.icon}</span>
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </nav>

                {/* ── SUBCATEGORY STRIP ── */}
                {activeCategory !== "all" && getCurrentSubcategories().length > 0 && (
                    <nav className="x_subcat_strip">
                        <div className="x_subcat_inner">
                            <button
                                className={`x_subcat_btn${!activeSubcategory ? " x_subcat_btn--active" : ""}`}
                                onClick={() => setActiveSubcategory(null)}
                            >
                                All {activeCategory === "restaurant" ? "Kitchen" : activeCategory === "cafe" ? "Cafe" : "Bar"} Items
                            </button>
                            {getCurrentSubcategories().map((subcat) => (
                                <button
                                    key={subcat.id}
                                    className={`x_subcat_btn${activeSubcategory === subcat.id ? " x_subcat_btn--active" : ""}`}
                                    onClick={() => setActiveSubcategory(subcat.id)}
                                >
                                    <span className="x_subcat_btn_icon">{subcat.icon}</span>
                                    {subcat.label}
                                </button>
                            ))}
                        </div>
                    </nav>
                )}

                {/* ── MAIN CONTENT ── */}
                <main className="x_main">

                    {/* FEATURED SECTION */}
                    {/* {featured.length > 0 && (
                        <section className="x_section">
                            <div className="x_section_head">
                                <span className="x_section_kicker">Selected</span>
                                <h2 className="x_section_title">Chef&apos;s <em>Featured</em></h2>
                            </div>
                            <div className="x_featured_grid">
                                {featured.map((item) => (
                                    <FeaturedCard
                                        key={item.id}
                                        item={item}
                                        hovered={hoveredId === item.id}
                                        visible={visibleIds.has(item.id)}
                                        onHover={setHoveredId}
                                        onDetails={() => navigate(`/dish/${item.id}`)}
                                        ref={(el) => { cardRefs.current[item.id] = el; }}
                                    />
                                ))}
                            </div>
                        </section>
                    )} */}

                    {/* REGULAR GRID */}
                    {regular.length > 0 && (
                        <section className="x_section">
                            <div className="x_section_head">
                                <span className="x_section_kicker">Full Menu</span>
                                <h2 className="x_section_title">
                                    {activeCategory === "bar" ? "Drinks & Cocktails" :
                                        activeCategory === "restaurant" ? "Kitchen Selections" :
                                            activeCategory === "cafe" ? "Cafe Delights" :
                                                "All Items"}
                                </h2>
                                <span className="x_section_count">{regular.length} items</span>
                            </div>
                            <div className="x_menu_grid">
                                {regular.map((item) => (
                                    <MenuCard
                                        key={item.id}
                                        item={item}
                                        hovered={hoveredId === item.id}
                                        visible={visibleIds.has(item.id)}
                                        onHover={setHoveredId}
                                        onDetails={() => navigate(`/dish/${item.id}`)}
                                        ref={(el) => { cardRefs.current[item.id] = el; }}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {filtered.length === 0 && (
                        <div className="x_empty">
                            <span className="x_empty_icon">🍽</span>
                            <p>No items match your search.</p>
                            <button className="x_empty_reset" onClick={() => { setSearch(""); setActiveCategory("all"); }}>
                                Clear Filters
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}

/* ─────────── FEATURED CARD ─────────── */


const FeaturedCard = forwardRef(function FeaturedCard({ item, hovered, visible, onHover, onDetails }, ref) {
    const accent = item.category === "bar" ? "var(--d-bar)" : "var(--d-restaurant)";
    return (
        <article
            ref={ref}
            data-id={item.id}
            className={`x_feat_card${visible ? " x_visible" : ""}${hovered ? " x_hovered" : ""}`}
            style={{ "--accent": accent }}
            onMouseEnter={() => onHover(item.id)}
            onMouseLeave={() => onHover(null)}
        >
            <div className="x_feat_img_wrap">
                <img src={item.img} alt={item.name} className="x_feat_img" loading="lazy" />
                <div className="x_feat_img_overlay" />
                <span className="x_feat_tag">{item.tag}</span>
                <span className="x_feat_cat_badge">{item.category === "bar" ? <GiWineGlass /> : <GiKnifeFork />}</span>
            </div>
            <div className="x_feat_body">
                <div className="x_feat_badges">
                    {item.badges.map((b) => (
                        <span key={b} className="x_badge" style={{ color: BADGE_META[b]?.color, background: BADGE_META[b]?.bg }}>
                            {BADGE_META[b]?.label}
                        </span>
                    ))}
                </div>
                <h3 className="x_feat_name">{item.name}</h3>
                <p className="x_feat_desc">{item.desc}</p>
                <div className="x_feat_foot">
                    <div className="x_feat_meta">
                        <span><FiClock /> {item.time}</span>
                        <span><FaFire /> {item.cal}</span>
                    </div>
                    <span className="x_feat_price">{item.price}</span>
                </div>
                <button className="x_details_btn" onClick={onDetails}>
                    View Details <FiArrowRight />
                </button>
            </div>
        </article>
    );
});

/* ─────────── MENU CARD ─────────── */
const MenuCard = forwardRef(function MenuCard({ item, hovered, visible, onHover, onDetails }, ref) {
    const accent = item.category === "bar" ? "var(--d-bar)" : "var(--d-restaurant)";
    return (
        <article
            ref={ref}
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
                        {item.badges.map((b) => (
                            <span key={b} className="x_badge x_badge--sm" style={{ color: BADGE_META[b]?.color, background: BADGE_META[b]?.bg }}>
                                {BADGE_META[b]?.label}
                            </span>
                        ))}
                    </div>
                    <div className="x_mc_meta">
                        <span><FiClock /> {item.time}</span>
                    </div>
                </div>
                <button className="x_details_btn x_details_btn--sm" onClick={onDetails}>
                    View Details <FiArrowRight />
                </button>
            </div>
        </article>
    );
});
