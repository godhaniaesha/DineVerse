import { useState } from "react";
const DATA = [{ id: 1, name: "Sophia", email: "sophia@mail.com", message: "Need table for 12 people.", date: "2026-04-01", status: "Open" }];
const IcEdit = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>;
const IcTrash = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m6 6 1 14h10l1-14"/></svg>;
export default function AdminInquiries() {
  const [rows, setRows] = useState(DATA);
  return <div className="ad_page"><h2 className="ad_h2">Contact Inquiries</h2><p className="ad_p">Manage contact form messages and responses.</p><div className="ad_table_wrap"><table className="ad_table"><thead><tr><th>Name</th><th>Email</th><th>Message</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>{rows.map((r)=><tr key={r.id}><td>{r.name}</td><td>{r.email}</td><td>{r.message}</td><td>{r.date}</td><td><span className="ad_chip">{r.status}</span></td><td className="rooms__actions_cell"><button className="rooms__icon_btn" onClick={()=>setRows((p)=>p.map((x)=>x.id===r.id?{...x,status:x.status==="Open"?"Resolved":"Open"}:x))}><IcEdit/></button><button className="rooms__icon_btn rooms__icon_btn--danger" onClick={()=>setRows((p)=>p.filter((x)=>x.id!==r.id))}><IcTrash/></button></td></tr>)}</tbody></table></div></div>;
}
