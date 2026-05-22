import { CheckCircle2, XCircle } from "lucide-react";

type Props = { status: number | null; body: string | null };

export default function ResponsePanel({ status, body }: Props) {
  if (status === null) return null;
  const ok = status >= 200 && status < 300;
  let pretty = body;
  try { if (body) pretty = JSON.stringify(JSON.parse(body), null, 2); } catch {}

  return (
    <div className="mt-4 rounded-lg border overflow-hidden">
      <div className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium ${ok ? "bg-emerald-50 border-b border-emerald-200 text-emerald-700" : "bg-red-50 border-b border-red-200 text-red-700"}`}>
        {ok ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
        HTTP {status} {ok ? "OK" : "Error"}
      </div>
      <pre className="p-4 text-xs font-mono bg-[#0F172A] text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
        {pretty}
      </pre>
    </div>
  );
}
