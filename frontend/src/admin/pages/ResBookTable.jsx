import { useState, useEffect } from "react";

const TABLES_STORAGE_KEY = "admin-res-tables";

const INITIAL_TABLES = [
  { id: 4, tableNo: "R1", area: "Restaurant", capacity: 6, status: "reserved", waiter: "" },
  { id: 5, tableNo: "R2", area: "Restaurant", capacity: 4, status: "occupied", waiter: "Jane Doe" },
  { id: 6, tableNo: "R3", area: "Restaurant", capacity: 8, status: "reserved", waiter: "" },
];

const EMPTY_FORM = { tableNo: "", area: "Restaurant", capacity: "2", status: "reserved", phone: "" };
const IcCheck = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20 6L9 17l-5-5"/></svg>;

function Modal({ title, onClose, children }) {
  return (
    <>
      <div className="rooms__modal_overlay" onClick={onClose} />
      <div className="rooms__modal_box">
        <div className="rooms__modal_head">
          <span className="rooms__modal_title">{title}</span>
          <button className="rooms__modal_close" onClick={onClose}>x</button>
        </div>
        {children}
      </div>
    </>
  );
}

export default function ResBookTable() {
  const [rows, setRows] = useState(() => {
    const saved = localStorage.getItem(TABLES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_TABLES;
  });

  useEffect(() => {
    localStorage.setItem(TABLES_STORAGE_KEY, JSON.stringify(rows));
  }, [rows]);

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const adminName = localStorage.getItem("adminName") || "Waiter";

  const openAdd = () => { setForm(EMPTY_FORM); setModal({ mode: "add" }); };
  const openEdit = (row) => { setForm({ ...row, capacity: String(row.capacity) }); setModal({ mode: "edit", row }); };
  const openDelete = (row) => setModal({ mode: "delete", row });
  const close = () => setModal(null);

  const save = () => {
    if (!form.tableNo.trim() || !form.capacity) return;
    const payload = { ...form, capacity: Number(form.capacity) };
    if (modal.mode === "add") setRows((prev) => [...prev, { id: Date.now(), ...payload, waiter: "" }]);
    if (modal.mode === "edit") setRows((prev) => prev.map((row) => (row.id === modal.row.id ? { ...row, ...payload } : row)));
    close();
  };

  const remove = () => {
    setRows((prev) => prev.filter((row) => row.id !== modal.row.id));
    close();
  };

  const acceptBooking = (id) => {
    setRows((prev) => prev.map((row) => row.id === id ? { ...row, status: "occupied", waiter: adminName } : row));
  };

  return (
    <div className="ad_page">
      <div className="rooms__header">
        <div><h2 className="ad_h2">Restaurant Booked Tables</h2><p className="ad_p">Manage restaurant table bookings.</p></div>
        <button className="rooms__add_btn" onClick={openAdd}>Add Booking</button>
      </div>
      <div className="ad_table_wrap">
        <table className="ad_table">
          <thead><tr><th>Table</th><th>Capacity</th><th>Status</th><th>Waiter</th></tr></thead>
          <tbody>
            {rows
              .filter((row) => row.area === "Restaurant" && (row.status === "reserved" || row.status === "occupied"))
              .map((row) => (
                <tr key={row.id}>
                  <td>{row.tableNo}</td><td>{row.capacity} members</td><td><span className="ad_chip">{row.status}</span></td>
                 <td>
                  <div className="d-flex" style={{ gap: "6px" }}>
                    {row.status === "reserved" && (
                      <button className="rooms__icon_btn rooms__icon_btn--primary" title="Accept Booking" onClick={() => acceptBooking(row.id)}><IcCheck /></button>
                    )}
                    {row.waiter}
                    </div>
                     </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {(modal?.mode === "add" || modal?.mode === "edit") && (
        <Modal title={modal.mode === "add" ? "Add Booking" : "Edit Booking"} onClose={close}>
          <div className="rooms__form_row"><label className="rooms__form_label">Table No</label><input required className="rooms__form_input" value={form.tableNo} onChange={(e) => setForm((f) => ({ ...f, tableNo: e.target.value }))} /></div>
          <div className="rooms__form_row"><label className="rooms__form_label">Capacity</label><input required type="number" className="rooms__form_input" min="1" max="20" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} /></div>
          <div className="rooms__form_row"><label className="rooms__form_label">Phone No</label><input required type="tel" className="rooms__form_input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} /></div>
          <div className="rooms__form_row"><label className="rooms__form_label">Status</label><select className="rooms__form_select" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}><option value="reserved">Reserved</option><option value="occupied">Occupied</option></select></div>
          <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={save}>Save</button></div>
        </Modal>
      )}
      {modal?.mode === "delete" && (
        <Modal title="Delete Booking" onClose={close}>
          <p className="rooms__delete_msg">Delete {modal.row.tableNo}?</p>
          <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--danger" onClick={remove}>Delete</button></div>
        </Modal>
      )}
    </div>
  );
}