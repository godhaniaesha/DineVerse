import { useState } from "react";
import { useTable } from "../../contexts/TableContext";
import DeleteIconButton from "../components/DeleteIconButton";

const EMPTY_FORM = {
  tableNo: "",
  area: "",
  capacity: "2",
  status: "Available",
};

const AREA_OPTIONS = ["Restaurant", "Cafe", "Bar"];
const STATUS_OPTIONS = ["Available", "Occupied", "Reserved"];
const AREA_PREFIXES = {
  Restaurant: "R",
  Cafe: "C",
  Bar: "B"
};

const IcEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
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
          <button className="rooms__modal_close" onClick={onClose}>x</button>
        </div>
        {children}
      </div>
    </>
  );
}

export default function AdminTables() {
  const { tables, addTable, updateTable, deleteTable, loading } = useTable();

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [areaFilter, setAreaFilter] = useState("All");

  // 🔄 Map backend → frontend
  const rows = tables.map((t) => ({
    id: t._id,
    tableNo: t.tableNo,
    area: t.area,
    capacity: t.capacity,
    status: t.status || "Available",
  }));

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal({ mode: "add" });
  };

  const openEdit = (row) => {
    setForm({
      ...row,
      capacity: String(row.capacity),
    });
    setModal({ mode: "edit", row });
  };

  const openDelete = (row) => {
    setModal({ mode: "delete", row });
  };

  const close = () => setModal(null);

  // ✅ SAVE (ADD + EDIT)
  const save = async () => {
    if (!form.tableNo.trim() || !form.area.trim() || !form.capacity) return;

    // Auto-prefix table number
    const prefix = AREA_PREFIXES[form.area] || "";
    let finalTableNo = form.tableNo.trim();
    
    // If user entered only number, add prefix
    if (/^\d+$/.test(finalTableNo)) {
      finalTableNo = prefix + finalTableNo;
    } else {
      // If user entered with prefix, ensure it's correct
      const requiredPrefix = prefix;
      if (!finalTableNo.startsWith(requiredPrefix)) {
        // Remove any existing prefix and add correct one
        const numPart = finalTableNo.replace(/^[A-Za-z]+/, "");
        finalTableNo = requiredPrefix + (numPart || "1");
      }
    }

    const payload = {
      tableNo: finalTableNo,
      area: form.area,
      capacity: Number(form.capacity),
      status: form.status,
    };

    let result;
    if (modal.mode === "add") {
      result = await addTable(payload);
    }

    if (modal.mode === "edit") {
      result = await updateTable(modal.row.id, payload);
    }

    if (result?.success) {
      close();
    } else {
      alert(result?.error || "Failed to save table");
    }
  };

  // ❌ DELETE
  const remove = async () => {
    const result = await deleteTable(modal.row.id);
    if (result?.success) {
      close();
    } else {
      alert(result?.error || "Failed to delete table");
    }
  };

  return (
    <div className="ad_page">
      {/* HEADER */}
      <div className="rooms__header">
        <div>
          <h2 className="ad_h2">Tables Management</h2>
          <p className="ad_p">
            Manage table capacity and seating status for all areas.
          </p>
        </div>
        <button className="rooms__add_btn" onClick={openAdd}>
          Add Table
        </button>
      </div>

      {/* FILTER */}
      <div className="ad_row_actions" style={{ marginBottom: 16, width: "max-content" }}>
        <select
          className="rooms__form_select"
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Cafe">Cafe</option>
          <option value="Restaurant">Restaurant</option>
          <option value="Bar">Bar</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="ad_table_wrap">
        <table className="ad_table">
          <thead>
            <tr>
              <th>Table</th>
              <th>Area</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : (
              rows
                .filter((row) => areaFilter === "All" || row.area === areaFilter)
                .map((row) => (
                  <tr key={row.id}>
                    <td>{row.tableNo}</td>
                    <td>{row.area}</td>
                    <td>{row.capacity} members</td>
                    <td>
                      <span className="ad_chip">{row.status}</span>
                    </td>
                    <td>
                      <div className="d-flex" style={{ gap: "6px" }}>
                        <button
                          className="rooms__icon_btn"
                          title="Edit table"
                          onClick={() => openEdit(row)}
                        >
                          <IcEdit />
                        </button>
                        <DeleteIconButton
                          title="Delete table"
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

      {/* ADD / EDIT MODAL */}
      {(modal?.mode === "add" || modal?.mode === "edit") && (
        <Modal
          title={modal.mode === "add" ? "Add Table" : "Edit Table"}
          onClose={close}
        >
          <div className="rooms__form_row">
            <label className="rooms__form_label">Table No</label>
            <input
              className="rooms__form_input"
              value={form.tableNo}
              onChange={(e) =>
                setForm((f) => ({ ...f, tableNo: e.target.value }))
              }
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
              <option value="">Select Area</option>
              {AREA_OPTIONS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div className="rooms__form_row">
            <label className="rooms__form_label">Capacity</label>
            <input
              type="number"
              min="1"
              max="20"
              className="rooms__form_input"
              value={form.capacity}
              onChange={(e) =>
                setForm((f) => ({ ...f, capacity: e.target.value }))
              }
            />
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
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
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

      {/* DELETE MODAL */}
      {modal?.mode === "delete" && (
        <Modal title="Delete Table" onClose={close}>
          <p className="rooms__delete_msg">
            Delete {modal.row.tableNo}?
          </p>

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
    </div>
  );
}