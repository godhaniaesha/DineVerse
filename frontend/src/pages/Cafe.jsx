import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaCoffee, FaLeaf, FaClock } from "react-icons/fa";
import { GiCoffeeBeans, GiCroissant } from "react-icons/gi";

const COFFEE_ITEMS = [
    {
        id: 1,
        name: "Artisanal Espresso",
        desc: "Rich and intense, pulled to perfection with our signature blend.",
        price: "$4",
        img: "https://i.pinimg.com/736x/34/02/5e/34025e3640cdc17421f2d30cf0d78656.jpg"
    },
    {
        id: 2,
        name: "Velvet Latte",
        desc: "Smooth and creamy with a delicate foam art and a hint of vanilla.",
        price: "$5",
        img: "https://i.pinimg.com/736x/04/ee/42/04ee4271e8e3b6c8a653eee2f49cca8c.jpg"
    },
    {
        id: 3,
        name: "Spiced Chai",
        desc: "Aromatic and warming, with a blend of exotic spices and honey.",
        price: "$5",
        img: "https://i.pinimg.com/736x/43/6d/a4/436da44985d61c713fbc4e2676e18a68.jpg"
    }
];

const TESTIMONIALS = [
    {
        id: 1,
        title: "A Coffee Lover's Dream",
        content: "The best coffee I've had in the city. The ambiance is perfect for a morning read or a chat with friends.",
        author: "BY JANE DOE / COFFEE ENTHUSIAST"
    },
    {
        id: 2,
        title: "Pastries to Die For",
        content: "The croissants are flaky and buttery, just like in Paris. I can't get enough!",
        author: "BY JOHN SMITH / FOOD BLOGGER"
    }
];

export default function Cafe() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    };

    return (
        <div className="z_bar_page z_cafe_theme">
            {/* Hero Section */}
            <section className="z_bar_hero" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=80')` }}>
                <div className="z_bar_hero_overlay"></div>
                <div className="z_bar_hero_content">
                    <div className="z_bar_hero_badge">
                        <div className="z_bar_badge_line"></div>
                        <span className="z_bar_tag">Artisanal & Cozy</span>
                        <div className="z_bar_badge_line"></div>
                    </div>
                    <h1 className="z_bar_title">The Soul of <br /><em>Premium Coffee</em></h1>
                    <p className="z_bar_desc">
                        Discover a world of rich aromas and delightful pastries. 
                        A perfect start to your morning, or a relaxing sweet escape.
                    </p>
                    <div className="z_bar_hero_btns">
                        <Link to="/bookTable" className="z_bar_btn_primary" style={{ background: 'var(--d-cafe)', borderColor: 'var(--d-cafe)' }}>Book a Table</Link>
                        <Link to="/menu" className="z_bar_btn_outline">View Menu</Link>
                    </div>
                </div>
            </section>

            {/* Coffee Experience - Masonry Layout */}
            <section className="z_bar_section" style={{ background: 'var(--d-bg)' }}>
                <div className="container">
                    <div className="z_bar_section_header">
                        <span className="z_bar_subtitle" style={{ color: 'var(--d-cafe)' }}>Morning Ritual</span>
                        <h2 className="z_bar_section_title">Our <em>Artisanal</em> Brews</h2>
                    </div>
                    <div className="z_cafe_masonry">
                        {COFFEE_ITEMS.map((drink) => (
                            <div key={drink.id} className="z_cafe_masonry_item">
                                <img src={drink.img} alt={drink.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{drink.name}</h3>
                                        <span style={{ color: 'var(--d-cafe)', fontWeight: '700' }}>{drink.price}</span>
                                    </div>
                                    <p style={{ color: 'var(--d-text-3)', fontSize: '0.9rem', margin: 0 }}>{drink.desc}</p>
                                </div>
                            </div>
                        ))}
                        {/* Extra item for masonry look */}
                        <div className="z_cafe_masonry_item" style={{ background: 'var(--d-cafe)', color: '#000', padding: '2rem' }}>
                            <h3 style={{ fontFamily: 'var(--d-font-serif)', fontSize: '2rem' }}>Freshly Roasted</h3>
                            <p style={{ margin: '1rem 0' }}>We roast our beans in small batches every single morning to ensure the peak of flavor.</p>
                            <Link to="/menu" style={{ color: '#000', fontWeight: '700', textDecoration: 'underline' }}>See Roasting Schedule</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Coffee Video Section */}
            <section style={{ padding: '40px 0', background: 'var(--d-bg)' }}>
                <div className="container">
                    <div className="row g-0 align-items-center">
                        <div className="col-lg-7">
                            <div style={{ borderRadius: 'var(--d-r-xl)', overflow: 'hidden', height: '400px', boxShadow: 'var(--d-shadow-lg)', border: '1px solid var(--d-border)' }}>
                                <video
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    src="/video/202910-919288798.mp4"
                                ></video>
                            </div>
                        </div>
                        <div className="col-lg-5" style={{ marginLeft: '-60px', zIndex: 10 }}>
                            <div className="z_floating_card" style={{ padding: '2.5rem' }}>
                                <span className="z_bar_subtitle" style={{ color: 'var(--d-cafe)' }}>The Pour</span>
                                <h2 className="z_bar_section_title" style={{ textAlign: 'left', fontSize: '2.2rem', marginTop: '0.5rem' }}>The <em>Perfect</em> Extraction</h2>
                                <p style={{ color: 'var(--d-text-2)', fontSize: '0.95rem', lineHeight: '1.6', marginTop: '1rem', marginBottom: 0 }}>
                                    Our baristas are trained in the art of precision. From water temperature to grind size, every detail matters in crafting your perfect cup.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brewing Methods - Unique Icons Grid */}
            <section className="z_cafe_methods_section" style={{ padding: '80px 0', background: 'var(--d-bg)' }}>
                <div className="container">
                    <div className="row g-4">
                        <div className="col-lg-4">
                            <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem', border: '1px solid var(--d-border)', borderRadius: 'var(--d-r-lg)', transition: 'all 0.3s ease', background: 'var(--d-surface-2)' }} className="z_method_hover">
                                <GiCoffeeBeans style={{ color: 'var(--d-cafe)', fontSize: '3rem', marginBottom: '1rem' }} />
                                <h3 style={{ fontFamily: 'var(--d-font-serif)', fontSize: '1.6rem' }}>Ethically Sourced</h3>
                                <p style={{ color: 'var(--d-text-2)', fontSize: '0.9rem', marginBottom: 0 }}>Direct trade partnerships with sustainable farms across the globe.</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem', border: '1px solid var(--d-border)', borderRadius: 'var(--d-r-lg)', transition: 'all 0.3s ease', background: 'var(--d-surface-2)' }} className="z_method_hover">
                                <FaCoffee style={{ color: 'var(--d-cafe)', fontSize: '3rem', marginBottom: '1rem' }} />
                                <h3 style={{ fontFamily: 'var(--d-font-serif)', fontSize: '1.6rem' }}>Expert Roasting</h3>
                                <p style={{ color: 'var(--d-text-2)', fontSize: '0.9rem', marginBottom: 0 }}>Small-batch roasting to bring out the unique profile of every bean.</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem', border: '1px solid var(--d-border)', borderRadius: 'var(--d-r-lg)', transition: 'all 0.3s ease', background: 'var(--d-surface-2)' }} className="z_method_hover">
                                <FaLeaf style={{ color: 'var(--d-cafe)', fontSize: '3rem', marginBottom: '1rem' }} />
                                <h3 style={{ fontFamily: 'var(--d-font-serif)', fontSize: '1.6rem' }}>Pure Ingredients</h3>
                                <p style={{ color: 'var(--d-text-2)', fontSize: '0.9rem', marginBottom: 0 }}>Only the freshest organic milk and house-made natural syrups.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials - Cafe Style */}
            <section style={{ padding: '80px 0', background: 'var(--d-surface-2)' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-8" style={{ textAlign: 'center' }}>
                            <div style={{ width: '50px', height: '50px', background: 'var(--d-cafe)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                <FaClock style={{ color: '#000', fontSize: '1.2rem' }} />
                            </div>
                            <h2 style={{ fontFamily: 'var(--d-font-serif)', fontSize: '2.2rem', marginBottom: '1.5rem' }}>{TESTIMONIALS[currentTestimonial].title}</h2>
                            <p style={{ fontSize: '1.1rem', lineHeight: '1.7', color: 'var(--d-text-2)' }}>{TESTIMONIALS[currentTestimonial].content}</p>
                            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                                <div style={{ height: '1px', width: '25px', background: 'var(--d-cafe)' }}></div>
                                <span style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem' }}>{TESTIMONIALS[currentTestimonial].author}</span>
                                <div style={{ height: '1px', width: '25px', background: 'var(--d-cafe)' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
