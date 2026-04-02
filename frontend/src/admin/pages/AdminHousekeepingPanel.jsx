import RoleOperationsPanel from "./RoleOperationsPanel";

export default function AdminHousekeepingPanel() {
  return (
    <RoleOperationsPanel
      title="Housekeeping Panel"
      subtitle="Housekeeping task board for room cleaning and status updates."
      cards={[
        { label: "Rooms To Clean", value: 11 },
        { label: "In Progress", value: 4 },
        { label: "Cleaned Today", value: 19 },
      ]}
      actions={["Start Cleaning", "Mark Cleaned", "Report Maintenance"]}
      tableTitle="Housekeeping Queue"
      columns={["Room", "Task", "Assigned", "Status"]}
      rows={[
        ["302", "Deep Cleaning", "HK-01", "In Progress"],
        ["110", "Checkout Cleaning", "HK-03", "Pending"],
      ]}
    />
  );
}
