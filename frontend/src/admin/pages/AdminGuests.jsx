import { useMemo, useState } from "react";

const INITIAL_GUESTS = [
  { id: 1, name: "Aarav Sharma", phone: "+91 98765 43210", email: "aarav@example.com", image: "https://i.pravatar.cc/80?img=11", visits: 7, vip: true },
  { id: 2, name: "Mia Wilson", phone: "+1 415 555 0109", email: "mia@example.com", image: "https://i.pravatar.cc/80?img=5", visits: 3, vip: false },
  { id: 3, name: "Noah Johnson", phone: "+1 212 555 0151", email: "noah@example.com", image: "https://i.pravatar.cc/80?img=16", visits: 5, vip: true },
  { id: 4, name: "Riya Patel", phone: "+91 99887 65432", email: "riya@example.com", image: "https://i.pravatar.cc/80?img=23", visits: 2, vip: false },
];
const EMPTY_FORM = { name: "", phone: "", email: "", image: "", visits: "1", vip: false };
const IcEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;
const IcTrash = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m6 6 1 14h10l1-14"/></svg>;

export default function AdminGuests() {
  const [guests, setGuests] = useState(INITIAL_GUESTS);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const visibleGuests = useMemo(() => {
    const keyword = query.toLowerCase();
    return guests.filter((guest) => {
      const blob = `${guest.name} ${guest.phone}`.toLowerCase();
      return !keyword || blob.includes(keyword);
    });
  }, [guests, query]);

  const toggleVip = (id) => {
    setGuests((current) =>
      current.map((guest) => (guest.id === id ? { ...guest, vip: !guest.vip } : guest))
    );
  };
  const openAdd = () => { setForm(EMPTY_FORM); setModal({ mode: "add" }); };
  const openEdit = (guest) => { setForm({ ...guest, visits: String(guest.visits) }); setModal({ mode: "edit", guest }); };
  const openDelete = (guest) => setModal({ mode: "delete", guest });
  const close = () => setModal(null);
  const save = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.image.trim()) return;
    const payload = { ...form, visits: Number(form.visits) };
    if (modal.mode === "add") setGuests((prev) => [...prev, { id: Date.now(), ...payload }]);
    if (modal.mode === "edit") setGuests((prev) => prev.map((guest) => (guest.id === modal.guest.id ? { ...guest, ...payload } : guest)));
    close();
  };
  const remove = () => { setGuests((prev) => prev.filter((guest) => guest.id !== modal.guest.id)); close(); };

  const vipCount = guests.filter((guest) => guest.vip).length;
  const totalVisits = guests.reduce((sum, guest) => sum + guest.visits, 0);

  return (
    <div className="ad_page">
      <div className="rooms__header">
        <div><h2 className="ad_h2">Guests</h2><p className="ad_p">Track frequent guests and manage VIP preferences.</p></div>
        <button className="rooms__add_btn" onClick={openAdd}>Add Guest</button>
      </div>

      {/* <div className="ad_cards_grid">
        <article className="ad_card">
          <div className="ad_card__label">Total guests</div>
          <div className="ad_card__value">{guests.length}</div>
        </article>
        <article className="ad_card">
          <div className="ad_card__label">VIP guests</div>
          <div className="ad_card__value">{vipCount}</div>
        </article>
        <article className="ad_card">
          <div className="ad_card__label">Guest visits</div>
          <div className="ad_card__value">{totalVisits}</div>
        </article>
        <article className="ad_card">
          <div className="ad_card__label">Retention score</div>
          <div className="ad_card__value">82%</div>
        </article>
      </div> */}

      <div className="ad_toolbar">
        <input
          className="ad_input w-25"
          placeholder="Search guest by name or phone"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="ad_table_wrap">
        <table className="ad_table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Photo</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Visits</th>
              <th>VIP</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleGuests.map((guest) => (
              <tr key={guest.id}>
                <td>{guest.name}</td>
                <td><img src={guest.image} alt={guest.name} className="ad_gallery_img" style={{ width: 42, height: 42, marginBottom: 0, borderRadius: "50%" }} /></td>
                <td>{guest.phone}</td>
                <td>{guest.email}</td>
                <td>{guest.visits}</td>
                <td>
                  <button className="ad_btn ad_btn--ghost" onClick={() => toggleVip(guest.id)}>
                    {guest.vip ? "VIP" : "Regular"}
                  </button>
                </td>
                <td className="rooms__actions_cell"><button className="rooms__icon_btn" title="Edit guest" onClick={() => openEdit(guest)}><IcEdit /></button><button className="rooms__icon_btn rooms__icon_btn--danger" title="Delete guest" onClick={() => openDelete(guest)}><IcTrash /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <section className="ad_card" style={{ marginTop: 16 }}>
        <h3 className="ad_card__title">Guest Engagement Suggestions</h3>
        <ul className="ad_list">
          <li className="ad_list__item">Offer loyalty coupons to guests with 3+ visits.</li>
          <li className="ad_list__item">Send personalized festive menus to VIP guests.</li>
          <li className="ad_list__item">Track birthdays and anniversaries for targeted offers.</li>
        </ul>
      </section> */}
      {(modal?.mode === "add" || modal?.mode === "edit") && (
        <>
          <div className="rooms__modal_overlay" onClick={close} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head"><span className="rooms__modal_title">{modal.mode === "add" ? "Add Guest" : "Edit Guest"}</span><button className="rooms__modal_close" onClick={close}>x</button></div>
            <div className="rooms__form_row"><label className="rooms__form_label">Name</label><input required className="rooms__form_input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
            <div className="rooms__form_row"><label className="rooms__form_label">Phone</label><input required className="rooms__form_input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} /></div>
            <div className="rooms__form_row"><label className="rooms__form_label">Email</label><input required type="email" className="rooms__form_input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} /></div>
            <div className="rooms__form_row"><label className="rooms__form_label">Profile Image URL</label><input required className="rooms__form_input" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://..." /></div>
            <div className="rooms__form_grid2"><div><label className="rooms__form_label">Visits</label><input type="number" min="1" className="rooms__form_input" value={form.visits} onChange={(e) => setForm((f) => ({ ...f, visits: e.target.value }))} /></div><div><label className="rooms__form_label">VIP</label><select className="rooms__form_select" value={String(form.vip)} onChange={(e) => setForm((f) => ({ ...f, vip: e.target.value === "true" }))}><option value="false">Regular</option><option value="true">VIP</option></select></div></div>
            <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={save}>Save</button></div>
          </div>
        </>
      )}
      {modal?.mode === "delete" && (
        <>
          <div className="rooms__modal_overlay" onClick={close} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head"><span className="rooms__modal_title">Delete Guest</span><button className="rooms__modal_close" onClick={close}>x</button></div>
            <p className="rooms__delete_msg">Delete {modal.guest.name}?</p>
            <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--danger" onClick={remove}>Delete</button></div>
          </div>
        </>
      )}
    </div>
  );
}
