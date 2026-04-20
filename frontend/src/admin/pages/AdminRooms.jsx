import { useState, useEffect } from "react";
import "../../styleadmin/AdminRooms.css";
import DeleteIconButton from "../components/DeleteIconButton";
import { useRooms } from "../../contexts/RoomContext";

const STATUS_LABELS = { "Available": "Available", "Occupied": "Occupied", "Reserved": "Reserved", "Maintenance": "Maintenance" };
const STATUS_CYCLE = ["Available", "Occupied", "Reserved", "Maintenance"];

const EMPTY_FORM = {
    roomNumber: "",
    floor: "1",
    roomType: "",
    capacity_adults: "1",
    capacity_childs: "0",
    status: "Available"
};

/* ─── ICONS ─────────────────────────────────────────── */

const IcEdit = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);


const IcPlus = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const IcClose = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const IcFilter = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
);

/* ─── STATUS BADGE ──────────────────────────────────── */

function StatusBadge({ status, onClick }) {
    const statusClass = status?.toLowerCase().replace(/ /g, "-") || "available";
    return (
        <span
            className={`rooms__status_badge rooms__status_badge--${statusClass}`}
            onClick={onClick}
            title="Click to cycle status"
        >
            {STATUS_LABELS[status] || status}
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

function RoomForm({ initial, onSave, onCancel, roomTypes }) {
    const [form, setForm] = useState(initial);
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    return (
        <div>
            <div className="rooms__form_grid2">
                <div>
                    <label className="rooms__form_label">Room number</label>
                    <input className="rooms__form_input" value={form.roomNumber} onChange={e => set("roomNumber", e.target.value)} placeholder="e.g. 205" />
                </div>
                <div>
                    <label className="rooms__form_label">Floor</label>
                    <input className="rooms__form_input" type="number" min="1" max="20" value={form.floor} onChange={e => set("floor", e.target.value)} />
                </div>
            </div>

            <div className="rooms__form_row">
                <label className="rooms__form_label">Room type</label>
                <select
                    className="rooms__form_select"
                    value={form.roomType}
                    onChange={e => set("roomType", e.target.value)}
                >
                    <option value="">Select Room Type</option>

                    {roomTypes.length === 0 ? (
                        <option disabled>No room types available</option>
                    ) : (
                        roomTypes
                            .filter(rt => rt.status?.toLowerCase() === "available")
                            .map((rt) => {
                                const label = rt.display_name || rt.name || "Unnamed Room Type";
                                return (
                                    <option key={rt._id} value={rt._id}>
                                        {label} (₹{(rt.price_per_night || 0).toLocaleString("en-IN")}/night)
                                    </option>
                                );
                            })
                    )}
                </select>
            </div>

            <label className="rooms__form_label">Capacity (guests)</label>
            <div className="rooms__form_grid2">
                <div>
                    <label className="rooms__form_label">Adults</label>
                    <input className="rooms__form_input" type="number" min="1" max="10" value={form.capacity_adults} onChange={e => set("capacity_adults", e.target.value)} />
                </div>
                <div>
                    <label className="rooms__form_label">Childs</label>
                    <input className="rooms__form_input" type="number" min="0" max="10" value={form.capacity_childs} onChange={e => set("capacity_childs", e.target.value)} />
                </div>
            </div>

            <div className="rooms__form_row">
                <label className="rooms__form_label">Status</label>
                <select className="rooms__form_select" value={form.status} onChange={e => set("status", e.target.value)}>
                    {Object.keys(STATUS_LABELS).map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
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
    const { rooms, roomTypes, loading, getRooms, getRoomTypes, addRoom, updateRoom, deleteRoom } = useRooms();
    const [filterType, setFilterType] = useState("All Types");
    const [filterStatus, setFilterStatus] = useState("All");
    const [search, setSearch] = useState("");
    const [modal, setModal] = useState(null);
    const [editForm, setEditForm] = useState(EMPTY_FORM);

    useEffect(() => {
        console.log("AdminRooms - useEffect - calling getRooms and getRoomTypes");
        getRooms();
        getRoomTypes();
    }, [getRooms, getRoomTypes]);

    useEffect(() => {
        console.log("AdminRooms - roomTypes updated:", roomTypes);
        console.log("AdminRooms - rooms updated:", rooms);
    }, [roomTypes, rooms]);

    /* stats */
    const total = rooms.length;
    const available = rooms.filter(r => r.status === "Available").length;
    const occupied = rooms.filter(r => r.status === "Occupied").length;
    const revenue = rooms.filter(r => r.status === "Occupied").reduce((s, r) => s + (r.roomType?.price_per_night || 0), 0);

    /* filtered list */
    const filtered = rooms.filter(r => {
        const roomTypeName = r.roomType?.display_name || r.roomType?.name || "";
        const matchType = filterType === "All Types" || roomTypeName === filterType;
        const matchStatus = filterStatus === "All" || r.status === filterStatus;
        const matchSearch = !search || r.roomNumber.includes(search) || roomTypeName.toLowerCase().includes(search.toLowerCase());
        return matchType && matchStatus && matchSearch;
    });

    /* modal helpers */
    const openAdd = () => { setEditForm(EMPTY_FORM); setModal({ mode: "add" }); };
    const openEdit = (room) => {
        setEditForm({
            ...room,
            roomType: room.roomType?._id || ""
        });
        setModal({ mode: "edit", room });
    };
    const openDel = (room) => setModal({ mode: "delete", room });
    const openView = (room) => setModal({ mode: "view", room });
    const closeModal = () => setModal(null);

    const handleSave = async (form) => {
        const payload = {
            ...form,
            floor: String(form.floor),
            capacity_adults: Number(form.capacity_adults),
            capacity_childs: Number(form.capacity_childs)
        };

        let result;
        if (modal.mode === "add") {
            result = await addRoom(payload);
        } else {
            result = await updateRoom(modal.room._id, payload);
        }

        if (result.success) {
            alert(modal.mode === "add" ? "Room added successfully!" : "Room updated successfully!");
            closeModal();
        } else {
            alert(result.error || "Failed to save room");
        }
    };

    const handleDelete = async () => {
        const result = await deleteRoom(modal.room._id);
        if (result.success) {
            alert("Room deleted successfully!");
            closeModal();
        } else {
            alert(result.error || "Failed to delete room");
        }
    };

    const cycleStatus = async (room) => {
        const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(room.status) + 1) % STATUS_CYCLE.length];
        await updateRoom(room._id, { status: next });
    };

    const hasFilter = filterType !== "All Types" || filterStatus !== "All" || search;
    const roomTypeOptions = ["All Types", ...roomTypes.map(rt => rt.display_name || rt.name)];

    return (
        <div className="rooms">

            {/* PAGE HEADER */}
            <div className="rooms__header">
                <div className="rooms__header_left">
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
                    <div className="rooms__stat_sub">{total > 0 ? Math.round(available / total * 100) : 0}% of inventory</div>
                </div>
                <div className="rooms__stat">
                    <div className="rooms__stat_label">Occupied</div>
                    <div className="rooms__stat_value">{occupied}</div>
                    <div className="rooms__stat_sub">{total > 0 ? Math.round(occupied / total * 100) : 0}% occupancy</div>
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
                    {roomTypeOptions.map(t => <option key={t}>{t}</option>)}
                </select>
                <select className="rooms__select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                    <option value="All">All statuses</option>
                    {Object.entries(STATUS_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
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
                                <th>Adults</th>
                                <th>Childs</th>
                                <th>Price / night</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="rooms__empty">Loading rooms...</td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="rooms__empty">No rooms match your filters</td>
                                </tr>
                            ) : filtered.map(room => (
                                <tr key={room._id} onClick={() => openView(room)}>
                                    <td className="rooms__td_number">#{room.roomNumber}</td>
                                    <td>
                                        {typeof room.roomType === "object"
                                            ? (room.roomType.display_name || room.roomType.name)
                                            : roomTypes.find(rt => rt._id === room.roomType)?.display_name ||
                                            roomTypes.find(rt => rt._id === room.roomType)?.name ||
                                            "-"}
                                    </td>
                                    <td>{room.floor}</td>
                                    <td>{room.capacity_adults}</td>
                                    <td>{room.capacity_childs}</td>
                                    <td className="rooms__td_price">₹{(room.roomType?.price_per_night || 0).toLocaleString("en-IN")}</td>
                                    <td onClick={e => { e.stopPropagation(); cycleStatus(room); }}>
                                        <StatusBadge status={room.status} />
                                    </td>
                                    <td onClick={e => e.stopPropagation()}>
                                        <div className="d-flex" style={{ gap: "6px" }}>
                                            <button className="rooms__icon_btn" title="Edit room" onClick={() => openEdit(room)}>
                                                <IcEdit />
                                            </button>
                                            <DeleteIconButton title="Delete room" onClick={() => openDel(room)} />
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
                {Object.entries(STATUS_LABELS).map(([key, label]) => {
                    const statusClass = key.toLowerCase().replace(/ /g, "-");
                    return (
                        <div key={key} className="rooms__legend_item">
                            <span className={`rooms__legend_dot rooms__legend_dot--${statusClass}`} />
                            {label}
                        </div>
                    );
                })}
                <span className="rooms__legend_hint">Click status badge to cycle</span>
            </div>

            {/* ADD / EDIT MODAL */}
            {(modal?.mode === "add" || modal?.mode === "edit") && (
                <Modal
                    title={modal.mode === "add" ? "Add new room" : `Edit room #${modal.room?.roomNumber}`}
                    onClose={closeModal}
                >
                    <RoomForm initial={editForm} onSave={handleSave} onCancel={closeModal} roomTypes={roomTypes} />
                </Modal>
            )}

            {/* DELETE MODAL */}
            {modal?.mode === "delete" && (
                <Modal title="Remove room" onClose={closeModal}>
                    <p className="rooms__delete_msg">
                        Are you sure you want to remove <strong>Room #{modal.room.roomNumber}</strong> ({modal.room.roomType?.display_name || modal.room.roomType?.name})? This action cannot be undone.
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
                const roomTypeName = r.roomType?.display_name || r.roomType?.name || "-";
                return (
                    <Modal title={`Room #${r.roomNumber} — ${roomTypeName}`} onClose={closeModal}>
                        <div className="rooms__detail_grid">
                            {[
                                ["Floor", r.floor],
                                ["Adults", `${r.capacity_adults} guest${r.capacity_adults > 1 ? "s" : ""}`],
                                ["Childs", `${r.capacity_childs} guest${r.capacity_childs > 1 ? "s" : ""}`],
                                ["Price / night", `₹${(r.roomType?.price_per_night || 0).toLocaleString("en-IN")}`],
                                ["Status", <StatusBadge key="s" status={r.status} />],
                            ].map(([label, val]) => (
                                <div key={label} className="rooms__detail_card">
                                    <div className="rooms__detail_card_label">{label}</div>
                                    <div className="rooms__detail_card_value">{val}</div>
                                </div>
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
