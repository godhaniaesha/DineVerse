// src/admin/pages/AdminReviews.jsx
import { useEffect, useState } from "react";
import DeleteIconButton from "../components/DeleteIconButton";
import reviewService from "../../services/reviewService";

const EMPTY = {
  // client-side fields (Add form ma jo future ma use karva hoy)
  name: "",
  phone_no: "",
  area: "Restaurant",
  rating: "5",
  message: "",
  tags: "",
  profession: "",
  date: "",
};

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

export default function AdminReviews() {
  const [rows, setRows] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // reviews per page

  const openAdd = () => {
    setForm(EMPTY);
    setModal({ mode: "add" });
  };

  const openView = (row) => setModal({ mode: "view", row });
  const openDelete = (row) => setModal({ mode: "delete", row });
  const close = () => setModal(null);

  const save = () => {
    if (!form.name.trim() || !form.message.trim() || !form.date || !form.area)
      return;

    const payload = {
      ...form,
      rating: Number(form.rating),
    };

    // Add only affects local UI (no API add)
    if (modal.mode === "add") {
      setRows((p) => [
        ...p,
        {
          _id: Date.now().toString(),
          ...payload,
        },
      ]);
    }

    close();
  };

  const remove = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        alert("Please login to perform this action");
        return;
      }
      await reviewService.deleteReview(modal.row._id, authToken);
      setRows((p) => p.filter((r) => r._id !== modal.row._id));
      close();
    } catch (error) {
      console.error("Error deleting review:", error);
      alert(
        "Error deleting review: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await reviewService.getAllReviews();
      // assuming { success, msg, data: [...] }
      const list = Array.isArray(res.data) ? res.data : res;

      const mapped = list.map((item) => ({
        _id: item._id,
        name:
          item.user?.full_name ||
          item.user?.name ||
          item.userName ||
          "Unknown",
        phone_no: item.user?.phone || item.phone_no || "",
        area: item.area,
        rating: item.rating,
        message: item.message,
        tags: item.tags || "",
        profession: item.profession || "",
        date: item.date || item.createdAt,
      }));

      setRows(mapped);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
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
      <div className="rooms__header">
        <div>
          <h2 className="ad_h2">Reviews & Ratings</h2>
          <p className="ad_p">
            View and manage customer testimonials.
          </p>
        </div>
        {/* Optional Add button (local only) - jo na joiye hoy to aa button pan hataavi sako */}
        {/* <button className="rooms__add_btn" onClick={openAdd}>
          Add Review
        </button> */}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          Loading reviews...
        </div>
      ) : (
        <>
          <div className="ad_table_wrap">
            <table className="ad_table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Area</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length > 0 ? (
                  paginatedRows.map((r) => (
                    <tr key={r._id}>
                      <td>{r.name}</td>
                      <td>{r.phone_no}</td>
                      <td>{r.area}</td>
                      <td>{r.rating}/5</td>
                      <td
                        style={{
                          maxWidth: "220px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.message}
                      </td>
                      <td>{formatDate(r.date)}</td>
                      <td>
                        <div className="d-flex" style={{ gap: "6px" }}>
                          <button
                            className="rooms__icon_btn"
                            onClick={() => openView(r)}
                            title="View Review"
                          >
                            <IcView />
                          </button>
                          <DeleteIconButton
                            title="Delete Review"
                            onClick={() => openDelete(r)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      style={{ textAlign: "center", padding: "40px" }}
                    >
                      No reviews found.
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

      {/* ADD modal only (since edit removed) */}
      {modal?.mode === "add" && (
        <>
          <div className="rooms__modal_overlay" onClick={close} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head">
              <span className="rooms__modal_title">Add Review</span>
              <button className="rooms__modal_close" onClick={close}>
                x
              </button>
            </div>

            <div className="rooms__form_row">
              <label className="rooms__form_label">Customer Name</label>
              <input
                required
                className="rooms__form_input"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>

            <div className="rooms__form_row">
              <label className="rooms__form_label">Phone Number</label>
              <input
                className="rooms__form_input"
                value={form.phone_no}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone_no: e.target.value }))
                }
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="rooms__form_row">
              <label className="rooms__form_label">Area</label>
              <select
                className="rooms__form_select"
                value={form.area}
                onChange={(e) =>
                  setForm((f) => ({ ...f, area: e.target.value }))
                }
              >
                <option value="Restaurant">Restaurant</option>
                <option value="Cafe">Cafe</option>
                <option value="Bar">Bar</option>
              </select>
            </div>

            <div className="rooms__form_row">
              <label className="rooms__form_label">Rating</label>
              <select
                className="rooms__form_select"
                value={form.rating}
                onChange={(e) =>
                  setForm((f) => ({ ...f, rating: e.target.value }))
                }
              >
                {["5", "4", "3", "2", "1"].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="rooms__form_row">
              <label className="rooms__form_label">Message</label>
              <textarea
                required
                className="rooms__form_input"
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
              />
            </div>

            <div className="rooms__form_row">
              <label className="rooms__form_label">Tags (optional)</label>
              <input
                className="rooms__form_input"
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
                placeholder="family, dinner, birthday..."
              />
            </div>

            <div className="rooms__form_row">
              <label className="rooms__form_label">
                Profession (optional)
              </label>
              <input
                className="rooms__form_input"
                value={form.profession}
                onChange={(e) =>
                  setForm((f) => ({ ...f, profession: e.target.value }))
                }
                placeholder="Designer, Student, etc."
              />
            </div>

            <div className="rooms__form_row">
              <label className="rooms__form_label">Date</label>
              <input
                required
                type="date"
                className="rooms__form_input"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
              />
            </div>

            <div className="rooms__form_actions">
              <button className="rooms__btn rooms__btn--ghost" onClick={close}>
                Cancel
              </button>
              <button
                className="rooms__btn rooms__btn--primary"
                onClick={save}
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}

      {modal?.mode === "delete" && (
        <>
          <div className="rooms__modal_overlay" onClick={close} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head">
              <span className="rooms__modal_title">Delete Review</span>
              <button className="rooms__modal_close" onClick={close}>
                x
              </button>
            </div>
            <p className="rooms__delete_msg">
              Delete review by {modal.row.name}?
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

      {modal?.mode === "view" && (
        <>
          <div className="rooms__modal_overlay" onClick={close} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head">
              <span className="rooms__modal_title">Review Details</span>
              <button className="rooms__modal_close" onClick={close}>
                x
              </button>
            </div>
            <div
              className="rooms__detail_grid"
              style={{
                padding: "20px",
                display: "grid",
                gap: "16px",
              }}
            >
              <div className="rooms__detail_card">
                <div
                  className="rooms__detail_card_label"
                  style={{
                    color: "var(--ad-text-3)",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Customer
                </div>
                <div
                  className="rooms__detail_card_value"
                  style={{
                    color: "var(--ad-text-1)",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  {modal.row.name}
                </div>
              </div>

              <div className="rooms__detail_card">
                <div
                  className="rooms__detail_card_label"
                  style={{
                    color: "var(--ad-text-3)",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Phone
                </div>
                <div
                  className="rooms__detail_card_value"
                  style={{
                    color: "var(--ad-text-1)",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  {modal.row.phone_no || "-"}
                </div>
              </div>

              <div className="rooms__detail_card">
                <div
                  className="rooms__detail_card_label"
                  style={{
                    color: "var(--ad-text-3)",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Area
                </div>
                <div
                  className="rooms__detail_card_value"
                  style={{
                    color: "var(--ad-text-1)",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  {modal.row.area}
                </div>
              </div>

              <div className="rooms__detail_card">
                <div
                  className="rooms__detail_card_label"
                  style={{
                    color: "var(--ad-text-3)",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Rating
                </div>
                <div
                  className="rooms__detail_card_value"
                  style={{
                    color: "var(--ad-gold)",
                    fontSize: "16px",
                    fontWeight: "600",
                  }}
                >
                  {modal.row.rating} / 5
                </div>
              </div>

              <div className="rooms__detail_card">
                <div
                  className="rooms__detail_card_label"
                  style={{
                    color: "var(--ad-text-3)",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Date
                </div>
                <div
                  className="rooms__detail_card_value"
                  style={{
                    color: "var(--ad-text-1)",
                    fontSize: "16px",
                    fontWeight: "500",
                  }}
                >
                  {formatDate(modal.row.date)}
                </div>
              </div>

              <div
                className="rooms__detail_card"
                style={{ gridColumn: "1 / -1" }}
              >
                <div
                  className="rooms__detail_card_label"
                  style={{
                    color: "var(--ad-text-3)",
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Review Message
                </div>
                <div
                  className="rooms__detail_card_value"
                  style={{
                    color: "var(--ad-text-2)",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    marginTop: "4px",
                  }}
                >
                  {modal.row.message}
                </div>
              </div>

              {modal.row.tags && (
                <div
                  className="rooms__detail_card"
                  style={{ gridColumn: "1 / -1" }}
                >
                  <div
                    className="rooms__detail_card_label"
                    style={{
                      color: "var(--ad-text-3)",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    Tags
                  </div>
                  <div
                    className="rooms__detail_card_value"
                    style={{
                      color: "var(--ad-text-2)",
                      fontSize: "14px",
                      marginTop: "4px",
                    }}
                  >
                    {modal.row.tags}
                  </div>
                </div>
              )}

              {modal.row.profession && (
                <div className="rooms__detail_card">
                  <div
                    className="rooms__detail_card_label"
                    style={{
                      color: "var(--ad-text-3)",
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                    }}
                  >
                    Profession
                  </div>
                  <div
                    className="rooms__detail_card_value"
                    style={{
                      color: "var(--ad-text-2)",
                      fontSize: "14px",
                      marginTop: "4px",
                    }}
                  >
                    {modal.row.profession}
                  </div>
                </div>
              )}
            </div>
            <div className="rooms__form_actions">
              <button className="rooms__btn rooms__btn--primary" onClick={close}>
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}