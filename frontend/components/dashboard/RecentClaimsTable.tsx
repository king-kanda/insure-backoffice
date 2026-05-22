"use client";
import { useEffect, useState } from "react";
import { DEFAULT_API_KEY } from "@/lib/auth";
import StatusBadge from "@/components/claims/StatusBadge";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

type Claim = {
  id: string; claimId: string; customerName: string; policyNumber: string;
  dateSubmitted: string; status: string; amount: number;
};

export default function RecentClaimsTable() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/claims", { headers: { "x-api-key": DEFAULT_API_KEY } })
      .then(r => r.json())
      .then(data => setClaims((data as Claim[]).slice(0, 9)))
      .catch(() => setClaims([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">Recent Claims</h2>
        <Link href="/claims" className="text-xs text-blue-600 hover:underline font-medium">View all</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              {["Claim ID","Customer","Policy No.","Submitted","Status","Amount"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><Skeleton className="h-4 w-full" /></td>
                    ))}
                  </tr>
                ))
              : claims.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-700 font-medium">{c.claimId}</td>
                    <td className="px-4 py-3 text-slate-800">{c.customerName}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{c.policyNumber}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{c.dateSubmitted}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status as Parameters<typeof StatusBadge>[0]["status"]} /></td>
                    <td className="px-4 py-3 text-slate-800 font-medium">KES {c.amount.toLocaleString()}</td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
