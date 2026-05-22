"use client";
import { useState, useEffect, useCallback } from "react";
import { DEFAULT_API_KEY } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronRight } from "lucide-react";
import CustomerDetail from "./CustomerDetail";
import CreateCoverDrawer from "./CreateCoverDrawer";

type Customer = {
  id: string; name: string; kraPin: string; idNumber: string; phone: string;
  email: string; address: string; status: string; policiesCount: number; lastActivity: string;
};

export default function CustomersTable() {
  const [customers, setCustomers]       = useState<Customer[]>([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [selectedId, setSelectedId]     = useState<string | null>(null);
  const [drawerCustomer, setDrawerCustomer] = useState<Customer | null>(null);

  const fetchCustomers = useCallback(() => {
    setLoading(true);
    fetch("/api/customers", { headers: { "x-api-key": DEFAULT_API_KEY } })
      .then(r => r.json())
      .then(data => setCustomers(data as Customer[]))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  if (selectedId) {
    return <CustomerDetail customerId={selectedId} onBack={() => setSelectedId(null)} />;
  }

  const filtered = customers.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.kraPin.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search by name or KRA PIN…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Name","ID Number","KRA PIN","Policies","Last Activity","Status",""].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>
                    ))}</tr>
                  ))
                : filtered.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setSelectedId(c.id)}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                            {c.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                          </div>
                          <span className="font-medium text-slate-800">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{c.idNumber}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{c.kraPin}</td>
                      <td className="px-4 py-3 text-slate-700">{c.policiesCount}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{c.lastActivity}</td>
                      <td className="px-4 py-3">
                        <Badge variant={c.status === "active" ? "default" : "secondary"} className="capitalize">{c.status}</Badge>
                      </td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="outline" className="text-xs h-7 px-2" onClick={() => setDrawerCustomer(c)}>
                            Create Cover
                          </Button>
                          <button onClick={() => setSelectedId(c.id)} className="p-1 rounded hover:bg-slate-100">
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-500">
          {filtered.length} customer{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {drawerCustomer && (
        <CreateCoverDrawer
          open={!!drawerCustomer}
          onClose={() => setDrawerCustomer(null)}
          defaultKraPin={drawerCustomer.kraPin}
          onSuccess={fetchCustomers}
        />
      )}
    </div>
  );
}
