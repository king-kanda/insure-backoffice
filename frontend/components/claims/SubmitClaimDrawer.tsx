"use client";
import { useState, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { DEFAULT_API_KEY } from "@/lib/auth";
import FileUploadField from "@/components/ui/FileUploadField";

type Props = { open: boolean; onClose: () => void; onSuccess?: () => void };

export default function SubmitClaimDrawer({ open, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ claim_id: string; submitted_at: string } | null>(null);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const form = new FormData(formRef.current!);
      const res = await fetch("/api/claims/submit", {
        method: "POST",
        headers: { "x-api-key": DEFAULT_API_KEY },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed");
      setSuccess(data);
      onSuccess?.();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setSuccess(null);
    setError("");
    formRef.current?.reset();
    onClose();
  }

  return (
    <Sheet open={open} onOpenChange={o => !o && handleClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Submit New Claim</SheetTitle>
          <SheetDescription>Upload the required documents to file a new insurance claim.</SheetDescription>
        </SheetHeader>

        {success ? (
          <div className="mt-8 flex flex-col items-center gap-4 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            <p className="text-lg font-semibold text-slate-800">Claim Submitted!</p>
            <div className="w-full rounded-lg bg-slate-50 px-4 py-4 space-y-2 text-sm text-left">
              <div className="flex justify-between"><span className="text-slate-500">Claim ID</span><span className="font-mono font-medium text-slate-800">{success.claim_id}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Submitted</span><span className="text-slate-700">{new Date(success.submitted_at).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="text-amber-600 font-medium">Pending</span></div>
            </div>
            <Button onClick={handleClose} className="w-full">Close</Button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={submit} className="mt-6 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="policy_number">Policy Number <span className="text-red-500">*</span></Label>
              <Input id="policy_number" name="policy_number" placeholder="POL-2024-00101" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" placeholder="Brief description of the incident" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amount">Claim Amount (KES)</Label>
              <Input id="amount" name="amount" type="number" min="0" placeholder="0" />
            </div>

            <FileUploadField name="police_abstract" label="Police Abstract" hint="JPEG" required />
            <FileUploadField name="id_document"     label="ID Document"    hint="JPEG" required />
            <FileUploadField name="log_book"        label="Log Book"       hint="PDF"  required />

            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting…</> : "Submit Claim"}
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
