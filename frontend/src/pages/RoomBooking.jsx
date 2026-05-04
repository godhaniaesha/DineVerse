import { useState, useEffect } from "react";
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

/* ── LOADING STYLES ───────────────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `
  .d_rooms_loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
  }
  
  .d_rooms_loading__spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid var(--d-primary, #2563eb);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .d_rooms_error {
    text-align: center;
    padding: 40px 20px;
    color: var(--d-error, #dc2626);
  }
`;
if (!document.head.querySelector('style[data-room-booking]')) {
  style.setAttribute('data-room-booking', 'true');
  document.head.appendChild(style);
}
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
      { icon: <MdWifi />, label: "Wi-Fi" },
      { icon: <MdAcUnit />, label: "Climate" },
      { icon: <PiBathtubBold />, label: "Jacuzzi" },
      { icon: <MdOutlineBalcony />, label: "Terrace" },
      { icon: <IoWineOutline />, label: "Minibar" },
      { icon: <TbMountain />, label: "City View" },
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
      { icon: <MdWifi />, label: "Wi-Fi" },
      { icon: <MdAcUnit />, label: "Climate" },
      { icon: <PiCoffeeBold />, label: "Espresso" },
      { icon: <MdTv />, label: "Smart TV" },
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
      { icon: <MdWifi />, label: "Wi-Fi" },
      { icon: <MdAcUnit />, label: "Climate" },
      { icon: <MdTv />, label: "Smart TV" },
      { icon: <PiParkBold />, label: "Garden View" },
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
      { icon: <MdWifi />, label: "Wi-Fi" },
      { icon: <MdAcUnit />, label: "Climate" },
      { icon: <MdOutlineBalcony />, label: "Balcony" },
      { icon: <MdTv />, label: "Smart TV" },
      { icon: <IoWineOutline />, label: "Minibar" },
      { icon: <TbMountain />, label: "Ocean View" },
    ],
  }
];

/* ── API CONFIGURATION ───────────────────────────────────────────── */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/* ── ROOMS DATA ───────────────────────────────────────────── */
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

  const isAvailable = room.isAvailable !== false;
  const availableCount = Number(room.availableCount ?? 0);
  const availabilityText = !isAvailable
    ? "Sold out"
    : availableCount > 0
      ? `${availableCount} available`
      : "Available";

  return (
    <div
      className={`d_rooms_card${room.featured ? " d_rooms_card--featured" : ""}${!isAvailable ? " d_rooms_card--unavailable" : ""}`}
    >

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
            <span className="d_rooms_card__price-label">Starting from</span>
            <span className="d_rooms_card__price">
              <sup>$</sup>{room.price}
              <span className="d_rooms_card__price-night">/ night</span>
            </span>
            <span
              className={`d_rooms_card__availability-text${!isAvailable ? " d_rooms_card__availability-text--unavailable" : ""}`}
            >
              {availabilityText}
            </span>
          </div>
          <button
            className="d_rooms_card__book-btn"
            onClick={() => onBook(room)}
            aria-label={`Book ${room.name}`}
            disabled={!isAvailable}
          >
            <MdHotel style={{ fontSize: 15 }} />
            {!isAvailable ? "Sold out" : "Book a Room"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN SECTION ─────────────────────────────────────────── */
export default function RoomBooking() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [checkInTime, setCheckInTime] = useState("15:00");
  const [checkOutTime, setCheckOutTime] = useState("11:00");

  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");

  const handleBook = (room) =>
    navigate("/bookRoom", {
      state: {
        selectedRoomTypeId: room.id,
        selectedRoomTypeName: room.type || room.name,
        checkIn: checkIn || undefined,
        checkOut: checkOut || undefined,
        adults,
        children,
        checkInTime,
        checkOutTime,
        startStep: checkIn && checkOut ? 2 : 1,
      },
    });

  const handleCheckAvail = async () => {
    setAvailabilityError("");

    if (!checkIn || !checkOut) {
      setAvailabilityError("Please select check-in and check-out dates.");
      return;
    }

    const checkInDate = new Date(`${checkIn}T00:00:00`);
    const checkOutDate = new Date(`${checkOut}T00:00:00`);
    if (isNaN(checkInDate) || isNaN(checkOutDate) || checkOutDate <= checkInDate) {
      setAvailabilityError("Check-out must be after check-in.");
      return;
    }

    if (!adults || Number(adults) < 1) {
      setAvailabilityError("At least 1 adult is required.");
      return;
    }

    setAvailabilityLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/reservations/getAvailableRoomTypes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          checkIn,
          checkOut,
          checkInTime,
          checkOutTime,
          adults,
          children,
        }),
      });

      if (!response.ok) {
        const maybe = await response.json().catch(() => null);
        throw new Error(maybe?.msg || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data?.success || !data?.data?.roomTypes) {
        throw new Error(data?.msg || "Failed to fetch availability.");
      }

      const iconMap = {
        wifi: <MdWifi />,
        climate: <MdAcUnit />,
        jacuzzi: <PiBathtubBold />,
        terrace: <MdOutlineBalcony />,
        balcony: <MdOutlineBalcony />,
        minibar: <IoWineOutline />,
        tv: <MdTv />,
        "smart tv": <MdTv />,
        espresso: <PiCoffeeBold />,
        coffee: <PiCoffeeBold />,
        "garden view": <PiParkBold />,
        "city view": <TbMountain />,
        "ocean view": <TbMountain />,
        kitchen: <TbToolsKitchen2 />,
      };

      const transformedRooms = data.data.roomTypes.map((roomType, index) => {
        const amenities =
          roomType.features?.map((feature) => {
            const lowerFeature = String(feature || "").toLowerCase();
            let icon = <MdWifi />; // default
            for (const [key, value] of Object.entries(iconMap)) {
              if (lowerFeature.includes(key)) {
                icon = value;
                break;
              }
            }
            return { icon, label: feature };
          }) || [
            { icon: <MdWifi />, label: "Wi-Fi" },
            { icon: <MdAcUnit />, label: "Climate" },
            { icon: <MdTv />, label: "Smart TV" },
          ];

        return {
          id: roomType._id || index + 1,
          featured: index === 0,
          name: roomType.display_name || roomType.name,
          type: roomType.name,
          desc: roomType.description || "Experience luxury and comfort in our beautifully designed room.",
          price: roomType.price_per_night?.toString() || "0",
          rating: 4.5 + Math.random() * 0.5,
          reviews: Math.floor(Math.random() * 200) + 50,
          img:
            roomType.image_url ||
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=80",
          amenities,
          availableCount: Number(roomType.availableCount || 0),
          isAvailable: Boolean(roomType.isAvailable),
        };
      });

      setRooms(transformedRooms);

      // If nothing is available for any room type, don't redirect.
      const hasAnyAvailable = transformedRooms.some((rt) => rt.isAvailable && rt.availableCount > 0);
      if (!hasAnyAvailable) {
        setAvailabilityError("No rooms available for selected dates.");
        return;
      }

      navigate("/bookRoom", {
        state: {
          checkIn,
          checkOut,
          adults,
          children,
          checkInTime,
          checkOutTime,
          startStep: 2,
        },
      });
    } catch (err) {
      setAvailabilityError(err?.message || "Unable to check availability.");
    } finally {
      setAvailabilityLoading(false);
    }
  };

  // Fetch room types from backend
  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/public/rooms/types`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          // Transform backend data to match frontend format
          const transformedRooms = data.data.map((roomType, index) => ({
            id: roomType._id || index + 1,
            featured: index === 0, // First room is featured
            name: roomType.display_name || roomType.name,
            type: roomType.name,
            desc: roomType.description || "Experience luxury and comfort in our beautifully designed room.",
            price: roomType.price_per_night?.toString() || "200",
            rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
            reviews: Math.floor(Math.random() * 200) + 50, // Random reviews between 50-250
            img: roomType.image_url || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=80",
            amenities: roomType.features?.map((feature, i) => {
              // Map feature names to icons
              const iconMap = {
                'wifi': <MdWifi />,
                'climate': <MdAcUnit />,
                'jacuzzi': <PiBathtubBold />,
                'terrace': <MdOutlineBalcony />,
                'balcony': <MdOutlineBalcony />,
                'minibar': <IoWineOutline />,
                'tv': <MdTv />,
                'smart tv': <MdTv />,
                'espresso': <PiCoffeeBold />,
                'coffee': <PiCoffeeBold />,
                'garden view': <PiParkBold />,
                'city view': <TbMountain />,
                'ocean view': <TbMountain />,
                'kitchen': <TbToolsKitchen2 />,
              };
              
              const lowerFeature = feature.toLowerCase();
              let icon = <MdWifi />; // Default icon
              
              // Find matching icon
              for (const [key, value] of Object.entries(iconMap)) {
                if (lowerFeature.includes(key)) {
                  icon = value;
                  break;
                }
              }
              
              return { icon, label: feature };
            }) || [
              { icon: <MdWifi />, label: "Wi-Fi" },
              { icon: <MdAcUnit />, label: "Climate" },
              { icon: <MdTv />, label: "Smart TV" },
            ],
          }));
          
          setRooms(transformedRooms);
        } else {
          throw new Error(data.msg || 'Failed to fetch room types');
        }
      } catch (err) {
        console.error('Error fetching room types:', err);
        setError(err.message);
        
        // Fallback to static data if API fails
        const fallbackRooms = [
          {
            id: 1,
            featured: true,
            name: "The Grand DineVerse Suite",
            type: "Signature Suite",
            desc: "Our crown jewel — a sprawling suite with floor-to-ceiling windows overlooking the city skyline.",
            price: "420",
            rating: 5.0,
            reviews: 88,
            img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=80",
            amenities: [
              { icon: <MdWifi />, label: "Wi-Fi" },
              { icon: <MdAcUnit />, label: "Climate" },
              { icon: <PiBathtubBold />, label: "Jacuzzi" },
              { icon: <MdOutlineBalcony />, label: "Terrace" },
            ],
          },
          {
            id: 2,
            featured: false,
            name: "Deluxe Room",
            type: "Deluxe Room",
            desc: "Comfortable and elegant room with modern amenities.",
            price: "220",
            rating: 4.8,
            reviews: 142,
            img: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=700&q=80",
            amenities: [
              { icon: <MdWifi />, label: "Wi-Fi" },
              { icon: <MdAcUnit />, label: "Climate" },
              { icon: <MdTv />, label: "Smart TV" },
            ],
          },
        ];
        setRooms(fallbackRooms);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomTypes();
  }, []);

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
            <input
              className="d_rooms_avail__input"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
            <LuCalendarCheck className="d_rooms_avail__icon" />
          </div>
          <div className="d_rooms_avail__field">
            <span className="d_rooms_avail__label">Check-out</span>
            <input
              className="d_rooms_avail__input"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
            <LuCalendarCheck className="d_rooms_avail__icon" />
          </div>
          <div className="d_rooms_avail__field">
            <span className="d_rooms_avail__label">Guests</span>
            <input
              className="d_rooms_avail__input d_rooms_avail__input--guests"
              type="number"
              min={1}
              max={10}
              value={adults}
              onChange={(e) => {
                const n = Number(e.target.value);
                setAdults(Number.isFinite(n) ? Math.max(1, Math.min(10, n)) : 2);
              }}
            />
            <MdOutlineKingBed className="d_rooms_avail__icon" />
          </div>
          <button
            className="d_rooms_avail__btn"
            onClick={handleCheckAvail}
            disabled={!checkIn || !checkOut || availabilityLoading}
          >
            <HiSparkles style={{ fontSize: 15 }} />
            {availabilityLoading ? "Checking..." : "Check Availability"}
          </button>
        </div>

        {availabilityError ? (
          <div className="d_rooms_error" style={{ padding: "12px 20px", marginBottom: 22 }}>
            {availabilityError}
          </div>
        ) : null}

        {/* ── ROOMS GRID ── */}
        {loading || availabilityLoading ? (
          <div className="d_rooms_loading">
            <div className="d_rooms_loading__spinner"></div>
            <p>{loading ? "Loading available rooms..." : "Checking available rooms..."}</p>
          </div>
        ) : error ? (
          <div className="d_rooms_error">
            <p>Unable to load rooms. Showing available rooms.</p>
          </div>
        ) : (
          <div className="d_rooms_grid">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} onBook={handleBook} />
            ))}
          </div>
        )}

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