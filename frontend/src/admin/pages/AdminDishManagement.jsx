import { useEffect, useMemo, useState, useRef } from "react";
import DeleteIconButton from "../components/DeleteIconButton";
import { useMenu } from "../../contexts/MenuContext";
import { toast } from "react-toastify";

const IcEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>;

const AREAS = ["Restaurant", "Cafe", "Bar"];
const COURSES = ["Soup", "Appetizer", "Palate Cleanser", "Main Course", "Dessert"];
const MEALS = ["Veg", "Non-Veg"];
const SORT_OPTIONS = ["None", "Name A–Z", "Name Z–A", "Area", "Course"];
const truncate = (str, len = 35) => str && str.length > len ? str.slice(0, len) + "..." : str;

const EMPTY = {
    cat_id: "",
    name: "",
    img: null,
    short_des: "",
    des: "",
    course: "Main Course",
    mealType: "Veg",
    price: "",
    prepTime: "",
    ingredients: "",
    note: "",
    chef: [],
    area: ["Restaurant"],
    status: "available",
};

const CHEF_ROLES = new Set(["Cafe Chef", "Restaurant Chef", "Bar Chef"]);

export default function AdminDishManagement() {
    const { mappedDishes: rows, categories, chefs, loading, addDish, updateDish, deleteDish } = useMenu();
    const adminRole = localStorage.getItem("adminRole") || "Super Admin";
    const adminName = localStorage.getItem("adminName") || "";
    const isChefRole = CHEF_ROLES.has(adminRole);
    
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [search, setSearch] = useState("");
    const [areaFilter, setAreaFilter] = useState("All");
    const [sortBy, setSortBy] = useState("None");
    const [isChefDropdownOpen, setIsChefDropdownOpen] = useState(false);
    const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
    const chefDropdownRef = useRef(null);
    const areaDropdownRef = useRef(null);
    const fileInputRef = useRef(null);

    const close = () => {
        setModal(null);
        setIsChefDropdownOpen(false);
        setIsAreaDropdownOpen(false);
        setForm(EMPTY);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chefDropdownRef.current && !chefDropdownRef.current.contains(event.target)) {
                setIsChefDropdownOpen(false);
            }
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
        if (!form.price || Number(form.price) <= 0) return toast.error("Valid price is required");
        if (!form.cat_id) return toast.error("Category is required");

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("cat_id", form.cat_id);
        formData.append("short_des", form.short_des);
        formData.append("des", form.des);
        formData.append("course", form.course);
        formData.append("mealType", form.mealType);
        formData.append("price", form.price);
        formData.append("prepTime", form.prepTime);
        formData.append("ingredients", form.ingredients);
        formData.append("note", form.note);
        formData.append("status", form.status);
        formData.append("area", JSON.stringify(form.area));
        formData.append("chef", JSON.stringify(form.chef));
        
        if (form.img instanceof File) {
            formData.append("img", form.img);
        }

        let result;
        if (modal?.mode === "add") {
            result = await addDish(formData);
        } else if (modal?.mode === "edit" && modal.row) {
            result = await updateDish(modal.row.id, formData);
        }

        if (result?.success) {
            toast.success(modal?.mode === "add" ? "Dish added successfully" : "Dish updated successfully");
            close();
        } else {
            toast.error(result?.error || "Something went wrong");
        }
    };

    const filtered = useMemo(() => {
        if (!rows) return [];
        return rows.filter((r) => {
            const matchArea = areaFilter === "All" || r.area.includes(areaFilter);
            const text = `${r.name} ${r.short_des} ${r.des} ${r.course} ${r.mealType} ${r.area.join(" ")}`.toLowerCase();
            return matchArea && (!search || text.includes(search.toLowerCase()));
        });
    }, [rows, areaFilter, search]);

    const sorted = useMemo(() => {
        const list = [...filtered];
        if (sortBy === "Name A–Z") return list.sort((a, b) => a.name.localeCompare(b.name));
        if (sortBy === "Name Z–A") return list.sort((a, b) => b.name.localeCompare(a.name));
        if (sortBy === "Area") return list.sort((a, b) => (a.area[0] || "").localeCompare(b.area[0] || ""));
        if (sortBy === "Course") return list.sort((a, b) => COURSES.indexOf(a.course) - COURSES.indexOf(b.course));
        return list;
    }, [filtered, sortBy]);

    if (loading) return <div className="ad_page"><div className="ad_h2">Loading Dishes...</div></div>;

    return (
        <div className="ad_page">
            <div className="rooms__header">
                <div>
                    <h2 className="ad_h2">Dish Management</h2>
                    <p className="ad_p">Manage dishes with full course, meal, ingredient and area controls.</p>
                </div>
                {!isChefRole && (
                    <button className="rooms__add_btn" onClick={() => { setForm(EMPTY); setModal({ mode: "add" }); }}>
                        Add Dish
                    </button>
                )}
            </div>

            <div className="rooms__filters" style={{ marginBottom: 12 }}>
                <input
                    className="rooms__search"
                    placeholder="Search dish by name/description/area..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 280, marginRight: 8 }}
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
                            <th>Category</th>
                            <th>Course</th>
                            <th>Meal</th>
                            <th>Price</th>
                            <th>Area</th>
                            <th>Chefs</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((r) => (
                            <tr key={r.id}>
                                <td>{r.name}</td>
                                <td>{r.categoryName}</td>
                                <td>{r.course}</td>
                                <td>{r.mealType}</td>
                                <td>{r.displayPrice}</td>
                                <td>{r.area.join(", ")}</td>
                                <td>{r.chef && r.chef.length ? r.chef.map(c => c.full_name).join(", ") : "-"}</td>
                                <td><span className="ad_chip">{r.status}</span></td>
                                <td>
                                  <div className="d-flex" style={{gap:"6px"}}>
                                    {!isChefRole ? (
                                        <>
                                            <button className="rooms__icon_btn" onClick={() => { 
                                                setForm({ 
                                                    ...r, 
                                                    cat_id: r.categoryId,
                                                    ingredients: r.ingredients.join(", "),
                                                    chef: r.chef.map(c => c._id || c)
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
                        {sorted.length === 0 && <tr><td colSpan={9} className="rooms__empty">No dishes found</td></tr>}
                    </tbody>
                </table>
            </div>

            {!isChefRole && (modal?.mode === "add" || modal?.mode === "edit") && (
                <>
                    <div className="rooms__modal_overlay" onClick={close} />
                    <div className="rooms__modal_box">
                        <div className="rooms__modal_head">
                            <span className="rooms__modal_title">{modal.mode === "add" ? "Add Dish" : "Edit Dish"}</span>
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

                        <div className="rooms__form_row"><label className="rooms__form_label">Short Description</label><input className="rooms__form_input" value={form.short_des} onChange={(e) => setForm((f) => ({ ...f, short_des: e.target.value }))} /></div>
                        <div className="rooms__form_row"><label className="rooms__form_label">Description</label><textarea className="rooms__form_input" value={form.des} onChange={(e) => setForm((f) => ({ ...f, des: e.target.value }))} /></div>
                        
                        <div className="rooms__form_row">
                            <label className="rooms__form_label">Category</label>
                            <select
                                className="rooms__form_select"
                                value={form.cat_id}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, cat_id: e.target.value }))
                                }
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="rooms__form_row"><label className="rooms__form_label">Course</label><select className="rooms__form_select" value={form.course} onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))}>{COURSES.map((c) => <option key={c}>{c}</option>)}</select></div>
                        <div className="rooms__form_row"><label className="rooms__form_label">Meal</label><select className="rooms__form_select" value={form.mealType} onChange={(e) => setForm((f) => ({ ...f, mealType: e.target.value }))}>{MEALS.map((m) => <option key={m}>{m}</option>)}</select></div>
                        
                        <div className="rooms__form_grid2">
                            <div><label className="rooms__form_label">Price</label><input type="number" className="rooms__form_input" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} /></div>
                            <div><label className="rooms__form_label">Prep time</label><input className="rooms__form_input" value={form.prepTime} onChange={(e) => setForm((f) => ({ ...f, prepTime: e.target.value }))} /></div>
                        </div>

                        <div className="rooms__form_row"><label className="rooms__form_label">Ingredients (comma-separated)</label><input className="rooms__form_input" value={form.ingredients} onChange={(e) => setForm((f) => ({ ...f, ingredients: e.target.value }))} /></div>
                        <div className="rooms__form_row"><label className="rooms__form_label">Note</label><input className="rooms__form_input" value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} /></div>
                        
                        <div className="rooms__form_row">
                            <label className="rooms__form_label">Assign Chefs</label>
                            <div className="rooms__multi_select_wrapper" ref={chefDropdownRef}>
                                <div
                                    className="rooms__multi_select_trigger"
                                    onClick={() => setIsChefDropdownOpen(!isChefDropdownOpen)}
                                >
                                    {form.chef.length > 0 ? (
                                        form.chef.map((chefId) => {
                                            const chefObj = chefs.find(c => c._id === chefId);
                                            return (
                                                <span key={chefId} className="rooms__multi_select_tag">
                                                    {chefObj?.full_name || chefId}
                                                </span>
                                            );
                                        })
                                    ) : (
                                        <span className="rooms__multi_select_placeholder">Select Chefs</span>
                                    )}
                                </div>
                                {isChefDropdownOpen && (
                                    <div className="rooms__multi_select_dropdown">
                                        {chefs.map((chef) => {
                                            const isSelected = form.chef.includes(chef._id);
                                            return (
                                                <div
                                                    key={chef._id}
                                                    className={`rooms__multi_select_item ${isSelected ? "selected" : ""}`}
                                                    onClick={() => {
                                                        const next = isSelected
                                                            ? form.chef.filter((id) => id !== chef._id)
                                                            : [...form.chef, chef._id];
                                                        setForm((f) => ({ ...f, chef: next }));
                                                    }}
                                                >
                                                    <div className="rooms__multi_select_checkbox"></div>
                                                    <span className="rooms__multi_select_item_label">{chef.full_name}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rooms__form_row">
                            <label className="rooms__form_label">Area</label>
                            <div className="rooms__multi_select_wrapper" ref={areaDropdownRef}>
                                <div
                                    className="rooms__multi_select_trigger"
                                    onClick={() => setIsAreaDropdownOpen(!isAreaDropdownOpen)}
                                >
                                    {form.area.length > 0 ? (
                                        form.area.map((a) => (
                                            <span key={a} className="rooms__multi_select_tag">
                                                {a}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="rooms__multi_select_placeholder">Select Areas</span>
                                    )}
                                </div>
                                {isAreaDropdownOpen && (
                                    <div className="rooms__multi_select_dropdown">
                                        {AREAS.map((area) => {
                                            const isSelected = form.area.includes(area);
                                            return (
                                                <div
                                                    key={area}
                                                    className={`rooms__multi_select_item ${isSelected ? "selected" : ""}`}
                                                    onClick={() => {
                                                        const next = isSelected
                                                            ? form.area.filter((a) => a !== area)
                                                            : [...form.area, area];
                                                        setForm((f) => ({ ...f, area: next }));
                                                    }}
                                                >
                                                    <div className="rooms__multi_select_checkbox"></div>
                                                    <span className="rooms__multi_select_item_label">{area}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rooms__form_row"><label className="rooms__form_label">Status</label><select className="rooms__form_select" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}><option value="available">Available</option><option value="out of stock">Out of Stock</option></select></div>

                        <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={save}>Save</button></div>
                    </div>
                </>
            )}
            {!isChefRole && modal?.mode === "delete" && (
                <>
                    <div className="rooms__modal_overlay" onClick={close} />
                    <div className="rooms__modal_box">
                        <div className="rooms__modal_head">
                            <span className="rooms__modal_title">Delete Dish</span>
                            <button className="rooms__modal_close" onClick={close}>x</button>
                        </div>
                        <p className="rooms__delete_msg">Delete {modal.row.name}?</p>
                        <div className="rooms__form_actions">
                            <button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button>
                            <button className="rooms__btn rooms__btn--danger" onClick={async () => { 
                                const res = await deleteDish(modal.row.id);
                                if (res.success) {
                                    toast.success("Dish deleted");
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

