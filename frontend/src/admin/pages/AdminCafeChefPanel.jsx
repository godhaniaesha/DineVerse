import RoleOperationsPanel from "./RoleOperationsPanel";

export default function AdminCafeChefPanel() {
  return (
    <RoleOperationsPanel
      title="Cafe Chef Panel"
      subtitle="Cafe chef KDS view for coffee/snacks preparation."
      cards={[
        { label: "Pending Orders", value: 6 },
        { label: "Cooking", value: 4 },
        { label: "Ready Pickup", value: 3 },
      ]}
      actions={["Accept Order", "Start Cooking", "Mark Ready"]}
      tableTitle="Cafe Kitchen Queue"
      columns={["Order", "Items", "Assigned Chef", "Status"]}
      rows={[
        ["CF-KDS-11", "Sandwich, Latte", "Cafe Chef 1", "Cooking"],
        ["CF-KDS-14", "Brownie, Cappuccino", "Cafe Chef 2", "Pending"],
        ["CF-KDS-18", "Club Sandwich, Cold Coffee", "Cafe Chef 1", "Accepted by Chef"],
        ["CF-KDS-22", "Pasta, Iced Tea", "Cafe Chef 2", "Ready"],
        ["CF-KDS-24", "Croissant, Americano", "Cafe Chef 1", "Pending"],
        ["CF-KDS-26", "Cheese Burger, Mocha", "Cafe Chef 2", "Cooking"],
        ["CF-KDS-29", "Garlic Bread, Frappe", "Cafe Chef 1", "Accepted by Chef"],
      ]}
    />
  );
}
