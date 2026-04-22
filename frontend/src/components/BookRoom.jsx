import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { FaRegBuilding, FaRegCreditCard, FaRegCheckCircle, FaLock, FaSwimmingPool, FaSpa, FaConciergeBell } from 'react-icons/fa';
import { IoBedOutline } from 'react-icons/io5';
import { MdOutlineKingBed, MdOutlineVilla, MdOutlineVpnKey } from 'react-icons/md';
import "../style/h_style.css"
import { useAuth } from "../contexts/AuthContext";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function buildCalendar(year, month) {
  const first = new Date(year, month, 1).getDay();
  const total = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  return cells;
}
function genRef() { return "RM·" + Math.random().toString(36).substring(2, 7).toUpperCase(); }

function StepIndicator({ current }) {
  const steps = ["Details", "Preferences", "Payment", "Confirm"];
  return (
    <div className="h_steps">
      {steps.map((lbl, i) => {
        const n = i + 1;
        const cls = `h_step${current > n ? " h_done" : current === n ? " h_active" : ""}`;
        return (
          <div key={lbl} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <div className={cls}>
              <div className="h_step_n">{current > n ? "✓" : n}</div>
              <span className="h_step_lbl">{lbl}</span>
            </div>
            {i < steps.length - 1 && <div className="h_step_con" />}
          </div>
        );
      })}
    </div>
  );
}

function CounterSelector({ label, value, onChange, min = 1, max = 10 }) {
  return (
    <div className="h_guests">
      <button className="h_g_btn" type="button" onClick={() => onChange(Math.max(min, value - 1))}>−</button>
      <div className="h_g_mid">
        <div className="h_g_num">{value}</div>
        <div className="h_g_txt">{label}{value !== 1 && label.endsWith('y') ? "ies" : value !== 1 ? "s" : ""}</div>
      </div>
      <button className="h_g_btn" type="button" onClick={() => onChange(Math.min(max, value + 1))}>+</button>
    </div>
  );
}

function CalendarPicker({ label, selectedDate, onSelect, minDate = new Date() }) {
  const [view, setView] = useState({ year: selectedDate ? selectedDate.getFullYear() : minDate.getFullYear(), month: selectedDate ? selectedDate.getMonth() : minDate.getMonth() });
  const cells = buildCalendar(view.year, view.month);
  const prev = () => setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
  const next = () => setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 });

  const isPast = (d) => {
    const date = new Date(view.year, view.month, d);
    const min = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
    return date < min;
  };

  const isToday = d => {
    const today = new Date();
    return d === today.getDate() && view.month === today.getMonth() && view.year === today.getFullYear();
  };

  const isSel = d => selectedDate && d === selectedDate.getDate() && view.month === selectedDate.getMonth() && view.year === selectedDate.getFullYear();

  return (
    <div className="h_cal">
      <div className="h_cal_head">
        <button className="h_cal_nav" type="button" onClick={prev}>‹</button>
        <span className="h_cal_mth">{MONTHS[view.month]} {view.year}</span>
        <button className="h_cal_nav" type="button" onClick={next}>›</button>
      </div>
      <div className="h_cal_grid">
        {DAYS.map(d => <div key={d} className="h_cal_dn">{d}</div>)}
        {cells.map((d, i) => d === null
          ? <div key={`e${i}`} className="h_cal_d h_empty" />
          : <div key={d}
            className={`h_cal_d${isPast(d) ? " h_past" : ""}${isToday(d) ? " h_today" : ""}${isSel(d) ? " h_sel" : ""}`}
            onClick={() => !isPast(d) && onSelect(new Date(view.year, view.month, d))}>
            {d}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookRoom() {
  const { user } = useAuth();
  const location = useLocation();
  const selectedRoomTypeId = location.state?.selectedRoomTypeId || "";
  const selectedRoomTypeName = location.state?.selectedRoomTypeName || "";

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState(genRef);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [checkIn, setCheckIn] = useState(null);
  const [checkInTime, setCheckInTime] = useState("15:00");
  const [checkOut, setCheckOut] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState("11:00");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const [roomType, setRoomType] = useState(selectedRoomTypeId || "");
  const [roomNo, setRoomNo] = useState("");
  const [availableRooms, setAvailableRooms] = useState([]);
  const [requests, setRequests] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomTypesLoading, setRoomTypesLoading] = useState(false);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomTypesError, setRoomTypesError] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("card"); // card or upi
  const [cardNo, setCardNo] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [billingDetails, setBillingDetails] = useState({
    billingType: "",
    hours: 0,
    nights: 0,
    hourlyRate: 0,
    totalAmount: 0
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [initialAvailabilityError, setInitialAvailabilityError] = useState("");
  const [initialTypeResolved, setInitialTypeResolved] = useState(false);

  const iconByIndex = [<IoBedOutline />, <MdOutlineKingBed />, <MdOutlineVilla />, <MdOutlineVpnKey />];
  const iconForRoomType = (index) => iconByIndex[index % iconByIndex.length];
  const formatCardNumber = (value) => value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
  const formatExpiry = (value) => value.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(?=\d)/g, "$1/");

  const formatDateForApi = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fetchAvailableRoomTypes = async () => {
    setRoomTypesLoading(true);
    setRoomTypesError("");
    try {
      let mappedRoomTypes = [];

      if (checkIn && checkOut && adults) {
        const response = await fetch(`${API_BASE_URL}/reservations/getAvailableRoomTypes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            checkIn: formatDateForApi(checkIn),
            checkOut: formatDateForApi(checkOut),
            checkInTime,
            checkOutTime,
            adults,
            children
          })
        });

        const data = await response.json();
        if (!response.ok || !data?.success) {
          throw new Error(data?.msg || "Failed to load room types");
        }

        mappedRoomTypes = (data?.data?.roomTypes || [])
          .map((rt, index) => ({
            id: rt._id,
            icon: iconForRoomType(index),
            name: rt.display_name || rt.name,
            desc: rt.description || "Comfortable stay with premium amenities",
            priceValue: rt.price_per_night || 0,
            price: `₹${rt.price_per_night || 0}/night`,
            totalAmount: rt.totalAmount || 0,
            features: Array.isArray(rt.features) ? rt.features : [],
            availableCount: Number(rt.availableCount || 0),
            isAvailable: Boolean(rt.isAvailable)
          }));
      } else {
        const response = await fetch(`${API_BASE_URL}/rooms/types`);
        const data = await response.json();
        if (!response.ok || !data?.success) {
          throw new Error(data?.msg || "Failed to load room types");
        }

        mappedRoomTypes = (data?.data || []).map((rt, index) => ({
          id: rt._id,
          icon: iconForRoomType(index),
          name: rt.display_name || rt.name,
          desc: rt.description || "Comfortable stay with premium amenities",
          priceValue: rt.price_per_night || 0,
          price: `₹${rt.price_per_night || 0}/night`,
          totalAmount: 0,
          features: Array.isArray(rt.features) ? rt.features : [],
          availableCount: 0,
          isAvailable: true
        }));
      }

      setRoomTypes(mappedRoomTypes);
      if (roomType && !mappedRoomTypes.some((rt) => rt.id === roomType)) {
        setRoomType("");
        setRoomNo("");
        setAvailableRooms([]);
      }
    } catch (error) {
      setRoomTypes([]);
      setRoomTypesError(error.message || "Failed to load room types");
    } finally {
      setRoomTypesLoading(false);
    }
  };

  const fetchRoomsByType = async (roomTypeId) => {
    if (!roomTypeId || !checkIn || !checkOut) return;
    setRoomsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/getRoomsByType`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomTypeId,
          checkIn: formatDateForApi(checkIn),
          checkOut: formatDateForApi(checkOut),
          checkInTime,
          checkOutTime
        })
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.msg || "Failed to load rooms");
      }

      setAvailableRooms(data?.data?.availableRooms || []);
      setBillingDetails({
        billingType: data?.data?.billingType || "",
        hours: Number(data?.data?.hours || 0),
        nights: Number(data?.data?.nights || 0),
        hourlyRate: Number(data?.data?.hourlyRate || 0),
        totalAmount: Number(data?.data?.totalAmount || 0)
      });
    } catch (error) {
      setAvailableRooms([]);
      setBillingDetails({
        billingType: "",
        hours: 0,
        nights: 0,
        hourlyRate: 0,
        totalAmount: 0
      });
      setErrors((prev) => ({ ...prev, roomNo: error.message || "Failed to load rooms" }));
    } finally {
      setRoomsLoading(false);
    }
  };

  useEffect(() => {
    const checkInitialAvailability = async () => {
      if (!selectedRoomTypeId) return;
      try {
        const response = await fetch(`${API_BASE_URL}/reservations/roomTypeAvailability/${selectedRoomTypeId}`);
        const data = await response.json();
        if (!response.ok || !data?.success) return;

        if (!data?.data?.isAvailable) {
          const roomTypeName = data?.data?.roomTypeName || selectedRoomTypeName || "Selected room type";
          const msg = `${roomTypeName} has no available rooms right now.`;
          setInitialAvailabilityError(msg);
          setSubmitError(msg);
        }
      } catch (_) {
        // Ignore network error and keep normal flow.
      }
    };

    checkInitialAvailability();
  }, [selectedRoomTypeId, selectedRoomTypeName]);

  useEffect(() => {
    if (step === 2) {
      fetchAvailableRoomTypes();
    }
  }, [step, checkIn, checkOut, checkInTime, checkOutTime, adults, children]);

  useEffect(() => {
    if (initialTypeResolved) return;
    if (!selectedRoomTypeId || !roomTypes.length) return;
    const isValidType = roomTypes.some((rt) => rt.id === selectedRoomTypeId);
    if (isValidType) {
      setRoomType(selectedRoomTypeId);
    }
    setInitialTypeResolved(true);
  }, [selectedRoomTypeId, roomTypes, initialTypeResolved]);

  useEffect(() => {
    if (initialTypeResolved) return;
    if (!selectedRoomTypeName || roomType || !roomTypes.length) return;
    const byName = roomTypes.find((rt) => rt.name?.toLowerCase() === selectedRoomTypeName.toLowerCase());
    if (byName) {
      setRoomType(byName.id);
    }
    setInitialTypeResolved(true);
  }, [selectedRoomTypeName, roomType, roomTypes, initialTypeResolved]);

  useEffect(() => {
    if (roomType) {
      fetchRoomsByType(roomType);
    } else {
      setAvailableRooms([]);
      setBillingDetails({
        billingType: "",
        hours: 0,
        nights: 0,
        hourlyRate: 0,
        totalAmount: 0
      });
    }
  }, [roomType, checkIn, checkOut, checkInTime, checkOutTime]);

  useEffect(() => {
    if (roomNo && !availableRooms.some((room) => room._id === roomNo)) {
      setRoomNo("");
    }
  }, [availableRooms, roomNo]);

  useEffect(() => {
    if (!user) return;
    setFirstName((prev) => prev || user.full_name?.split(" ")[0] || "");
    setLastName((prev) => {
      if (prev) return prev;
      const parts = (user.full_name || "").trim().split(" ");
      return parts.length > 1 ? parts.slice(1).join(" ") : "";
    });
    setEmail((prev) => prev || user.email || "");
    setPhone((prev) => prev || user.phone || "");
  }, [user]);

  const validate1 = () => {
    const e = {};
    if (!firstName.trim()) {
      e.firstName = "First name is required";
    } else if (!/^[A-Za-z ]+$/.test(firstName)) {
      e.firstName = "First name should only contain letters";
    }

    if (!lastName.trim()) {
      e.lastName = "Last name is required";
    } else if (!/^[A-Za-z ]+$/.test(lastName)) {
      e.lastName = "Last name should only contain letters";
    }

    if (!email.trim()) {
      e.email = "Email address is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      e.email = "Please enter a valid email address";
    }

    if (!phone.trim()) {
      e.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      e.phone = "Phone number must be 10 digits";
    }

    if (!checkIn) {
      e.checkIn = "Please select a check-in date";
    }

    if (!checkInTime) {
      e.checkInTime = "Please select a check-in time";
    }

    if (!checkOut) {
      e.checkOut = "Please select a check-out date";
    } else if (checkIn && checkOut <= checkIn) {
      e.checkOut = "Check-out date must be after check-in date";
    }

    if (!checkOutTime) {
      e.checkOutTime = "Please select a check-out time";
    }

    setErrors(e);
    return !Object.keys(e).length;
  };

  const validate2 = () => {
    const e = {};
    if (!roomType) e.roomType = "Please select a room type";
    if (roomType && !roomNo) e.roomNo = "Please select a room number";
    if (!agree) e.agree = "You must agree to our stay policy";

    setErrors(e);
    return !Object.keys(e).length;
  };

  const validate3 = () => {
    const e = {};

    if (paymentMethod === "card") {
      if (!cardNo.trim()) {
        e.cardNo = "Card number is required";
      } else if (!/^\d{16}$/.test(cardNo.replace(/\s/g, ""))) {
        e.cardNo = "Card number must be 16 digits";
      }
      if (!cardName.trim()) e.cardName = "Cardholder name is required";
      if (!expiry.trim()) e.expiry = "Expiry date is required";
      if (!cvv.trim()) e.cvv = "CVV is required";
    } else if (paymentMethod === "upi") {
      if (!upiId.trim()) {
        e.upiId = "UPI ID is required";
      } else if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId)) {
        e.upiId = "Please enter a valid UPI ID (e.g. user@bank)";
      }
    }

    setErrors(e);
    return !Object.keys(e).length;
  };

  const calculateTotal = () => {
    if (billingDetails.totalAmount > 0) return billingDetails.totalAmount;
    if (!roomType || !checkIn || !checkOut) return 0;
    const room = roomTypes.find(r => r.id === roomType);
    if (!room) return 0;

    if (room.totalAmount) return room.totalAmount;
    const pricePerNight = room.priceValue || parseInt(room.price.replace(/[^0-9]/g, ""), 10) || 0;
    const diffTime = checkOut - checkIn;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const nights = diffDays > 0 ? diffDays : 0;

    return pricePerNight * nights;
  };

  const totalAmount = calculateTotal();
  const selectedRoomType = roomTypes.find(r => r.id === roomType);
  const selectedRoom = availableRooms.find((room) => room._id === roomNo);

  const goNext = async () => {
    if (step === 1 && validate1()) setStep(2);
    if (step === 2 && validate2()) setStep(3);
    if (step === 3 && validate3()) {
      setSubmitError("");
      setSubmitLoading(true);
      try {
        const payload = {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: user?.email || email.trim(),
          phone: phone.trim(),
          checkIn: formatDateForApi(checkIn),
          checkOut: formatDateForApi(checkOut),
          checkInTime,
          checkOutTime,
          adults,
          children,
          roomTypeId: roomType,
          roomId: roomNo,
          specialRequest: requests
        };

        const response = await fetch(`${API_BASE_URL}/reservations/createPaymentIntent`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (!response.ok || !data?.success) {
          throw new Error(data?.msg || "Payment initialization failed");
        }

        setPaymentIntentId(data?.data?.paymentIntentId || "");
        setBillingDetails({
          billingType: data?.data?.billingType || billingDetails.billingType || "",
          hours: Number(data?.data?.hours || billingDetails.hours || 0),
          nights: Number(data?.data?.nights || billingDetails.nights || 0),
          hourlyRate: Number(data?.data?.hourlyRate || billingDetails.hourlyRate || 0),
          totalAmount: Number(data?.data?.totalAmount || billingDetails.totalAmount || 0)
        });
        if (data?.data?.totalAmount) {
          const updatedTotal = Number(data.data.totalAmount);
          setRoomTypes((prev) =>
            prev.map((rt) => (rt.id === roomType ? { ...rt, totalAmount: updatedTotal } : rt))
          );
        }
        setStep(4);
      } catch (error) {
        setSubmitError(error.message || "Unable to initialize payment");
      } finally {
        setSubmitLoading(false);
      }
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!agree) return;
    if (!paymentIntentId) {
      setSubmitError("Payment not initialized. Please review payment details again.");
      return;
    }
    setSubmitError("");
    setSubmitLoading(true);

    try {
      const payload = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: user?.email || email.trim(),
        phone: phone.trim(),
        checkIn: formatDateForApi(checkIn),
        checkOut: formatDateForApi(checkOut),
        checkInTime,
        checkOutTime,
        adults,
        children,
        roomTypeId: roomType,
        roomId: roomNo,
        specialRequest: requests,
        paymentIntentId
      };

      const response = await fetch(`${API_BASE_URL}/reservations/confirmBooking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.msg || "Booking failed");
      }

      setBookingRef(data?.data?.bookingRef || genRef());
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error.message || "Unable to confirm booking");
    } finally {
      setSubmitLoading(false);
    }
  };

  const fmtDate = d => d ? d.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" }) : null;

  const reset = () => {
    setSubmitted(false); setStep(1); setFirstName(""); setLastName(""); setEmail(""); setPhone("");
    setCheckIn(null); setCheckInTime("15:00"); setCheckOut(null); setCheckOutTime("11:00"); setAdults(2); setChildren(0);
    setRoomType(""); setRequests(""); setAgree(false); setErrors({});
    setAvailableRooms([]); setRoomTypesError("");
    setBillingDetails({ billingType: "", hours: 0, nights: 0, hourlyRate: 0, totalAmount: 0 });
    setPaymentMethod("card"); setCardNo(""); setCardName(""); setExpiry(""); setCvv(""); setUpiId(""); setPaymentIntentId("");
  };

  if (initialAvailabilityError) {
    return (
      <div className="h_page">
        <div className="h_atm" />
        <div className="h_atm_mid" />
        <div className="h_grid_veil" />
        <div className="h_grain" />
        <main className="h_main">
          <div className="h_wrap" style={{ maxWidth: "820px" }}>
            <div className="h_card" style={{ textAlign: "center", padding: "2.2rem 1.5rem" }}>
              <div className="h_card_title" style={{ marginBottom: ".8rem" }}>Room Reservation</div>
              <div className="h_err_msg" style={{ marginBottom: "1.2rem" }}>{initialAvailabilityError}</div>
              <p className="h_policy_p" style={{ marginBottom: "1.2rem" }}>
                Please go back and select another room type.
              </p>
              <button type="button" className="h_btn_back" onClick={() => window.history.back()}>
                ← Go Back
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <div className="h_page">
        <div className="h_atm" />
        <div className="h_atm_mid" />
        <div className="h_grid_veil" />
        <div className="h_grain" />

        {/* MAIN */}
        <main className="h_main">
          <div className="h_wrap">
            <div className="h_layout">

              {/* LEFT */}
              <div className="h_card">
                <div className="h_card_head">
                  <div>
                    <div className="h_card_title">Room Reservation</div>
                    <div className="h_card_sub">
                      {step === 1 ? "Guest details & dates" : step === 2 ? "Room selection" : step === 3 ? "Payment details" : "Review & confirm"}
                    </div>
                  </div>
                  <StepIndicator current={step} />
                </div>

                <div className={`h_success${submitted ? " h_show" : ""}`}>
                  <div className="h_success_ring"><span className="h_success_ico">✓</span></div>
                  <div className="h_success_ttl">Booking Confirmed</div>
                  <p className="h_success_msg">
                    Your luxury stay has been booked. A confirmation email will be sent to{" "}
                    <strong style={{ color: "var(--h-champ-lt)" }}>{email}</strong> shortly.{" "}
                    We look forward to your arrival.
                  </p>
                  <div className="h_ref">Booking Ref: {bookingRef} | Total Paid: ₹{totalAmount}</div>
                  <button className="h_again_btn" onClick={reset}>← Make Another Booking</button>
                </div>

                {!submitted && (
                  <form onSubmit={submit} noValidate>
                    {submitError && <div className="h_err_msg" style={{ marginBottom: ".8rem" }}>{submitError}</div>}
                    {step === 1 && (
                      <div className="h_fbody">
                        <div className="h_fsec">
                          <div className="h_sec_lbl">Personal Information</div>
                          <div className="h_row_2">
                            <div className="h_field">
                              <label className="h_label">First Name</label>
                              <input
                                className={`h_input${errors.firstName ? " h_err" : ""}`}
                                type="text"
                                placeholder="Alexandre"
                                value={firstName}
                                onChange={e => {
                                  const val = e.target.value.replace(/[^A-Za-z ]/g, "");
                                  setFirstName(val);
                                  if (errors.firstName) setErrors(p => ({ ...p, firstName: null }));
                                }}
                              />
                              {errors.firstName && <div className="h_err_msg">{errors.firstName}</div>}
                            </div>
                            <div className="h_field">
                              <label className="h_label">Last Name</label>
                              <input
                                className={`h_input${errors.lastName ? " h_err" : ""}`}
                                type="text"
                                placeholder="Dupont"
                                value={lastName}
                                onChange={e => {
                                  const val = e.target.value.replace(/[^A-Za-z ]/g, "");
                                  setLastName(val);
                                  if (errors.lastName) setErrors(p => ({ ...p, lastName: null }));
                                }}
                              />
                              {errors.lastName && <div className="h_err_msg">{errors.lastName}</div>}
                            </div>
                            <div className="h_field">
                              <label className="h_label">Email Address</label>
                              <input
                                className={`h_input${errors.email ? " h_err" : ""}`}
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => {
                                  setEmail(e.target.value);
                                  if (errors.email) setErrors(p => ({ ...p, email: null }));
                                }}
                              />
                              {errors.email && <div className="h_err_msg">{errors.email}</div>}
                            </div>
                            <div className="h_field">
                              <label className="h_label">Phone Number</label>
                              <input
                                className={`h_input${errors.phone ? " h_err" : ""}`}
                                type="tel"
                                placeholder="10-digit number"
                                value={phone}
                                onChange={e => {
                                  const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                                  setPhone(val);
                                  if (errors.phone) setErrors(p => ({ ...p, phone: null }));
                                }}
                              />
                              {errors.phone && <div className="h_err_msg">{errors.phone}</div>}
                            </div>
                          </div>
                        </div>

                        <div className="h_fsec">
                          <div className="h_sec_lbl">Stay Duration</div>
                          <div className="h_row_2">
                            <div className="h_field">
                              <label className="h_label">Check-In Date</label>
                              <CalendarPicker selectedDate={checkIn} onSelect={d => { setCheckIn(d); if (checkOut && d >= checkOut) setCheckOut(null); }} />
                              {errors.checkIn && <div className="h_err_msg">{errors.checkIn}</div>}

                              <div style={{ marginTop: "10px" }}>
                                <label className="h_label">Check-In Time</label>
                                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                  <input
                                    type="time"
                                    className={`h_input${errors.checkInTime ? " h_err" : ""}`}
                                    value={checkInTime}
                                    onChange={e => setCheckInTime(e.target.value)}
                                    style={{ paddingLeft: "35px" }}
                                  />
                                  <span style={{ position: "absolute", left: "12px", color: "#c8965a", display: "flex", alignItems: "center" }}>
                                    <FaConciergeBell size={14} />
                                  </span>
                                </div>
                                {errors.checkInTime && <div className="h_err_msg">{errors.checkInTime}</div>}
                              </div>
                            </div>
                            <div className="h_field">
                              <label className="h_label">Check-Out Date</label>
                              <CalendarPicker selectedDate={checkOut} onSelect={setCheckOut} minDate={checkIn || new Date()} />
                              {errors.checkOut && <div className="h_err_msg">{errors.checkOut}</div>}

                              <div style={{ marginTop: "10px" }}>
                                <label className="h_label">Check-Out Time</label>
                                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                  <input
                                    type="time"
                                    className={`h_input${errors.checkOutTime ? " h_err" : ""}`}
                                    value={checkOutTime}
                                    onChange={e => setCheckOutTime(e.target.value)}
                                    style={{ paddingLeft: "35px" }}
                                  />
                                  <span style={{ position: "absolute", left: "12px", color: "#c8965a", display: "flex", alignItems: "center" }}>
                                    <FaConciergeBell size={14} />
                                  </span>
                                </div>
                                {errors.checkOutTime && <div className="h_err_msg">{errors.checkOutTime}</div>}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="h_fsec">
                          <div className="h_sec_lbl">Occupancy</div>
                          <div className="h_row_2">
                            <CounterSelector label="Adult" value={adults} onChange={setAdults} />
                            <CounterSelector label="Child" value={children} onChange={setChildren} min={0} />
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="h_fbody">
                        <div className="h_fsec">
                          <div className="h_sec_lbl">Select Accommodation</div>
                          {roomTypesLoading && <div className="h_panel_sub" style={{ marginBottom: ".6rem" }}>Loading available room types...</div>}
                          {roomTypesError && <div className="h_err_msg" style={{ marginBottom: ".6rem" }}>{roomTypesError}</div>}
                          {errors.roomType && <div className="h_err_msg" style={{ marginBottom: ".6rem" }}>{errors.roomType}</div>}
                          <div className="h_areas">
                            {roomTypes.map(r => (
                              <div key={r.id} className={`h_area${roomType === r.id ? " h_asel" : ""}`}
                                style={{ opacity: !checkIn || !checkOut || r.isAvailable ? 1 : 0.6, cursor: !checkIn || !checkOut || r.isAvailable ? "pointer" : "not-allowed" }}
                                onClick={() => {
                                  if (checkIn && checkOut && !r.isAvailable) return;
                                  setRoomType(r.id);
                                  setRoomNo(""); // Reset room number when type changes
                                  setErrors(p => ({ ...p, roomType: null, roomNo: null }));
                                }}>
                                <span className="h_area_ico">{r.icon}</span>
                                <div className="h_area_name">{r.name}</div>
                                {/* <div className="h_area_desc">
                                  {(r.features?.length ? r.features.slice(0, 2).join(" • ") : r.desc)}
                                </div> */}
                                <div className="h_area_price" style={{ color: "var(--h-champ)", fontSize: ".75rem", marginTop: ".5rem" }}>{r.price}</div>
                                {checkIn && checkOut && <div className="h_area_price" style={{ fontSize: ".7rem", marginTop: ".2rem" }}>{r.isAvailable ? `${r.availableCount} rooms available` : "No rooms available for selected dates"}</div>}
                                <div className="h_area_chk">✓</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="h_fsec">
                          <div className="h_sec_lbl">Select Room Number</div>
                          <div className="h_field">
                            <label className="h_label">Available {roomTypes.find(r => r.id === roomType)?.name || "Rooms"}</label>
                            <select
                              className={`h_input${errors.roomNo ? " h_err" : ""}`}
                              value={roomNo}
                              onChange={e => {
                                setRoomNo(e.target.value);
                                setErrors(p => ({ ...p, roomNo: null }));
                              }}
                              disabled={!roomType || roomsLoading || !checkIn || !checkOut}
                            >
                              <option value="">
                                {roomsLoading
                                  ? "-- Loading Rooms --"
                                  : !checkIn || !checkOut
                                    ? "-- Select check-in/check-out first --"
                                    : "-- Select Room Number --"}
                              </option>
                              {roomType && availableRooms.map(room => (
                                <option key={room._id} value={room._id}>Room {room.roomNumber}</option>
                              ))}
                            </select>
                            {errors.roomNo && <div className="h_err_msg">{errors.roomNo}</div>}
                          </div>
                        </div>

                        <div className="h_fsec">
                          <div className="h_sec_lbl">Special Requests</div>
                          <div className="h_field">
                            <label className="h_label">Preferences, allergies, or other notes</label>
                            <textarea className="h_textarea" placeholder="E.g. high floor, early check-in, anniversary setup…" value={requests} onChange={e => setRequests(e.target.value)} />
                          </div>
                        </div>

                        <div className="h_fsec">
                          <label className="h_chk_wrap">
                            <input type="checkbox" className="h_chk" checked={agree}
                              onChange={e => { setAgree(e.target.checked); setErrors(p => ({ ...p, agree: null })); }} />
                            <span className="h_chk_lbl">I agree to the <a href="#">Stay Policy</a> and understand our cancellation terms.</span>
                          </label>
                          {errors.agree && <div className="h_err_msg">{errors.agree}</div>}
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="h_fbody">
                        <div className="h_fsec">
                          <div className="h_sec_lbl">Payment Method</div>
                          <div className="h_pay_methods" style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                            <div
                              className={`h_pay_method${paymentMethod === "card" ? " h_asel" : ""}`}
                              style={{ flex: 1, padding: "1rem", border: "1px solid var(--h-border)", borderRadius: "var(--h-r-md)", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
                              onClick={() => setPaymentMethod("card")}
                            >
                              <FaRegCreditCard /> <span>Credit Card</span>
                            </div>
                            <div
                              className={`h_pay_method${paymentMethod === "upi" ? " h_asel" : ""}`}
                              style={{ flex: 1, padding: "1rem", border: "1px solid var(--h-border)", borderRadius: "var(--h-r-md)", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}
                              onClick={() => setPaymentMethod("upi")}
                            >
                              <FaRegCheckCircle /> <span>UPI</span>
                            </div>
                          </div>

                          {paymentMethod === 'card' ? (
                            <div className="h_row_2">
                              <div className="h_field">
                                <label className="h_label">Card Number</label>
                                <input
                                  className={`h_input${errors.cardNo ? " h_err" : ""}`}
                                  type="text"
                                  placeholder="0000 0000 0000 0000"
                                  value={cardNo}
                                  onChange={e => {
                                    setCardNo(formatCardNumber(e.target.value));
                                    if (errors.cardNo) setErrors(p => ({ ...p, cardNo: null }));
                                  }}
                                />
                                {errors.cardNo && <div className="h_err_msg">{errors.cardNo}</div>}
                              </div>
                              <div className="h_field">
                                <label className="h_label">Cardholder Name</label>
                                <input
                                  className={`h_input${errors.cardName ? " h_err" : ""}`}
                                  type="text"
                                  placeholder="Alexandre Dupont"
                                  value={cardName}
                                  onChange={e => {
                                    setCardName(e.target.value);
                                    if (errors.cardName) setErrors(p => ({ ...p, cardName: null }));
                                  }}
                                />
                                {errors.cardName && <div className="h_err_msg">{errors.cardName}</div>}
                              </div>
                              <div className="h_field">
                                <label className="h_label">Expiry Date</label>
                                <input
                                  className={`h_input${errors.expiry ? " h_err" : ""}`}
                                  type="text"
                                  placeholder="MM/YY"
                                  value={expiry}
                                  onChange={e => {
                                    setExpiry(formatExpiry(e.target.value));
                                    if (errors.expiry) setErrors(p => ({ ...p, expiry: null }));
                                  }}
                                />
                                {errors.expiry && <div className="h_err_msg">{errors.expiry}</div>}
                              </div>
                              <div className="h_field">
                                <label className="h_label">CVV</label>
                                <input
                                  className={`h_input${errors.cvv ? " h_err" : ""}`}
                                  type="password"
                                  maxLength="3"
                                  placeholder="***"
                                  value={cvv}
                                  onChange={e => {
                                    setCvv(e.target.value.replace(/\D/g, "").slice(0, 3));
                                    if (errors.cvv) setErrors(p => ({ ...p, cvv: null }));
                                  }}
                                />
                                {errors.cvv && <div className="h_err_msg">{errors.cvv}</div>}
                              </div>
                            </div>
                          ) : (
                            <div className="h_field">
                              <label className="h_label">UPI ID</label>
                              <input
                                className={`h_input${errors.upiId ? " h_err" : ""}`}
                                type="text"
                                placeholder="username@bank"
                                value={upiId}
                                onChange={e => {
                                  setUpiId(e.target.value);
                                  if (errors.upiId) setErrors(p => ({ ...p, upiId: null }));
                                }}
                              />
                              {errors.upiId && <div className="h_err_msg">{errors.upiId}</div>}
                            </div>
                          )}
                        </div>
                        <div className="h_policy" style={{ background: "rgba(200, 160, 90, 0.05)", padding: "1rem", borderRadius: "8px", border: "1px dashed var(--h-border)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".5rem" }}>
                            <span>Payable Amount</span>
                            <strong style={{ color: "var(--h-champ-lt)" }}>₹{totalAmount || 0}</strong>
                          </div>
                          <p className="h_policy_p" style={{ fontSize: "11px", margin: 0 }}>
                            {billingDetails.billingType === "hourly"
                              ? `Calculated hourly by backend (${billingDetails.hours || 0} hours${billingDetails.hourlyRate ? ` @ ₹${billingDetails.hourlyRate}/hour` : ""}).`
                              : `Calculated nightly by backend (${billingDetails.nights || 0} nights).`}
                          </p>
                        </div>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="h_fbody">
                        <div className="h_fsec">
                          <div className="h_sec_lbl">Booking Summary</div>
                          {[
                            ["Guest", `${firstName} ${lastName}`],
                            ["Duration", `${fmtDate(checkIn)} (${checkInTime}) — ${fmtDate(checkOut)} (${checkOutTime})`],
                            ["Occupancy", `${adults} Adults, ${children} Children`],
                            ["Room Type", selectedRoomType?.name || "—"],
                            ["Room Number", selectedRoom?.roomNumber || "—"],
                            ["Price per Night", selectedRoomType?.price || "—"],
                            ["Total Amount", totalAmount ? `₹${totalAmount}` : "—"],
                            ["Billing Type", billingDetails.billingType ? billingDetails.billingType.toUpperCase() : "Nightly"],
                            ["Payment", paymentMethod === 'card' ? `Card (Ending in ${cardNo.slice(-4) || "XXXX"})` : `UPI (${upiId})`],
                            ["Requests", requests || "None"],
                          ].map(([k, v]) => (
                            <div className="h_sum_row" key={k}>
                              <span className="h_sum_k">{k}</span>
                              <span className="h_sum_v">{v}</span>
                            </div>
                          ))}
                        </div>
                        <div className="h_policy">
                          <div className="h_policy_t">Reservation Policy</div>
                          <p className="h_policy_p">Check-in: 3:00 PM. Check-out: 11:00 AM. Cancellations must be made 48 hours prior to arrival to avoid penalty.</p>
                        </div>
                      </div>
                    )}

                    <div className="h_ffoot">
                      <div className="h_fnote"><span><FaLock /></span> Secure Reservation</div>
                      <div className="h_fbtns">
                        {step > 1 && <button type="button" className="h_btn_back" onClick={() => setStep(s => s - 1)}>← Back</button>}
                        {step < 4
                          ? <button type="button" className="h_btn_prime" onClick={goNext} disabled={submitLoading}>{submitLoading ? "Processing..." : step === 3 ? "Proceed to Confirm" : "Continue"} <span className="h_btn_arr">→</span></button>
                          : <button type="submit" className="h_btn_prime" disabled={submitLoading}>{submitLoading ? "Confirming..." : "Confirm Stay"} <span className="h_btn_arr">✓</span></button>
                        }
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* RIGHT */}
              <div className="h_right">
                <div className="h_panel">
                  <div className="h_panel_head">
                    <div className="h_panel_title">Stay Details</div>
                    <div className="h_panel_sub">Live Preview</div>
                  </div>
                  <div className="h_panel_body">
                    {[
                      { key: "Guest", val: firstName || lastName ? `${firstName} ${lastName}`.trim() : null },
                      { key: "Check-In", val: fmtDate(checkIn) },
                      { key: "Check-Out", val: fmtDate(checkOut) },
                      { key: "Adults", val: adults },
                      { key: "Children", val: children },
                      { key: "Room", val: roomType ? (selectedRoomType?.name || "Selected") : null },
                      { key: "Room No", val: selectedRoom?.roomNumber || null },
                      { key: "Total Amount", val: totalAmount > 0 ? `₹${totalAmount}` : null },
                    ].map(({ key, val }) => (
                      <div className="h_p_row" key={key}>
                        <span className="h_p_k">{key}</span>
                        <span className={`h_p_v${!val ? " h_empty" : ""}`}>{val || "_"}</span>
                      </div>
                    ))}
                    <div className="h_policy" style={{ marginTop: "1.1rem" }}>
                      <div className="h_policy_t">Guest Policy</div>
                      <p className="h_policy_p">Valid ID required at check-in. Minimum age for check-in is 21.</p>
                    </div>
                  </div>
                </div>

                <div className="h_info_cards">
                  {[
                    { icon: <FaRegBuilding />, title: "Location", text: "12 Rue de la Paix, Paris\nValet parking available" },
                    { icon: <FaSwimmingPool />, title: "Facilities", text: "Pool, Spa, Fitness Center\n24/7 Room Service" },
                    { icon: <FaRegCreditCard />, title: "Contact Us", text: "+1 (800) 555-NOIR\nstay@lanoire.com" },
                  ].map(c => (
                    <div className="h_info_card" key={c.title}>
                      <div className="h_info_ico">{c.icon}</div>
                      <div>
                        <div className="h_info_ttl">{c.title}</div>
                        <div className="h_info_txt" style={{ whiteSpace: "pre-line" }}>{c.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </>
  );
}
