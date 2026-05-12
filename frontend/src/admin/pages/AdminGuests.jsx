import { useEffect, useMemo, useState } from "react";
import { useOrder } from "../../contexts/OrderContext";
import { FaUserCircle } from "react-icons/fa";


const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  image: "",
  visits: "1"
};
const IcEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>;

export default function AdminGuests() {
  const [guests, setGuests] = useState([]);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const { fetchGuests } = useOrder();

  const visibleGuests = useMemo(() => {
    const keyword = query.toLowerCase();
    return guests.filter((guest) => {
      const blob = `${guest.name} ${guest.phone}`.toLowerCase();
      return !keyword || blob.includes(keyword);
    });
  }, [guests, query]);


  const openAdd = () => { setForm(EMPTY_FORM); setModal({ mode: "add" }); };

  const close = () => setModal(null);
  const save = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim() || !form.image.trim()) return;
    const payload = { ...form, visits: Number(form.visits) };
    if (modal.mode === "add") setGuests((prev) => [...prev, { id: Date.now(), ...payload }]);
    if (modal.mode === "edit") setGuests((prev) => prev.map((guest) => (guest.id === modal.guest.id ? { ...guest, ...payload } : guest)));
    close();
  };
  useEffect(() => {
    const loadGuests = async () => {
      const data = await fetchGuests();

      if (data) {
        setGuests(data);
        console.log("Guests:", data);
      }
    };

    loadGuests();
  }, [fetchGuests]);

  return (
    <div className="ad_page">
      <div className="rooms__header">
        <div><h2 className="ad_h2">Guests</h2><p className="ad_p">Track frequent guests and manage VIP preferences.</p></div>
        {/* <button className="rooms__add_btn" onClick={openAdd}>Add Guest</button> */}
      </div>


      <div>
        <input
          className="rooms__search w-100 my-2"
          style={{ maxWidth: "320px" }}
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
            </tr>
          </thead>
          <tbody>
            {visibleGuests.map((guest) => (
              <tr key={guest.id}>
                <td>{guest.name}</td>
                <td>
                  {guest.image ? (
                    <img
                      src={guest.image}
                      alt={guest.name}
                      className="ad_gallery_img"
                      style={{
                        width: 42,
                        height: 42,
                        marginBottom: 0,
                        borderRadius: "50%",
                        objectFit: "cover"
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "block";
                      }}
                    />
                  ) : null}

                  <FaUserCircle
                    size={32}
                    color="#999"
                    style={{
                      display: guest.image ? "none" : "block"
                    }}
                  />
                </td>
                <td>{guest.phone}</td>
                <td>{guest.email}</td>
                <td>{guest.visits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal?.mode === "add" || modal?.mode === "edit") && (
        <>
          <div className="rooms__modal_overlay" onClick={close} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head"><span className="rooms__modal_title">{modal.mode === "add" ? "Add Guest" : "Edit Guest"}</span><button className="rooms__modal_close" onClick={close}>x</button></div>
            <div className="rooms__form_row"><label className="rooms__form_label">Name</label><input required className="rooms__form_input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
            <div className="rooms__form_row"><label className="rooms__form_label">Phone</label><input required className="rooms__form_input" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} /></div>
            <div className="rooms__form_row"><label className="rooms__form_label">Email</label><input required type="email" className="rooms__form_input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} /></div>
            <div className="rooms__form_row"><label className="rooms__form_label">Profile Image URL</label><input required className="rooms__form_input" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder="https://..." /></div>
            <div className="rooms__form_grid2"><div><label className="rooms__form_label">Visits</label><input type="number" min="1" className="rooms__form_input" value={form.visits} onChange={(e) => setForm((f) => ({ ...f, visits: e.target.value }))} /></div>
            </div>
            <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={save}>Save</button></div>
          </div>
        </>
      )}

    </div>
  );
}
