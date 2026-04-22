// src/admin/pages/AdminInquiries.jsx
import { useEffect, useState } from "react";
import DeleteIconButton from "../components/DeleteIconButton";
import inquiryService from "../../services/inquiryService";

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
const IcView = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
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

export default function AdminInquiries() {
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(true);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // rows per page

  const openView = (inquiry) => setModal({ mode: "view", inquiry });
  const openDelete = (inquiry) => setModal({ mode: "delete", inquiry });
  const close = () => setModal(null);

  const toggleStatus = async (inquiry) => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("Please login to perform this action");
        return;
      }

      const newStatus = inquiry.status === "Open" ? "Resolved" : "Open";

      const res = await inquiryService.updateInquiryStatus(
        inquiry._id,
        newStatus,
        authToken
      );
      const updated = res.data || res;

      setRows((prev) =>
        prev.map((x) => (x._id === inquiry._id ? updated : x))
      );
    } catch (error) {
      console.error("Error toggling inquiry status:", error);
      alert(
        "Error updating status: " +
        (error.response?.data?.message || error.message)
      );
    }
  };

  const confirmDelete = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("Please login to perform this action");
        return;
      }
      await inquiryService.deleteInquiry(modal.inquiry._id, authToken);
      setRows((p) => p.filter((x) => x._id !== modal.inquiry._id));
      close();
    } catch (error) {
      console.error("Error deleting inquiry:", error);
      alert(
        "Error deleting inquiry: " +
        (error.response?.data?.message || error.message)
      );
    }
  };

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("Please login to view inquiries");
        setRows([]);
        return;
      }
      const res = await inquiryService.getInquiries(authToken);
      const list = Array.isArray(res.data) ? res.data : res;
      setRows(list);
      setCurrentPage(1); // reset page on load
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const formatDate = (iso) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString();
  };

  // pagination derived values
  const totalItems = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRows = rows.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="ad_page">
      <h2 className="ad_h2">Contact Inquiries</h2>
      <p className="ad_p">Manage contact form messages and responses.</p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          Loading inquiries...
        </div>
      ) : (
        <>
          <div className="ad_table_wrap">
            <table className="ad_table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Reason</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length > 0 ? (
                  paginatedRows.map((r) => (
                    <tr key={r._id}>
                      <td>{r.full_name}</td>
                      <td>{r.email}</td>
                      <td>{r.phone || "-"}</td>
                      <td>{r.reason || "-"}</td>
                      <td
                        style={{
                          maxWidth: "200px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.message}
                      </td>
                      <td>{formatDate(r.createdAt)}</td>
                      <td>
                        <span className="ad_chip">{r.status}</span>
                      </td>
                      <td>
                        <div className="d-flex" style={{ gap: "6px" }}>
                          <button
                            className="rooms__icon_btn"
                            onClick={() => toggleStatus(r)}
                            title="Toggle Status"
                          >
                            <IcEdit />
                          </button>
                          <button
                            className="rooms__icon_btn"
                            onClick={() => openView(r)}
                            title="View Inquiry"
                          >
                            <IcView />
                          </button>
                          <DeleteIconButton
                            title="Delete Inquiry"
                            onClick={() => openDelete(r)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      No inquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          {totalItems > pageSize && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "16px",
              }}
            >
              <span style={{ fontSize: "12px", color: "#b5b5b5" }}>
                Showing {startIndex + 1}–
                {Math.min(endIndex, totalItems)} of {totalItems}
              </span>

              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                <button
                  className="rooms__btn rooms__btn--ghost"
                  style={{ padding: "4px 10px", fontSize: "12px" }}
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={
                        page === currentPage
                          ? "rooms__btn rooms__btn--primary"
                          : "rooms__btn rooms__btn--ghost"
                      }
                      style={{
                        padding: "4px 10px",
                        fontSize: "12px",
                        minWidth: "32px",
                      }}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  className="rooms__btn rooms__btn--ghost"
                  style={{ padding: "4px 10px", fontSize: "12px" }}
                  disabled={currentPage === totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {modal?.mode === "view" && (
        <Modal title="Inquiry Details" onClose={close}>
          <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#6a6278",
                }}
              >
                Name
              </label>
              <p
                style={{
                  margin: "6px 0 0 0",
                  fontSize: "14px",
                  color: "#b5b5b5",
                }}
              >
                {modal.inquiry.full_name}
              </p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#6a6278",
                }}
              >
                Email
              </label>
              <p
                style={{
                  margin: "6px 0 0 0",
                  fontSize: "14px",
                  color: "#b5b5b5",
                }}
              >
                {modal.inquiry.email}
              </p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#6a6278",
                }}
              >
                Phone
              </label>
              <p
                style={{
                  margin: "6px 0 0 0",
                  fontSize: "14px",
                  color: "#b5b5b5",
                }}
              >
                {modal.inquiry.phone || "-"}
              </p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#6a6278",
                }}
              >
                Reason
              </label>
              <p
                style={{
                  margin: "6px 0 0 0",
                  fontSize: "14px",
                  color: "#b5b5b5",
                }}
              >
                {modal.inquiry.reason || "-"}
              </p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#6a6278",
                }}
              >
                Message
              </label>
              <p
                style={{
                  margin: "6px 0 0 0",
                  fontSize: "14px",
                  color: "#b5b5b5",
                  lineHeight: "1.6",
                }}
              >
                {modal.inquiry.message}
              </p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#6a6278",
                }}
              >
                Date
              </label>
              <p
                style={{
                  margin: "6px 0 0 0",
                  fontSize: "14px",
                  color: "#b5b5b5",
                }}
              >
                {formatDate(modal.inquiry.createdAt)}
              </p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#6a6278",
                }}
              >
                Status
              </label>
              <p style={{ margin: "6px 0 0 0", fontSize: "14px" }}>
                <span className="ad_chip">{modal.inquiry.status}</span>
              </p>
            </div>
            <div className="rooms__form_actions">
              <button className="rooms__btn rooms__btn--ghost" onClick={close}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {modal?.mode === "delete" && (
        <Modal title="Delete Inquiry" onClose={close}>
          <div style={{ padding: "20px" }}>
            <p className="rooms__delete_msg" style={{ marginBottom: "20px" }}>
              Are you sure you want to delete the inquiry from{" "}
              <b>{modal.inquiry.full_name}</b>?
            </p>
            <div className="rooms__form_actions">
              <button className="rooms__btn rooms__btn--ghost" onClick={close}>
                Cancel
              </button>
              <button
                className="rooms__btn rooms__btn--danger"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}