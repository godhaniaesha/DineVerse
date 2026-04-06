import { useState } from "react";
import "../../styleadmin/AdminRooms.css";

/* ─── DATA ─────────────────────────────────────────── */

const INITIAL_ROOMS = [
  { id: 1,  number: "101", type: "Deluxe",  floor: 1, capacity: 2, price: 280, status: "available",   amenities: ["King Bed", "Ocean View", "Jacuzzi", "Mini Bar"], img: "", description: "A luxurious deluxe room with ocean view.", features: [{ icon: "bed", title: "King Bed" }, { icon: "view", title: "Ocean View" }] },
  { id: 2,  number: "102", type: "Suite",  floor: 1, capacity: 2, price: 140, status: "occupied",    amenities: ["Queen Bed", "Garden View", "Mini Bar"], img: "", description: "Comfortable suite with garden view.", features: [{ icon: "bed", title: "Queen Bed" }, { icon: "view", title: "Garden View" }] },
  { id: 3,  number: "201", type: "Deluxe",  floor: 2, capacity: 2, price: 290, status: "available",   amenities: ["King Bed", "City View", "Jacuzzi", "Mini Bar"], img: "", description: "Deluxe room with city view.", features: [{ icon: "bed", title: "King Bed" }, { icon: "view", title: "City View" }] },
  { id: 4,  number: "202", type: "Presidential",   floor: 2, capacity: 4, price: 340, status: "maintenance", amenities: ["Twin Beds", "Bunk Bed", "Garden View"], img: "", description: "Presidential suite for special occasions.", features: [{ icon: "bed", title: "Twin Beds" }, { icon: "view", title: "Garden View" }] },
  { id: 5,  number: "203", type: "Suite",  floor: 2, capacity: 2, price: 140, status: "available",   amenities: ["Double Bed", "City View"], img: "", description: "Standard suite with city view.", features: [{ icon: "bed", title: "Double Bed" }, { icon: "view", title: "City View" }] },
  { id: 6,  number: "301", type: "Presidential",     floor: 3, capacity: 4, price: 620, status: "occupied",    amenities: ["King Bed", "Panoramic View", "Jacuzzi", "Butler", "Terrace"], img: "", description: "Luxurious presidential room.", features: [{ icon: "bed", title: "King Bed" }, { icon: "view", title: "Panoramic View" }] },
  { id: 7,  number: "302", type: "Suite",  floor: 3, capacity: 2, price: 380, status: "available",   amenities: ["King Bed", "Ocean View", "Lounge Area", "Mini Bar"], img: "", description: "Suite with ocean view and lounge.", features: [{ icon: "bed", title: "King Bed" }, { icon: "view", title: "Ocean View" }] },
  { id: 8,  number: "303", type: "Deluxe",  floor: 3, capacity: 1, price: 120, status: "reserved",    amenities: ["Single Bed", "City View"], img: "", description: "Deluxe single room.", features: [{ icon: "bed", title: "Single Bed" }, { icon: "view", title: "City View" }] },
  { id: 9,  number: "401", type: "Presidential",     floor: 4, capacity: 4, price: 650, status: "available",   amenities: ["King Bed", "Panoramic View", "Jacuzzi", "Butler", "Terrace", "Chef"], img: "", description: "Top presidential suite.", features: [{ icon: "bed", title: "King Bed" }, { icon: "view", title: "Panoramic View" }] },
  { id: 10, number: "402", type: "Suite",  floor: 4, capacity: 2, price: 390, status: "reserved",    amenities: ["King Bed", "Ocean View", "Lounge Area"], img: "", description: "Suite with lounge area.", features: [{ icon: "bed", title: "King Bed" }, { icon: "view", title: "Ocean View" }] },
];

const TYPES    = ["All Types", "Deluxe", "Suite", "Presidential"];
const STATUSES = ["All", "available", "occupied", "reserved", "maintenance"];
const STATUS_LABELS = { available: "Available", occupied: "Occupied", reserved: "Reserved", maintenance: "Maintenance" };
const STATUS_CYCLE  = ["available", "occupied", "reserved", "maintenance"];

const EMPTY_FORM = {
  number: "", type: "Deluxe", floor: "1",
  capacity: "2", price: "", status: "available", amenities: "",
  img: "", description: "", features: "",
};

/* ─── ICONS ─────────────────────────────────────────── */

const IcEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IcTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);

const IcPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IcClose = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IcRoom = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18M3 21V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16M9 21V11h6v10"/>
  </svg>
);

const IcFilter = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

/* ─── STATUS BADGE ──────────────────────────────────── */

function StatusBadge({ status, onClick }) {
  return (
    <span
      className={`rooms__status_badge rooms__status_badge--${status}`}
      onClick={onClick}
      title="Click to cycle status"
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

/* ─── MODAL WRAPPER ─────────────────────────────────── */

function Modal({ title, onClose, children }) {
  return (
    <>
      <div className="rooms__modal_overlay" onClick={onClose} />
      <div className="rooms__modal_box">
        <div className="rooms__modal_head">
          <span className="rooms__modal_title">{title}</span>
          <button className="rooms__modal_close" onClick={onClose} aria-label="Close">
            <IcClose />
          </button>
        </div>
        {children}
      </div>
    </>
  );
}

/* ─── ROOM FORM ─────────────────────────────────────── */

function RoomForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <div className="rooms__form_grid2">
        <div>
          <label className="rooms__form_label">Room number</label>
          <input className="rooms__form_input" value={form.number} onChange={e => set("number", e.target.value)} placeholder="e.g. 205" />
        </div>
        <div>
          <label className="rooms__form_label">Floor</label>
          <input className="rooms__form_input" type="number" min="1" max="20" value={form.floor} onChange={e => set("floor", e.target.value)} />
        </div>
      </div>

      <div className="rooms__form_row">
        <label className="rooms__form_label">Room type</label>
        <select className="rooms__form_select" value={form.type} onChange={e => set("type", e.target.value)}>
          {TYPES.slice(1).map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

        <label className="rooms__form_label">Capacity (guests)</label>
      <div className="rooms__form_grid2">
        <div>
          <label className="rooms__form_label">Adults</label>
          <input className="rooms__form_input" type="number" min="1" max="10" value={form.capacity} onChange={e => set("capacity", e.target.value)} />
        </div>
        <div>
          <label className="rooms__form_label">Childs</label>
          <input className="rooms__form_input" type="number" min="1" max="10" value={form.capacity} onChange={e => set("capacity", e.target.value)} />
        </div>
      </div>

      <div className="rooms__form_row">
        <label className="rooms__form_label">Status</label>
        <select className="rooms__form_select" value={form.status} onChange={e => set("status", e.target.value)}>
          {STATUSES.slice(1).map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>

      <div className="rooms__form_actions">
        <button className="rooms__btn rooms__btn--ghost" onClick={onCancel}>Cancel</button>
        <button className="rooms__btn rooms__btn--primary" onClick={() => onSave(form)}>Save room</button>
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─────────────────────────────────────── */

export default function AdminRooms() {
  const [rooms, setRooms]               = useState(INITIAL_ROOMS);
  const [filterType, setFilterType]     = useState("All Types");
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch]             = useState("");
  const [modal, setModal]               = useState(null);
  const [editForm, setEditForm]         = useState(EMPTY_FORM);

  /* stats */
  const total     = rooms.length;
  const available = rooms.filter(r => r.status === "available").length;
  const occupied  = rooms.filter(r => r.status === "occupied").length;
  const revenue   = rooms.filter(r => r.status === "occupied").reduce((s, r) => s + Number(r.price), 0);

  /* filtered list */
  const filtered = rooms.filter(r => {
    const matchType   = filterType === "All Types" || r.type === filterType;
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    const matchSearch = !search || r.number.includes(search) || r.type.toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  /* modal helpers */
  const openAdd    = ()     => { setEditForm(EMPTY_FORM); setModal({ mode: "add" }); };
  const openEdit   = (room) => { setEditForm({ ...room, amenities: room.amenities.join(", "), features: room.features.map(f => `${f.icon}:${f.title}`).join(", ") }); setModal({ mode: "edit", room }); };
  const openDel    = (room) => setModal({ mode: "delete", room });
  const openView   = (room) => setModal({ mode: "view", room });
  const closeModal = ()     => setModal(null);

  const handleSave = (form) => {
    const amenities = form.amenities.split(",").map(a => a.trim()).filter(Boolean);
    const features = form.features.split(",").map(f => {
      const [icon, title] = f.split(":").map(s => s.trim());
      return icon && title ? { icon, title } : null;
    }).filter(Boolean);
    const base = { ...form, floor: Number(form.floor), capacity: Number(form.capacity), price: Number(form.price), amenities, features };
    if (modal.mode === "add") {
      setRooms(rs => [...rs, { ...base, id: Date.now() }]);
    } else {
      setRooms(rs => rs.map(r => r.id === modal.room.id ? { ...r, ...base } : r));
    }
    closeModal();
  };

  const handleDelete = () => {
    setRooms(rs => rs.filter(r => r.id !== modal.room.id));
    closeModal();
  };

  const cycleStatus = (room) => {
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(room.status) + 1) % STATUS_CYCLE.length];
    setRooms(rs => rs.map(r => r.id === room.id ? { ...r, status: next } : r));
  };

  const hasFilter = filterType !== "All Types" || filterStatus !== "All" || search;

  return (
    <div className="rooms">

      {/* PAGE HEADER */}
      <div className="rooms__header">
        <div className="rooms__header_left">
          <div className="rooms__header_icon"><IcRoom /></div>
          <div>
            <h2 className="rooms__header_title">Rooms</h2>
            <p className="rooms__header_sub">Manage room types, pricing and availability</p>
          </div>
        </div>
        <button className="rooms__add_btn" onClick={openAdd}>
          <IcPlus /> Add room
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="rooms__stats">
        <div className="rooms__stat">
          <div className="rooms__stat_label">Total rooms</div>
          <div className="rooms__stat_value">{total}</div>
        </div>
        <div className="rooms__stat">
          <div className="rooms__stat_label">Available</div>
          <div className="rooms__stat_value">{available}</div>
          <div className="rooms__stat_sub">{Math.round(available / total * 100)}% of inventory</div>
        </div>
        <div className="rooms__stat">
          <div className="rooms__stat_label">Occupied</div>
          <div className="rooms__stat_value">{occupied}</div>
          <div className="rooms__stat_sub">{Math.round(occupied / total * 100)}% occupancy</div>
        </div>
        <div className="rooms__stat">
          <div className="rooms__stat_label">Nightly revenue</div>
          <div className="rooms__stat_value">₹{revenue.toLocaleString("en-IN")}</div>
          <div className="rooms__stat_sub">occupied rooms</div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="rooms__filters">
        <span className="rooms__filter_label"><IcFilter /> Filters</span>
        <input
          className="rooms__search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search room or type…"
        />
        <select className="rooms__select" value={filterType} onChange={e => setFilterType(e.target.value)}>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
        <select className="rooms__select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          {STATUSES.map(s => (
            <option key={s} value={s}>{s === "All" ? "All statuses" : STATUS_LABELS[s]}</option>
          ))}
        </select>
        {hasFilter && (
          <button className="rooms__clear_btn" onClick={() => { setFilterType("All Types"); setFilterStatus("All"); setSearch(""); }}>
            Clear
          </button>
        )}
        <span className="rooms__count">{filtered.length} room{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* TABLE */}
      <div className="rooms__table_wrap">
        <div className="rooms__table_scroll">
          <table className="rooms__table">
            <thead>
              <tr>
                <th>Room</th>
                <th>Type</th>
                <th>Floor</th>
                <th>Guests</th>
                <th>Price / night</th>
                <th>Amenities</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="rooms__empty">No rooms match your filters</td>
                </tr>
              ) : filtered.map(room => (
                <tr key={room.id} onClick={() => openView(room)}>
                  <td className="rooms__td_number">#{room.number}</td>
                  <td>{room.type}</td>
                  <td>{room.floor}</td>
                  <td>{room.capacity}</td>
                  <td className="rooms__td_price">₹{Number(room.price).toLocaleString("en-IN")}</td>
                  <td>
                    <div className="rooms__amenities">
                      {room.amenities.slice(0, 2).map(a => (
                        <span key={a} className="rooms__amenity_pill">{a}</span>
                      ))}
                      {room.amenities.length > 2 && (
                        <span className="rooms__amenity_more">+{room.amenities.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td onClick={e => { e.stopPropagation(); cycleStatus(room); }}>
                    <StatusBadge status={room.status} />
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="rooms__actions_cell">
                      <button className="rooms__icon_btn" title="Edit room" onClick={() => openEdit(room)}>
                        <IcEdit />
                      </button>
                      <button className="rooms__icon_btn rooms__icon_btn--danger" title="Delete room" onClick={() => openDel(room)}>
                        <IcTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* LEGEND */}
      <div className="rooms__legend">
        {STATUSES.slice(1).map(s => (
          <div key={s} className="rooms__legend_item">
            <span className={`rooms__legend_dot rooms__legend_dot--${s}`} />
            {STATUS_LABELS[s]}
          </div>
        ))}
        <span className="rooms__legend_hint">Click status badge to cycle</span>
      </div>

      {/* ADD / EDIT MODAL */}
      {(modal?.mode === "add" || modal?.mode === "edit") && (
        <Modal
          title={modal.mode === "add" ? "Add new room" : `Edit room #${modal.room.number}`}
          onClose={closeModal}
        >
          <RoomForm initial={editForm} onSave={handleSave} onCancel={closeModal} />
        </Modal>
      )}

      {/* DELETE MODAL */}
      {modal?.mode === "delete" && (
        <Modal title="Remove room" onClose={closeModal}>
          <p className="rooms__delete_msg">
            Are you sure you want to remove <strong>Room #{modal.room.number}</strong> ({modal.room.type})? This action cannot be undone.
          </p>
          <div className="rooms__form_actions">
            <button className="rooms__btn rooms__btn--ghost" onClick={closeModal}>Cancel</button>
            <button className="rooms__btn rooms__btn--danger" onClick={handleDelete}>Remove room</button>
          </div>
        </Modal>
      )}

      {/* VIEW DETAIL MODAL */}
      {modal?.mode === "view" && (() => {
        const r = modal.room;
        return (
          <Modal title={`Room #${r.number} — ${r.type}`} onClose={closeModal}>
            <div className="rooms__detail_grid">
              {[
                ["Floor",         r.floor],
                ["Capacity",      `${r.capacity} guest${r.capacity > 1 ? "s" : ""}`],
                ["Price / night", `₹${Number(r.price).toLocaleString("en-IN")}`],
                ["Status",        <StatusBadge key="s" status={r.status} />],
              ].map(([label, val]) => (
                <div key={label} className="rooms__detail_card">
                  <div className="rooms__detail_card_label">{label}</div>
                  <div className="rooms__detail_card_value">{val}</div>
                </div>
              ))}
            </div>
            <div className="rooms__detail_amenities_label">Amenities</div>
            <div className="rooms__detail_amenities">
              {r.amenities.map(a => (
                <span key={a} className="rooms__detail_amenity">{a}</span>
              ))}
            </div>
            <div className="rooms__form_actions">
              <button className="rooms__btn rooms__btn--ghost" onClick={closeModal}>Close</button>
              <button className="rooms__btn rooms__btn--primary" onClick={() => { closeModal(); openEdit(r); }}>
                <IcEdit /> Edit room
              </button>
            </div>
          </Modal>
        );
      })()}

    </div>
  );
}