import RoleOperationsPanel from "./RoleOperationsPanel";

export default function AdminBartenderPanel() {
  return (
    <RoleOperationsPanel
      title="Bartender Panel"
      subtitle="Dedicated bartender operations for bar queue and drink readiness."
      cards={[
        { label: "Bar Orders", value: 14 },
        { label: "In Mix", value: 6 },
        { label: "Ready Pickup", value: 5 },
      ]}
      actions={["Accept Bar Order", "Prepare Drink", "Notify Waiter"]}
      tableTitle="Bartender Queue"
      columns={["Order", "Drink Items", "Priority", "Status"]}
      rows={[
        ["BT-101", "Old Fashioned x2", "High", "Preparing"],
        ["BT-103", "Wine Glass", "Normal", "Ready"],
      ]}
    />
  );
}
