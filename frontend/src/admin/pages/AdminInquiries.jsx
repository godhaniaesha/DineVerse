  import { useState } from "react";
import { FiEye, FiEdit2 } from "react-icons/fi";
import DeleteIconButton from "../components/DeleteIconButton";

const DATA = [{ id: 1, name: "Sophia", email: "sophia@mail.com", message: "Need table for 12 people.", date: "2026-04-01", status: "Open" }];

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

export default function AdminInquiries() {
  const [rows, setRows] = useState(DATA);
  const [modal, setModal] = useState(null);

  const openView = (inquiry) => setModal({ mode: "view", inquiry });
  const close = () => setModal(null);
  const toggleStatus = (id) => setRows((p) => p.map((x) => (x.id === id ? { ...x, status: x.status === "Open" ? "Resolved" : "Open" } : x)));
  const deleteRow = (id) => setRows((p) => p.filter((x) => x.id !== id));

  return (
    <div className="ad_page">
      <h2 className="ad_h2">Contact Inquiries</h2>
      <p className="ad_p">Manage contact form messages and responses.</p>
      <div className="ad_table_wrap">
        <table className="ad_table">
          <thead><tr><th>Name</th><th>Email</th><th>Message</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.message}</td>
                <td>{r.date}</td>
                <td><span className="ad_chip">{r.status}</span></td>
                <td className="rooms__actions_cell">
                  <button className="rooms__icon_btn" title="View" onClick={() => openView(r)}><FiEye /></button>
                  <button className="rooms__icon_btn" title="Mark as Resolved" onClick={() => toggleStatus(r.id)}><FiEdit2 /></button>
                  <DeleteIconButton title="Delete" onClick={() => deleteRow(r.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal?.mode === "view" && (
        <Modal title="Inquiry Details" onClose={close}>
          <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#6a6278" }}>Name</label>
              <p style={{ margin: "6px 0 0 0", fontSize: "14px", color: "#b5b5b5" }}>{modal.inquiry.name}</p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#6a6278" }}>Email</label>
              <p style={{ margin: "6px 0 0 0", fontSize: "14px", color: "#b5b5b5" }}>{modal.inquiry.email}</p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#6a6278" }}>Message</label>
              <p style={{ margin: "6px 0 0 0", fontSize: "14px", color: "#b5b5b5", lineHeight: "1.6" }}>{modal.inquiry.message}</p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#6a6278" }}>Date</label>
              <p style={{ margin: "6px 0 0 0", fontSize: "14px", color: "#b5b5b5" }}>{modal.inquiry.date}</p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#6a6278" }}>Status</label>
              <p style={{ margin: "6px 0 0 0", fontSize: "14px" }}><span className="ad_chip">{modal.inquiry.status}</span></p>
            </div>
            <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Close</button></div>
          </div>
        </Modal>
      )}
      </div>
  );
}
