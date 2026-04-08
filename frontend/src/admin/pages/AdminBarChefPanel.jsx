import RoleOperationsPanel from "./RoleOperationsPanel";

export default function AdminBarChefPanel() {
  return (
    <RoleOperationsPanel
      title="Bar Chef Panel"
      subtitle="Bar preparation panel for cocktails, mocktails and pairings."
      cards={[
        { label: "Pending Drink Tickets", value: 8 },
        { label: "Mixing In Progress", value: 5 },
        { label: "Ready Drinks", value: 4 },
      ]}
      actions={["Accept Drink Order", "Start Mixing", "Mark Drink Ready"]}
      tableTitle="Bar Preparation Queue"
      columns={["Order", "Seat", "Drinks", "Status"]}
      rows={[
        ["BR-KDS-41", "B3", "Whiskey Sour", "Cooking"],
        ["BR-KDS-42", "B1", "Virgin Mojito", "Pending"],
        ["BR-KDS-44", "B5", "Margarita, Nachos", "Accepted by Chef"],
        ["BR-KDS-46", "B2", "Old Fashioned", "Ready"],
        ["BR-KDS-48", "B4", "Long Island Iced Tea", "Pending"],
        ["BR-KDS-50", "B7", "Cosmopolitan, Fries", "Cooking"],
        ["BR-KDS-52", "B9", "Blue Lagoon", "Accepted by Chef"],
      ]}
    />
  );
}
