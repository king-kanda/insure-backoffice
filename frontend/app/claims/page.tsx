import ClaimsTable from "@/components/claims/ClaimsTable";

export default function ClaimsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Claims Management</h1>
        <p className="text-sm text-slate-500 mt-0.5">Track, review, and manage all insurance claims.</p>
      </div>
      <ClaimsTable />
    </div>
  );
}
