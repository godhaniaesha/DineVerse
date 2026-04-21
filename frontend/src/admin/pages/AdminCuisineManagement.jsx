import { useEffect, useMemo, useState, useRef } from "react";
import DeleteIconButton from "../components/DeleteIconButton";
import { useMenu } from "../../contexts/MenuContext";
import { toast } from "react-toastify";

const IcEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;

const AREAS = ["Restaurant", "Cafe", "Bar"];
const SORT_OPTIONS = ["None", "Name A–Z", "Name Z–A", "Area"];
const truncate = (str, len = 35) => str && str.length > len ? str.slice(0, len) + "..." : str;

const EMPTY = { name: "", img: null, area: "Restaurant", status: "Active", description: "" };
const CHEF_ROLES = new Set(["Cafe Chef", "Restaurant Chef", "Bar Chef"]);

export default function AdminCuisineManagement() {
  const { cuisines: rows, loading, addCuisine, updateCuisine, deleteCuisine } = useMenu();
  const adminRole = localStorage.getItem("adminRole") || "Super Admin";
  const isChefRole = CHEF_ROLES.has(adminRole);
  
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("All");
  const [sortBy, setSortBy] = useState("None");
  const fileInputRef = useRef(null);

  const close = () => {
    setModal(null);
    setForm(EMPTY);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForm(f => ({ ...f, img: e.target.files[0] }));
    }
  };

  const save = async () => {
    if (!form.name.trim() || !form.description.trim()) return toast.error("Name and Description are required");
    
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("area", form.area);
    formData.append("status", form.status);
    
    if (form.img instanceof File) {
      formData.append("img", form.img);
    }

    let result;
    if (modal?.mode === "add") {
      result = await addCuisine(formData);
    } else if (modal?.mode === "edit" && modal.row) {
      result = await updateCuisine(modal.row._id, formData);
    }

    if (result?.success) {
      toast.success(modal?.mode === "add" ? "Cuisine added" : "Cuisine updated");
      close();
    } else {
      toast.error(result?.error || "Something went wrong");
    }
  };

  const filtered = useMemo(() => {
    if (!rows) return [];
    return rows.filter((r) => {
      const matchArea = areaFilter === "All" || r.area === areaFilter;
      const text = `${r.name} ${r.description} ${r.area}`.toLowerCase();
      const matchSearch = !search || text.includes(search.toLowerCase());
      return matchArea && matchSearch;
    });
  }, [rows, areaFilter, search]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortBy === "Name A–Z") return list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "Name Z–A") return list.sort((a, b) => b.name.localeCompare(a.name));
    if (sortBy === "Area") return list.sort((a, b) => AREAS.indexOf(a.area) - AREAS.indexOf(b.area));
    return list;
  }, [filtered, sortBy]);

  if (loading) return <div className="ad_page"><div className="ad_h2">Loading Cuisines...</div></div>;

  return (
    <div className="ad_page">
      <div className="rooms__header">
        <div>
          <h2 className="ad_h2">Cuisine Management</h2>
          <p className="ad_p">Create and manage cuisines by area with search and sort.</p>
        </div>
        {!isChefRole && (
          <button className="rooms__add_btn" onClick={() => { setForm(EMPTY); setModal({ mode: "add" }); }}>
            Add Cuisine
          </button>
        )}
      </div>

      <div className="rooms__filters" style={{ marginBottom: 12 }}>
        <input
          className="rooms__search"
          placeholder="Search by cuisine/description/area..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 260, marginRight: 8 }}
        />
        <select className="rooms__select" value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} style={{ marginRight: 8 }}>
          <option>All</option>
          {AREAS.map((area) => <option key={area}>{area}</option>)}
        </select>
        <select className="rooms__select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          {SORT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      <div className="ad_table_wrap">
        <table className="ad_table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Description</th>
              <th>Area</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r._id}>
                <td>{r.name}</td>
                <td>
                  {r.img ? (
                    <img src={r.img} alt={r.name} className="ad_gallery_img" style={{ width: 60, height: 40, marginBottom: 0, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 60, height: 40, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>No Img</div>
                  )}
                </td>
                <td title={r.description}>{truncate(r.description)}</td>
                <td>{r.area}</td>
                <td><span className="ad_chip">{r.status}</span></td>
                <td>
                  <div className="d-flex" style={{gap:"6px"}}>
                  {!isChefRole ? (
                    <>
                      <button className="rooms__icon_btn" onClick={() => { setForm({ ...r, img: r.img }); setModal({ mode: "edit", row: r }); }}><IcEdit /></button>
                      <DeleteIconButton onClick={() => setModal({ mode: "delete", row: r })} />
                    </>
                  ) : (
                    <span className="ad_chip">View only</span>
                  )}
                  </div>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr><td colSpan={7} className="rooms__empty">No cuisines match filters</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {!isChefRole && (modal?.mode === "add" || modal?.mode === "edit") && (
        <>
          <div className="rooms__modal_overlay" onClick={close} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head">
              <span className="rooms__modal_title">{modal.mode === "add" ? "Add Cuisine" : "Edit Cuisine"}</span>
              <button className="rooms__modal_close" onClick={close}>x</button>
            </div>

            <div className="rooms__form_row"><label className="rooms__form_label">Name</label><input className="rooms__form_input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
            
            <div className="rooms__form_row">
              <label className="rooms__form_label">Image</label>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
              <div className="d-flex align-items-center gap-2">
                <button className="rooms__add_btn" style={{ padding: '5px 15px', fontSize: '12px' }} onClick={() => fileInputRef.current.click()}>
                  {form.img ? "Change Image" : "Upload Image"}
                </button>
                {form.img && <span style={{ fontSize: '12px' }}>{form.img instanceof File ? form.img.name : "Current Image"}</span>}
              </div>
            </div>

            <div className="rooms__form_row"><label className="rooms__form_label">Description</label><textarea className="rooms__form_input" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></div>
            <div className="rooms__form_row"><label className="rooms__form_label">Area</label><select className="rooms__form_select" value={form.area} onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}>{AREAS.map((a) => <option key={a}>{a}</option>)}</select></div>
            <div className="rooms__form_row"><label className="rooms__form_label">Status</label><select className="rooms__form_select" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}><option value="Active">Active</option><option value="Inactive">Inactive</option></select></div>

            <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={save}>Save</button></div>
          </div>
        </>
      )}
      {!isChefRole && modal?.mode === "delete" && (
        <>
          <div className="rooms__modal_overlay" onClick={close} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head">
              <span className="rooms__modal_title">Delete Cuisine</span>
              <button className="rooms__modal_close" onClick={close}>x</button>
            </div>
            <p className="rooms__delete_msg">Delete {modal.row.name}?</p>
            <div className="rooms__form_actions">
              <button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button>
              <button className="rooms__btn rooms__btn--danger" onClick={async () => {
                const res = await deleteCuisine(modal.row._id);
                if (res.success) {
                  toast.success("Cuisine deleted");
                  close();
                } else {
                  toast.error(res.error || "Delete failed");
                }
              }}>Delete</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
