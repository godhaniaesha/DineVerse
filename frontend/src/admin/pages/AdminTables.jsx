import { useState } from "react";
import DeleteIconButton from "../components/DeleteIconButton";

const INITIAL_TABLES = [
  { id: 1, tableNo: "T1", area: "Cafe", capacity: 4, status: "available" },
  { id: 2, tableNo: "T2", area: "Cafe", capacity: 4, status: "reserved" },
  { id: 3, tableNo: "R1", area: "Restaurant", capacity: 6, status: "occupied" },
  { id: 4, tableNo: "R2", area: "Restaurant", capacity: 4, status: "available" },
  { id: 5, tableNo: "B1", area: "Bar", capacity: 4, status: "occupied" },
  { id: 6, tableNo: "B2", area: "Bar", capacity: 2, status: "available" },
];

const EMPTY_FORM = { tableNo: "", area: "", capacity: "2", status: "available" };
const IcEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;

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

export default function AdminTables() {
  const [rows, setRows] = useState(INITIAL_TABLES);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [areaFilter, setAreaFilter] = useState("All");
  const openAdd = () => { setForm(EMPTY_FORM); setModal({ mode: "add" }); };
  const openEdit = (row) => { setForm({ ...row, capacity: String(row.capacity) }); setModal({ mode: "edit", row }); };
  const openDelete = (row) => setModal({ mode: "delete", row });
  const close = () => setModal(null);

  const save = () => {
    if (!form.tableNo.trim() || !form.area.trim() || !form.capacity) return;
    const payload = { ...form, capacity: Number(form.capacity) };
    if (modal.mode === "add") setRows((prev) => [...prev, { id: Date.now(), ...payload }]);
    if (modal.mode === "edit") setRows((prev) => prev.map((row) => (row.id === modal.row.id ? { ...row, ...payload } : row)));
    close();
  };

  const remove = () => {
    setRows((prev) => prev.filter((row) => row.id !== modal.row.id));
    close();
  };

  return (
    <div className="ad_page">
      <div className="rooms__header">
        <div><h2 className="ad_h2">Tables Management</h2><p className="ad_p">Manage table capacity and seating status for all areas.</p></div>
        <button className="rooms__add_btn" onClick={openAdd}>Add Table</button>
      </div>
      <div className="ad_row_actions " style={{ marginBottom: 16, width:"max-content" }}>
        <select className="rooms__form_select" value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Cafe">Cafe</option>
          <option value="Restaurant">Restaurant</option>
          <option value="Bar">Bar</option>
        </select>
      </div>
      <div className="ad_table_wrap">
        <table className="ad_table">
          <thead><tr><th>Table</th><th>Area</th><th>Capacity</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {rows
              .filter((row) => areaFilter === "All" || row.area === areaFilter)
              .map((row) => (
                <tr key={row.id}>
                  <td>{row.tableNo}</td><td>{row.area}</td><td>{row.capacity} members</td><td><span className="ad_chip">{row.status}</span></td>
                  <td>
                    <div className="d-flex" style={{ gap: "6px" }}>
                      <button className="rooms__icon_btn" title="Edit table" onClick={() => openEdit(row)}><IcEdit /></button>
                      <DeleteIconButton title="Delete table" onClick={() => openDelete(row)} />
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(modal?.mode === "add" || modal?.mode === "edit") && (
        <Modal title={modal.mode === "add" ? "Add Table" : "Edit Table"} onClose={close}>
          <div className="rooms__form_row"><label className="rooms__form_label">Table No</label><input required className="rooms__form_input" value={form.tableNo} onChange={(e) => setForm((f) => ({ ...f, tableNo: e.target.value }))} /></div>
          <div className="rooms__form_row"><label className="rooms__form_label">Area</label><input required className="rooms__form_input" value={form.area} onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))} /></div>
          <div className="rooms__form_row"><label className="rooms__form_label">Capacity</label><input required type="number" className="rooms__form_input" min="1" max="20" value={form.capacity} onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} /></div>
          <div className="rooms__form_row"><label className="rooms__form_label">Status</label><select className="rooms__form_select" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}><option value="available">Available</option><option value="reserved">Reserved</option><option value="occupied">Occupied</option></select></div>
          <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={save}>Save</button></div>
        </Modal>
      )}
      {modal?.mode === "delete" && (
        <Modal title="Delete Table" onClose={close}>
          <p className="rooms__delete_msg">Delete {modal.row.tableNo}?</p>
          <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--danger" onClick={remove}>Delete</button></div>
        </Modal>
      )}
    </div>
  );
}
