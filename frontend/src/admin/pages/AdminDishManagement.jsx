import { useMemo, useState } from "react";
import { FaArrowRightLong } from "react-icons/fa6";

const IcEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>;
const IcTrash = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="m6 6 1 14h10l1-14" /></svg>;

const CATEGORIES = [
    { id: 1, name: "Pizza", cuisineId: 1 },
    { id: 2, name: "Pasta", cuisineId: 1 },
    { id: 3, name: "Noodles", cuisineId: 2 },
    { id: 4, name: "Punjabi", cuisineId: 3 },
];
const AREAS = ["Restaurant", "Cafe", "Bar"];
const COURSES = ["Soup", "Appetizer", "Palate Cleanser", "Main Course", "Dessert"];
const MEALS = ["Veg", "Non-Veg"];
const SORT_OPTIONS = ["None", "Name A–Z", "Name Z–A", "Area", "Course"];
const truncate = (str, len = 35) => str && str.length > len ? str.slice(0, len) + "..." : str;

const INITIAL = [
    {
        id: 1,
        categoryId: 1,
        name: "Sea Bass Citrus",
        image: "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=400&q=80",
        inShortDesc: "Citrus-marinated sea bass",
        description: "Pan-seared sea bass with fennel and smoked butter",
        course: "Main Course",
        meal: "Non-Veg",
        price: 1250,
        prepTime: "30 mins",
        ingredients: ["Sea bass", "Smoked butter", "Fennel", "Citrus"],
        note: "Chef special",
        area: "Restaurant",
        status: "Active",
    },
];

const EMPTY = {
    categoryId: 1,
    name: "",
    image: "",
    inShortDesc: "",
    description: "",
    course: "Main Course",
    meal: "Veg",
    price: "",
    prepTime: "",
    ingredients: "",
    note: "",
    area: "Restaurant",
    status: "Active",
};

export default function AdminDishManagement() {
    const [rows, setRows] = useState(INITIAL);
    const [modal, setModal] = useState(null);
    const [form, setForm] = useState(EMPTY);
    const [search, setSearch] = useState("");
    const [areaFilter, setAreaFilter] = useState("All");
    const [sortBy, setSortBy] = useState("None");

    const close = () => setModal(null);

    const save = () => {
        if (!form.name.trim()) return;
        if (!form.price || Number(form.price) <= 0) return;
        const payload = {
            ...form,
            price: Number(form.price),
            image: form.image.trim() || "https://via.placeholder.com/140",
            ingredients: form.ingredients.split(",").map((i) => i.trim()).filter(Boolean),
        };

        if (modal?.mode === "add") {
            setRows((prev) => [...prev, { id: Date.now(), ...payload }]);
        }
        if (modal?.mode === "edit" && modal.row) {
            setRows((prev) => prev.map((r) => (r.id === modal.row.id ? { ...r, ...payload } : r)));
        }
        close();
    };

    const filtered = rows.filter((r) => {
        const matchArea = areaFilter === "All" || r.area === areaFilter;
        const text = `${r.name} ${r.inShortDesc} ${r.description} ${r.course} ${r.meal} ${r.area}`.toLowerCase();
        return matchArea && (!search || text.includes(search.toLowerCase()));
    });

    const sorted = useMemo(() => {
        const list = [...filtered];
        if (sortBy === "Name A–Z") return list.sort((a, b) => a.name.localeCompare(b.name));
        if (sortBy === "Name Z–A") return list.sort((a, b) => b.name.localeCompare(a.name));
        if (sortBy === "Area") return list.sort((a, b) => AREAS.indexOf(a.area) - AREAS.indexOf(b.area));
        if (sortBy === "Course") return list.sort((a, b) => COURSES.indexOf(a.course) - COURSES.indexOf(b.course));
        return list;
    }, [filtered, sortBy]);

    return (
        <div className="ad_page">
            <div className="rooms__header"><div><h2 className="ad_h2">Dish Management</h2><p className="ad_p">Manage dishes with full course, meal, ingredient and area controls.</p></div><button className="rooms__add_btn" onClick={() => { setForm(EMPTY); setModal({ mode: "add" }); }}>Add Dish</button></div>

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
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((r) => (
                            <tr key={r.id}>
                                <td>{r.name}</td>
                                <td>{CATEGORIES.find(c => c.id === r.categoryId)?.name || "-"}</td>
                                <td>{r.course}</td>
                                <td>{r.meal}</td>
                                <td>₹{r.price.toLocaleString("en-IN")}</td>
                                <td>{r.area}</td>
                                <td><span className="ad_chip">{r.status}</span></td>
                                <td className="rooms__actions_cell">
                                    <button className="rooms__icon_btn" onClick={() => { setForm({ ...r, ingredients: r.ingredients.join(", ") }); setModal({ mode: "edit", row: r }); }}><IcEdit /></button>
                                    <button className="rooms__icon_btn rooms__icon_btn--danger" onClick={() => setRows((p) => p.filter((x) => x.id !== r.id))}><IcTrash /></button>
                                </td>
                            </tr>
                        ))}
                        {sorted.length === 0 && <tr><td colSpan={8} className="rooms__empty">No dishes found</td></tr>}
                    </tbody>
                </table>
            </div>

            {(modal?.mode === "add" || modal?.mode === "edit") && (
                <>
                    <div className="rooms__modal_overlay" onClick={close} />
                    <div className="rooms__modal_box">
                        <div className="rooms__modal_head">
                            <span className="rooms__modal_title">{modal.mode === "add" ? "Add Dish" : "Edit Dish"}</span>
                            <button className="rooms__modal_close" onClick={close}>x</button>
                        </div>

                        <div className="rooms__form_row"><label className="rooms__form_label">Name</label><input className="rooms__form_input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} /></div>
                        <div className="rooms__form_row"><label className="rooms__form_label">Image URL</label><input className="rooms__form_input" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} /></div>
                        <div className="rooms__form_row"><label className="rooms__form_label">Short Description</label><input className="rooms__form_input" value={form.inShortDesc} onChange={(e) => setForm((f) => ({ ...f, inShortDesc: e.target.value }))} /></div>
                        <div className="rooms__form_row"><label className="rooms__form_label">Description</label><textarea className="rooms__form_input" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></div>
                        <div className="rooms__form_row">
                            <label className="rooms__form_label">Category</label>
                            <select
                                className="rooms__form_select"
                                value={form.categoryId}
                                onChange={(e) =>
                                    setForm((f) => ({ ...f, categoryId: Number(e.target.value) }))
                                }
                            >
                                {CATEGORIES.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="rooms__form_row"><label className="rooms__form_label">Course</label><select className="rooms__form_select" value={form.course} onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))}>{COURSES.map((c) => <option key={c}>{c}</option>)}</select></div>
                        <div className="rooms__form_row"><label className="rooms__form_label">Meal</label><select className="rooms__form_select" value={form.meal} onChange={(e) => setForm((f) => ({ ...f, meal: e.target.value }))}>{MEALS.map((m) => <option key={m}>{m}</option>)}</select></div>
                        <div className="rooms__form_grid2"><div><label className="rooms__form_label">Price</label><input type="number" className="rooms__form_input" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} /></div>
                            <div><label className="rooms__form_label">Prep time</label><input className="rooms__form_input" value={form.prepTime} onChange={(e) => setForm((f) => ({ ...f, prepTime: e.target.value }))} /></div>
                        </div>
                        <div className="rooms__form_row"><label className="rooms__form_label">Ingredients (comma-separated)</label><input className="rooms__form_input" value={form.ingredients} onChange={(e) => setForm((f) => ({ ...f, ingredients: e.target.value }))} /></div>
                        <div className="rooms__form_row"><label className="rooms__form_label">Note</label><input className="rooms__form_input" value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} /></div>
                        <div className="rooms__form_row"><label className="rooms__form_label">Area</label><select className="rooms__form_select" value={form.area} onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}>{AREAS.map((a) => <option key={a}>{a}</option>)}</select></div>
                        <div className="rooms__form_row"><label className="rooms__form_label">Status</label><select className="rooms__form_select" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}><option>Active</option><option>Inactive</option></select></div>

                        <div className="rooms__form_actions"><button className="rooms__btn rooms__btn--ghost" onClick={close}>Cancel</button><button className="rooms__btn rooms__btn--primary" onClick={save}>Save</button></div>
                    </div>
                </>
            )}
        </div>
    );
}
