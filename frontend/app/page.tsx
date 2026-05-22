import { Shield, FileText, Users, TrendingUp } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentClaimsTable from "@/components/dashboard/RecentClaimsTable";
import RecentCustomers from "@/components/dashboard/RecentCustomers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { backendFetch } from "@/lib/backend";

async function fetchStats() {
  try {
    const res = await backendFetch("/api/stats");
    if (!res.ok) throw new Error("failed");
    return res.json();
  } catch {
    return { active_policies: 0, open_claims: 0, resolved_claims: 0, total_revenue: 0, total_customers: 0 };
  }
}

export default async function DashboardPage() {
  const stats = await fetchStats();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Good morning, Steven</h1>
          <p className="text-sm text-slate-500 mt-0.5">Here&apos;s what&apos;s happening at Wayyo today.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/claims">
            <Button size="sm" variant="outline">Submit New Claim</Button>
          </Link>
          <Link href="/customers">
            <Button size="sm">Create Cover</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Active Policies"     value={String(stats.active_policies)}                          change="+3 this month"      changeType="up"      icon={Shield}     iconColor="text-blue-600"    />
        <StatsCard title="Open Claims"         value={String(stats.open_claims)}                              change="awaiting action"    changeType="neutral" icon={FileText}   iconColor="text-amber-500"   />
        <StatsCard title="Resolved Claims"     value={String(stats.resolved_claims)}                          change="+12% vs last month" changeType="up"      icon={TrendingUp} iconColor="text-emerald-600" />
        <StatsCard title="Total Revenue"       value={`KES ${((stats.total_revenue ?? 0) / 1000).toFixed(0)}K`} change="+8% vs last month" changeType="up"   icon={Users}      iconColor="text-violet-600"  />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RecentClaimsTable />
        </div>
        <div>
          <RecentCustomers />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: "/claims",    label: "Submit New Claim",   desc: "File a new insurance claim",        color: "border-blue-200 bg-blue-50 hover:bg-blue-100"          },
          { href: "/customers", label: "Create Cover",       desc: "Issue a new policy for a customer", color: "border-emerald-200 bg-emerald-50 hover:bg-emerald-100"  },
          { href: "/customers", label: "View All Customers", desc: "Browse and manage all customers",   color: "border-violet-200 bg-violet-50 hover:bg-violet-100"     },
        ].map(q => (
          <Link key={q.label} href={q.href} className={`rounded-xl border p-4 transition-colors ${q.color}`}>
            <p className="font-semibold text-slate-800 text-sm">{q.label}</p>
            <p className="text-xs text-slate-500 mt-0.5">{q.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
