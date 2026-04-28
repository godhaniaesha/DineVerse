import { useMemo, useState, useRef, useEffect } from "react";
import DeleteIconButton from "../components/DeleteIconButton";
import { useMenu } from "../../contexts/MenuContext";
import { toast } from "react-toastify";

const IcEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>;

const AREAS = ["Restaurant", "Cafe", "Bar"];
const SORT_OPTIONS = ["None", "Name A–Z", "Name Z–A", "Area"];
const truncate = (str, len = 35) => str && str.length > len ? str.slice(0, len) + "..." : str;

const EMPTY = {
  // cuisineId: "",
  name: "",
  img: null,
  area: ["Restaurant"],
  status: "Active"
};
const CHEF_ROLES = new Set(["Cafe Chef", "Restaurant Chef", "Bar Chef"]);

export default function AdminCategoryManagement() {
  const { categories: rows,  loading, addCategory, updateCategory, deleteCategory } = useMenu();
  const  adminRole = localStorage.getItem("adminRole") || "Super Admin";
  const isChefRole = CHEF_ROLES.has(adminRole);

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("All");
  const [sortBy, setSortBy] = useState("None");
  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
  const areaDropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const close = () => {
    setModal(null);
    setForm(EMPTY);
    setIsAreaDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (areaDropdownRef.current && !areaDropdownRef.current.contains(event.target)) {
        setIsAreaDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForm(f => ({ ...f, img: e.target.files[0] }));
    }
  };

  const save = async () => {
    if (!form.name.trim()) return toast.error("Name is required");
    // if (!form.cuisineId) return toast.error("Cuisine is required");
    if (form.area.length === 0) return toast.error("At least one area is required");

    const formData = new FormData();
    formData.append("name", form.name);
    // formData.append("cuisineId", form.cuisineId);
    formData.append("status", form.status);
    formData.append("area", JSON.stringify(form.area));

    if (form.img instanceof File) {
      formData.append("img", form.img);
    }

    let result;
    if (modal?.mode === "add") {
      result = await addCategory(formData);
    } else if (modal?.mode === "edit" && modal.row) {
      result = await updateCategory(modal.row._id, formData);
    }

    if (result?.success) {
      toast.success(modal?.mode === "add" ? "Category added" : "Category updated");
      close();
    } else {
      toast.error(result?.error || "Something went wrong");
    }
  };

  const filtered = useMemo(() => {
    if (!rows) return [];
    return rows.filter((r) => {
      const matchArea = areaFilter === "All" || r.area.includes(areaFilter);
      const cuisineName = r.cuisineId?.name || "";
      const text = `${r.name} ${r.area.join(" ")} ${cuisineName}`.toLowerCase();
      const matchSearch = !search || text.includes(search.toLowerCase());
      return matchArea && matchSearch;
    });
  }, [rows, areaFilter, search]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortBy === "Name A–Z") return list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "Name Z–A") return list.sort((a, b) => b.name.localeCompare(a.name));
    if (sortBy === "Area") return list.sort((a, b) => (a.area[0] || "").localeCompare(b.area[0] || ""));
    return list;
  }, [filtered, sortBy]);

  if (loading) return <div className="ad_page"><div className="ad_h2">Loading Categories...</div></div>;

  return (
    <div className="ad_page">
      <div className="rooms__header">
        <div><h2 className="ad_h2">Category Management</h2><p className="ad_p">Manage categories in the system by cuisine and area.</p></div>
        {!isChefRole && <button className="rooms__add_btn" onClick={() => { setForm(EMPTY); setModal({ mode: "add" }); }}>Add Category</button>}
      </div>

      <div className="rooms__filters" style={{ marginBottom: 12 }}>
        <input
          className="rooms__search"
          placeholder="Search name/area/cuisine..."
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
              <th>Image</th>
              <th>Category Name</th>
              {/* <th>Cuisine</th> */}
              <th>Area</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r._id}>
                <td>
                  {r.img ? (
                    <img src={r.img} alt={r.name} className="ad_gallery_img" style={{ width: 60, height: 40, marginBottom: 0, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 60, height: 40, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>No Img</div>
                  )}
                </td>
                <td>{r.name}</td>
                {/* <td>{r.cuisineId?.name || "-"}</td> */}

                <td>{r.area.join(", ")}</td>
                <td><span className="ad_chip">{r.status}</span></td>
                <td>
                  <div className="d-flex" style={{ gap: "6px" }}>
                    {!isChefRole ? (
                      <>
                        <button className="rooms__icon_btn" onClick={() => {
                          setForm({
                            ...r,
                            cuisineId: r.cuisineId?._id || r.cuisineId,
                            img: r.img
                          });
                          setModal({ mode: "edit", row: r });
                        }}><IcEdit /></button>
                        <DeleteIconButton onClick={() => setModal({ mode: "delete", row: r })} />
                      </>
                    ) : (
                      <span className="ad_chip">View only</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && <tr><td colSpan={6} className="rooms__empty">No categories match filters</td></tr>}
          </tbody>
        </table>
      </div>

      {!isChefRole && (modal?.mode === "add" || modal?.mode === "edit") && (
        <>
          <div className="rooms__modal_overlay" onClick={close} />
          <div className="rooms__modal_box">
            <div className="rooms__modal_head">
              <span className="rooms__modal_title">{modal.mode === "add" ? "Add Category" : "Edit Category"}</span>
              <button className="rooms__modal_close" onClick={close}>x</button>
            </div>

            <div className="rooms__form_row"><label className="rooms__form_label">Name</label><input className="rooms__form_input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>

            <div className="rooms__form_row">
              <label className="rooms__form_label">Cuisine</label>
              {/* <select className="rooms__form_select" value={form.cuisineId} onChange={(e) => setForm((f) => ({ ...f, cuisineId: e.target.value }))}>
                <option value="">Select Cuisine</option>
                {cuisines.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select> */}
            </div>

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

            <div className="rooms__form_row">
              <label className="rooms__form_label">Area</label>
              <div className="rooms__multi_select_wrapper" ref={areaDropdownRef}>
                <div className="rooms__multi_select_trigger" onClick={() => setIsAreaDropdownOpen(!isAreaDropdownOpen)}>
                  {form.area.length > 0 ? (
                    form.area.map((a) => <span key={a} className="rooms__multi_select_tag">{a}</span>)
                  ) : (
                    <span className="rooms__multi_select_placeholder">Select Areas</span>
                  )}
                </div>
                {isAreaDropdownOpen && (
                  <div className="rooms__multi_select_dropdown">
                    {AREAS.map((area) => {
                      const isSelected = form.area.includes(area);
                      return (
                        <div key={area} className={`rooms__multi_select_item ${isSelected ? "selected" : ""}`} onClick={() => {
                          const next = isSelected ? form.area.filter((a) => a !== area) : [...form.area, area];
                          setForm((f) => ({ ...f, area: next }));
                        }}>
                          <div className="rooms__multi_select_checkbox"></div>
                          <span className="rooms__multi_select_item_label">{area}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

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
              <span className="rooms__modal_title">Delete Category</span>
              <button className="rooms__modal_close" onClick={close}>x</button>
            </div>
            <p className="rooms__delete_msg">Delete {modal.row.name}?</p>
            <div className="rooms__form_actions">
              <button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button>
              <button className="rooms__btn rooms__btn--danger" onClick={async () => {
                const res = await deleteCategory(modal.row._id);
                if (res.success) {
                  toast.success("Category deleted");
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
