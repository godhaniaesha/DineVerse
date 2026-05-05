import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaWifi, FaSwimmingPool, FaParking, FaSnowflake, FaCoffee, FaConciergeBell, FaDumbbell, FaBath } from "react-icons/fa";
import { MdHotel, MdKingBed, MdMeetingRoom, MdArrowForward, MdOutlineLocalBar, MdOutlineTv, MdOutlineAir, MdOutlineRestaurant } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const getFeatureIcon = (featureName = "") => {
    const feature = String(featureName).toLowerCase();
    if (feature.includes("wifi") || feature.includes("wi-fi") || feature.includes("internet")) {
        return <FaWifi className="z_prestige_amenity_icon" />;
    }
    if (feature.includes("pool") || feature.includes("swim")) {
        return <FaSwimmingPool className="z_prestige_amenity_icon" />;
    }
    if (feature.includes("mini bar") || feature.includes("bar")) {
        return <MdOutlineLocalBar className="z_prestige_amenity_icon" />;
    }
    if (feature.includes("bed")) {
        return <MdKingBed className="z_prestige_amenity_icon" />;
    }
    if (feature.includes("balcony")) {
        return <MdMeetingRoom className="z_prestige_amenity_icon" />;
    }
    if (feature.includes("tv") || feature.includes("television")) {
        return <MdOutlineTv className="z_prestige_amenity_icon" />;
    }
    if (feature.includes("ac") || feature.includes("air") || feature.includes("cooling")) {
        return <MdOutlineAir className="z_prestige_amenity_icon" />;
    }
    if (feature.includes("gym") || feature.includes("fitness")) {
        return <FaDumbbell className="z_prestige_amenity_icon" />;
    }
    if (feature.includes("spa")) {
        return <FaBath className="z_prestige_amenity_icon" />;
    }
    if (feature.includes("breakfast") || feature.includes("meal") || feature.includes("dinner") || feature.includes("restaurant")) {
        return <MdOutlineRestaurant className="z_prestige_amenity_icon" />;
    }
    if (feature.includes("coffee")) {
        return <FaCoffee className="z_prestige_amenity_icon" />;
    }
    if (feature.includes("service") || feature.includes("concierge")) {
        return <FaConciergeBell className="z_prestige_amenity_icon" />;
    }
    if (feature.includes("snow")) {
        return <FaSnowflake className="z_prestige_amenity_icon" />;
    }
    if (feature.includes("parking") || feature.includes("car")) {
        return <FaParking className="z_prestige_amenity_icon" />;
    }
    return <MdHotel className="z_prestige_amenity_icon" />;
};

const TESTIMONIALS = [
    {
        id: 1,
        title: "A Truly Royal Experience",
        content: "The Royal Suite exceeded all our expectations. The attention to detail and service were impeccable.",
        author: "BY SARAH JOHNSON / FREQUENT TRAVELER"
    },
    {
        id: 2,
        title: "Perfect Business Stay",
        content: "The Executive Room had everything I needed for my work trip. Quiet, comfortable, and great Wi-Fi.",
        author: "BY MICHAEL CHEN / CORPORATE GUEST"
    }
];

export default function Rooms() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [roomItems, setRoomItems] = useState([]);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [roomsError, setRoomsError] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
        AOS.init({
            duration: 500,
            once: true,
            easing: 'ease-out',
        });
    }, []);

    useEffect(() => {
        const fetchRoomTypes = async () => {
            setLoadingRooms(true);
            setRoomsError("");
            try {
                const response = await fetch(`${API_BASE_URL}/rooms/types`);
                const data = await response.json();

                if (!response.ok || !data?.success) {
                    throw new Error(data?.msg || "Failed to load room types");
                }

                const mapped = (data?.data || []).map((room, index) => ({
                    id: room._id,
                    name: room.display_name || room.name || `Room Type ${index + 1}`,
                    desc: room.description || "Experience unparalleled comfort in our thoughtfully designed spaces.",
                    price: `₹${Number(room.price_per_night || 0).toLocaleString("en-IN")}`,
                    img: room.image_url || "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80",
                    features: Array.isArray(room.features) ? room.features.filter(Boolean) : [],
                    raw: room
                }));

                setRoomItems(mapped);
            } catch (error) {
                console.error("Error fetching room types:", error);
                setRoomsError("Unable to load room collection at this time.");
                setRoomItems([]);
            } finally {
                setLoadingRooms(false);
            }
        };

        fetchRoomTypes();
    }, []);

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    };

    return (
        <div className="z_bar_page z_room_theme">
            {/* Hero Section */}
            <section className="z_bar_hero" style={{ backgroundImage: `url('https://avatars.mds.yandex.net/get-altay/13482651/2a00000192ea5b8aa6b2e24ecd9b7b364ee4/orig')` }}>
                <div className="z_bar_hero_overlay"></div>
                <div className="z_bar_hero_content" >
                    <div className="z_bar_hero_badge" >
                        <div className="z_bar_badge_line" style={{ background: 'var(--d-room)' }}></div>
                        <span className="z_bar_tag" style={{ color: 'var(--d-room)' }}>Luxury Stays</span>
                        <div className="z_bar_badge_line" style={{ background: 'var(--d-room)' }}></div>
                    </div>
                    <h1 className="z_bar_title">Refined <em>Comfort</em></h1>
                    <p className="z_bar_desc" >
                        Experience the perfect blend of elegance and tranquility.
                        Your sanctuary awaits in the heart of the city.
                    </p>
                    <div className="z_bar_hero_btns">
                        <Link to="/bookRoom" className="z_bar_btn_primary" style={{ background: 'var(--d-room)', borderColor: 'var(--d-room)' }}>Book Your Stay</Link>
                        <Link to="/gallerypage" className="z_bar_btn_outline">View Gallery</Link>
                    </div>
                </div>
            </section>

            {/* Prestige Collection - Immersive Horizontal Cards */}
            <section className="z_prestige_section" style={{ background: 'var(--d-bg)', padding: '100px 0' }}>
                <div className="container">
                    <div className="z_prestige_header" data-aos="fade-up">
                        <span className="z_prestige_eyebrow">The Prestige Collection</span>
                        <h2 className="z_prestige_title">Sanctuary <em>Suites</em></h2>
                        <p className="z_prestige_subtitle">Discover our exclusive range of {roomItems.length > 0 ? roomItems.length : "premium"} unique accommodations</p>
                    </div>

                    <div className="z_prestige_cards">
                        {loadingRooms && <p className="z_bar_desc">Loading room types...</p>}
                        {roomsError && <p className="z_bar_desc" style={{ color: "#dc3545" }}>{roomsError}</p>}
                        {!loadingRooms && !roomsError && roomItems.length === 0 && (
                            <p className="z_bar_desc">No room types available right now.</p>
                        )}
                        {roomItems.map((room, index) => (
                            <div key={room.id} className={`z_prestige_card ${index % 2 === 1 ? 'z_prestige_card--reverse' : ''}`} data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}>
                                <div className="z_prestige_media">
                                    <img src={room.img} alt={room.name} className="z_prestige_img" />
                                    <div className="z_prestige_media_overlay"></div>
                                    <div className="z_prestige_price_badge" data-aos="zoom-in" data-aos-delay="200">
                                        <span className="z_prestige_price_from">From</span>
                                        <span className="z_prestige_price_value">{room.price.split('.')[0]}</span>
                                        <span className="z_prestige_price_night">/night</span>
                                    </div>
                                </div>

                                <div className="z_prestige_content" data-aos={index % 2 === 0 ? "fade-left" : "fade-right"} data-aos-delay="100">
                                    <div className="z_prestige_content_inner">
                                        <span className="z_prestige_room_num">0{index + 1}</span>
                                        <h3 className="z_prestige_room_name">{room.name}</h3>
                                        <p className="z_prestige_room_desc">{room.desc}</p>

                                        <div className="z_prestige_amenities">
                                            {(room.features.length ? room.features : ["Premium Stay", "Luxury Comfort", "24/7 Service"])
                                                .slice(0, 3)
                                                .map((feature, fIdx) => (
                                                    <div className="z_prestige_amenity" key={`${room.id}-${feature}`} data-aos="fade-up" data-aos-delay={150 + (fIdx * 50)}>
                                                        {getFeatureIcon(feature)}
                                                        <span>{feature}</span>
                                                    </div>
                                                ))}
                                        </div>

                                        <Link
                                            to="/bookRoom"
                                            state={{ selectedRoomTypeId: room.id, selectedRoomTypeName: room.name }}
                                            className="z_prestige_cta"
                                            data-aos="fade-up"
                                            data-aos-delay="300"
                                        >
                                            <span>Reserve Room</span>
                                            <MdArrowForward className="z_prestige_cta_arrow" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Room Video Section */}
            <section style={{ height: '80vh', position: 'relative' }} data-aos="fade">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    src="/video/106674-673786323.mp4"
                ></video>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', maxWidth: '700px', padding: '2rem' }} data-aos="zoom-in">
                        <h2 className="z_bar_section_title" style={{ color: '#fff', fontSize: '4.5rem' }}>Luxury <em>Redefined</em></h2>
                        <p style={{ color: '#fff', fontSize: '1.3rem' }}>Wake up to breathtaking views and unparalleled comfort in our most exclusive accommodations.</p>
                    </div>
                </div>
            </section>

            {/* Amenities Section - Minimal Icons */}
            <section className="z_bar_section" style={{ padding: '120px 0', background: 'var(--d-surface-2)' }}>
                <div className="container">
                    <div className="row g-5">
                        <div className="col-xl-3 col-sm-6" data-aos="fade-up" data-aos-delay="50">
                            <div style={{ textAlign: 'center' }}>
                                <FaSwimmingPool style={{ color: 'var(--d-room)', fontSize: '3rem', marginBottom: '1rem' }} />
                                <h4 style={{ fontSize: '1.5rem' }}>Infinity Pool</h4>
                                <p style={{ color: 'var(--d-text-3)' }}>A refreshing escape with city views.</p>
                            </div>
                        </div>
                        <div className="col-xl-3 col-sm-6" data-aos="fade-up" data-aos-delay="100">
                            <div style={{ textAlign: 'center' }}>
                                <MdHotel style={{ color: 'var(--d-room)', fontSize: '3rem', marginBottom: '1rem' }} />
                                <h4 style={{ fontSize: '1.5rem' }}>24/7 Service</h4>
                                <p style={{ color: 'var(--d-text-3)' }}>We are here for your every need.</p>
                            </div>
                        </div>
                        <div className="col-xl-3 col-sm-6" data-aos="fade-up" data-aos-delay="150">
                            <div style={{ textAlign: 'center' }}>
                                <FaParking style={{ color: 'var(--d-room)', fontSize: '3rem', marginBottom: '1rem' }} />
                                <h4 style={{ fontSize: '1.5rem' }}>Valet Parking</h4>
                                <p style={{ color: 'var(--d-text-3)' }}>Secure and hassle-free arrival.</p>
                            </div>
                        </div>
                        <div className="col-xl-3 col-sm-6" data-aos="fade-up" data-aos-delay="200">
                            <div style={{ textAlign: 'center' }}>
                                <FaWifi style={{ color: 'var(--d-room)', fontSize: '3rem', marginBottom: '1rem' }} />
                                <h4 style={{ fontSize: '1.5rem' }}>High-Speed Wi-Fi</h4>
                                <p style={{ color: 'var(--d-text-3)' }}>Stay connected effortlessly.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials - Elegant Overlay */}
            <section style={{ position: 'relative', height: '500px', overflow: 'hidden' }} data-aos="fade-up">
                <img src="https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1600&q=80" alt="Testimonial BG" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
                        <span style={{ color: 'var(--d-room)', fontSize: '3rem' }} data-aos="zoom-in" data-aos-delay="50"><FaChevronLeft onClick={prevTestimonial} style={{ cursor: 'pointer', marginRight: '2rem' }} /><FaChevronRight onClick={nextTestimonial} style={{ cursor: 'pointer' }} /></span>
                        <h2 style={{ color: '#fff', fontFamily: 'var(--d-font-serif)', fontSize: '2.5rem', margin: '2rem 0' }} data-aos="fade-up" data-aos-delay="100">{TESTIMONIALS[currentTestimonial].title}</h2>
                        <p style={{ color: 'var(--d-text-2)', fontSize: '1.2rem' }} data-aos="fade-up" data-aos-delay="150">{TESTIMONIALS[currentTestimonial].content}</p>
                        <p style={{ color: 'var(--d-room)', fontWeight: '700', marginTop: '2rem', letterSpacing: '2px' }} data-aos="fade-up" data-aos-delay="200">{TESTIMONIALS[currentTestimonial].author}</p>
                    </div>
                </div>
            </section>

        </div>
    );
}