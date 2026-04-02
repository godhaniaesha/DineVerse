import RoleOperationsPanel from "./RoleOperationsPanel";

export default function AdminRestaurantWaiterPanel() {
  return (
    <RoleOperationsPanel
      title="Restaurant Waiter Panel"
      subtitle="Restaurant waiter operations with assigned tables and served orders."
      cards={[
        { label: "Assigned Restaurant Tables", value: 9 },
        { label: "Restaurant Active Orders", value: 18 },
        { label: "Ready To Serve", value: 7 },
      ]}
      actions={["Create Restaurant Order", "Add Dishes", "Serve Food", "Close Table"]}
      tableTitle="Restaurant Service Queue"
      columns={["Order", "Table", "Items", "Status", "Customer Note"]}
      rows={[
        ["RS-ORD-201", "R4", "Pasta, Soup", "Ready", "Less spice"],
        ["RS-ORD-208", "R8", "Pizza Combo", "Preparing", "-"],
      ]}
    />
  );
}
