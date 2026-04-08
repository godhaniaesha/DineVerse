import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import DeleteIconButton from "../components/DeleteIconButton";

const INITIAL_ROOM_TYPES = [
    { id: 1, name: "Standard Room", roomType: "Standard", description: "Comfortable room with basic amenities", price: 4500, image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80", features: [{ icon: "🛏️", name: "Queen Bed" }, { icon: "📺", name: "Smart TV" }, { icon: "❄️", name: "AC" }] },
    { id: 2, name: "Deluxe Room", roomType: "Deluxe", description: "Spacious room with premium features", price: 7500, image: "https://www.fourseasons.com/alt/img-opt/~75.701.0,0000-430,5202-3000,0000-1687,5000/publish/content/dam/fourseasons/images/web/DIF/DIF_674_original.jpg", features: [{ icon: "🛏️", name: "King Bed" }, { icon: "🛁", name: "Jacuzzi" }, { icon: "🌃", name: "City View" }] },
    { id: 3, name: "Luxury Suite", roomType: "Suite", description: "Premier suite with panoramic views", price: 12000, image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&q=80", features: [{ icon: "👑", name: "Premium Service" }, { icon: "🏊", name: "Private Pool" }, { icon: "🍷", name: "Complimentary Wine" }] },
];

const EMPTY_FORM = { name: "", roomType: "", description: "", price: "", image: "", features: [] };

function Modal({ title, onClose, children }) {
    return (
        <>
            <div className="rooms__modal_overlay" onClick={onClose} />
            <div className="rooms__modal_box" style={{ maxHeight: "90vh", overflowY: "auto" }}>
                <div className="rooms__modal_head"><span className="rooms__modal_title">{title}</span><button className="rooms__modal_close" onClick={onClose}>x</button></div>
                {children}
            </div>
        </>
    );
}

export default function AdminRoomTypes() {
    const [roomTypes, setRoomTypes] = useState(INITIAL_ROOM_TYPES);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [newFeature, setNewFeature] = useState({ icon: "", name: "" });

    const openAdd = () => { setForm(EMPTY_FORM); setNewFeature({ icon: "", name: "" }); setModal({ mode: "add" }); };
    const openEdit = (room) => { setForm(room); setNewFeature({ icon: "", name: "" }); setModal({ mode: "edit", room }); };
    const openDelete = (room) => setModal({ mode: "delete", room });
    const close = () => setModal(null);

    const addFeature = () => {
        if (!newFeature.icon.trim() || !newFeature.name.trim()) return;
        setForm((f) => ({ ...f, features: [...f.features, newFeature] }));
        setNewFeature({ icon: "", name: "" });
    };

    const removeFeature = (index) => {
        setForm((f) => ({ ...f, features: f.features.filter((_, i) => i !== index) }));
    };

    const save = () => {
        if (!form.name.trim() || !form.roomType.trim() || !form.description.trim() || !form.price || !form.image.trim()) return;
        const payload = { ...form, price: Number(form.price) };
        if (modal.mode === "add") setRoomTypes((prev) => [...prev, { id: Date.now(), ...payload }]);
        if (modal.mode === "edit") setRoomTypes((prev) => prev.map((r) => (r.id === modal.room.id ? { ...r, ...payload } : r)));
        close();
    };

    const remove = () => { setRoomTypes((prev) => prev.filter((r) => r.id !== modal.room.id)); close(); };

    return (
        <div className="ad_page">
            <div className="rooms__header">
                <div><h2 className="ad_h2">Room Types</h2><p className="ad_p">Manage hotel room types with pricing and features.</p></div>
                <button className="rooms__add_btn" onClick={openAdd}>Add Room Type</button>
            </div>

            {/* Cards View */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px", marginBottom: "30px" }}>
                {roomTypes.map((room) => (
                    <div key={room.id} className="ad_card" style={{ minHeight: "430px", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden" }}>
                        <div>
                            <img src={room.image} alt={room.name} style={{ width: "100%", height: "220px", objectFit: "cover", marginBottom: "16px" }} />
                            <span className="ad_chip" style={{ marginBottom: "10px", display: "inline-block" }}>{room.roomType}</span>
                            <h3 className="ad_card__title" style={{ margin: "8px 0" }}>{room.name}</h3>
                            <p className="ad_p" style={{ fontSize: "14px", marginBottom: "16px", color: "#666" }}>{room.description}</p>
                            <div style={{ marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #eee" }}>
                                <span style={{ fontSize: "22px", fontWeight: "700", color: "#d4a373" }}>₹{room.price}</span>
                                <span style={{ fontSize: "12px", color: "#999", marginLeft: "8px" }}>per night</span>
                            </div>
                            <div style={{ marginBottom: "16px" }}>
                                <div style={{ fontSize: "12px", fontWeight: "700", color: "#666", marginBottom: "10px" }}>Features</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                                    {room.features.map((feat, idx) => (
                                        <span key={idx} style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", background: "#ddd", color: "#333", padding: "8px 10px", borderRadius: "999px" }}>{feat.icon} {feat.name}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "auto" }}>
                            <button className="rooms__icon_btn" title="Edit" onClick={() => openEdit(room)}><FiEdit2 /></button>
                            <DeleteIconButton title="Delete" onClick={() => openDelete(room)} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {(modal?.mode === "add" || modal?.mode === "edit") && (
                <Modal title={modal.mode === "add" ? "Add Room Type" : "Edit Room Type"} onClose={close}>
                    <div className="rooms__form_row"><label className="rooms__form_label">Room Type Name</label><input required className="rooms__form_input" value={form.roomType} onChange={(e) => setForm((f) => ({ ...f, roomType: e.target.value }))} placeholder="e.g., Standard, Deluxe, Suite" /></div>
                    <div className="rooms__form_row"><label className="rooms__form_label">Display Name</label><input required className="rooms__form_input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g., Standard Room" /></div>
                    <div className="rooms__form_row"><label className="rooms__form_label">Description</label><textarea className="rooms__form_input" rows="3" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Room description..." /></div>
                    <div className="rooms__form_grid2">
                        <div><label className="rooms__form_label">Price Per Night (₹)</label><input required type="number" className="rooms__form_input" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} /></div>
                        <div><label className="rooms__form_label">Image URL</label><input required className="rooms__form_input" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://..." /></div>
                    </div>

                    {/* Features Section */}
                    <div style={{ marginTop: "16px", padding: "12px", background: "#14101b", borderRadius: "6px" }}>
                        <label className="rooms__form_label">Features</label>
                        <div style={{ marginBottom: "12px", display: "flex", gap: "8px" }}>
                            <input className="rooms__form_input" placeholder="Icon (e.g., 🛏️)" style={{ flex: 1 }} value={newFeature.icon} onChange={(e) => setNewFeature((f) => ({ ...f, icon: e.target.value }))} maxLength="2" />
                            <input className="rooms__form_input" placeholder="Feature name (e.g., King Bed)" style={{ flex: 2 }} value={newFeature.name} onChange={(e) => setNewFeature((f) => ({ ...f, name: e.target.value }))} />
                            <button className="rooms__btn rooms__btn--primary" onClick={addFeature} style={{ whiteSpace: "nowrap" }}>+ Add</button>
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {form.features.map((feat, idx) => (
                                <span key={idx} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#14101b", padding: "6px 12px", borderRadius: "4px", border: "1px solid #9a6e3f" }}>
                                    {feat.icon} {feat.name}
                                    <button onClick={() => removeFeature(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ff4444", fontWeight: "bold" }}>×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="rooms__form_actions" style={{ marginTop: "20px" }} ><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button>
                        <button className="rooms__btn rooms__btn--primary" onClick={save}>Save</button></div>
                </Modal>
            )
            }

            {/* Delete Modal */}
            {modal?.mode === "delete" && <Modal title="Delete Room Type" onClose={close}><p className="rooms__delete_msg">Delete "{modal.room.name}" room type?</p><div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--danger" onClick={remove}>Delete</button></div></Modal>}
        </div >
    );
}
