import RoleOperationsPanel from "./RoleOperationsPanel";

export default function AdminRestaurantChefPanel() {
  return (
    <RoleOperationsPanel
      title="Restaurant Chef Panel"
      subtitle="Restaurant chef panel with main-course order progression."
      cards={[
        { label: "Pending Kitchen Tickets", value: 10 },
        { label: "Cooking Dishes", value: 7 },
        { label: "Ready To Serve", value: 4 },
      ]}
      actions={["Accept Ticket", "Start Cooking", "Mark Dish Ready"]}
      tableTitle="Restaurant Kitchen Queue"
      columns={["Order", "Table", "Dishes", "Status"]}
      rows={[
        ["RS-KDS-89", "R3", "Pasta Alfredo, Soup", "Cooking"],
        ["RS-KDS-90", "R5", "Paneer Steak", "Pending"],
        ["RS-KDS-93", "R2", "Dal Makhani, Naan", "Accepted by Chef"],
        ["RS-KDS-95", "R7", "Sizzler Platter", "Ready"],
        ["RS-KDS-98", "R1", "Veg Biryani, Raita", "Pending"],
        ["RS-KDS-101", "R10", "Mushroom Soup, Garlic Naan", "Cooking"],
        ["RS-KDS-104", "R6", "Paneer Lababdar, Tandoori Roti", "Accepted by Chef"],
      ]}
    />
  );
}
