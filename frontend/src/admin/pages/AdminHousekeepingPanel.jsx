import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";

const INITIAL_TASKS = [
  { id: 1, room: "302", task: "deluxe", assigned: "HK-01", status: "checkout", hasBooking: true, clean_status: "Pending", housekeeper_name: "" },
  { id: 2, room: "110", task: "suite", assigned: "HK-03", status: "checkout", hasBooking: true, clean_status: "In Progress", housekeeper_name: "John Doe" },
  { id: 3, room: "205", task: "deluxe", assigned: "HK-02", status: "occupied", hasBooking: true, clean_status: "Clean", housekeeper_name: "Jane Smith" },
  { id: 4, room: "401", task: "suite", assigned: "HK-01", status: "checkout", hasBooking: false, clean_status: "Pending", housekeeper_name: "" },
];

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

export default function AdminHousekeepingPanel() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [modal, setModal] = useState(null);

  const filteredTasks = tasks.filter(task => task.hasBooking && task.status === "checkout");

  const openEdit = (task) => setModal({ mode: "edit", task });
  const close = () => setModal(null);

  const saveCleanStatus = (id, newStatus) => {
    const adminName = localStorage.getItem("adminName") || "Admin";
    setTasks(prev => prev.map(t => t.id === id ? { ...t, clean_status: newStatus, housekeeper_name: adminName } : t));
    close();
  };

  return (
    <div className="ad_page">
      <h2 className="ad_h2">Housekeeping Panel</h2>
      <p className="ad_p">Housekeeping task board for room cleaning and status updates.</p>

      <div className="ad_two_col">
        <div className="ad_card">
          <h3>Rooms To Clean</h3>
          <p className="ad_metric">{filteredTasks.filter(t => t.clean_status === "Pending").length}</p>
        </div>
        <div className="ad_card">
          <h3>In Progress</h3>
          <p className="ad_metric">{filteredTasks.filter(t => t.clean_status === "In Progress").length}</p>
        </div>
        <div className="ad_card">
          <h3>Cleaned Today</h3>
          <p className="ad_metric">{filteredTasks.filter(t => t.clean_status === "Clean").length}</p>
        </div>
      </div>

      <div className="ad_table_wrap mt-3">
        <table className="ad_table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Type</th>
              <th>Status</th>
              <th>Clean Status</th>
              <th>Last Updated By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id}>
                <td>{task.room}</td>
                <td>{task.task}</td>
                <td><span className="ad_chip">{task.status}</span></td>
                <td><span className="ad_chip">{task.clean_status}</span></td>
                <td>{task.housekeeper_name || "N/A"}</td>
                <td className="rooms__actions_cell">
                  <button className="rooms__icon_btn" title="Edit Clean Status" onClick={() => openEdit(task)}>
                    <FiEdit2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal?.mode === "edit" && (
        <Modal title="Edit Clean Status" onClose={close}>
          <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#666" }}>Room</label>
              <p style={{ margin: "6px 0 0 0", fontSize: "14px", color: "#333" }}>{modal.task.room}</p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#666" }}>Current Clean Status</label>
              <p style={{ margin: "6px 0 0 0", fontSize: "14px", color: "#333" }}>{modal.task.clean_status}</p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label htmlFor="clean_status" style={{ fontSize: "12px", fontWeight: "700", color: "#666" }}>New Clean Status</label>
              <select className="rooms__form_select" id="clean_status" defaultValue={modal.task.clean_status} >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Clean">Clean</option>
              </select>
            </div>
            <div className="rooms__form_actions">
              <button className="rooms__btn rooms__btn--primary" onClick={() => {
                const select = document.getElementById("clean_status");
                saveCleanStatus(modal.task.id, select.value);
              }}>Save</button>
              <button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
