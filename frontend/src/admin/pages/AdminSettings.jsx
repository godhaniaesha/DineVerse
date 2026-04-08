import { useState } from "react";
import DeleteIconButton from "../components/DeleteIconButton";

export default function AdminSettings() {
  const IcEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;
  const [configRows, setConfigRows] = useState([
    { id: 1, key: "booking_window_days", value: "30", type: "number" },
    { id: 2, key: "late_cancel_hours", value: "6", type: "number" },
  ]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ key: "", value: "", type: "text" });
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    emailNotifications: true,
    autoConfirmReservations: false,
    currency: "INR",
    timezone: "Asia/Kolkata",
    supportEmail: "admin@lumiere.com",
    checkInTime: "14:00",
    checkOutTime: "11:00",
  });

  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value }));
  const openAdd = () => { setForm({ key: "", value: "", type: "text" }); setModal({ mode: "add" }); };
  const openEdit = (row) => { setForm({ key: row.key, value: row.value, type: row.type }); setModal({ mode: "edit", row }); };
  const openDelete = (row) => setModal({ mode: "delete", row });
  const close = () => setModal(null);
  const save = () => {
    if (!form.key.trim() || !form.value.trim()) return;
    if (modal.mode === "add") setConfigRows((prev) => [...prev, { id: Date.now(), ...form }]);
    if (modal.mode === "edit") setConfigRows((prev) => prev.map((row) => (row.id === modal.row.id ? { ...row, ...form } : row)));
    close();
  };
  const remove = () => { setConfigRows((prev) => prev.filter((row) => row.id !== modal.row.id)); close(); };

  return (
    <div className="ad_page">
      <h2 className="ad_h2">Settings</h2>
      <p className="ad_p">Configure general behavior for the admin platform.</p>

      <div className="ad_cards_grid">
        <article className="ad_card">
          <div className="ad_card__label">System status</div>
          <div className="ad_card__value">{settings.maintenanceMode ? "Limited" : "Live"}</div>
        </article>
        <article className="ad_card">
          <div className="ad_card__label">Notification mode</div>
          <div className="ad_card__value">{settings.emailNotifications ? "Enabled" : "Muted"}</div>
        </article>
      </div>

      <div className="ad_settings_list" style={{ marginTop: 16 }}>
        <label className="ad_setting_item">
          <span>Maintenance mode</span>
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(event) => update("maintenanceMode", event.target.checked)}
          />
        </label>

        <label className="ad_setting_item">
          <span>Email notifications</span>
          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={(event) => update("emailNotifications", event.target.checked)}
          />
        </label>

        <label className="ad_setting_item">
          <span>Auto-confirm reservations</span>
          <input
            type="checkbox"
            checked={settings.autoConfirmReservations}
            onChange={(event) => update("autoConfirmReservations", event.target.checked)}
          />
        </label>

        <label className="ad_setting_item">
          <span>Currency</span>
          <select
            className="ad_select"
            value={settings.currency}
            onChange={(event) => update("currency", event.target.value)}
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </label>

        <label className="ad_setting_item">
          <span>Timezone</span>
          <select
            className="ad_select"
            value={settings.timezone}
            onChange={(event) => update("timezone", event.target.value)}
          >
            <option value="Asia/Kolkata">Asia/Kolkata</option>
            <option value="Europe/London">Europe/London</option>
            <option value="America/New_York">America/New_York</option>
          </select>
        </label>
      </div>

      <section className="ad_card" style={{ marginTop: 16 }}>
        <div className="rooms__header"><h3 className="ad_card__title">Advanced Config Table</h3><button className="rooms__add_btn" onClick={openAdd}>Add Config</button></div>
        <div className="ad_table_wrap">
          <table className="ad_table">
            <thead><tr><th>Key</th><th>Value</th><th>Type</th><th>Actions</th></tr></thead>
            <tbody>
              {configRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.key}</td><td>{row.value}</td><td>{row.type}</td>
                  <td>
                    <div className="d-flex" style={{ gap: "6px" }}>
                      <button className="rooms__icon_btn" title="Edit config" onClick={() => openEdit(row)}><IcEdit /></button>
                      <DeleteIconButton title="Delete config" onClick={() => openDelete(row)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ad_card" style={{ marginTop: 16 }}>
        <h3 className="ad_card__title">Operational Preferences</h3>
        <div className="ad_form_grid">
          <input
            className="ad_input"
            value={settings.supportEmail}
            onChange={(event) => update("supportEmail", event.target.value)}
            placeholder="Support email"
          />
          <input
            className="ad_input"
            type="time"
            value={settings.checkInTime}
            onChange={(event) => update("checkInTime", event.target.value)}
          />
          <input
            className="ad_input"
            type="time"
            value={settings.checkOutTime}
            onChange={(event) => update("checkOutTime", event.target.value)}
          />
        </div>
      </section>
      {(modal?.mode === "add" || modal?.mode === "edit") && (
        <>
          <div className="rooms__modal_overlay" onClick={close} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head"><span className="rooms__modal_title">{modal.mode === "add" ? "Add Config" : "Edit Config"}</span><button className="rooms__modal_close" onClick={close}>x</button></div>
            <div className="rooms__form_row"><label className="rooms__form_label">Key</label><input required className="rooms__form_input" value={form.key} onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))} /></div>
            <div className="rooms__form_row"><label className="rooms__form_label">Value</label><input required className="rooms__form_input" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} /></div>
            <div className="rooms__form_row"><label className="rooms__form_label">Type</label><select className="rooms__form_select" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}><option value="text">text</option><option value="number">number</option><option value="boolean">boolean</option></select></div>
            <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={save}>Save</button></div>
          </div>
        </>
      )}
      {modal?.mode === "delete" && (
        <>
          <div className="rooms__modal_overlay" onClick={close} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head"><span className="rooms__modal_title">Delete Config</span><button className="rooms__modal_close" onClick={close}>x</button></div>
            <p className="rooms__delete_msg">Delete {modal.row.key}?</p>
            <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--danger" onClick={remove}>Delete</button></div>
          </div>
        </>
      )}
    </div>
  );
}
