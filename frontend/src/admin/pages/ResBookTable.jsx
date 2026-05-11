import { useState, useEffect, useMemo } from "react";
import { useTableReservation } from "../../contexts/TableReservationContext";
import { useAuth } from "../../contexts/AuthContext";
import { MdCheck, MdDoneAll, MdClose } from "react-icons/md";
import Pagination from "../components/Pagination";

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
  const { reservations, loading, getReservations, updateReservationStatus } = useTableReservation();
  const { user } = useAuth();
  const [modal, setModal] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const adminName = user?.full_name || localStorage.getItem("adminName") || "Waiter";

  useEffect(() => {
    getReservations();
  }, [getReservations]);

  const openEdit = (row) => setModal({ mode: "edit", row });
  const openDelete = (row) => setModal({ mode: "delete", row });
  const close = () => setModal(null);

  const acceptBooking = async (id) => {
    await updateReservationStatus(id, "Arrived", adminName);
  };

  const completeBooking = async (id) => {
    await updateReservationStatus(id, "Completed");
  };

  const cancelBooking = async (id) => {
    await updateReservationStatus(id, "Cancelled");
  };

  const restaurantReservations = reservations.filter(r => r.area === "Restaurant");
  
  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return restaurantReservations.slice(startIndex, endIndex);
  }, [restaurantReservations, currentPage]);

  const totalPages = Math.ceil(restaurantReservations.length / itemsPerPage);

  return (
    <div className="ad_page">
      <div className="rooms__header">
        <div><h2 className="ad_h2">Restaurant Booked Tables</h2><p className="ad_p">Manage restaurant table bookings.</p></div>
      </div>
      <div className="ad_table_wrap">
        <table className="ad_table">
          <thead><tr><th>Table</th><th>Guest</th><th>Date</th><th>Time</th><th>Capacity</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: "center" }}>Loading reservations...</td></tr>
            ) : restaurantReservations.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: "center" }}>No reservations found</td></tr>
            ) : (
              paginatedData.map((row) => (
                <tr 
                  key={row._id}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (row.status === "Confirmed") {
                      acceptBooking(row._id);
                    }
                  }}
                  style={{ cursor: "context-menu" }}
                >
                  <td>{row.table?.tableNo || "-"}</td>
                  <td>{row.guest_name}</td>
                  <td>{new Date(row.date).toLocaleDateString()}</td>
                  <td>{row.time}</td>
                  <td>{row.guests} guests</td>
                  <td><span className="ad_chip">{row.status}</span></td>
                  <td>
                    <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                      {row.status === "Confirmed" ? (
                        <button 
                          className="rooms__icon_btn" 
                          title="Accept Booking" 
                          onClick={() => acceptBooking(row._id)}
                          style={{ color: "var(--ad-champ)", borderColor: "rgba(200, 150, 90, 0.3)" }}
                        >
                          <MdCheck size={18} />
                        </button>
                      ) : row.status === "Arrived" ? (
                          <span style={{ fontSize: "14px", color: "var(--ad-champ-lt)", fontWeight: "500", marginRight: "4px" }}>{row.waiter || "Self"}</span>
                      ) : null}
                      
                      {row.status === "Arrived" && (
                        <button 
                          className="rooms__icon_btn" 
                          title="Complete Booking" 
                          onClick={() => completeBooking(row._id)} 
                          style={{ color: "var(--ad-champ)", borderColor: "rgba(200, 150, 90, 0.3)" }}
                        >
                          <MdDoneAll size={18} />
                        </button>
                      )}
                      
                      {(row.status === "Confirmed" || row.status === "Arrived") && (
                        <button 
                          className="rooms__icon_btn" 
                          title="Cancel Booking" 
                          onClick={() => cancelBooking(row._id)} 
                          style={{ color: "var(--ad-champ)", opacity: 0.7, borderColor: "rgba(255, 255, 255, 0.1)" }}
                        >
                          <MdClose size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={restaurantReservations.length}
      />
    </div>
  );
}
