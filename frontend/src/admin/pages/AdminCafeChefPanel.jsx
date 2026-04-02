import RoleOperationsPanel from "./RoleOperationsPanel";

export default function AdminCafeChefPanel() {
  return (
    <RoleOperationsPanel
      title="Cafe Chef Panel"
      subtitle="Cafe chef KDS view for coffee/snacks preparation."
      cards={[
        { label: "New Cafe Orders", value: 6 },
        { label: "Preparing", value: 4 },
        { label: "Ready Pickup", value: 3 },
      ]}
      actions={["Accept Order", "Start Preparing", "Mark Ready"]}
      tableTitle="Cafe Kitchen Queue"
      columns={["Order", "Items", "Assigned Chef", "Status"]}
      rows={[
        ["CF-KDS-11", "Sandwich, Latte", "Cafe Chef 1", "Preparing"],
        ["CF-KDS-14", "Brownie, Cappuccino", "Cafe Chef 2", "New Order"],
      ]}
    />
  );
}
