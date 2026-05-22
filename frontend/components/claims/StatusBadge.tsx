import { cn } from "@/lib/utils";

type Status = "pending" | "under_review" | "approved" | "rejected" | "paid";

const config: Record<Status, { label: string; className: string }> = {
  pending:      { label: "Pending",      className: "bg-amber-100 text-amber-700 border-amber-200"   },
  under_review: { label: "Under Review", className: "bg-blue-100 text-blue-700 border-blue-200"      },
  approved:     { label: "Approved",     className: "bg-green-100 text-green-700 border-green-200"   },
  rejected:     { label: "Rejected",     className: "bg-red-100 text-red-700 border-red-200"         },
  paid:         { label: "Paid",         className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
};

export default function StatusBadge({ status }: { status: Status }) {
  const { label, className } = config[status] ?? { label: status, className: "bg-slate-100 text-slate-600 border-slate-200" };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", className)}>
      {label}
    </span>
  );
}
