import { useState, useEffect } from "react";
import DeleteIconButton from "../components/DeleteIconButton";
import { useReservations } from "../../contexts/ReservationContext";
import { useAuth } from "../../contexts/AuthContext";

const EMPTY = {
  reservation: "",
  guest: "",
  contact: "",
  date: "",
  time: "",
  party: "2",
  specialRequest: "",
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

const formatAmount = (amount) => {
  const value = Number(amount || 0);
  return `Rs. ${value.toLocaleString("en-IN")}`;
};

const displayValue = (value, fallback = "-") => {
  return value || fallback;
};

const HOUSEKEEPING_COLUMNS = [
  { key: "reservation", label: "Booking Ref" },
  { key: "guest", label: "Guest" },
  { key: "phone", label: "Phone" },
  { key: "checkInFormatted", label: "Check In" },
  { key: "checkOutFormatted", label: "Check Out" },
  { key: "roomNumber", label: "Room" },
  { key: "floor", label: "Floor" },
  { key: "roomType", label: "Room Type" },
  { key: "status", label: "Status", isStatus: true },
];

const FULL_COLUMNS = [
  { key: "reservation", label: "Booking Ref" },
  { key: "guest", label: "Guest" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "checkInFormatted", label: "Check In" },
  { key: "checkOutFormatted", label: "Check Out" },
  { key: "checkInTime", label: "Check In Time" },
  { key: "checkOutTime", label: "Check Out Time" },
  { key: "adults", label: "Adults" },
  { key: "children", label: "Children" },
  { key: "party", label: "Party" },
  { key: "roomNumber", label: "Room" },
  { key: "floor", label: "Floor" },
  { key: "roomType", label: "Room Type" },
  { key: "specialRequest", label: "Special Request" },
  { key: "totalAmount", label: "Amount", isAmount: true },
  { key: "paymentStatus", label: "Payment" },
  { key: "status", label: "Status", isStatus: true },
];

export default function AdminCafeBookings({
  title = "Cafe Bookings",
  sub = "Manage all cafe table reservations.",
}) {
  const { user } = useAuth();
  const { reservations, getReservations, updateReservationStatus } =
    useReservations();
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const isHousekeeping = user?.role === "Housekeeping";
  const visibleColumns = isHousekeeping ? HOUSEKEEPING_COLUMNS : FULL_COLUMNS;

  const close = () => setModal(null);

  const openEdit = (row) => {
    if (isHousekeeping) return;

    setForm({
      reservation: row.reservation ?? row.id ?? "",
      guest: row.guest ?? "",
      contact: row.contact ?? row.phone ?? "",
      date: row.date ?? "",
      time: row.time ?? "",
      party: String(row.party ?? "2"),
      specialRequest: row.specialRequest ?? row.raw?.specialRequest ?? "",
      status: row.status ?? "Pending",
    });
    setModal({ mode: "edit", row });
  };

  const openView = (row) => setModal({ mode: "view", row });

  const openDelete = (row) => {
    if (isHousekeeping) return;
    setModal({ mode: "delete", row });
  };

  const save = async () => {
    if (
      !form.reservation.trim() ||
      !form.guest.trim() ||
      !form.contact.trim() ||
      !form.date ||
      !form.time
    ) {
      return;
    }

    const payload = {
      ...form,
      party: Number(form.party),
      specialRequest: form.specialRequest,
    };

    if (modal.mode === "edit") {
      setSaving(true);
      const result = await updateReservationStatus(modal.row.id, form.status);

      if (result?.success) {
        setRows((prev) =>
          prev.map((row) =>
            row.id === modal.row.id ? { ...row, ...payload, status: form.status } : row,
          ),
        );
        close();
      } else {
        alert(result?.error || "Failed to update booking status");
      }
      setSaving(false);
      return;
    }

    close();
  };

  const remove = () => {
    setRows((prev) => prev.filter((row) => row.id !== modal.row.id));
    close();
  };

  useEffect(() => {
    getReservations();
  }, [getReservations]);

  useEffect(() => {
    setRows(reservations);
  }, [reservations]);

  return (
    <div className="ad_page">
      <div className="rooms__header">
        <div>
          <h2 className="ad_h2">{title}</h2>
          <p className="ad_p">{sub}</p>
        </div>
      </div>

      <div className="ad_table_wrap">
        <table className="ad_table">
          <thead>
            <tr>
              {visibleColumns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              {!isHousekeeping && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + (isHousekeeping ? 0 : 1)}
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  No bookings found
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} onClick={() => openView(row)}>
                  {visibleColumns.map((column) => {
                    if (column.isStatus) {
                      return (
                        <td key={column.key}>
                          <span className="ad_chip">{displayValue(row[column.key])}</span>
                        </td>
                      );
                    }

                    if (column.isAmount) {
                      return <td key={column.key}>{formatAmount(row[column.key])}</td>;
                    }

                    return <td key={column.key}>{displayValue(row[column.key])}</td>;
                  })}
                  {!isHousekeeping && (
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="d-flex" style={{ gap: "6px" }}>
                        <button
                          className="rooms__icon_btn"
                          onClick={() => openEdit(row)}
                        >
                          <IcEdit />
                        </button>
                        <DeleteIconButton onClick={() => openDelete(row)} />
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal?.mode === "edit" && (
        <>
          <div className="rooms__modal_overlay" onClick={close} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head">
              <span className="rooms__modal_title">Edit Booking</span>
              <button className="rooms__modal_close" onClick={close}>
                x
              </button>
            </div>
            <div className="rooms__form_grid2">
              <div>
                <label className="rooms__form_label">Reservation</label>
                <input className="rooms__form_input" value={form.reservation} readOnly />
              </div>
              <div>
                <label className="rooms__form_label">Guest</label>
                <input className="rooms__form_input" value={form.guest} readOnly />
              </div>
            </div>
            <div className="rooms__form_grid2">
              <div>
                <label className="rooms__form_label">Contact</label>
                <input className="rooms__form_input" value={form.contact} readOnly />
              </div>
              <div>
                <label className="rooms__form_label">Party</label>
                <input className="rooms__form_input" value={form.party} readOnly />
              </div>
            </div>
            <div className="rooms__form_row">
              <label className="rooms__form_label">Special Request</label>
              <input className="rooms__form_input" value={form.specialRequest} readOnly />
            </div>
            <div className="rooms__form_row">
              <label className="rooms__form_label">Status</label>
              <select
                className="rooms__form_select"
                value={form.status}
                onChange={(e) =>
                  setForm((current) => ({ ...current, status: e.target.value }))
                }
              >
                <option>Confirmed</option>
                <option>Checked In</option>
                <option>Checked Out</option>
                <option>No Show</option>
                <option>Cancelled</option>
              </select>
            </div>
            <div className="rooms__form_actions">
              <button className="rooms__btn rooms__btn--ghost" onClick={close}>
                Cancel
              </button>
              <button
                className="rooms__btn rooms__btn--primary"
                onClick={save}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </>
      )}

      {modal?.mode === "view" && (
        <>
          <div className="rooms__modal_overlay" onClick={close} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head">
              <span className="rooms__modal_title">Booking Details</span>
              <button className="rooms__modal_close" onClick={close}>
                x
              </button>
            </div>
            <div className="rooms__detail_grid">
              {[
                ["Booking Ref", modal.row.reservation],
                ["Guest", modal.row.guest],
                ["Email", modal.row.email],
                ["Phone", modal.row.phone],
                ["Check In", modal.row.checkInFormatted],
                ["Check Out", modal.row.checkOutFormatted],
                ["Check In Time", modal.row.checkInTime],
                ["Check Out Time", modal.row.checkOutTime],
                ["Adults", modal.row.adults],
                ["Children", modal.row.children],
                ["Party", modal.row.party],
                ["Room", modal.row.roomNumber],
                ["Floor", modal.row.floor],
                ["Room Type", modal.row.roomType],
                ["Special Request", modal.row.specialRequest],
                ["Amount", formatAmount(modal.row.totalAmount)],
                ["Payment Status", modal.row.paymentStatus],
                ["Status", modal.row.status],
              ].map(([label, value]) => (
                <div key={label} className="rooms__detail_card">
                  <div className="rooms__detail_card_label">{label}</div>
                  <div className="rooms__detail_card_value">
                    {displayValue(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {modal?.mode === "delete" && !isHousekeeping && (
        <>
          <div className="rooms__modal_overlay" onClick={close} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head">
              <span className="rooms__modal_title">Delete Booking</span>
              <button className="rooms__modal_close" onClick={close}>
                x
              </button>
            </div>
            <p className="rooms__delete_msg">
              Delete {modal.row.reservation || modal.row.id}?
            </p>
            <div className="rooms__form_actions">
              <button className="rooms__btn rooms__btn--ghost" onClick={close}>
                Cancel
              </button>
              <button
                className="rooms__btn rooms__btn--danger"
                onClick={remove}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
