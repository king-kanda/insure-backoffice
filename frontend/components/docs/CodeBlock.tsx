type Props = { code: string; language?: string };
export default function CodeBlock({ code, language = "bash" }: Props) {
  return (
    <div className="rounded-lg overflow-hidden border border-slate-700">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-xs text-slate-400 font-mono">{language}</span>
      </div>
      <pre className="p-4 bg-[#0F172A] overflow-x-auto">
        <code className="text-sm font-mono text-slate-300 whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}
