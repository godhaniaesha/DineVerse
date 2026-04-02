import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdWineBar, MdNightlife, MdLocalBar, MdEvent } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const COCKTAILS = [
    {
        id: 1,
        name: "Smoked Old Fashioned",
        desc: "A timeless classic with a smoky twist of hickory and oak.",
        price: "$18",
        img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80"
    },
    {
        id: 2,
        name: "Purple Rain",
        desc: "Gin-based with elderflower, lavender syrup, and a touch of magic.",
        price: "$16",
        img: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800&q=80"
    },
    {
        id: 3,
        name: "Spiced Margarita",
        desc: "Tequila Blanco with jalapeño, lime juice, and a tajin rim.",
        price: "$15",
        img: "https://images.unsplash.com/photo-1556855810-ac404aa91f85?w=800&q=80"
    }
];

const TESTIMONIALS = [
    {
        id: 1,
        title: "They say about us",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        author: "BY DORA JOHNS / SOMALIER"
    },
    {
        id: 2,
        title: "They say about us",
        content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
        author: "BY JAMES SMITH / MIXOLOGIST"
    },
    {
        id: 3,
        title: "They say about us",
        content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.",
        author: "BY MARIA GARCIA / WINE EXPERT"
    }
];

export default function Bar() {
    const [isExpanded, setIsExpanded] = useState(false);
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
        <div className="z_bar_page">
            {/* Hero Section */}
            <section className="z_bar_hero">
                <div className="z_bar_hero_overlay"></div>
                <div className="z_bar_hero_content">
                    <span className="z_bar_tag">Elevated Mixology</span>
                    <h1 className="z_bar_title">The Art of <em>Liquid Alchemy</em></h1>
                    <p className="z_bar_desc">
                        Where every pour tells a story and every glass holds a masterpiece.
                        Experience the finest spirits and craft cocktails in a setting designed for the soul.
                    </p>
                    <div className="z_bar_hero_btns">
                        <button className="z_bar_btn_primary">Reserve a Table</button>
                        <button className="z_bar_btn_outline">View Full Menu</button>
                    </div>
                </div>
                <div className="z_bar_hero_scroll">
                    <div className="z_bar_scroll_line"></div>
                </div>
            </section>

            {/* Signature Cocktails Section */}
            <section className="z_bar_section z_bar_cocktails">
                <div className="container">
                    <div className="z_bar_section_header">
                        <span className="z_bar_subtitle">Signature Menu</span>
                        <h2 className="z_bar_section_title">Our Crafted <em>Mixology</em></h2>
                    </div>
                    <div className="row g-4">
                        {COCKTAILS.map((drink) => (
                            <div key={drink.id} className="col-lg-4 col-md-6">
                                <div className="z_bar_card">
                                    <div className="z_bar_card_img">
                                        <img src={drink.img} alt={drink.name} />
                                        <div className="z_bar_card_overlay">
                                            <span className="z_bar_card_price">{drink.price}</span>
                                        </div>
                                    </div>
                                    <div className="z_bar_card_info">
                                        <h3>{drink.name}</h3>
                                        <p>{drink.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* A La Carte Menu Section */}
            <section className="z_bar_menu_section">
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-7">
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
                                <div className="z_bar_overlap_img z_slide_shape_arch">
                                    <img src="https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800&q=80" alt="Signature Cocktail" />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="z_bar_menu_content">
                                <h2 className="z_bar_menu_title">A LA CARTE MENU</h2>
                                <p className="z_bar_item_desc">
                                    {isExpanded
                                        ? "Venture beyond the ordinary with our A La Carte selections, a curated library of liquid artistry. Here, our master mixologists deconstruct classic recipes and forge new ones, using house-made infusions, rare bitters, and artisanal spirits. Each drink is a conversation piece, an exploration of flavor and aroma designed to surprise and delight the senses. Discover your new favorite."
                                        : "Venture beyond the ordinary with our A La Carte selections, a curated library of liquid artistry. Here, our master mixologists deconstruct classic recipes and forge new ones..."}
                                </p>
                                <button onClick={() => setIsExpanded(!isExpanded)} className="z_bar_btn_outline" style={{ marginTop: '15px' }}>
                                    {isExpanded ? "Read Less" : "Read More"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonial Slider Section */}
            <section className="z_bar_testimonial_section">
                <div className="z_bar_testimonial_container">
                    <button className="z_bar_testimonial_nav z_bar_testimonial_prev" onClick={prevTestimonial}>
                        <FaChevronLeft />
                    </button>
                    
                    <div className="z_bar_testimonial_content">
                        <h2 className="z_bar_testimonial_title">{TESTIMONIALS[currentTestimonial].title}</h2>
                        <p className="z_bar_testimonial_text">{TESTIMONIALS[currentTestimonial].content}</p>
                        <p className="z_bar_testimonial_author">{TESTIMONIALS[currentTestimonial].author}</p>
                    </div>
                    
                    <button className="z_bar_testimonial_nav z_bar_testimonial_next" onClick={nextTestimonial}>
                        <FaChevronRight />
                    </button>
                </div>
                
                <div className="z_bar_testimonial_dots">
                    {TESTIMONIALS.map((_, index) => (
                        <button
                            key={index}
                            className={`z_bar_testimonial_dot ${index === currentTestimonial ? 'active' : ''}`}
                            onClick={() => setCurrentTestimonial(index)}
                        />
                    ))}
                </div>
            </section>

        </div>
    );
}