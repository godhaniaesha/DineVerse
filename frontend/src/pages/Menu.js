import { useState, useEffect, useRef } from "react";
import { FiSearch, FiX, FiStar, FiClock, FiLeaf, FiArrowRight } from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import { GiWineGlass, GiCoffeeCup, GiKnifeFork, GiBeerStein } from "react-icons/gi";
import { TbSparkles, TbChefHat } from "react-icons/tb";
import { MdOutlineLocalBar } from "react-icons/md";
import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";

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

export const MENU_ITEMS = [
    /* ── RESTAURANT ── */
    {
        id: 1, category: "restaurant", subcategory: "appetizers", tag: "Chef's Special", featured: true,
        name: "Wagyu Burnt Ends", price: "₹2,890",
        desc: "48-hour braised A5 wagyu, smoked bone marrow butter, pickled shallots, micro herbs.",
        badges: ["signature", "spicy"],
        time: "35 min", cal: "620 kcal",
        img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
    },
    {
        id: 2, category: "restaurant", subcategory: "appetizers", tag: "Starter",
        name: "Burrata Royale", price: "₹890",
        desc: "Creamy burrata, heirloom tomatoes, 12-year aged balsamic, truffle oil, sourdough crisps.",
        badges: ["veg"],
        time: "10 min", cal: "310 kcal",
        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80",
    },
    {
        id: 3, category: "restaurant", subcategory: "mains", tag: "Main",
        name: "Pan-Seared Halibut", price: "₹1,990",
        desc: "Atlantic halibut, saffron beurre blanc, caviar, fennel confit, yuzu foam.",
        badges: [],
        time: "28 min", cal: "480 kcal",
        img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80",
    },
    {
        id: 4, category: "restaurant", subcategory: "desserts", tag: "Dessert",
        name: "Dark Chocolate Sphere", price: "₹690",
        desc: "Valrhona 70% dome, molten praline core, gold leaf, passion fruit coulis.",
        badges: ["veg", "sweet"],
        time: "15 min", cal: "540 kcal",
        img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80",
    },
    {
        id: 5, category: "restaurant", subcategory: "mains", tag: "Main",
        name: "Truffle Risotto", price: "₹1,490",
        desc: "Carnaroli rice, aged Parmigiano, black truffle shavings, Périgord truffle oil.",
        badges: ["veg", "signature"],
        time: "22 min", cal: "560 kcal",
        img: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80",
    },
    {
        id: 6, category: "restaurant", subcategory: "appetizers", tag: "Starter",
        name: "Smoked Duck Tataki", price: "₹1,190",
        desc: "Cherry-smoked duck breast, ponzu gel, pickled daikon, sesame tuile, wasabi aioli.",
        badges: ["spicy"],
        time: "18 min", cal: "390 kcal",
        img: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=600&q=80",
    },
    {
        id: 13, category: "restaurant", subcategory: "sides", tag: "Side",
        name: "Truffle Parmesan Fries", price: "₹490",
        desc: "Hand-cut fries with black truffle oil, aged Parmigiano, fresh parsley.",
        badges: [],
        time: "12 min", cal: "280 kcal",
        img: "https://i.pinimg.com/736x/fb/6e/d2/fb6ed247d66ca7e208e038802eeadcc9.jpg",
    },
    {
        id: 14, category: "restaurant", subcategory: "sides", tag: "Side",
        name: "Grilled Asparagus", price: "₹390",
        desc: "Seasonal asparagus, lemon butter, shaved Parmesan, toasted almonds.",
        badges: ["veg"],
        time: "8 min", cal: "120 kcal",
        img: "https://i.pinimg.com/1200x/b4/93/09/b493093259ad1a15c18c1a78a877ffe9.jpg",
    },
    {
        id: 15, category: "restaurant", subcategory: "drinks", tag: "Beverage",
        name: "Fresh Lemonade", price: "₹190",
        desc: "Fresh squeezed lemons, organic cane sugar, mint, sparkling water.",
        badges: ["veg", "alcohol-free"],
        time: "5 min", cal: "80 kcal",
        img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&q=80",
    },
    /* ── BAR ── */
    {
        id: 7, category: "bar", subcategory: "cocktails", tag: "Signature Cocktail", featured: true,
        name: "Midnight Empress", price: "₹890",
        desc: "Butterfly pea-infused gin, elderflower liqueur, yuzu, activated charcoal, egg white foam.",
        badges: ["bestseller"],
        time: "8 min", cal: "180 kcal",
        img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80",
    },
    {
        id: 8, category: "bar", subcategory: "cocktails", tag: "Classic",
        name: "Negroni Sbagliato", price: "₹750",
        desc: "Campari, Carpano Antica Formula, Prosecco, expressed orange peel, large ice cube.",
        badges: [],
        time: "5 min", cal: "155 kcal",
        img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80",
    },
    {
        id: 9, category: "bar", subcategory: "mocktails", tag: "Mocktail",
        name: "Saffron Sunrise", price: "₹490",
        desc: "Cold-pressed orange, saffron syrup, ginger beer, Himalayan pink salt, dehydrated citrus.",
        badges: ["veg", "alcohol-free"],
        time: "6 min", cal: "120 kcal",
        img: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&q=80",
    },
    {
        id: 10, category: "bar", subcategory: "spirits", tag: "Whisky",
        name: "Smoke & Honey", price: "₹1,290",
        desc: "Aberfeldy 16yr, smoked honey syrup, Angostura, Peychaud's bitters, smoked rosemary.",
        badges: ["signature"],
        time: "10 min", cal: "210 kcal",
        img: "https://i.pinimg.com/1200x/b3/3c/da/b33cda44290b058cf9c6c4d74a5d1e7c.jpg",
    },
    {
        id: 11, category: "bar", subcategory: "spirits", tag: "Shots",
        name: "Golden Dragon", price: "₹380",
        desc: "Gold tequila, Drambuie, fresh lime, chilli tincture, gold shimmer dust.",
        badges: ["spicy", "bestseller"],
        time: "3 min", cal: "90 kcal",
        img: "https://i.pinimg.com/1200x/ee/7d/74/ee7d74334ad94561ff2138c62a1d24d2.jpg",
    },
    {
        id: 12, category: "bar", subcategory: "wine", tag: "Wine",
        name: "Barolo Reserve 2019", price: "₹3,200",
        desc: "Single-vineyard Nebbiolo from Langhe, garnet ruby, dried roses, tar, leather, firm tannins.",
        badges: [],
        time: "2 min", cal: "125 kcal",
        img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80",
    },
    {
        id: 16, category: "bar", subcategory: "beer", tag: "Craft Beer",
        name: "Belgian Tripel", price: "₹590",
        desc: "Traditional Belgian tripel with notes of citrus, honey, and spice, 9% ABV.",
        badges: [],
        time: "3 min", cal: "220 kcal",
        img: "https://i.pinimg.com/736x/6a/29/84/6a2984e529e29a99e408e67bfdb682a8.jpg",
    },
    {
        id: 17, category: "bar", subcategory: "signature", tag: "House Special",
        name: "DineVerse Fusion", price: "₹1,490",
        desc: "House-infused gin with saffron, cardamom, and local botanicals, served with gold leaf.",
        badges: ["signature", "bestseller"],
        time: "12 min", cal: "160 kcal",
        img: "https://i.pinimg.com/736x/0c/6f/1b/0c6f1bd0c40b054eeb35f6ab86ad99a1.jpg",
    },
    /* ── CAFE ── */
    {
        id: 18, category: "cafe", subcategory: "toasts", tag: "Breakfast",
        name: "Avocado Toast Deluxe", price: "₹390",
        desc: "Sourdough toast, smashed avocado, poached eggs, feta, cherry tomatoes, micro herbs.",
        badges: ["veg", "bestseller"],
        time: "12 min", cal: "340 kcal",
        img: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=600&q=80",
    },
    {
        id: 19, category: "cafe", subcategory: "toasts", tag: "Classic",
        name: "French Toast", price: "₹290",
        desc: "Brioche, vanilla custard, fresh berries, maple syrup, dusted with powdered sugar.",
        badges: ["veg", "sweet"],
        time: "10 min", cal: "380 kcal",
        img: "https://i.pinimg.com/1200x/d5/ad/6e/d5ad6ef2f943811f9d9e361b899173f1.jpg",
    },
    {
        id: 20, category: "cafe", subcategory: "light-meals", tag: "Lunch",
        name: "Mediterranean Wrap", price: "₹450",
        desc: "Grilled chicken, hummus, roasted vegetables, feta, olives, tzatziki, whole wheat wrap.",
        badges: [],
        time: "15 min", cal: "420 kcal",
        img: "https://i.pinimg.com/1200x/01/5d/15/015d15bb9770336ddc570880761c5f54.jpg",
    },
    {
        id: 21, category: "cafe", subcategory: "light-meals", tag: "Healthy",
        name: "Quinoa Buddha Bowl", price: "₹490",
        desc: "Organic quinoa, roasted chickpeas, kale, beets, sweet potato, tahini dressing.",
        badges: ["veg", "bestseller"],
        time: "18 min", cal: "380 kcal",
        img: "https://i.pinimg.com/736x/94/13/81/941381d08aad02420646d84f881e0e1e.jpg",
    },
    {
        id: 22, category: "cafe", subcategory: "salads", tag: "Fresh",
        name: "Caesar Salad", price: "₹350",
        desc: "Romaine lettuce, parmesan shavings, croutons, classic Caesar dressing, grilled chicken.",
        badges: [],
        time: "8 min", cal: "290 kcal",
        img: "https://i.pinimg.com/1200x/8b/76/b8/8b76b89916cb1835988868779e3bcac2.jpg",
    },
    {
        id: 23, category: "cafe", subcategory: "salads", tag: "Vegan",
        name: "Superfood Salad", price: "₹320",
        desc: "Mixed greens, spinach, kale, nuts, seeds, berries, citrus vinaigrette.",
        badges: ["veg", "alcohol-free"],
        time: "6 min", cal: "180 kcal",
        img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    },
    {
        id: 24, category: "cafe", subcategory: "snacks", tag: "Quick Bite",
        name: "Artisan Cheese Board", price: "₹550",
        desc: "Selection of local cheeses, crackers, grapes, nuts, honey comb.",
        badges: ["veg"],
        time: "5 min", cal: "420 kcal",
        img: "https://i.pinimg.com/control1/1200x/bb/b3/29/bbb329d22dd85ab17bd8fa43731b5530.jpg",
    },
    {
        id: 25, category: "cafe", subcategory: "snacks", tag: "Sweet",
        name: "Croissant Assortment", price: "₹280",
        desc: "Butter, almond, chocolate croissants served with jam and butter.",
        badges: ["veg", "sweet"],
        time: "3 min", cal: "320 kcal",
        img: "https://i.pinimg.com/1200x/8e/ef/09/8eef094d7b0f0caaad992cea0945182c.jpg",
    },
    {
        id: 26, category: "cafe", subcategory: "tonics", tag: "Wellness",
        name: "Green Detox Juice", price: "₹220",
        desc: "Spinach, kale, cucumber, green apple, ginger, lemon, wheatgrass.",
        badges: ["veg", "alcohol-free"],
        time: "5 min", cal: "120 kcal",
        img: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&q=80",
    },
    {
        id: 27, category: "cafe", subcategory: "tonics", tag: "Energy",
        name: "Matcha Latte", price: "₹320",
        desc: "Premium Japanese matcha, oat milk, honey, served hot or iced.",
        badges: ["veg", "alcohol-free"],
        time: "8 min", cal: "140 kcal",
        img: "https://i.pinimg.com/736x/32/d5/a3/32d5a352cd3d092c37b0f79d144bae16.jpg",
    },
    {
        id: 28, category: "cafe", subcategory: "light-meals", tag: "Lunch",
        name: "Margherita Pizza", price: "₹550",
        desc: "Classic Neapolitan pizza with fresh mozzarella, basil, and tomato sauce on a thin crust.",
        badges: ["veg"],
        time: "20 min", cal: "650 kcal",
        img: "https://i.pinimg.com/736x/e4/81/00/e48100d4cecd9121ea762fb546a5d815.jpg",
    },
    {
        id: 29, category: "cafe", subcategory: "light-meals", tag: "Lunch",
        name: "Penne Alfredo Pasta", price: "₹480",
        desc: "Penne pasta in creamy Alfredo sauce, topped with parmesan and fresh herbs.",
        badges: ["veg", "signature"],
        time: "18 min", cal: "580 kcal",
        img: "https://i.pinimg.com/1200x/89/5e/11/895e1147dcfc9f025c7cacbb2f3e4e65.jpg",
    }
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
                        setVisibleIds((prev) => new Set([...prev, Number(e.target.dataset.id)]));
                    }
                });
            },
            { threshold: 0.12 }
        );
        Object.values(cardRefs.current).forEach((el) => el && obs.observe(el));
        return () => obs.disconnect();
    }, [activeCategory, activeSubcategory, search]);

    const filtered = MENU_ITEMS.filter((item) => {
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
                    {featured.length > 0 && (
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
                    )}

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
