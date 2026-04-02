import RoleOperationsPanel from "./RoleOperationsPanel";

export default function AdminManagerPanel() {
  return (
    <RoleOperationsPanel
      title="Manager Panel"
      subtitle="Manager overview for orders, staff assignments and operations control."
      cards={[
        { label: "Open Orders", value: 32 },
        { label: "On-duty Staff", value: 24 },
        { label: "Escalations", value: 2 },
      ]}
      actions={["Assign Staff", "Review Delays", "Approve Offer", "Close Shift"]}
      tableTitle="Manager Watchlist"
      columns={["Area", "Issue", "Owner", "Priority"]}
      rows={[
        ["Kitchen", "2 delayed tickets", "Head Chef", "High"],
        ["Reception", "Late check-in queue", "Front Desk", "Medium"],
      ]}
    />
  );
}
