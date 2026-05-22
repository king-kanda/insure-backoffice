import CustomersTable from "@/components/customers/CustomersTable";

export default function CustomersPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Customers</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage customer records, policies, and claims history.</p>
      </div>
      <CustomersTable />
    </div>
  );
}
