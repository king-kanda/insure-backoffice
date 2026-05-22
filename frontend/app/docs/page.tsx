import CodeBlock from "@/components/docs/CodeBlock";
import DocsSidebar from "@/components/docs/DocsSidebar";
import { API_BASE_URL } from "@/lib/config";

const sections = [
  { id: "getting-started",  label: "Getting Started"   },
  { id: "claims-status",    label: "GET /claims/status" },
  { id: "claims-submit",    label: "POST /claims/submit"},
  { id: "covers-create",    label: "POST /covers/create"},
];

const params = {
  "claims-status": [
    { name: "claim_id", type: "string", required: true, description: "The claim identifier (e.g. CLM-2024-00123)" },
  ],
  "claims-submit": [
    { name: "policy_number",  type: "string", required: true,  description: "Existing policy number for the claim"  },
    { name: "police_abstract",type: "file",   required: true,  description: "Certified police abstract (PDF/image)" },
    { name: "id_document",    type: "file",   required: true,  description: "National ID or passport scan"          },
    { name: "log_book",       type: "file",   required: true,  description: "Vehicle log book"                      },
  ],
  "covers-create": [
    { name: "kra_pin",         type: "string", required: true, description: "Customer's KRA PIN (format: A123456789B)" },
    { name: "log_book",        type: "file",   required: true, description: "Vehicle log book"                         },
    { name: "id_card",         type: "file",   required: true, description: "National ID card scan"                    },
    { name: "driving_license", type: "file",   required: true, description: "Valid driving licence"                    },
  ],
};

const responses = {
  "claims-status": `{
  "claim_id": "CLM-2024-00123",
  "status": "under_review",
  "updated_at": "2024-11-01T10:30:00Z",
  "notes": "Awaiting surveyor report"
}`,
  "claims-submit": `{
  "claim_id": "CLM-2024-00124",
  "submitted_at": "2024-11-01T11:00:00Z",
  "status": "pending"
}`,
  "covers-create": `{
  "policy_number": "POL-2024-00789",
  "created_at": "2024-11-01T12:00:00Z",
  "expiry_date": "2025-11-01"
}`,
};

type ApiDef = { id: string; method: "GET" | "POST"; path: string; title: string; desc: string };

const apis: ApiDef[] = [
  { id: "claims-status", method: "GET",  path: "/api/claims/status",  title: "Get Claim Status", desc: "Retrieve the current processing status and notes for an existing claim."       },
  { id: "claims-submit", method: "POST", path: "/api/claims/submit",  title: "Submit Claim",     desc: "File a new insurance claim by uploading the required documents."              },
  { id: "covers-create", method: "POST", path: "/api/covers/create",  title: "Create Cover",     desc: "Issue a new motor insurance policy cover with the required KYC documents."    },
];

export default function DocsPage() {
  const baseUrl = API_BASE_URL || "http://localhost:8000";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-[#0F172A] border-r border-slate-700 px-4 py-6 sticky top-0 max-h-screen overflow-y-auto flex-shrink-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">API Reference</p>
        <DocsSidebar sections={sections} />
      </aside>

      {/* Content */}
      <div className="flex-1 p-6 lg:p-10 max-w-4xl space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Wayyo Insurance API</h1>
          <p className="text-slate-500 mt-1">REST API documentation for the Wayyo Insurance platform.</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-slate-900 text-slate-300 px-4 py-2 rounded-lg font-mono text-sm">
            <span className="text-slate-500">Base URL</span>
            <span className="text-blue-400">{baseUrl}</span>
          </div>
        </div>

        {/* Getting Started */}
        <section id="getting-started" className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">Getting Started</h2>
          <p className="text-sm text-slate-600">All API requests require an <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">x-api-key</code> header. Use the default demo key below during development.</p>
          <CodeBlock language="http" code={`x-api-key: ins_live_key_demo_2024`} />
          <p className="text-sm text-slate-600">Requests without a valid key return <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">401 Unauthorized</code>.</p>
          <CodeBlock language="json" code={`{ "error": "Invalid or missing API key" }`} />
        </section>

        {/* API sections */}
        {apis.map(api => {
          const pList = params[api.id as keyof typeof params];
          const resp  = responses[api.id as keyof typeof responses];
          const isGet = api.method === "GET";
          const methodColor = isGet ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700";

          const curlLines = isGet
            ? `curl -G "${baseUrl}${api.path}" \\\n  -H "x-api-key: ins_live_key_demo_2024" \\\n  --data-urlencode "claim_id=CLM-2024-00123"`
            : `curl -X POST "${baseUrl}${api.path}" \\\n  -H "x-api-key: ins_live_key_demo_2024" \\\n  -F "${pList.find(p => p.type === "string")?.name ?? "field"}=VALUE" \\\n  -F "file_field=@/path/to/file.pdf"`;

          return (
            <section key={api.id} id={api.id} className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
                <span className={`inline-flex mr-2 px-2 py-0.5 rounded text-xs font-bold font-mono ${methodColor}`}>{api.method}</span>
                {api.title}
              </h2>
              <p className="text-sm text-slate-600">{api.desc}</p>

              <div className="bg-slate-50 rounded-lg px-4 py-2 font-mono text-sm text-slate-700">
                {api.method} {baseUrl}{api.path}
              </div>

              <h3 className="text-sm font-semibold text-slate-700 mt-4">Authentication</h3>
              <p className="text-xs text-slate-500">Pass your API key in the <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">x-api-key</code> request header.</p>

              <h3 className="text-sm font-semibold text-slate-700 mt-4">{isGet ? "Query Parameters" : "Request Body (multipart/form-data)"}</h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      {["Name","Type","Required","Description"].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pList.map(p => (
                      <tr key={p.name} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 font-mono text-slate-800">{p.name}</td>
                        <td className="px-4 py-2.5 text-slate-500">{p.type}</td>
                        <td className="px-4 py-2.5">{p.required ? <span className="text-emerald-600 font-medium">yes</span> : <span className="text-slate-400">no</span>}</td>
                        <td className="px-4 py-2.5 text-slate-600">{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-sm font-semibold text-slate-700 mt-4">Example Request</h3>
              <CodeBlock language="bash" code={curlLines} />

              <h3 className="text-sm font-semibold text-slate-700 mt-4">Example Response</h3>
              <CodeBlock language="json" code={resp} />
            </section>
          );
        })}
      </div>
    </div>
  );
}
