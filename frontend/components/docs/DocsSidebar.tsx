"use client";
type Props = { sections: { id: string; label: string }[] };

export default function DocsSidebar({ sections }: Props) {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  return (
    <nav className="space-y-1">
      {sections.map(s => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {s.label}
        </button>
      ))}
    </nav>
  );
}
