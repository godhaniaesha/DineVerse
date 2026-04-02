import RoleOperationsPanel from "./RoleOperationsPanel";

export default function AdminBarChefPanel() {
  return (
    <RoleOperationsPanel
      title="Bar Chef Panel"
      subtitle="Bar preparation panel for cocktails, mocktails and pairings."
      cards={[
        { label: "New Drink Tickets", value: 8 },
        { label: "Mixing In Progress", value: 5 },
        { label: "Ready Drinks", value: 4 },
      ]}
      actions={["Accept Drink Order", "Start Mixing", "Mark Drink Ready"]}
      tableTitle="Bar Preparation Queue"
      columns={["Order", "Seat", "Drinks", "Status"]}
      rows={[
        ["BR-KDS-41", "B3", "Whiskey Sour", "Preparing"],
        ["BR-KDS-42", "B1", "Virgin Mojito", "New Order"],
      ]}
    />
  );
}
