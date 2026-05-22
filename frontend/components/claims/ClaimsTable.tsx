"use client";
import { useState, useEffect, useCallback } from "react";
import { DEFAULT_API_KEY } from "@/lib/auth";
import StatusBadge from "./StatusBadge";
import ClaimStatusModal from "./ClaimStatusModal";
import SubmitClaimDrawer from "./SubmitClaimDrawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";

type Claim = {
  id: string; claimId: string; customerName: string; policyNumber: string;
  dateSubmitted: string; status: string; amount: number; description: string;
};

const PAGE_SIZE = 10;

export default function ClaimsTable() {
  const [claims, setClaims]         = useState<Claim[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage]             = useState(1);
  const [modalClaimId, setModalClaimId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchClaims = useCallback(() => {
    setLoading(true);
    fetch("/api/claims", { headers: { "x-api-key": DEFAULT_API_KEY } })
      .then(r => r.json())
      .then(data => setClaims(data as Claim[]))
      .catch(() => setClaims([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchClaims(); }, [fetchClaims]);

  const filtered = claims.filter(c => {
    const matchSearch = !search ||
      c.claimId.toLowerCase().includes(search.toLowerCase()) ||
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.policyNumber.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search claims…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={v => { if (v) { setStatusFilter(v); setPage(1); } }}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button size="sm" onClick={() => setDrawerOpen(true)} className="gap-1.5">
          <Plus className="w-4 h-4" /> Submit Claim
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Claim ID","Customer","Policy No.","Date Submitted","Status","Amount","Action"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
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
                : paged.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-medium text-slate-700">{c.claimId}</td>
                      <td className="px-4 py-3 text-slate-800">{c.customerName}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">{c.policyNumber}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{c.dateSubmitted}</td>
                      <td className="px-4 py-3"><StatusBadge status={c.status as Parameters<typeof StatusBadge>[0]["status"]} /></td>
                      <td className="px-4 py-3 text-slate-800 font-medium">KES {c.amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setModalClaimId(c.claimId)}
                          className="text-xs text-blue-600 hover:underline font-medium"
                        >
                          Check Status
                        </button>
                      </td>
                    </tr>
                  ))
              }
              {!loading && paged.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400">No claims found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{filtered.length} claim{filtered.length !== 1 ? "s" : ""}</span>
          <div className="flex items-center gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1 rounded hover:bg-slate-100 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
            <span>Page {page} of {totalPages || 1}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-1 rounded hover:bg-slate-100 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {modalClaimId && (
        <ClaimStatusModal
          claimId={modalClaimId}
          open={!!modalClaimId}
          onClose={() => setModalClaimId(null)}
          onStatusUpdated={fetchClaims}
        />
      )}
      <SubmitClaimDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onSuccess={fetchClaims} />
    </div>
  );
}
