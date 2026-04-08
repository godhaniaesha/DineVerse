import { useMemo, useState } from "react";
import DeleteIconButton from "../components/DeleteIconButton";

const INITIAL_RESERVATIONS = [
  { id: "RV-101", guest: "Aarav Sharma", date: "2026-04-02", time: "19:30", party: 2, type: "Table", status: "Confirmed" },
  { id: "RV-102", guest: "Mia Wilson", date: "2026-04-02", time: "20:15", party: 4, type: "Table", status: "Pending" },
  { id: "RV-103", guest: "Noah Johnson", date: "2026-04-03", time: "18:45", party: 3, type: "Table", status: "Confirmed" },
  { id: "RV-104", guest: "Riya Patel", date: "2026-04-03", time: "14:00", party: 2, type: "Room", status: "Checked In" },
  { id: "RV-105", guest: "Lucas Martin", date: "2026-04-03", time: "21:00", party: 6, type: "Table", status: "Cancelled" },
];

const STATUSES = ["All", "Pending", "Confirmed", "Checked In", "Cancelled"];
const EMPTY_FORM = { id: "", guest: "", date: "", time: "", party: "2", type: "Table", status: "Pending" };
const IcEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;

function Modal({ title, onClose, children }) {
  return (
    <>
      <div className="rooms__modal_overlay" onClick={onClose} />
      <div className="rooms__modal_box">
        <div className="rooms__modal_head"><span className="rooms__modal_title">{title}</span><button className="rooms__modal_close" onClick={onClose}>x</button></div>
        {children}
      </div>
    </>
  );
}

export default function AdminReservations() {
  const [rows, setRows] = useState(INITIAL_RESERVATIONS);
  const [status, setStatus] = useState("All");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      const statusMatch = status === "All" || row.status === status;
      const searchText = `${row.id} ${row.guest} ${row.type}`.toLowerCase();
      const queryMatch = !query || searchText.includes(query.toLowerCase());
      return statusMatch && queryMatch;
    });
  }, [rows, status, query]);

  const updateStatus = (id, nextStatus) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, status: nextStatus } : row)));
  };
  const openDelete = (row) => setModal({ mode: "delete", row });
  const close = () => setModal(null);
  const save = () => {
    if (!form.id.trim() || !form.guest.trim() || !form.date || !form.time || !form.party) return;
    const payload = { ...form, party: Number(form.party) };
    if (modal.mode === "add") setRows((prev) => [...prev, payload]);
    if (modal.mode === "edit") setRows((prev) => prev.map((row) => (row.id === modal.row.id ? payload : row)));
    close();
  };
  const remove = () => { setRows((prev) => prev.filter((row) => row.id !== modal.row.id)); close(); };

  const total = rows.length;
  const confirmed = rows.filter((row) => row.status === "Confirmed").length;
  const pending = rows.filter((row) => row.status === "Pending").length;
  const cancelled = rows.filter((row) => row.status === "Cancelled").length;

  return (
    <div className="ad_page">
      <h2 className="ad_h2">Reservations</h2>
      <p className="ad_p">Manage table and room bookings with quick status updates.</p>

      <div className="ad_cards_grid">
        <article className="ad_card">
          <div className="ad_card__label">Total bookings</div>
          <div className="ad_card__value">{total}</div>
        </article>
        <article className="ad_card">
          <div className="ad_card__label">Confirmed</div>
          <div className="ad_card__value">{confirmed}</div>
        </article>
        <article className="ad_card">
          <div className="ad_card__label">Pending</div>
          <div className="ad_card__value">{pending}</div>
        </article>
        <article className="ad_card">
          <div className="ad_card__label">Cancelled</div>
          <div className="ad_card__value">{cancelled}</div>
        </article>
      </div>

      <div className="rooms__header">
        <div />
      </div>
      <div className="ad_toolbar">
        <input
          className="ad_input"
          placeholder="Search by id, guest, type"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select className="ad_select" value={status} onChange={(event) => setStatus(event.target.value)}>
          {STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="ad_table_wrap">
        <table className="ad_table">
          <thead>
            <tr>
              <th>Reservation</th>
              <th>Guest</th>
              <th>Date</th>
              <th>Time</th>
              <th>Party</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="ad_table__empty">
                  No reservations found.
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.guest}</td>
                  <td>{row.date}</td>
                  <td>{row.time}</td>
                  <td>{row.party}</td>
                  <td>{row.type}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <select
                      className="ad_select ad_select--small"
                      value={row.status}
                      onChange={(event) => updateStatus(row.id, event.target.value)}
                    >
                      {STATUSES.slice(1).map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="rooms__actions_cell">
                    <button className="rooms__icon_btn" title="Edit reservation" ><IcEdit /></button>
                    <DeleteIconButton title="Delete reservation" onClick={() => openDelete(row)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
   
      {modal?.mode === "delete" && <Modal title="Delete Reservation" onClose={close}><p className="rooms__delete_msg">Delete {modal.row.id}?</p><div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--danger" onClick={remove}>Delete</button></div></Modal>}
    </div>
  );
}