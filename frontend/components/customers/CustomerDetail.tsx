"use client";
import { useState, useEffect, useCallback } from "react";
import { DEFAULT_API_KEY } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StatusBadge from "@/components/claims/StatusBadge";
import CreateCoverDrawer from "./CreateCoverDrawer";
import { ArrowLeft, Phone, Mail, MapPin } from "lucide-react";

type Policy = { id: string; policyNumber: string; coverType: string; startDate: string; expiryDate: string; premium: number; status: string };
type Claim  = { id: string; claimId: string; description: string; dateSubmitted: string; status: string; amount: number };
type CustomerFull = {
  id: string; name: string; kra_pin: string; id_number: string; phone: string;
  email: string; address: string; status: string; created_at: string;
  policies: Policy[]; claims: Claim[];
};

type Props = { customerId: string; onBack: () => void };

export default function CustomerDetail({ customerId, onBack }: Props) {
  const [customer, setCustomer] = useState<CustomerFull | null>(null);
  const [loading, setLoading]   = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchCustomer = useCallback(() => {
    setLoading(true);
    fetch(`/api/customers/${customerId}`, { headers: { "x-api-key": DEFAULT_API_KEY } })
      .then(r => r.json())
      .then(data => setCustomer(data as CustomerFull))
      .catch(() => setCustomer(null))
      .finally(() => setLoading(false));
  }, [customerId]);

  useEffect(() => { fetchCustomer(); }, [fetchCustomer]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-24" />
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <Skeleton className="h-14 w-64" />
          <div className="grid grid-cols-3 gap-4">{Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-4" />)}</div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return <div className="text-center py-12 text-slate-400">Customer not found.</div>;
  }

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to customers
      </button>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
              {customer.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{customer.name}</h2>
              <p className="text-sm text-slate-500 font-mono">{customer.kra_pin}</p>
              <Badge variant={customer.status === "active" ? "default" : "secondary"} className="mt-1 capitalize">
                {customer.status}
              </Badge>
            </div>
          </div>
          <Button size="sm" onClick={() => setDrawerOpen(true)}>Create Cover</Button>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600"><Phone className="w-4 h-4 text-slate-400" />{customer.phone}</div>
          <div className="flex items-center gap-2 text-sm text-slate-600"><Mail className="w-4 h-4 text-slate-400" />{customer.email}</div>
          <div className="flex items-center gap-2 text-sm text-slate-600"><MapPin className="w-4 h-4 text-slate-400" />{customer.address}</div>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "ID Number",   value: customer.id_number           },
            { label: "Policies",    value: String(customer.policies.length) },
            { label: "Claims",      value: String(customer.claims.length)   },
            { label: "Member Since",value: customer.created_at.split("T")[0] },
          ].map(i => (
            <div key={i.label} className="bg-slate-50 rounded-lg px-4 py-3">
              <p className="text-xs text-slate-400">{i.label}</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{i.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100"><h3 className="text-sm font-semibold text-slate-800">Policies ({customer.policies.length})</h3></div>
        {customer.policies.length === 0
          ? <p className="px-5 py-8 text-center text-sm text-slate-400">No policies found.</p>
          : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50"><tr>
                {["Policy No.","Cover Type","Start","Expiry","Premium","Status"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {customer.policies.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-slate-700">{p.policyNumber}</td>
                    <td className="px-4 py-3 capitalize text-slate-700">{p.coverType}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{p.startDate}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{p.expiryDate}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">KES {p.premium.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${p.status === "active" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : p.status === "expired" ? "bg-red-100 text-red-600 border-red-200" : "bg-amber-100 text-amber-700 border-amber-200"}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100"><h3 className="text-sm font-semibold text-slate-800">Claims History ({customer.claims.length})</h3></div>
        {customer.claims.length === 0
          ? <p className="px-5 py-8 text-center text-sm text-slate-400">No claims found.</p>
          : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50"><tr>
                {["Claim ID","Description","Date","Status","Amount"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {customer.claims.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-slate-700">{c.claimId}</td>
                    <td className="px-4 py-3 text-slate-700 max-w-xs truncate">{c.description}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{c.dateSubmitted}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status as Parameters<typeof StatusBadge>[0]["status"]} /></td>
                    <td className="px-4 py-3 font-medium text-slate-800">KES {c.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>

      <CreateCoverDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        defaultKraPin={customer.kra_pin}
        onSuccess={fetchCustomer}
      />
    </div>
  );
}
