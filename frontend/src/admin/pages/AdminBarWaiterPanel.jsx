import RoleOperationsPanel from "./RoleOperationsPanel";

export default function AdminBarWaiterPanel() {
  return (
    <RoleOperationsPanel
      title="Bar Waiter Panel"
      subtitle="Bar waiter panel for seat handling, drink service and closing tabs."
      cards={[
        { label: "Assigned Bar Seats", value: 12 },
        { label: "Active Drink Orders", value: 16 },
        { label: "Drinks Ready", value: 5 },
      ]}
      actions={["Create Drink Order", "Add Bar Items", "Serve Drink", "Close Bill"]}
      tableTitle="Bar Service Queue"
      columns={["Order", "Seat/Table", "Items", "Status", "Note"]}
      rows={[
        ["BR-ORD-31", "B2", "Mojito x2", "Ready", "Less ice"],
        ["BR-ORD-37", "B6", "Craft Beer", "Preparing", "-"],
      ]}
    />
  );
}
