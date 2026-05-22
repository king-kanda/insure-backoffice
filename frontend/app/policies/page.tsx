import PoliciesTable from "@/components/policies/PoliciesTable";

export default function PoliciesPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Policies</h1>
        <p className="text-sm text-slate-500 mt-0.5">View and manage all active, pending, and expired policies.</p>
      </div>
      <PoliciesTable />
    </div>
  );
}
