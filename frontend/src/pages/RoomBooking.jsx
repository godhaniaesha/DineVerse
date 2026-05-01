import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdHotel, MdWifi, MdAcUnit, MdTv, MdStar, MdOutlineKingBed, MdOutlineBalcony } from "react-icons/md";
import { PiBathtubBold, PiCoffeeBold, PiParkBold } from "react-icons/pi";
import { TbMountain, TbToolsKitchen2 } from "react-icons/tb";
import { HiSparkles } from "react-icons/hi2";
import { RiArrowRightSLine } from "react-icons/ri";
import { IoWineOutline } from "react-icons/io5";
import { BsShieldCheck } from "react-icons/bs";
import { LuCalendarCheck } from "react-icons/lu";
import { useRooms } from "../contexts/RoomContext";
import "./roomBooking.css";

const style = document.createElement("style");
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
  style.setAttribute("data-room-booking", "true");
  document.head.appendChild(style);
}

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const DEFAULT_ROOM_IMAGE = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&q=80";

const PERKS = [
  {
    icon: <LuCalendarCheck />,
    title: "Free Cancellation",
    desc: "Cancel up to 48 hours before check-in with no charge, no questions asked.",
  },
  {
    icon: <PiCoffeeBold />,
    title: "Breakfast Included",
    desc: "Wake up to a curated breakfast spread from our in-house cafe kitchen.",
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

const amenityIconMap = {
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

const getAmenityIcon = (feature = "") => {
  const lowerFeature = String(feature).toLowerCase();

  for (const [key, value] of Object.entries(amenityIconMap)) {
    if (lowerFeature.includes(key)) {
      return value;
    }
  }

  return <MdWifi />;
};

const transformRoomType = (roomType, index) => ({
  id: roomType._id || index + 1,
  featured: index === 0,
  name: roomType.display_name || roomType.name,
  type: roomType.name,
  desc: roomType.description || "Experience luxury and comfort in our beautifully designed room.",
  price: roomType.price_per_night?.toString() || "0",
  rating: Number(roomType.rating) || 4.8,
  reviews: Number(roomType.reviews) || 0,
  img: roomType.image_url || DEFAULT_ROOM_IMAGE,
  amenities: roomType.features?.length
    ? roomType.features.map((feature) => ({
        icon: getAmenityIcon(feature),
        label: feature,
      }))
    : [
        { icon: <MdWifi />, label: "Wi-Fi" },
        { icon: <MdAcUnit />, label: "Climate" },
        { icon: <MdTv />, label: "Smart TV" },
      ],
  availableCount: Number(roomType.availableCount ?? 0),
  isAvailable: roomType.isAvailable ?? true,
});

const transformRoomTypes = (roomTypes = []) => roomTypes.map(transformRoomType);

function RoomCard({ room, onBook }) {
  const words = room.desc.split(" ");
  const truncatedDesc = words.length > 14 ? `${words.slice(0, 14).join(" ")}...` : room.desc;

  const isAvailable = room.isAvailable !== false;
  const availableCount = Number(room.availableCount ?? 0);
  const availabilityText = !isAvailable ? "Sold out" : availableCount > 0 ? `${availableCount} available` : "Available";

  return (
    <div className={`d_rooms_card${room.featured ? " d_rooms_card--featured" : ""}${!isAvailable ? " d_rooms_card--unavailable" : ""}`}>
      <div className="d_rooms_card__img-wrap">
        <img src={room.img} alt={room.name} className="d_rooms_card__img" loading="lazy" />

        <span className="d_rooms_card__type">
          <span className="d_rooms_card__avail-dot" />
          {room.type}
        </span>

        <span className="d_rooms_card__rating-float">
          <MdStar className="d_rooms_card__rating-star" />
          {room.rating.toFixed(1)}
          <span style={{ color: "var(--d-text-4)", fontSize: 10 }}>({room.reviews})</span>
        </span>
      </div>

      <div className="d_rooms_card__body">
        <div>
          <h3 className="d_rooms_card__name">{room.name}</h3>
          <p className="d_rooms_card__desc">{truncatedDesc}</p>
        </div>

        <div className="d_rooms_card__amenities">
          {room.amenities.map((amenity, index) => (
            <span key={index} className="d_rooms_card__amenity">
              <span className="d_rooms_card__amenity-icon">{amenity.icon}</span>
              {amenity.label}
            </span>
          ))}
        </div>

        <div className="d_rooms_card__footer">
          <div className="d_rooms_card__price-wrap">
            <span className="d_rooms_card__price-label">From</span>
            <span className="d_rooms_card__price">
              <sup>$</sup>
              {room.price}
              <span className="d_rooms_card__price-night">/ night</span>
            </span>
            <span className={`d_rooms_card__availability-text${!isAvailable ? " d_rooms_card__availability-text--unavailable" : ""}`}>
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

export default function RoomBooking() {
  const navigate = useNavigate();
  const { getRoomTypes } = useRooms();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const children = 0;
  const checkInTime = "15:00";
  const checkOutTime = "11:00";
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

      const transformedRooms = transformRoomTypes(data.data.roomTypes);
      setRooms(transformedRooms);

      const hasAnyAvailable = transformedRooms.some((roomType) => roomType.isAvailable && roomType.availableCount > 0);
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

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        setLoading(true);
        const result = await getRoomTypes();

        if (!result?.success) {
          throw new Error(result?.error || "Failed to fetch room types");
        }

        const roomTypes = result?.data?.data || [];
        setRooms(transformRoomTypes(roomTypes));
        setError(null);
      } catch (err) {
        console.error("Error fetching room types:", err);
        setError(err.message || "Unable to load rooms.");
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomTypes();
  }, [getRoomTypes]);

  return (
    <section className="d_rooms_section">
      <div className="d_wrapper">
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
              Each room at DineVerse is a world of its own - thoughtfully designed spaces where comfort meets artistry,
              just moments from the dining floor and bar.
            </p>
            <button className="d_rooms_header__cta" onClick={() => navigate("/bookRoom")}>
              View All Rooms
              <span className="d_rooms_header__cta-arrow">
                <RiArrowRightSLine />
              </span>
            </button>
          </div>
        </div>

        {/* <div className="d_rooms_avail">
          <div className="d_rooms_avail__field">
            <span className="d_rooms_avail__label">Check-in</span>
            <input className="d_rooms_avail__input" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
            <LuCalendarCheck className="d_rooms_avail__icon" />
          </div>
          <div className="d_rooms_avail__field">
            <span className="d_rooms_avail__label">Check-out</span>
            <input className="d_rooms_avail__input" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
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
                const value = Number(e.target.value);
                setAdults(Number.isFinite(value) ? Math.max(1, Math.min(10, value)) : 2);
              }}
            />
            <MdOutlineKingBed className="d_rooms_avail__icon" />
          </div>
          <button className="d_rooms_avail__btn" onClick={handleCheckAvail} disabled={!checkIn || !checkOut || availabilityLoading}>
            <HiSparkles style={{ fontSize: 15 }} />
            {availabilityLoading ? "Checking..." : "Check Availability"}
          </button>
        </div> */}

        {availabilityError ? (
          <div className="d_rooms_error" style={{ padding: "12px 20px", marginBottom: 22 }}>
            {availabilityError}
          </div>
        ) : null}

        {loading || availabilityLoading ? (
          <div className="d_rooms_loading">
            <div className="d_rooms_loading__spinner" />
            <p>{loading ? "Loading available rooms..." : "Checking available rooms..."}</p>
          </div>
        ) : error ? (
          <div className="d_rooms_error">
            <p>{error}</p>
          </div>
        ) : (
          <div className="d_rooms_grid">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} onBook={handleBook} />
            ))}
          </div>
        )}

        <div className="d_rooms_perks">
          {PERKS.map((perk, index) => (
            <div key={index} className="d_rooms_perk">
              <div className="d_rooms_perk__icon-wrap">{perk.icon}</div>
              <span className="d_rooms_perk__title">{perk.title}</span>
              <p className="d_rooms_perk__desc">{perk.desc}</p>
            </div>
          ))}
        </div>

        <div className="d_rooms_cta_row">
          <p className="d_rooms_cta_row__note">
            <HiSparkles style={{ fontSize: 8, marginRight: 6, verticalAlign: "middle" }} />
            Best rate guarantee | Breakfast included | Free cancellation
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
