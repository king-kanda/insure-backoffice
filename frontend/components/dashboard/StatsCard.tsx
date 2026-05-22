import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
};

export default function StatsCard({ title, value, change, changeType = "neutral", icon: Icon, iconColor = "text-blue-600" }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-start justify-between hover:shadow-sm transition-shadow">
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        {change && (
          <p className={cn("text-xs mt-1 font-medium",
            changeType === "up" ? "text-emerald-600" : changeType === "down" ? "text-red-500" : "text-slate-400"
          )}>
            {change}
          </p>
        )}
      </div>
      <div className={cn("w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center", iconColor.replace("text-", "bg-").replace("600", "50"))}>
        <Icon className={cn("w-5 h-5", iconColor)} />
      </div>
    </div>
  );
}
