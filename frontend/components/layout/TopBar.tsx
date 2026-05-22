"use client";
import { usePathname } from "next/navigation";
import { Bell, Search, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const breadcrumbs: Record<string, string[]> = {
  "/":           ["Dashboard"],
  "/claims":     ["Claims Management"],
  "/customers":  ["Customers"],
  "/policies":   ["Policies"],
  "/playground": ["Developer", "API Playground"],
  "/docs":       ["Developer", "API Documentation"],
};

export default function TopBar() {
  const pathname = usePathname();
  const crumbs = breadcrumbs[pathname] ?? [pathname.replace("/", "").replace(/-/g, " ")];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-14 flex items-center justify-between px-6">
      <nav className="flex items-center gap-1 text-sm text-slate-500">
        <span className="text-slate-400">Wayyo</span>
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1">
            <ChevronRight className="w-3 h-3" />
            <span className={i === crumbs.length - 1 ? "text-slate-800 font-medium" : ""}>{c}</span>
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
          <Search className="w-4 h-4 text-slate-500" />
        </button>
        <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative">
          <Bell className="w-4 h-4 text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
        </button>
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">SK</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
