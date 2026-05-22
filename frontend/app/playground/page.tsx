import ApiCard from "@/components/playground/ApiCard";

export default function PlaygroundPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">API Playground</h1>
        <p className="text-sm text-slate-500 mt-0.5">Test the Wayyo Insurance APIs interactively. All requests go through the Next.js proxy.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ApiCard
          method="GET"
          path="/api/claims/status"
          title="Get Claim Status"
          description="Retrieve the current status and notes for a claim by its ID."
          fields={[]}
          queryParams={[{ name: "claim_id", label: "Claim ID", type: "text" }]}
        />
        <ApiCard
          method="POST"
          path="/api/claims/submit"
          title="Submit Claim"
          description="Submit a new insurance claim with the required supporting documents."
          fields={[
            { name: "policy_number",  label: "Policy Number",  type: "text" },
            { name: "police_abstract",label: "Police Abstract", type: "file", hint: "JPEG" },
            { name: "id_document",    label: "ID Document",    type: "file", hint: "JPEG" },
            { name: "log_book",       label: "Log Book",       type: "file", hint: "PDF"  },
          ]}
        />
        <ApiCard
          method="POST"
          path="/api/covers/create"
          title="Create Cover"
          description="Issue a new insurance policy cover by uploading the required KYC documents."
          fields={[
            { name: "name",            label: "Full Name",       type: "text" },
            { name: "kra_pin",         label: "KRA PIN",         type: "text" },
            { name: "cover_type",      label: "Cover Type",      type: "text" },
            { name: "log_book",        label: "Log Book",        type: "file", hint: "PDF"  },
            { name: "id_card",         label: "ID Card",         type: "file", hint: "JPEG" },
            { name: "driving_license", label: "Driving Licence", type: "file", hint: "JPEG" },
          ]}
        />
      </div>
    </div>
  );
}
