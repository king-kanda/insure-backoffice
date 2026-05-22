"use client";
import { useEffect, useState } from "react";
import { DEFAULT_API_KEY } from "@/lib/auth";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type Customer = { id: string; name: string; kraPin: string; policiesCount: number; status: string };

export default function RecentCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customers", { headers: { "x-api-key": DEFAULT_API_KEY } })
      .then(r => r.json())
      .then(data => setCustomers((data as Customer[]).slice(0, 6)))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800">Recent Customers</h2>
        <Link href="/customers" className="text-xs text-blue-600 hover:underline font-medium">View all</Link>
      </div>
      <ul className="divide-y divide-slate-100">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="space-y-1"><Skeleton className="h-3 w-32" /><Skeleton className="h-3 w-24" /></div>
                </div>
                <Skeleton className="h-5 w-14 rounded-full" />
              </li>
            ))
          : customers.map(c => (
              <li key={c.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                    {c.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.kraPin}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">{c.policiesCount} polic{c.policiesCount !== 1 ? "ies" : "y"}</Badge>
              </li>
            ))
        }
      </ul>
    </div>
  );
}
