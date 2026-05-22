"use client";
import { useState, useEffect, useCallback } from "react";
import { DEFAULT_API_KEY } from "@/lib/auth";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";

type Policy = {
  id: string; policyNumber: string; customerName: string; coverType: string;
  startDate: string; expiryDate: string; premium: number; status: string;
};

const PAGE_SIZE = 10;

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function PolicyStatusBadge({ status }: { status: string }) {
  const cls = status === "active"
    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : status === "expired"
    ? "bg-red-100 text-red-600 border-red-200"
    : "bg-amber-100 text-amber-700 border-amber-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${cls}`}>
      {status}
    </span>
  );
}

export default function PoliciesTable() {
  const [policies, setPolicies]   = useState<Policy[]>([]);
  const [loading, setLoading]     = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage]           = useState(1);

  const fetchPolicies = useCallback(() => {
    setLoading(true);
    fetch("/api/policies", { headers: { "x-api-key": DEFAULT_API_KEY } })
      .then(r => r.json())
      .then(data => setPolicies(data as Policy[]))
      .catch(() => setPolicies([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchPolicies(); }, [fetchPolicies]);

  const filtered = policies.filter(p => statusFilter === "all" || p.status === statusFilter);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function renew(policyNumber: string) {
    toast.success(`Policy ${policyNumber} renewal initiated.`, { description: "You will receive a confirmation shortly." });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select value={statusFilter} onValueChange={v => { if (v) { setStatusFilter(v); setPage(1); } }}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Policy No.","Customer","Cover Type","Start Date","Expiry","Premium","Status","Action"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>{Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>
                    ))}</tr>
                  ))
                : paged.map(p => {
                    const days = daysUntil(p.expiryDate);
                    const expiringSoon = p.status === "active" && days > 0 && days <= 30;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-medium text-slate-700">{p.policyNumber}</td>
                        <td className="px-4 py-3 text-slate-800">{p.customerName || <span className="text-slate-400 italic">Unknown</span>}</td>
                        <td className="px-4 py-3 capitalize text-slate-700">{p.coverType}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{p.startDate}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-500">{p.expiryDate}</span>
                            {expiringSoon && (
                              <span className="flex items-center gap-1 bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full text-xs font-medium">
                                <AlertTriangle className="w-3 h-3" />{days}d
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">KES {p.premium.toLocaleString()}</td>
                        <td className="px-4 py-3"><PolicyStatusBadge status={p.status} /></td>
                        <td className="px-4 py-3">
                          <Button size="sm" variant="outline" className="text-xs h-7 px-2" onClick={() => renew(p.policyNumber)}>
                            Renew
                          </Button>
                        </td>
                      </tr>
                    );
                  })
              }
              {!loading && paged.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400">No policies found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{filtered.length} polic{filtered.length !== 1 ? "ies" : "y"}</span>
          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1 rounded hover:bg-slate-100 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
            <span>Page {page} of {totalPages || 1}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-1 rounded hover:bg-slate-100 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
