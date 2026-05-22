"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileUploadField from "@/components/ui/FileUploadField";
import ResponsePanel from "./ResponsePanel";
import { Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/config";

type Field = { name: string; label: string; type: "text" | "file"; hint?: string };
type Props = {
  method: "GET" | "POST";
  path: string;
  title: string;
  description: string;
  fields: Field[];
  queryParams?: Field[];
};

export default function ApiCard({ method, path, title, description, fields, queryParams = [] }: Props) {
  const [apiKey, setApiKey]         = useState("ins_live_key_demo_2024");
  const [queryValues, setQueryValues] = useState<Record<string, string>>({});
  const [loading, setLoading]       = useState(false);
  const [response, setResponse]     = useState<{ status: number; body: string } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const baseUrl      = API_BASE_URL || "";
  const endpointUrl  = `${baseUrl}${path}`;
  const methodColor  = method === "GET" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700";

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    try {
      let url  = endpointUrl;
      let body: BodyInit | undefined;
      const headers: Record<string, string> = { "x-api-key": apiKey };

      if (method === "GET") {
        const params = new URLSearchParams(queryValues).toString();
        if (params) url += "?" + params;
      } else {
        body = new FormData(formRef.current!);
      }

      const res  = await fetch(url, { method, headers, body });
      const text = await res.text();
      setResponse({ status: res.status, body: text });
    } catch (e: unknown) {
      setResponse({ status: 0, body: e instanceof Error ? e.message : "Network error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-1">
          <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${methodColor}`}>{method}</span>
          <code className="text-sm text-slate-700 font-mono">{path}</code>
        </div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>

      <form ref={formRef} onSubmit={send} className="p-5 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor={`key-${path}`}>API Key</Label>
          <Input id={`key-${path}`} value={apiKey} onChange={e => setApiKey(e.target.value)} className="font-mono text-xs" />
        </div>

        {queryParams.map(f => (
          <div key={f.name} className="space-y-1.5">
            <Label htmlFor={`${f.name}-${path}`}>{f.label}</Label>
            <Input
              id={`${f.name}-${path}`}
              value={queryValues[f.name] ?? ""}
              onChange={e => setQueryValues(prev => ({ ...prev, [f.name]: e.target.value }))}
              placeholder={f.name}
            />
          </div>
        ))}

        {fields.map(f =>
          f.type === "file" ? (
            <FileUploadField key={f.name} name={f.name} label={f.label} hint={f.hint} />
          ) : (
            <div key={f.name} className="space-y-1.5">
              <Label htmlFor={`${f.name}-${path}`}>{f.label}</Label>
              <Input id={`${f.name}-${path}`} name={f.name} placeholder={f.name} />
            </div>
          )
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Sending…</> : "Send Request"}
        </Button>

        {response && <ResponsePanel status={response.status} body={response.body} />}
      </form>
    </div>
  );
}
