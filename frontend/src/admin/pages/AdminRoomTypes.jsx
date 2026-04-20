import { useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import DeleteIconButton from "../components/DeleteIconButton";
import { useRooms } from "../../contexts/RoomContext";

const EMPTY_FORM = { name: "", display_name: "", description: "", price_per_night: "", features: [] };

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
    const { roomTypes, loading, getRoomTypes, addRoomType, updateRoomType, deleteRoomType } = useRooms();
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [newFeature, setNewFeature] = useState({ icon: "", name: "" });
    const [roomTypeImage, setRoomTypeImage] = useState(null);

    useEffect(() => {
        console.log("AdminRoomTypes - calling getRoomTypes");
        getRoomTypes();
    }, [getRoomTypes]);

    useEffect(() => {
        console.log("AdminRoomTypes - roomTypes updated:", roomTypes);
    }, [roomTypes]);

    const openAdd = () => { setForm(EMPTY_FORM); setNewFeature({ icon: "", name: "" }); setRoomTypeImage(null); setModal({ mode: "add" }); };
    const openEdit = (roomType) => { 
        setForm({ 
            ...roomType, 
            features: roomType.features?.map(f => ({ icon: f.icon || "", name: f.name || f })) || [] 
        }); 
        setNewFeature({ icon: "", name: "" }); 
        setRoomTypeImage(null);
        setModal({ mode: "edit", roomType }); 
    };
    const openDelete = (roomType) => setModal({ mode: "delete", roomType });
    const close = () => setModal(null);

    const addFeature = () => {
        if (!newFeature.icon.trim() || !newFeature.name.trim()) return;
        setForm((f) => ({ ...f, features: [...f.features, newFeature] }));
        setNewFeature({ icon: "", name: "" });
    };

    const removeFeature = (index) => {
        setForm((f) => ({ ...f, features: f.features.filter((_, i) => i !== index) }));
    };

    const save = async () => {
        console.log("Saving room type - form data:", form);
        console.log("Room type image:", roomTypeImage);
        
        if (!form.name.trim() || !form.display_name?.trim() || !form.description.trim() || !form.price_per_night) return;

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("display_name", form.display_name);
        formData.append("description", form.description);
        formData.append("price_per_night", form.price_per_night);
        formData.append("features", JSON.stringify(form.features));
        if (form.status) formData.append("status", form.status);
        if (roomTypeImage) {
            formData.append("image_url", roomTypeImage);
        }

        // Log formData content
        console.log("FormData entries:");
        for (let pair of formData.entries()) {
            console.log(pair[0] + ": " + pair[1]);
        }

        let result;
        if (modal.mode === "add") {
            result = await addRoomType(formData);
        } else {
            result = await updateRoomType(modal.roomType._id, formData);
        }

        if (result.success) {
            alert(modal.mode === "add" ? "Room type added successfully!" : "Room type updated successfully!");
            close();
        } else {
            alert(result.error || "Failed to save room type");
        }
    };

    const remove = async () => {
        console.log("AdminRoomTypes - remove - calling deleteRoomType with id:", modal.roomType._id);
        const result = await deleteRoomType(modal.roomType._id);
        console.log("AdminRoomTypes - remove - result:", result);
        
        if (result.success) {
            alert("Room type deleted successfully!");
            close();
        } else {
            alert(result.error || "Failed to delete room type");
        }
    };

    return (
        <div className="ad_page">
            <div className="rooms__header">
                <div><h2 className="ad_h2">Room Types</h2><p className="ad_p">Manage hotel room types with pricing and features.</p></div>
                <button className="rooms__add_btn" onClick={openAdd}>Add Room Type</button>
            </div>

            {/* Table View */}
            <div className="ad_table_wrap" style={{ marginTop: "20px" }}>
                <table className="ad_table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Display Name</th>
                            <th>Description</th>
                            <th>Price / Night</th>
                            <th>Features</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="rooms__empty">Loading room types...</td>
                            </tr>
                        ) : roomTypes.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="rooms__empty">No room types found</td>
                            </tr>
                        ) : (
                            roomTypes.map((roomType) => (
                                <tr key={roomType._id}>
                                    <td>
                                        {roomType.image_url ? (
                                            <img src={roomType.image_url} alt={roomType.name} style={{ width: "80px", height: "50px", objectFit: "cover", borderRadius: "6px" }} />
                                        ) : "-"}
                                    </td>
                                    <td>{roomType.name}</td>
                                    <td>{roomType.display_name || "-"}</td>
                                    <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{roomType.description || "-"}</td>
                                    <td>₹{Number(roomType.price_per_night).toLocaleString("en-IN")}</td>
                                    <td>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                            {roomType.features?.slice(0, 3).map((feat, idx) => (
                                                <span key={idx} style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", background: "#ddd", color: "#333", padding: "4px 8px", borderRadius: "999px" }}>
                                                    {feat.icon || ""} {feat.name || feat}
                                                </span>
                                            ))}
                                            {roomType.features?.length > 3 && <span style={{ fontSize: "12px", color: "#666" }}>+{roomType.features.length - 3}</span>}
                                        </div>
                                    </td>
                                    <td><span className="ad_chip">{roomType.status || "Active"}</span></td>
                                    <td>
                                        <div className="d-flex" style={{ gap: "6px" }}>
                                            <button className="rooms__icon_btn" title="Edit" onClick={() => openEdit(roomType)}><FiEdit2 /></button>
                                            <DeleteIconButton title="Delete" onClick={() => openDelete(roomType)} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {(modal?.mode === "add" || modal?.mode === "edit") && (
                <Modal title={modal.mode === "add" ? "Add Room Type" : "Edit Room Type"} onClose={close}>
                    <div className="rooms__form_row">
                        <label className="rooms__form_label">Room Type Image</label>
                        <input type="file" accept="image/*" className="rooms__form_input" onChange={(e) => setRoomTypeImage(e.target.files[0])} />
                    </div>
                    <div className="rooms__form_row"><label className="rooms__form_label">Room Type Name</label><input required className="rooms__form_input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g., Standard, Deluxe, Suite" /></div>
                    <div className="rooms__form_row"><label className="rooms__form_label">Display Name</label><input required className="rooms__form_input" value={form.display_name} onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))} placeholder="e.g., Standard Room" /></div>
                    <div className="rooms__form_row"><label className="rooms__form_label">Description</label><textarea className="rooms__form_input" rows="3" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Room description..." /></div>
                    <div className="rooms__form_grid2">
                        <div><label className="rooms__form_label">Price Per Night (₹)</label><input required type="number" className="rooms__form_input" value={form.price_per_night} onChange={(e) => setForm((f) => ({ ...f, price_per_night: e.target.value }))} /></div>
                        <div><label className="rooms__form_label">Status</label>
                            <select className="rooms__form_select" value={form.status || "Active"} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Available">Available</option>
                            </select>
                        </div>
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
            )}

            {/* Delete Modal */}
            {modal?.mode === "delete" && <Modal title="Delete Room Type" onClose={close}><p className="rooms__delete_msg">Delete "{modal.roomType.name}" room type?</p><div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--danger" onClick={remove}>Delete</button></div></Modal>}
        </div>
    );
}
