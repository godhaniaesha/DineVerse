import RoleOperationsPanel from "./RoleOperationsPanel";

export default function AdminCafeWaiterPanel() {
  return (
    <RoleOperationsPanel
      title="Cafe Waiter Panel"
      subtitle="Cafe waiter specific tables, orders and service flow."
      cards={[
        { label: "Assigned Cafe Tables", value: 6 },
        { label: "Cafe Active Orders", value: 11 },
        { label: "Cafe Ready Orders", value: 4 },
      ]}
      actions={["Create Cafe Order", "Add Cafe Items", "Serve Order", "Close Table"]}
      tableTitle="Cafe Order Queue"
      columns={["Order", "Table", "Items", "Status", "Request"]}
      rows={[
        ["CF-ORD-12", "C2", "Cappuccino, Fries", "Preparing", "No sugar"],
        ["CF-ORD-14", "C5", "Cold Coffee", "Ready", "-"],
      ]}
    />
  );
}
