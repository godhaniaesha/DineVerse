import RoleOperationsPanel from "./RoleOperationsPanel";

export default function AdminRestaurantChefPanel() {
  return (
    <RoleOperationsPanel
      title="Restaurant Chef Panel"
      subtitle="Restaurant chef panel with main-course order progression."
      cards={[
        { label: "New Kitchen Tickets", value: 10 },
        { label: "Preparing Dishes", value: 7 },
        { label: "Ready To Serve", value: 4 },
      ]}
      actions={["Accept Ticket", "Start Cooking", "Mark Dish Ready"]}
      tableTitle="Restaurant Kitchen Queue"
      columns={["Order", "Table", "Dishes", "Status"]}
      rows={[
        ["RS-KDS-89", "R3", "Pasta Alfredo, Soup", "Preparing"],
        ["RS-KDS-90", "R5", "Paneer Steak", "New Order"],
      ]}
    />
  );
}
