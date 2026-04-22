import { useState, useEffect } from "react";
import { FiEdit2 } from "react-icons/fi";
import housekeepingService from "../../services/housekeepingService";

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
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ roomsToClean: 0, inProgress: 0, cleanedToday: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    fetchHousekeepingData();
  }, []);

  const fetchHousekeepingData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await housekeepingService.getHousekeepingTasks();
      
      if (response.success) {
        setTasks(Array.isArray(response.data.tasks) ? response.data.tasks : []);
        setStats(response.data.stats || { roomsToClean: 0, inProgress: 0, cleanedToday: 0 });
      } else {
        setError(response.msg || 'Failed to load housekeeping data');
      }
    } catch (error) {
      console.error('Error fetching housekeeping data:', error);
      setError('Failed to load housekeeping data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (task) => setModal({ mode: "edit", task });
  const close = () => setModal(null);

  const saveCleanStatus = async (roomId, newStatus) => {
    try {
      const response = await housekeepingService.updateCleanStatus(roomId, newStatus);
      
      if (response.success) {
        // Refresh data after update
        await fetchHousekeepingData();
        close();
      } else {
        setError(response.msg || 'Failed to update clean status');
      }
    } catch (error) {
      console.error('Error updating clean status:', error);
      setError('Failed to update clean status. Please try again.');
    }
  };

  const getRoomTypeDisplay = (room) => {
    return room.roomType?.display_name || room.roomType || 'Standard';
  };

  const getHousekeeperName = (room) => {
    return room.assignedHousekeeper?.full_name || 'Not Assigned';
  };

  if (loading) {
    return (
      <div className="ad_page">
        <h2 className="ad_h2">Housekeeping Panel</h2>
        <p className="ad_p">Housekeeping task board for room cleaning and status updates.</p>
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading housekeeping data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ad_page">
        <h2 className="ad_h2">Housekeeping Panel</h2>
        <p className="ad_p">Housekeeping task board for room cleaning and status updates.</p>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ color: '#ff6b6b', marginBottom: '16px' }}>{error}</div>
          <button 
            className="rooms__btn rooms__btn--primary" 
            onClick={fetchHousekeepingData}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ad_page">
      <h2 className="ad_h2">Housekeeping Panel</h2>
      <p className="ad_p">Housekeeping task board for room cleaning and status updates.</p>

      <div className="ad_two_col">
        <div className="ad_card">
          <h3>Rooms To Clean</h3>
          <p className="ad_metric">{stats.roomsToClean}</p>
        </div>
        <div className="ad_card">
          <h3>In Progress</h3>
          <p className="ad_metric">{stats.inProgress}</p>
        </div>
        <div className="ad_card">
          <h3>Cleaned Today</h3>
          <p className="ad_metric">{stats.cleanedToday}</p>
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
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px' }}>
                  No housekeeping tasks found
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.roomNumber}</td>
                  <td>{getRoomTypeDisplay(task)}</td>
                  <td><span className="ad_chip">{task.status}</span></td>
                  <td><span className="ad_chip">{task.cleanStatus}</span></td>
                  <td>{getHousekeeperName(task)}</td>
                  <td>
                    <div className="d-flex" style={{ gap: "6px" }}>
                      <button className="rooms__icon_btn" title="Edit Clean Status" onClick={() => openEdit(task)}>
                        <FiEdit2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modal?.mode === "edit" && (
        <Modal title="Edit Clean Status" onClose={close}>
          <div style={{ padding: "20px" }}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#666" }}>Room</label>
              <p style={{ margin: "6px 0 0 0", fontSize: "14px", color: "#cbc7c7" }}>{modal.task.roomNumber}</p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#666" }}>Room Type</label>
              <p style={{ margin: "6px 0 0 0", fontSize: "14px", color: "#cbc7c7" }}>{getRoomTypeDisplay(modal.task)}</p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", color: "#666" }}>Current Clean Status</label>
              <p style={{ margin: "6px 0 0 0", fontSize: "14px", color: "#cbc7c7" }}>{modal.task.cleanStatus}</p>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label htmlFor="clean_status" style={{ fontSize: "12px", fontWeight: "700", color: "#666" }}>New Clean Status</label>
              <select className="rooms__form_select" id="clean_status" defaultValue={modal.task.cleanStatus} >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Clean">Clean</option>
                <option value="Dirty">Dirty</option>
              </select>
            </div>
            <div className="rooms__form_actions">
              <button className="rooms__btn rooms__btn--primary" onClick={() => {
                const select = document.getElementById("clean_status");
                saveCleanStatus(modal.task._id, select.value);
              }}>Save</button>
              <button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
