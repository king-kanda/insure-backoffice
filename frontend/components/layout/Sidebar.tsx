"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Shield,
  Code2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Umbrella,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const nav = [
  { href: "/",           label: "Dashboard",  icon: LayoutDashboard },
  { href: "/claims",     label: "Claims",     icon: FileText        },
  { href: "/customers",  label: "Customers",  icon: Users           },
  { href: "/policies",   label: "Policies",   icon: Shield          },
  { href: "/playground", label: "Playground", icon: Code2           },
  { href: "/docs",       label: "API Docs",   icon: BookOpen        },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-[#0F172A] text-slate-300 transition-all duration-300 min-h-screen sticky top-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-slate-700/50", collapsed && "justify-center px-0")}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <Umbrella className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-white text-sm tracking-wide">Wayyo Insurance</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                  : "hover:bg-slate-800 hover:text-white",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? label : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-2 mb-4 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <><ChevronLeft className="w-4 h-4" /><span>Collapse</span></>}
      </button>
    </aside>
  );
}
