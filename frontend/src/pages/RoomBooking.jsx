import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdHotel, MdWifi, MdAcUnit, MdTv, MdStar, MdOutlineKingBed, MdOutlineBalcony } from "react-icons/md";
import { PiBathtubBold, PiCoffeeBold, PiParkBold } from "react-icons/pi";
import { TbEye, TbMountain, TbToolsKitchen2 } from "react-icons/tb";
import { HiSparkles } from "react-icons/hi2";
import { RiArrowRightSLine } from "react-icons/ri";
import { IoSnowOutline, IoWineOutline } from "react-icons/io5";
import { BsShieldCheck } from "react-icons/bs";
import { LuCalendarCheck } from "react-icons/lu";
import "./roomBooking.css";

/* ── ROOMS DATA ───────────────────────────────────────────── */
const ROOMS = [
  {
    id: 1,
    featured: true,
    name: "The Grand DineVerse Suite",
    type: "Signature Suite",
    desc: "Our crown jewel — a sprawling suite with floor-to-ceiling windows overlooking the city skyline. Hand-picked antique furnishings, a private terrace, soaking tub, and complimentary sommelier service.",
    price: "420",
    rating: 5.0,
    reviews: 88,
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1000&q=80",
    amenities: [
      { icon: <MdWifi />,             label: "Wi-Fi" },
      { icon: <MdAcUnit />,           label: "Climate" },
      { icon: <PiBathtubBold />,      label: "Jacuzzi" },
      { icon: <MdOutlineBalcony />,   label: "Terrace" },
      { icon: <IoWineOutline />,      label: "Minibar" },
      { icon: <TbMountain />,         label: "City View" },
    ],
  },
  {
    id: 2,
    featured: false,
    name: "Jardin Deluxe Room",
    type: "Deluxe Room",
    desc: "Lush garden vistas, king-size bed with linen sheets, espresso station, and a marble rain shower.",
    price: "220",
    rating: 4.8,
    reviews: 142,
    img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=700&q=80",
    amenities: [
      { icon: <MdWifi />,          label: "Wi-Fi" },
      { icon: <MdAcUnit />,        label: "Climate" },
      { icon: <PiCoffeeBold />,    label: "Espresso" },
      { icon: <MdTv />,            label: "Smart TV" },
    ],
  },
  {
    id: 3,
    featured: false,
    name: "Atelier Classic Room",
    type: "Classic Room",
    desc: "Elegant and intimate. Carefully curated art-deco styling, queen bed, and walk-in rainfall shower.",
    price: "155",
    rating: 4.7,
    reviews: 201,
    img: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=700&q=80",
    amenities: [
      { icon: <MdWifi />,       label: "Wi-Fi" },
      { icon: <MdAcUnit />,     label: "Climate" },
      { icon: <MdTv />,         label: "Smart TV" },
      { icon: <PiParkBold />,   label: "Garden View" },
    ],
  },
  {
  id: 4,
  featured: false,
  name: "Ocean Grand Suite",
  type: "Luxury Suite",
  desc: "A luxurious suite designed for ultimate comfort with panoramic ocean views, a private lounge area, king-size bed, and a spacious marble bathroom with rainfall shower and bathtub.",
  price: "360",
  rating: 4.9,
  reviews: 124,
  img: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=700&q=80",
  amenities: [
    { icon: <MdWifi />,           label: "Wi-Fi" },
    { icon: <MdAcUnit />,         label: "Climate" },
    { icon: <MdOutlineBalcony />, label: "Balcony" },
    { icon: <MdTv />,             label: "Smart TV" },
    { icon: <IoWineOutline />,    label: "Minibar" },
    { icon: <TbMountain />,       label: "Ocean View" },
  ],
}
];

const PERKS = [
  {
    icon: <LuCalendarCheck />,
    title: "Free Cancellation",
    desc: "Cancel up to 48 hours before check-in with no charge, no questions asked.",
  },
  {
    icon: <PiCoffeeBold />,
    title: "Breakfast Included",
    desc: "Wake up to a curated breakfast spread from our in-house café kitchen.",
  },
  {
    icon: <BsShieldCheck />,
    title: "Best Rate Guarantee",
    desc: "Found it cheaper? We'll match the price and offer a complimentary upgrade.",
  },
  {
    icon: <MdOutlineKingBed />,
    title: "Late Checkout",
    desc: "Enjoy your stay at your own pace with complimentary late checkout until 2 PM.",
  },
];

/* ── ROOM CARD ────────────────────────────────────────────── */
function RoomCard({ room, onBook }) {
  // Truncate description to 20 words
  const words = room.desc.split(" ");
  const truncatedDesc = words.length > 14 
    ? words.slice(0, 14).join(" ") + "..." 
    : room.desc;

  return (
    <div className={`d_rooms_card${room.featured ? " d_rooms_card--featured" : ""}`}>

      {/* Image */}
      <div className="d_rooms_card__img-wrap">
        <img
          src={room.img}
          alt={room.name}
          className="d_rooms_card__img"
          loading="lazy"
        />

        {/* Type badge */}
        <span className="d_rooms_card__type">
          <span className="d_rooms_card__avail-dot" />
          {room.type}
        </span>

        {/* Rating float */}
        <span className="d_rooms_card__rating-float">
          <MdStar className="d_rooms_card__rating-star" />
          {room.rating.toFixed(1)}
          <span style={{ color: 'var(--d-text-4)', fontSize: 10 }}>({room.reviews})</span>
        </span>

        {/* Hover overlay */}
        {/* <div className="d_rooms_card__overlay">
          <button className="d_rooms_card__peek-btn">
            <TbEye style={{ fontSize: 13 }} />
            View Room
          </button>
        </div> */}
      </div>

      {/* Body */}
      <div className="d_rooms_card__body">
        <div>
          <h3 className="d_rooms_card__name">{room.name}</h3>
          <p className="d_rooms_card__desc">{truncatedDesc}</p>
        </div>

        {/* Amenities */}
        <div className="d_rooms_card__amenities">
          {room.amenities.map((a, i) => (
            <span key={i} className="d_rooms_card__amenity">
              <span className="d_rooms_card__amenity-icon">{a.icon}</span>
              {a.label}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="d_rooms_card__footer">
          <div className="d_rooms_card__price-wrap">
            <span className="d_rooms_card__price-label">From</span>
            <span className="d_rooms_card__price">
              <sup>$</sup>{room.price}
              <span className="d_rooms_card__price-night">/ night</span>
            </span>
          </div>
          <button
            className="d_rooms_card__book-btn"
            onClick={() => onBook(room)}
            aria-label={`Book ${room.name}`}
          >
            <MdHotel style={{ fontSize: 15 }} />
            Book a Room
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN SECTION ─────────────────────────────────────────── */
export default function RoomBooking() {
  const navigate = useNavigate();
  const handleBook = (room) => navigate("/bookRoom");

  const handleCheckAvail = () => navigate("/bookRoom");

  return (
    <section className="d_rooms_section">
      <div className="d_wrapper">

        {/* ── HEADER ── */}
        <div className="d_rooms_header">
          <div className="d_rooms_header__left">
            <p className="d_rooms_header__eyebrow">
              <span className="d_rooms_header__eyebrow-line" />
              Stays & Suites
              <span className="d_rooms_header__eyebrow-line" />
            </p>
            <h2 className="d_rooms_header__title">
              Rest in
              <em>Refined Luxury</em>
            </h2>
          </div>
          <div className="d_rooms_header__right">
            <p className="d_rooms_header__desc">
              Each room at DineVerse is a world of its own — thoughtfully designed
              spaces where comfort meets artistry, just moments from the dining
              floor and bar.
            </p>
            <button
              className="d_rooms_header__cta"
              onClick={() => navigate("/bookRoom")}
            >
              View All Rooms
              <span className="d_rooms_header__cta-arrow">
                <RiArrowRightSLine />
              </span>
            </button>
          </div>
        </div>

        {/* ── AVAILABILITY STRIP ── */}
        <div className="d_rooms_avail">
          <div className="d_rooms_avail__field">
            <span className="d_rooms_avail__label">Check-in</span>
            <span className="d_rooms_avail__value d_rooms_avail__value--placeholder">
              Select date
            </span>
            <LuCalendarCheck className="d_rooms_avail__icon" />
          </div>
          <div className="d_rooms_avail__field">
            <span className="d_rooms_avail__label">Check-out</span>
            <span className="d_rooms_avail__value d_rooms_avail__value--placeholder">
              Select date
            </span>
            <LuCalendarCheck className="d_rooms_avail__icon" />
          </div>
          <div className="d_rooms_avail__field">
            <span className="d_rooms_avail__label">Guests</span>
            <span className="d_rooms_avail__value">2 Adults</span>
            <MdOutlineKingBed className="d_rooms_avail__icon" />
          </div>
          <button className="d_rooms_avail__btn" onClick={handleCheckAvail}>
            <HiSparkles style={{ fontSize: 15 }} />
            Check Availability
          </button>
        </div>

        {/* ── ROOMS GRID ── */}
        <div className="d_rooms_grid">
          {ROOMS.map((room) => (
            <RoomCard key={room.id} room={room} onBook={handleBook} />
          ))}
        </div>

        {/* ── PERKS ROW ── */}
        <div className="d_rooms_perks">
          {PERKS.map((perk, i) => (
            <div key={i} className="d_rooms_perk">
              <div className="d_rooms_perk__icon-wrap">{perk.icon}</div>
              <span className="d_rooms_perk__title">{perk.title}</span>
              <p className="d_rooms_perk__desc">{perk.desc}</p>
            </div>
          ))}
        </div>

        {/* ── MAIN CTA ── */}
        <div className="d_rooms_cta_row">
          <p className="d_rooms_cta_row__note">
            <HiSparkles style={{ fontSize: 8, marginRight: 6, verticalAlign: 'middle' }} />
            Best rate guarantee · Breakfast included · Free cancellation
          </p>
          <button className="d_rooms_cta_btn" onClick={handleCheckAvail}>
            <MdHotel className="d_rooms_cta_btn__icon" />
            Book a Room
            <RiArrowRightSLine style={{ fontSize: 18 }} />
          </button>
        </div>

      </div>
    </section>
  );
}