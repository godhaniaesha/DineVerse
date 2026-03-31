import { useState } from "react";
import { FaRegBuilding, FaRegCreditCard, FaRegCheckCircle, FaLock, FaSwimmingPool, FaSpa, FaConciergeBell } from 'react-icons/fa';
import { IoBedOutline } from 'react-icons/io5';
import { MdOutlineKingBed, MdOutlineVilla, MdOutlineVpnKey } from 'react-icons/md';
import "../style/h_style.css"

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function buildCalendar(year, month) {
  const first = new Date(year, month, 1).getDay();
  const total = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  return cells;
}
function genRef() { return "RM·" + Math.random().toString(36).substring(2,7).toUpperCase(); }

function StepIndicator({ current }) {
  const steps = ["Details", "Preferences", "Confirm"];
  return (
    <div className="h_steps">
      {steps.map((lbl, i) => {
        const n = i + 1;
        const cls = `h_step${current > n ? " h_done" : current === n ? " h_active" : ""}`;
        return (
          <div key={lbl} style={{ display:"flex", alignItems:"center", flex: i < steps.length-1 ? 1 : "none" }}>
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

function CounterSelector({ label, value, onChange, min=1, max=10 }) {
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
  const prev = () => setView(v => v.month === 0 ? {year:v.year-1,month:11} : {...v,month:v.month-1});
  const next = () => setView(v => v.month === 11 ? {year:v.year+1,month:0} : {...v,month:v.month+1});
  
  const isPast = (d) => {
    const date = new Date(view.year, view.month, d);
    const min = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
    return date < min;
  };
  
  const isToday = d => {
    const today = new Date();
    return d===today.getDate() && view.month===today.getMonth() && view.year===today.getFullYear();
  };
  
  const isSel = d => selectedDate && d===selectedDate.getDate() && view.month===selectedDate.getMonth() && view.year===selectedDate.getFullYear();

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
              className={`h_cal_d${isPast(d)?" h_past":""}${isToday(d)?" h_today":""}${isSel(d)?" h_sel":""}`}
              onClick={() => !isPast(d) && onSelect(new Date(view.year,view.month,d))}>
              {d}
            </div>
        )}
      </div>
    </div>
  );
}

export default function BookRoom() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [bookingRef] = useState(genRef);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  
  const [roomType, setRoomType] = useState("");
  const [requests, setRequests] = useState("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState({});

  const roomTypes = [
    {id:"deluxe", icon:<IoBedOutline />, name:"Deluxe Room",  desc:"City view, King bed", price:"$250/night"},
    {id:"suite",  icon:<MdOutlineKingBed />, name:"Executive Suite", desc:"Spacious, Premium decor", price:"$450/night"},
    {id:"villa",  icon:<MdOutlineVilla />, name:"Ocean Villa",   desc:"Private pool, Beachfront", price:"$800/night"},
    {id:"pres",   icon:<MdOutlineVpnKey />, name:"Presidential",  desc:"Ultimate luxury, Butler", price:"$1500/night"},
  ];

  const validate1 = () => {
    const e = {};
    if (!firstName.trim()) e.firstName = "First name required";
    if (!lastName.trim()) e.lastName = "Last name required";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!phone.trim()) e.phone = "Phone required";
    if (!checkIn) e.checkIn = "Check-in date required";
    if (!checkOut) e.checkOut = "Check-out date required";
    if (checkIn && checkOut && checkOut <= checkIn) e.checkOut = "Check-out must be after check-in";
    setErrors(e); return !Object.keys(e).length;
  };

  const validate2 = () => {
    const e = {};
    if (!roomType) e.roomType = "Please select a room type";
    if (!agree) e.agree = "Please accept our policy";
    setErrors(e); return !Object.keys(e).length;
  };

  const goNext = () => { 
    if (step===1 && validate1()) setStep(2); 
    if (step===2 && validate2()) setStep(3); 
  };
  
  const submit = e => { e.preventDefault(); if (!agree) return; setSubmitted(true); };
  
  const fmtDate = d => d ? d.toLocaleDateString("en-US",{weekday:"short",month:"long",day:"numeric",year:"numeric"}) : null;
  
  const reset = () => {
    setSubmitted(false); setStep(1); setFirstName(""); setLastName(""); setEmail(""); setPhone("");
    setCheckIn(null); setCheckOut(null); setAdults(2); setChildren(0);
    setRoomType(""); setRequests(""); setAgree(false); setErrors({});
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
                    <div className="h_card_title">Room Reservation</div>
                    <div className="h_card_sub">
                      {step===1?"Guest details & dates":step===2?"Room selection":"Review & confirm"}
                    </div>
                  </div>
                  <StepIndicator current={step} />
                </div>

                <div className={`h_success${submitted?" h_show":""}`}>
                  <div className="h_success_ring"><span className="h_success_ico">✓</span></div>
                  <div className="h_success_ttl">Booking Confirmed</div>
                  <p className="h_success_msg">
                    Your luxury stay has been booked. A confirmation email will be sent to{" "}
                    <strong style={{color:"var(--h-champ-lt)"}}>{email}</strong> shortly.{" "}
                    We look forward to your arrival.
                  </p>
                  <div className="h_ref">Booking Ref: {bookingRef}</div>
                  <button className="h_again_btn" onClick={reset}>← Make Another Booking</button>
                </div>

                {!submitted && (
                  <form onSubmit={submit} noValidate>
                    {step === 1 && (
                      <div className="h_fbody">
                        <div className="h_fsec">
                          <div className="h_sec_lbl">Personal Information</div>
                          <div className="h_row_2">
                            <div className="h_field">
                              <label className="h_label">First Name</label>
                              <input className={`h_input${errors.firstName?" h_err":""}`} type="text" placeholder="Alexandre" value={firstName} onChange={e=>setFirstName(e.target.value)} />
                              {errors.firstName && <div className="h_err_msg">{errors.firstName}</div>}
                            </div>
                            <div className="h_field">
                              <label className="h_label">Last Name</label>
                              <input className={`h_input${errors.lastName?" h_err":""}`} type="text" placeholder="Dupont" value={lastName} onChange={e=>setLastName(e.target.value)} />
                              {errors.lastName && <div className="h_err_msg">{errors.lastName}</div>}
                            </div>
                            <div className="h_field">
                              <label className="h_label">Email Address</label>
                              <input className={`h_input${errors.email?" h_err":""}`} type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
                              {errors.email && <div className="h_err_msg">{errors.email}</div>}
                            </div>
                            <div className="h_field">
                              <label className="h_label">Phone Number</label>
                              <input className={`h_input${errors.phone?" h_err":""}`} type="tel" placeholder="+1 (555) 000-0000" value={phone} onChange={e=>setPhone(e.target.value)} />
                              {errors.phone && <div className="h_err_msg">{errors.phone}</div>}
                            </div>
                          </div>
                        </div>

                        <div className="h_fsec">
                          <div className="h_sec_lbl">Stay Duration</div>
                          <div className="h_row_2">
                            <div className="h_field">
                              <label className="h_label">Check-In Date</label>
                              <CalendarPicker selectedDate={checkIn} onSelect={d=>{setCheckIn(d); if(checkOut && d >= checkOut) setCheckOut(null);}} />
                              {errors.checkIn && <div className="h_err_msg">{errors.checkIn}</div>}
                            </div>
                            <div className="h_field">
                              <label className="h_label">Check-Out Date</label>
                              <CalendarPicker selectedDate={checkOut} onSelect={setCheckOut} minDate={checkIn || new Date()} />
                              {errors.checkOut && <div className="h_err_msg">{errors.checkOut}</div>}
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
                          {errors.roomType && <div className="h_err_msg" style={{marginBottom:".6rem"}}>{errors.roomType}</div>}
                          <div className="h_areas">
                            {roomTypes.map(r=>(
                              <div key={r.id} className={`h_area${roomType===r.id?" h_asel":""}`}
                                onClick={()=>{setRoomType(r.id);setErrors(p=>({...p,roomType:null}));}}>
                                <span className="h_area_ico">{r.icon}</span>
                                <div className="h_area_name">{r.name}</div>
                                <div className="h_area_desc">{r.desc}</div>
                                <div className="h_area_price" style={{color:"var(--h-champ)", fontSize:".75rem", marginTop:".5rem"}}>{r.price}</div>
                                <div className="h_area_chk">✓</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="h_fsec">
                          <div className="h_sec_lbl">Special Requests</div>
                          <div className="h_field">
                            <label className="h_label">Preferences, allergies, or other notes</label>
                            <textarea className="h_textarea" placeholder="E.g. high floor, early check-in, anniversary setup…" value={requests} onChange={e=>setRequests(e.target.value)} />
                          </div>
                        </div>

                        <div className="h_fsec">
                          <label className="h_chk_wrap">
                            <input type="checkbox" className="h_chk" checked={agree}
                              onChange={e=>{setAgree(e.target.checked);setErrors(p=>({...p,agree:null}));}} />
                            <span className="h_chk_lbl">I agree to the <a href="#">Stay Policy</a> and understand our cancellation terms.</span>
                          </label>
                          {errors.agree && <div className="h_err_msg">{errors.agree}</div>}
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="h_fbody">
                        <div className="h_fsec">
                          <div className="h_sec_lbl">Booking Summary</div>
                          {[
                            ["Guest",`${firstName} ${lastName}`],
                            ["Duration",`${fmtDate(checkIn)} — ${fmtDate(checkOut)}`],
                            ["Occupancy",`${adults} Adults, ${children} Children`],
                            ["Room Type",roomTypes.find(r=>r.id===roomType)?.name||"—"],
                            ["Price",roomTypes.find(r=>r.id===roomType)?.price||"—"],
                            ["Requests",requests||"None"],
                          ].map(([k,v])=>(
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
                        {step>1 && <button type="button" className="h_btn_back" onClick={()=>setStep(s=>s-1)}>← Back</button>}
                        {step<3
                          ? <button type="button" className="h_btn_prime" onClick={goNext}>Continue <span className="h_btn_arr">→</span></button>
                          : <button type="submit" className="h_btn_prime">Confirm Stay <span className="h_btn_arr">✓</span></button>
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
                      {key:"Guest", val:firstName||lastName?`${firstName} ${lastName}`.trim():null},
                      {key:"Check-In",  val:fmtDate(checkIn)},
                      {key:"Check-Out", val:fmtDate(checkOut)},
                      {key:"Adults", val:adults},
                      {key:"Children", val:children},
                      {key:"Room",  val:roomType?roomTypes.find(r=>r.id===roomType)?.name:null},
                    ].map(({key,val})=>(
                      <div className="h_p_row" key={key}>
                        <span className="h_p_k">{key}</span>
                        <span className={`h_p_v${!val?" h_empty":""}`}>{val||"Not selected"}</span>
                      </div>
                    ))}
                    <div className="h_policy" style={{marginTop:"1.1rem"}}>
                      <div className="h_policy_t">Guest Policy</div>
                      <p className="h_policy_p">Valid ID required at check-in. Minimum age for check-in is 21.</p>
                    </div>
                  </div>
                </div>

                <div className="h_info_cards">
                  {[
                    {icon:<FaRegBuilding />,title:"Location",    text:"12 Rue de la Paix, Paris\nValet parking available"},
                    {icon:<FaSwimmingPool />,title:"Facilities",  text:"Pool, Spa, Fitness Center\n24/7 Room Service"},
                    {icon:<FaRegCreditCard />,title:"Contact Us",  text:"+1 (800) 555-NOIR\nstay@lanoire.com"},
                  ].map(c=>(
                    <div className="h_info_card" key={c.title}>
                      <div className="h_info_ico">{c.icon}</div>
                      <div>
                        <div className="h_info_ttl">{c.title}</div>
                        <div className="h_info_txt" style={{whiteSpace:"pre-line"}}>{c.text}</div>
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
