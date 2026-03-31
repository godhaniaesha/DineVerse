import { useState, useEffect, useRef } from "react";
import { FiSearch, FiX, FiStar, FiClock, FiLeaf } from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import { GiWineGlass, GiCoffeeCup, GiKnifeFork, GiBeerStein } from "react-icons/gi";
import { TbSparkles, TbChefHat } from "react-icons/tb";
import { MdOutlineLocalBar } from "react-icons/md";
import { forwardRef } from "react";

/* ─────────── DATA ─────────── */
const CATEGORIES = [
    { id: "all", label: "All", icon: <TbSparkles /> },
    { id: "restaurant", label: "Restaurant", icon: <GiKnifeFork />, accent: "var(--d-restaurant)" },
    { id: "bar", label: "Bar", icon: <MdOutlineLocalBar />, accent: "var(--d-bar)" },
    { id: "cafe", label: "Cafe", icon: <GiCoffeeCup />, accent: "var(--d-cafe)" },
];

const RESTAURANT_SUBCATEGORIES = [
    { id: "appetizers", label: "Appetizers", icon: <GiKnifeFork /> },
    { id: "mains", label: "Mains", icon: <GiKnifeFork /> },
    { id: "sides", label: "Sides", icon: <GiKnifeFork /> },
    { id: "desserts", label: "Desserts", icon: <GiKnifeFork /> },
    { id: "drinks", label: "Drinks", icon: <GiWineGlass /> },
];

const BAR_SUBCATEGORIES = [
    { id: "cocktails", label: "Cocktails", icon: <MdOutlineLocalBar /> },
    { id: "spirits", label: "Spirits", icon: <GiBeerStein /> },
    { id: "wine", label: "Wine", icon: <GiWineGlass /> },
    { id: "beer", label: "Beer", icon: <GiBeerStein /> },
    { id: "mocktails", label: "Mocktails", icon: <GiCoffeeCup /> },
    { id: "signature", label: "Signature", icon: <TbSparkles /> },
];

const CAFE_SUBCATEGORIES = [
    { id: "toasts", label: "Toasts", icon: <GiCoffeeCup /> },
    { id: "light-meals", label: "Light Meals", icon: <GiCoffeeCup /> },
    { id: "salads", label: "Salads", icon: <GiCoffeeCup /> },
    { id: "snacks", label: "Snacks", icon: <GiCoffeeCup /> },
    { id: "tonics", label: "Tonics", icon: <GiCoffeeCup /> },
];

const MENU_ITEMS = [
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
        name: "Aurum Fusion", price: "₹1,490",
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

const BADGE_META = {
    signature: { label: "Signature", color: "var(--d-gold)", bg: "var(--d-gold-subtle)" },
    spicy: { label: "🌶 Spicy", color: "#e87070", bg: "rgba(232,112,112,0.10)" },
    veg: { label: "🌿 Veg", color: "var(--d-cafe)", bg: "var(--d-cafe-dim)" },
    sweet: { label: "🍫 Sweet", color: "#d48fb5", bg: "var(--d-room-dim)" },
    bestseller: { label: "⭐ Best", color: "#e8c878", bg: "rgba(232,200,120,0.10)" },
    "alcohol-free": { label: "🧃 AF", color: "var(--d-cafe)", bg: "var(--d-cafe-dim)" },
};

/* ─────────── COMPONENT ─────────── */
export default function Menu() {
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
                            <em>Aurum</em> Menu
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

                {/* ── FOOTER ── */}
                <footer className="x_footer">
                    <div className="x_footer_line" />
                    <p className="x_footer_text">
                        <GiWineGlass /> Aurum · Restaurant &amp; Bar &nbsp;|&nbsp; All prices inclusive of taxes
                    </p>
                </footer>

                {/* ── STYLES ── */}
                <style>{styles}</style>
            </div>
        </>
    );
}

/* ─────────── FEATURED CARD ─────────── */


const FeaturedCard = forwardRef(function FeaturedCard({ item, hovered, visible, onHover }, ref) {
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
            </div>
        </article>
    );
});

/* ─────────── MENU CARD ─────────── */
const MenuCard = forwardRef(function MenuCard({ item, hovered, visible, onHover }, ref) {
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
            </div>
        </article>
    );
});

/* ─────────── STYLES ─────────── */
const styles = `
:root {
  --d-bg:             #080705;
  --d-surface:        #100e0b;
  --d-surface-2:      #181510;
  --d-surface-3:      #201c16;
  --d-surface-glass:  rgba(16, 14, 11, 0.82);
  --d-border:         rgba(200, 160, 90, 0.10);
  --d-border-hover:   rgba(200, 160, 90, 0.28);
  --d-border-strong:  rgba(200, 160, 90, 0.50);
  --d-gold:           #c8965a;
  --d-gold-light:     #e8b878;
  --d-gold-pale:      #f2d4a8;
  --d-gold-dark:      #9a6e3a;
  --d-gold-glow:      rgba(200, 150, 90, 0.22);
  --d-gold-subtle:    rgba(200, 150, 90, 0.08);
  --d-text-1:         #f5f0e8;
  --d-text-2:         #b8b0a0;
  --d-text-3:         #7a7060;
  --d-text-4:         #4a4438;
  --d-cafe:           #7ab898;
  --d-cafe-dim:       rgba(122, 184, 152, 0.10);
  --d-restaurant:     #c8965a;
  --d-restaurant-dim: rgba(200, 150, 90, 0.10);
  --d-bar:            #9b8fd4;
  --d-bar-dim:        rgba(155, 143, 212, 0.10);
  --d-room:           #d48fb5;
  --d-room-dim:       rgba(212, 143, 181, 0.10);
  --d-shadow-sm:   0 2px 12px rgba(0,0,0,0.40);
  --d-shadow-md:   0 8px 32px  rgba(0,0,0,0.55);
  --d-shadow-lg:   0 20px 60px rgba(0,0,0,0.70);
  --d-glow-gold:   0 0 40px rgba(200,150,90,0.12);
  --d-r-xs:   4px;
  --d-r-sm:   8px;
  --d-r-md:   14px;
  --d-r-lg:   22px;
  --d-r-xl:   32px;
  --d-r-pill: 999px;
  --d-font-serif: 'Cormorant Garamond', 'Georgia', serif;
  --d-font-sans:  'DM Sans', system-ui, sans-serif;
  --d-ease:   cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --d-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --d-dur:    0.30s;
  --d-header-h: 80px;
  --d-strip-h:  38px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

/* ── WRAPPER ── */
.x_wrapper {
  font-family: var(--d-font-sans);
  background: var(--d-bg);
  color: var(--d-text-1);
  min-height: 100vh;
  overflow-x: hidden;
}

/* ── HEADER ── */
.x_header {
  position: relative;
  text-align: center;
  padding: 90px 24px 64px;
  overflow: hidden;
  background: var(--d-surface);
  border-bottom: 1px solid var(--d-border);
}
.x_header_noise {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  opacity: 0.6; pointer-events: none;
}
.x_header_glow {
  position: absolute;
  top: -60px; left: 50%; transform: translateX(-50%);
  width: 600px; height: 300px;
  background: radial-gradient(ellipse, var(--d-gold-glow) 0%, transparent 70%);
  pointer-events: none;
}
.x_header_inner { position: relative; z-index: 1; max-width: 700px; margin: 0 auto; }

.x_eyebrow {
  display: flex; align-items: center; justify-content: center;
  gap: 10px; margin-bottom: 20px;
  font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--d-gold); font-weight: 500;
}
.x_eyebrow_line { flex: 0 0 40px; height: 1px; background: var(--d-border-strong); }
.x_eyebrow_icon { font-size: 14px; }

.x_title {
  font-family: var(--d-font-serif);
  font-size: clamp(48px, 8vw, 84px);
  font-weight: 300; line-height: 1;
  color: var(--d-text-1);
  letter-spacing: -0.01em;
  margin-bottom: 14px;
}
.x_title em {
  font-style: italic; color: var(--d-gold-light);
}
.x_subtitle {
  font-size: 14px; color: var(--d-text-3);
  letter-spacing: 0.08em; margin-bottom: 40px;
}

/* ── SEARCH ── */
.x_search_wrap {
  position: relative; max-width: 480px; margin: 0 auto;
}
.x_search_icon {
  position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
  color: var(--d-text-3); font-size: 16px; pointer-events: none;
}
.x_search_clear {
  position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: var(--d-text-3);
  cursor: pointer; font-size: 15px; display: flex; align-items: center;
  transition: color var(--d-dur);
}
.x_search_clear:hover { color: var(--d-text-1); }

/* ── CATEGORY STRIP ── */
.x_cat_strip {
  position: sticky; top: 0; z-index: 100;
  background: var(--d-surface-glass);
  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  border-bottom: 1px solid var(--d-border);
}
.x_cat_inner {
  display: flex; align-items: center; gap: 4px;
  max-width: 1200px; margin: 0 auto;
  padding: 10px 24px; overflow-x: auto;
  scrollbar-width: none;
}
.x_cat_inner::-webkit-scrollbar { display: none; }
.x_cat_btn {
  display: flex; align-items: center; gap: 7px;
  padding: 8px 20px; border-radius: var(--d-r-pill);
  border: 1px solid transparent;
  background: none; color: var(--d-text-3);
  font-family: var(--d-font-sans); font-size: 13px; font-weight: 400;
  cursor: pointer; white-space: nowrap;
  transition: all var(--d-dur) var(--d-ease);
}
.x_cat_btn:hover { color: var(--d-text-1); border-color: var(--d-border); }
.x_cat_btn--active {
  background: var(--d-surface-3);
  border-color: var(--d-border-strong);
  color: var(--cat-accent, var(--d-gold));
  font-weight: 500;
}
.x_cat_btn_icon { font-size: 15px; }

/* ── SUBCATEGORY STRIP ── */
.x_subcat_strip {
  position: sticky; top: 48px; z-index: 90;
  background: var(--d-surface);
  border-bottom: 1px solid var(--d-border);
  backdrop-filter: blur(12px) saturate(1.2);
  -webkit-backdrop-filter: blur(12px) saturate(1.2);
}
.x_subcat_inner {
  display: flex; align-items: center; gap: 6px;
  max-width: 1200px; margin: 0 auto;
  padding: 8px 24px; overflow-x: auto;
  scrollbar-width: none;
}
.x_subcat_inner::-webkit-scrollbar { display: none; }
.x_subcat_btn {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 16px; border-radius: var(--d-r-pill);
  border: 1px solid var(--d-border);
  background: var(--d-surface-2);
  color: var(--d-text-3);
  font-family: var(--d-font-sans); font-size: 12px; font-weight: 400;
  cursor: pointer; white-space: nowrap;
  transition: all var(--d-dur) var(--d-ease);
}
.x_subcat_btn:hover { 
  color: var(--d-text-1); 
  border-color: var(--d-border-hover);
  background: var(--d-surface-3);
}
.x_subcat_btn--active {
  background: var(--cat-accent, var(--d-gold));
  border-color: var(--cat-accent, var(--d-gold));
  color: #fff;
  font-weight: 500;
}
.x_subcat_btn_icon { font-size: 13px; }

/* ── MAIN ── */
.x_main {
  max-width: 1200px; margin: 0 auto;
  padding: 56px 24px 80px;
  display: flex; flex-direction: column; gap: 72px;
}

/* ── SECTION HEADER ── */
.x_section_head {
  display: flex; align-items: baseline; gap: 16px;
  margin-bottom: 36px; flex-wrap: wrap;
}
.x_section_kicker {
  font-size: 10px; letter-spacing: 0.20em; text-transform: uppercase;
  color: var(--d-gold); font-weight: 500;
  padding: 4px 10px; border: 1px solid var(--d-border-strong);
  border-radius: var(--d-r-pill);
}
.x_section_title {
  font-family: var(--d-font-serif);
  font-size: clamp(26px, 4vw, 38px); font-weight: 300;
  color: var(--d-text-1); flex: 1;
}
.x_section_count {
  font-size: 12px; color: var(--d-text-4);
  border: 1px solid var(--d-border);
  border-radius: var(--d-r-pill); padding: 2px 10px;
}

/* ── FEATURED GRID ── */
.x_featured_grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

/* ── FEATURED CARD ── */
.x_feat_card {
  display: flex; flex-direction: column;
  background: var(--d-surface-2);
  border: 1px solid var(--d-border);
  border-radius: var(--d-r-lg);
  overflow: hidden;
  transition: transform var(--d-dur) var(--d-spring), box-shadow var(--d-dur) var(--d-ease), border-color var(--d-dur) var(--d-ease);
  opacity: 0; transform: translateY(28px);
}
.x_feat_card.x_visible { animation: x_fadeUp 0.55s var(--d-ease) forwards; }
.x_feat_card.x_hovered {
  transform: translateY(-4px);
  border-color: var(--d-border-hover);
  box-shadow: var(--d-shadow-lg), 0 0 0 1px var(--accent), var(--d-glow-gold);
}
.x_feat_img_wrap {
  position: relative; aspect-ratio: 16/9; overflow: hidden;
}
.x_feat_img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.55s var(--d-ease);
}
.x_feat_card.x_hovered .x_feat_img { transform: scale(1.06); }
.x_feat_img_overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, var(--d-surface-2) 0%, transparent 60%);
}
.x_feat_tag {
  position: absolute; top: 14px; left: 14px;
  font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--d-gold); background: var(--d-surface-glass);
  backdrop-filter: blur(10px); padding: 4px 12px;
  border-radius: var(--d-r-pill); border: 1px solid var(--d-border-strong);
}
.x_feat_cat_badge {
  position: absolute; top: 14px; right: 14px;
  background: var(--accent); color: #fff;
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px;
}
.x_feat_body { padding: 22px 24px 26px; flex: 1; display: flex; flex-direction: column; gap: 10px; }
.x_feat_badges { display: flex; gap: 6px; flex-wrap: wrap; }
.x_feat_name {
  font-family: var(--d-font-serif);
  font-size: 26px; font-weight: 400;
  color: var(--d-text-1); line-height: 1.2;
}
.x_feat_desc { font-size: 13px; color: var(--d-text-3); line-height: 1.65; flex: 1; }
.x_feat_foot {
  display: flex; align-items: center; justify-content: space-between;
  margin-top: 6px; padding-top: 14px;
  border-top: 1px solid var(--d-border);
}
.x_feat_meta { display: flex; gap: 14px; font-size: 12px; color: var(--d-text-4); align-items: center; }
.x_feat_meta span { display: flex; align-items: center; gap: 5px; }
.x_feat_price {
  font-family: var(--d-font-serif);
  font-size: 22px; font-weight: 600;
  color: var(--accent);
}

/* ── MENU GRID ── */
.x_menu_grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* ── MENU CARD ── */
.x_menu_card {
  display: flex; flex-direction: column;
  background: var(--d-surface-2);
  border: 1px solid var(--d-border);
  border-radius: var(--d-r-md);
  overflow: hidden;
  cursor: pointer;
  opacity: 0; transform: translateY(20px);
  transition: transform var(--d-dur) var(--d-spring), border-color var(--d-dur) var(--d-ease), box-shadow var(--d-dur) var(--d-ease);
}
.x_menu_card.x_visible { animation: x_fadeUp 0.50s var(--d-ease) forwards; }
.x_menu_card.x_hovered {
  transform: translateY(-3px);
  border-color: var(--d-border-hover);
  box-shadow: var(--d-shadow-md), 0 0 24px var(--d-gold-glow);
}
.x_mc_img_wrap { position: relative; aspect-ratio: 4/3; overflow: hidden; }
.x_mc_img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform 0.50s var(--d-ease);
}
.x_menu_card.x_hovered .x_mc_img { transform: scale(1.07); }
.x_mc_tag {
  position: absolute; bottom: 10px; left: 10px;
  font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--d-gold-pale); background: var(--d-surface-glass);
  backdrop-filter: blur(8px); padding: 3px 10px;
  border-radius: var(--d-r-pill); border: 1px solid var(--d-border);
}
.x_mc_body { padding: 16px 18px 18px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
.x_mc_top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
.x_mc_name {
  font-family: var(--d-font-serif);
  font-size: 20px; font-weight: 400;
  color: var(--d-text-1); line-height: 1.25; flex: 1;
}
.x_mc_price {
  font-family: var(--d-font-serif);
  font-size: 17px; font-weight: 600;
  color: var(--accent); white-space: nowrap; flex-shrink: 0;
}
.x_mc_desc { font-size: 14px; color: var(--d-text-3); line-height: 1.6; flex: 1; }
.x_mc_foot {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 10px; border-top: 1px solid var(--d-border);
  margin-top: auto;
}
.x_mc_badges { display: flex; gap: 5px; flex-wrap: wrap; }
.x_mc_meta { font-size: 11px; color: var(--d-text-4); display: flex; align-items: center; gap: 5px; }

/* ── BADGE ── */
.x_badge {
  font-size: 11px; padding: 3px 9px;
  border-radius: var(--d-r-pill);
  font-weight: 500; white-space: nowrap;
}
.x_badge--sm { font-size: 10px; padding: 2px 7px; }

/* ── EMPTY STATE ── */
.x_empty {
  text-align: center; padding: 80px 24px;
  display: flex; flex-direction: column; align-items: center; gap: 16px;
}
.x_empty_icon { font-size: 48px; opacity: 0.4; }
.x_empty p { color: var(--d-text-3); font-size: 15px; }
.x_empty_reset {
  padding: 10px 24px; border-radius: var(--d-r-pill);
  border: 1px solid var(--d-border-strong);
  background: none; color: var(--d-gold);
  font-family: var(--d-font-sans); font-size: 13px;
  cursor: pointer; transition: all var(--d-dur) var(--d-ease);
}
.x_empty_reset:hover { background: var(--d-gold-subtle); border-color: var(--d-gold); }

/* ── FOOTER ── */
.x_footer { text-align: center; padding: 32px 24px 48px; }
.x_footer_line { height: 1px; background: var(--d-border); max-width: 300px; margin: 0 auto 20px; }
.x_footer_text {
  font-size: 12px; color: var(--d-text-4);
  letter-spacing: 0.06em; display: flex;
  align-items: center; justify-content: center; gap: 8px;
}

/* ── ANIMATION ── */
@keyframes x_fadeUp {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .x_header { padding: 64px 20px 48px; }
  .x_featured_grid { grid-template-columns: 1fr; }
  .x_menu_grid { grid-template-columns: 1fr 1fr; }
  .x_main { padding: 40px 16px 60px; gap: 56px; }
}
@media (max-width: 520px) {
  .x_menu_grid { grid-template-columns: 1fr; }
  .x_feat_name { font-size: 22px; }
}
`;