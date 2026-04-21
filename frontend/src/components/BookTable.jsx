import { useState, useEffect } from "react";
import { FaRegCalendarAlt, FaRegClock, FaRegUser, FaRegBuilding, FaRegCreditCard, FaRegCheckCircle, FaRegTimesCircle, FaChevronLeft, FaChevronRight, FaLock } from 'react-icons/fa';
import { IoRestaurantOutline, IoWineOutline, IoCafeOutline, IoBedOutline } from 'react-icons/io5';
import "../style/h_style.css"
import { useTableReservation } from "../contexts/TableReservationContext";

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
function genRef() { return "LN" + Math.random().toString(36).substring(2, 7).toUpperCase(); }

function StepIndicator({ current }) {
  const steps = ["Details", "Preferences", "Confirm"];
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

function GuestSelector({ value, onChange }) {
  return (
    <div className="h_guests">
      <button className="h_g_btn" type="button" onClick={() => onChange(Math.max(1, value - 1))}>−</button>
      <div className="h_g_mid">
        <div className="h_g_num">{value}</div>
        <div className="h_g_txt">Guest{value !== 1 ? "s" : ""}</div>
      </div>
      <button className="h_g_btn" type="button" onClick={() => onChange(Math.min(30, value + 1))}>+</button>
    </div>
  );
}

function CalendarPicker({ selectedDate, onSelect }) {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const cells = buildCalendar(view.year, view.month);
  const prev = () => setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
  const next = () => setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 });
  const isPast = d => new Date(view.year, view.month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isToday = d => d === today.getDate() && view.month === today.getMonth() && view.year === today.getFullYear();
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

export default function BookTable() {
  const { getAvailableTables, createPaymentIntent, confirmBooking, getReservations } = useTableReservation();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef] = useState(genRef);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [area, setArea] = useState("");
  const [tableId, setTableId] = useState(""); // store table._id instead of tableNo
  const [occasion, setOccasion] = useState("");
  const [requests, setRequests] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});
  const [availableTables, setAvailableTables] = useState([]);
  const [loadingTables, setLoadingTables] = useState(false);
  const [bookedReservations, setBookedReservations] = useState([]);

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNo, setCardNo] = useState("");
  const [upiId, setUpiId] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");

  const baseTimes = [
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "6:00 PM",
    "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"
  ];

  const areas = [
    { id: "Cafe", icon: <IoCafeOutline />, name: "Cafe", desc: "Cozy coffee & snacks" },
    { id: "Restaurant", icon: <IoRestaurantOutline />, name: "Restaurant", desc: "Fine dining experience" },
    { id: "Bar", icon: <IoWineOutline />, name: "Bar Lounge", desc: "Cocktails & night life" },
  ];
  const occasions = ["Anniversary", "Birthday", "Business", "Date Night", "Family", "Celebration", "Other"];

  // Fetch available tables when area, date, time, or guests change
  useEffect(() => {
    const fetchTables = async () => {
      if (area && date && time && guests) {
        try {
          setLoadingTables(true);
          const result = await getAvailableTables({
            area: area,
            date: date.toISOString(),
            time: time,
            guests: guests
          });
          if (result.success) {
            setAvailableTables(result.data);
          } else {
            setAvailableTables([]);
          }
        } catch (err) {
          console.error(err);
          setAvailableTables([]);
        } finally {
          setLoadingTables(false);
        }
      }
    };
    fetchTables();
  }, [area, date, time, guests, getAvailableTables]);

  // Fetch booked reservations for selected date and area to check time availability
  useEffect(() => {
    const fetchBookedReservations = async () => {
      if (date) {
        const dateStr = date.toISOString();
        const result = await getReservations(dateStr);
        if (result.success) {
          setBookedReservations(result.data);
        } else {
          setBookedReservations([]);
        }
      } else {
        setBookedReservations([]);
      }
    };
    fetchBookedReservations();
  }, [date, getReservations]);

  // Generate times array with avail based on bookedReservations
  const times = baseTimes.map(label => {
    // Check if this time has any booked tables for selected area and date
    if (!area || !date) return { label, avail: true };
    const hasBooking = bookedReservations.some(res => 
      res.date.startsWith(date.toISOString().split('T')[0]) && 
      res.time === label && 
      res.area === area &&
      (res.status === "Confirmed" || res.status === "Arrived")
    );
    return { label, avail: !hasBooking };
  });
  const sortedAvailableTables = [...availableTables].sort((a, b) => {
    const aMatch = a.capacityMatch ? 1 : 0;
    const bMatch = b.capacityMatch ? 1 : 0;
    if (aMatch !== bMatch) return bMatch - aMatch;
    return a.capacity - b.capacity;
  });
  const selectedTable = availableTables.find(t => t._id === tableId);

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

    if (!date) {
      e.date = "Please select a date";
    }

    if (!time) {
      e.time = "Please select a time";
    }

    setErrors(e);
    return !Object.keys(e).length;
  };
  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const validate2 = () => {
    const e = {};
    if (!area) e.area = "Please select a seating area";
    if (area && !tableId) e.tableNo = "Please select a table number";

    if (!agree) e.agree = "You must agree to our reservation policy";

    setErrors(e);
    return !Object.keys(e).length;
  };
  const goNext = async () => { 
    if (step === 1 && validate1()) {
      setStep(2);
    }
    if (step === 2 && validate2()) {
      // Create payment intent
      const paymentResult = await createPaymentIntent({
        guest_name: `${firstName} ${lastName}`,
        email: email
      });
      if (paymentResult.success) {
        setPaymentIntentId(paymentResult.data.paymentIntentId);
        setStep(3);
      } else {
        alert(paymentResult.error || "Failed to create payment");
      }
    } 
  };
  const submit = async (e) => { 
    e.preventDefault(); 
    if (!agree) return; 
    
    const bookingResult = await confirmBooking({
      guest_name: `${firstName} ${lastName}`,
      email: email,
      phone: phone,
      date: date.toISOString(),
      time: time,
      guests: guests,
      area: area,
      tableId: tableId,
      occasion: occasion,
      specialRequest: requests,
      paymentIntentId: paymentIntentId
    });

    if (bookingResult.success) {
      setSubmitted(true);
    } else {
      alert(bookingResult.error || "Failed to confirm booking");
    }
  };
  const fmtDate = d => d ? d.toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" }) : null;
  const reset = () => {
    setSubmitted(false); setStep(1); setFirstName(""); setLastName(""); setEmail(""); setPhone("");
    setGuests(2); setDate(null); setTime(""); setArea(""); setTableId(""); setOccasion(""); setRequests(""); setAgree(false); setErrors({});
    setPaymentMethod("card"); setCardNo(""); setUpiId(""); setPaymentIntentId(""); setAvailableTables([]); setBookedReservations([]);
  };

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
                    <div className="h_card_title">Table Reservation</div>
                    <div className="h_card_sub">
                      {step === 1 ? "Your details & schedule" : step === 2 ? "Seating preferences" : "Review & confirm"}
                    </div>
                  </div>
                  <StepIndicator current={step} />
                </div>

                <div className={`h_success${submitted ? " h_show" : ""}`}>
                  <div className="h_success_ring"><span className="h_success_ico">✓</span></div>
                  <div className="h_success_ttl">Reservation Confirmed</div>
                  <p className="h_success_msg">
                    Your table has been reserved. A confirmation will be sent to{" "}
                    <strong style={{ color: "var(--h-champ-lt)" }}>{email}</strong>.{" "}
                    We look forward to welcoming you.
                  </p>
                  <div className="h_ref">Booking Ref: {bookingRef}</div>
                  <button className="h_again_btn" onClick={reset}>← Make Another Reservation</button>
                </div>

                {!submitted && (
                  <form onSubmit={submit} noValidate>
                    {step === 1 && (
                      <div className="h_fbody">
                        <div className="h_fsec">
                          <div className="h_sec_lbl">Guest Information</div>
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
                          <div className="h_field" style={{ marginTop: ".3rem" }}>
                            <label className="h_label">Number of Guests</label>
                            <GuestSelector value={guests} onChange={setGuests} />
                          </div>
                        </div>
                        <div className="h_fsec">
                          <div className="h_sec_lbl">Select Date</div>
                          {errors.date && <div className="h_err_msg" style={{ marginBottom: ".6rem" }}>{errors.date}</div>}
                          <CalendarPicker selectedDate={date} onSelect={d => { setDate(d); setErrors(p => ({ ...p, date: null })); }} />
                        </div>
                        <div className="h_fsec">
                          <div className="h_sec_lbl">Select Time</div>
                          {errors.time && <div className="h_err_msg" style={{ marginBottom: ".6rem" }}>{errors.time}</div>}
                          <div className="h_times">
                            {times.map(t => (
                              <div key={t.label}
                                className={`h_time${!t.avail ? " h_unavail" : ""}${time === t.label && t.avail ? " h_tsel" : ""}`}
                                onClick={() => t.avail && setTime(t.label)}>
                                {t.label}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="h_fbody">
                        <div className="h_fsec">
                          <div className="h_sec_lbl">Seating Area</div>
                          {errors.area && <div className="h_err_msg" style={{ marginBottom: ".6rem" }}>{errors.area}</div>}
                          <div className="h_areas">
                            {areas.map(a => (
                              <div key={a.id} className={`h_area${area === a.id ? " h_asel" : ""}`}
                                onClick={() => {
                                  setArea(a.id);
                                  setTableId(""); // Reset table when area changes
                                  setErrors(p => ({ ...p, area: null, tableNo: null }));
                                }}>
                                <span className="h_area_ico">{a.icon}</span>
                                <div className="h_area_name">{a.name}</div>
                                <div className="h_area_desc">{a.desc}</div>
                                <div className="h_area_chk">✓</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="h_fsec">
                          <div className="h_sec_lbl">Select Table</div>
                          <div className="h_field">
                            <label className="h_label">Available Tables in {areas.find(a => a.id === area)?.name || "Selection"}</label>
                            <select
                              className={`h_input${errors.tableNo ? " h_err" : ""}`}
                              value={tableId}
                              onChange={e => {
                                setTableId(e.target.value);
                                setErrors(p => ({ ...p, tableNo: null }));
                              }}
                              disabled={!area || loadingTables}
                            >
                              <option value="">-- Select Table Number --</option>
                              {loadingTables && <option value="">Loading tables...</option>}
                              {!loadingTables && availableTables.length === 0 && area && <option value="">No available tables</option>}
                              {!loadingTables && sortedAvailableTables.map(table => (
                                <option key={table._id} value={table._id}>
                                  {table.tableNo} ({table.capacity} guests{table.capacityMatch ? ", fits" : ", less than guests"})
                                </option>
                              ))}
                            </select>
                            {errors.tableNo && <div className="h_err_msg">{errors.tableNo}</div>}
                            {selectedTable && !selectedTable.capacityMatch && (
                              <div className="h_err_msg">Selected table capacity is lower than number of guests, but table is available.</div>
                            )}
                          </div>
                        </div>

                        <div className="h_fsec">
                          <div className="h_sec_lbl">Special Occasion</div>
                          <div className="h_occs">
                            {occasions.map(o => (
                              <div key={o} className={`h_occ${occasion === o ? " h_osel" : ""}`}
                                onClick={() => setOccasion(occasion === o ? "" : o)}>
                                {o}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="h_fsec">
                          <div className="h_sec_lbl">Special Requests</div>
                          <div className="h_field">
                            <label className="h_label">Dietary requirements, allergies, or other notes</label>
                            <textarea className="h_textarea" placeholder="E.g. gluten-free, wheelchair access, window table…" value={requests} onChange={e => setRequests(e.target.value)} />
                          </div>
                        </div>

                        <div className="h_fsec">
                          <label className="h_chk_wrap">
                            <input type="checkbox" className="h_chk" checked={agree}
                              onChange={e => { setAgree(e.target.checked); setErrors(p => ({ ...p, agree: null })); }} />
                            <span className="h_chk_lbl">I agree to the <a href="#">Reservation Policy</a> and understand cancellations must be made 24 hours in advance.</span>
                          </label>
                          {errors.agree && <div className="h_err_msg">{errors.agree}</div>}
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="h_fbody">
                        <div className="h_fsec">
                          <div className="h_sec_lbl">Reservation Summary</div>
                          {[
                            ["Guest", `${firstName} ${lastName}`],
                            ["Email", email], ["Phone", phone],
                            ["Guests", `${guests} ${guests > 1 ? "Guests" : "Guest"}`],
                            ["Date", fmtDate(date)], ["Time", time],
                            ["Area", areas.find(a => a.id === area)?.name || "—"],
                            ["Table Number", availableTables.find(t => t._id === tableId)?.tableNo || "—"],
                            ["Occasion", occasion || "—"],
                            ["Advance Payment", "10 USD"],
                            ["Requests", requests || "None"],
                          ].map(([k, v]) => (
                            <div className="h_sum_row" key={k}>
                              <span className="h_sum_k">{k}</span>
                              <span className="h_sum_v">{v}</span>
                            </div>
                          ))}
                        </div>
                        <div className="h_policy">
                          <div className="h_policy_t">Cancellation Policy</div>
                          <p className="h_policy_p">Cancellations must be made at least 24 hours in advance. Late cancellations or no-shows may incur a fee. Confirmation will be emailed to you.</p>
                        </div>
                      </div>
                    )}

                    <div className="h_ffoot">
                      <div className="h_fnote"><span><FaLock /></span> Encrypted &amp; secure</div>
                      <div className="h_fbtns">
                        {step > 1 && <button type="button" className="h_btn_back" onClick={() => setStep(s => s - 1)}>← Back</button>}
                        {step < 3
                          ? <button type="button" className="h_btn_prime" onClick={goNext}>Continue <span className="h_btn_arr">→</span></button>
                          : <button type="submit" className="h_btn_prime">Confirm Reservation <span className="h_btn_arr">✓</span></button>
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
                    <div className="h_panel_title">Your Reservation</div>
                    <div className="h_panel_sub">Live Preview</div>
                  </div>
                  <div className="h_panel_body">
                    {[
                      { key: "Guest", val: firstName || lastName ? `${firstName} ${lastName}`.trim() : null },
                      { key: "Date", val: fmtDate(date) },
                      { key: "Time", val: time },
                      { key: "Guests", val: `${guests} ${guests > 1 ? "guests" : "guest"}` },
                      { key: "Area", val: area ? areas.find(a => a.id === area)?.name : null },
                      { key: "Table No", val: availableTables.find(t => t._id === tableId)?.tableNo || null },
                      { key: "Occasion", val: occasion || null },
                      { key: "Advance Payment", val: "10 USD" },
                    ].map(({ key, val }) => (
                      <div className="h_p_row" key={key}>
                        <span className="h_p_k">{key}</span>
                        <span className={`h_p_v${!val ? " h_empty" : ""}`}>{val || "_"}</span>
                      </div>
                    ))}
                    <div className="h_policy" style={{ marginTop: "1.1rem" }}>
                      <div className="h_policy_t">House Policy</div>
                      <p className="h_policy_p">Reservations held 15 min. Smart casual attire appreciated.</p>
                    </div>
                  </div>
                </div>

                <div className="h_info_cards">
                  {[
                    { icon: <FaRegBuilding />, title: "Location", text: "12 Rue de la Paix, Paris\nValet parking available" },
                    { icon: <FaRegClock />, title: "Opening Hours", text: "Mon–Fri  12PM – 11PM\nSat–Sun   11AM – 12AM" },
                    { icon: <FaRegCreditCard />, title: "Reservations", text: "+1 (800) 555-NOIR\nreservations@lanoire.com" },
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
