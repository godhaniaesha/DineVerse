import { useMemo, useState, useEffect } from "react";
import DeleteIconButton from "../components/DeleteIconButton";
import { useReservations } from "../../contexts/ReservationContext";

const STATUSES = ["All", "Pending", "Confirmed", "Checked In", "Cancelled"];
const EMPTY_FORM = {
  id: "",
  guest: "",
  date: "",
  time: "",
  party: "2",
  type: "Table",
  status: "Pending",
};
const IcEdit = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

function Modal({ title, onClose, children }) {
  return (
    <>
      <div className="rooms__modal_overlay" onClick={onClose} />
      <div className="rooms__modal_box">
        <div className="rooms__modal_head">
          <span className="rooms__modal_title">{title}</span>
          <button className="rooms__modal_close" onClick={onClose}>
            x
          </button>
        </div>
        {children}
      </div>
    </>
  );
}

export default function AdminReservations() {
  const { reservations, loading, getReservations, updateReservationStatus } =
    useReservations();
  const [status, setStatus] = useState("All");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    getReservations();
  }, [getReservations]);

  const filtered = useMemo(() => {
    return reservations.filter((row) => {
      const statusMatch = status === "All" || row.status === status;
      const searchText =
        `${row.reservation} ${row.guest} ${row.type}`.toLowerCase();
      const queryMatch = !query || searchText.includes(query.toLowerCase());
      return statusMatch && queryMatch;
    });
  }, [reservations, status, query]);

  const latestTenReservations = useMemo(() => {
    return filtered.slice(0, 10);
  }, [filtered]);

  const updateStatus = async (id, nextStatus) => {
    await updateReservationStatus(id, nextStatus);
    setEditingId(null);
  };
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal({ mode: "add" });
  };
  const openEdit = (row) => {
    setForm({ ...row, party: String(row.party) });
    setModal({ mode: "edit", row });
  };
  const openDelete = (row) => setModal({ mode: "delete", row });
  const close = () => setModal(null);
  const save = () => {
    close();
  };
  const remove = () => {
    close();
  };

  const total = reservations.length;
  const confirmed = reservations.filter(
    (row) => row.status === "Confirmed",
  ).length;
  const pending = reservations.filter((row) => row.status === "Pending").length;
  const cancelled = reservations.filter(
    (row) => row.status === "Cancelled",
  ).length;

  return (
    <div className="ad_page">
      <div className="rooms__header">
        <div>
          <h2 className="ad_h2">Reservations</h2>
          <p className="ad_p">
            Manage table and room bookings with quick status updates.
          </p>
        </div>
        {/* <button className="rooms__add_btn" onClick={openAdd}>Add Reservation</button> */}
      </div>

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

      <div className="ad_toolbar">
        <input
          className="ad_input"
          placeholder="Search by id, guest, type"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          className="ad_select"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
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
            {latestTenReservations.length === 0 ? (
              <tr>
                <td colSpan={8} className="ad_table__empty">
                  No reservations found.
                </td>
              </tr>
            ) : (
              latestTenReservations.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.guest}</td>
                  <td>{row.date}</td>
                  <td>{row.time}</td>
                  <td>{row.party}</td>
                  <td>{row.type}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {editingId === row.id ? (
                      <select
                        className="ad_select ad_select--small"
                        value={row.status}
                        onChange={(event) =>
                          updateStatus(row.id, event.target.value)
                        }
                        autoFocus
                        onBlur={() => setEditingId(null)}
                      >
                        {STATUSES.slice(1).map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="ad_chip">{row.status}</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex" style={{ gap: "6px" }}>
                      <button
                        className="rooms__icon_btn"
                        title="Edit status"
                        onClick={() => setEditingId(row.id)}
                      >
                        <IcEdit />
                      </button>
                      <DeleteIconButton
                        title="Delete reservation"
                        onClick={() => openDelete(row)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal?.mode === "delete" && (
        <Modal title="Delete Reservation" onClose={close}>
          <p className="rooms__delete_msg">Delete {modal.row.id}?</p>
          <div className="rooms__form_actions">
            <button className="rooms__btn rooms__btn--ghost" onClick={close}>
              Cancel
            </button>
            <button className="rooms__btn rooms__btn--danger" onClick={remove}>
              Delete
            </button>
          </div>
        </Modal>
      )}
      {(modal?.mode === "add" || modal?.mode === "edit") && (
        <Modal
          title={modal.mode === "add" ? "Add Reservation" : "Edit Reservation"}
          onClose={close}
        >
          <div className="rooms__form_row">
            <label className="rooms__form_label">Guest Name</label>
            <input
              required
              className="rooms__form_input"
              value={form.guest}
              onChange={(e) =>
                setForm((f) => ({ ...f, guest: e.target.value }))
              }
            />
          </div>
          <div className="rooms__form_row">
            <label className="rooms__form_label">Date</label>
            <input
              required
              type="date"
              className="rooms__form_input"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>
          <div className="rooms__form_row">
            <label className="rooms__form_label">Time</label>
            <input
              required
              type="time"
              className="rooms__form_input"
              value={form.time}
              onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
            />
          </div>
          <div className="rooms__form_row">
            <label className="rooms__form_label">Party Size</label>
            <input
              required
              type="number"
              className="rooms__form_input"
              value={form.party}
              onChange={(e) =>
                setForm((f) => ({ ...f, party: e.target.value }))
              }
            />
          </div>
          <div className="rooms__form_row">
            <label className="rooms__form_label">Type</label>
            <select
              className="rooms__form_select"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            >
              <option value="Table">Table</option>
              <option value="Room">Room</option>
            </select>
          </div>
          <div className="rooms__form_row">
            <label className="rooms__form_label">Status</label>
            <select
              className="rooms__form_select"
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value }))
              }
            >
              {STATUSES.slice(1).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="rooms__form_actions">
            <button className="rooms__btn rooms__btn--ghost" onClick={close}>
              Cancel
            </button>
            <button className="rooms__btn rooms__btn--primary" onClick={save}>
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
