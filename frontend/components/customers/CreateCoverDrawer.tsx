"use client";
import { useState, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle2 } from "lucide-react";
import { DEFAULT_API_KEY } from "@/lib/auth";
import FileUploadField from "@/components/ui/FileUploadField";

type Props = { open: boolean; onClose: () => void; defaultKraPin?: string; defaultName?: string; onSuccess?: () => void };

export default function CreateCoverDrawer({ open, onClose, defaultKraPin = "", defaultName = "", onSuccess }: Props) {
  const [loading, setLoading]   = useState(false);
  const [coverType, setCoverType] = useState("motor");
  const [success, setSuccess]   = useState<{ policy_number: string; created_at: string; expiry_date: string; customer_name?: string } | null>(null);
  const [error, setError]       = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const form = new FormData(formRef.current!);
      const res = await fetch("/api/covers/create", {
        method: "POST",
        headers: { "x-api-key": DEFAULT_API_KEY },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
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
    setCoverType("motor");
    formRef.current?.reset();
    onClose();
  }

  return (
    <Sheet open={open} onOpenChange={o => !o && handleClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create New Cover</SheetTitle>
          <SheetDescription>Upload the required documents to issue a new policy.</SheetDescription>
        </SheetHeader>

        {success ? (
          <div className="mt-8 flex flex-col items-center gap-4 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            <p className="text-lg font-semibold text-slate-800">Cover Created!</p>
            <div className="w-full rounded-lg bg-slate-50 px-4 py-4 space-y-2 text-sm text-left">
              {success.customer_name && (
                <div className="flex justify-between"><span className="text-slate-500">Customer</span><span className="text-slate-800 font-medium">{success.customer_name}</span></div>
              )}
              <div className="flex justify-between"><span className="text-slate-500">Policy No.</span><span className="font-mono font-medium text-slate-800">{success.policy_number}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Created</span><span className="text-slate-700">{new Date(success.created_at).toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Expiry</span><span className="text-slate-700">{success.expiry_date}</span></div>
            </div>
            <Button onClick={handleClose} className="w-full">Close</Button>
          </div>
        ) : (
          <form ref={formRef} onSubmit={submit} className="mt-6 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="e.g. Amina Wanjiku Mwangi" defaultValue={defaultName} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="kra_pin">KRA PIN <span className="text-red-500">*</span></Label>
              <Input id="kra_pin" name="kra_pin" placeholder="A123456789B" defaultValue={defaultKraPin} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cover_type">Cover Type</Label>
              <Select value={coverType} onValueChange={v => { if (v) setCoverType(v); }}>
                <SelectTrigger id="cover_type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="motor">Motor</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="fire">Fire</SelectItem>
                </SelectContent>
              </Select>
              {/* hidden input so FormData picks it up */}
              <input type="hidden" name="cover_type" value={coverType} />
            </div>
            <FileUploadField name="log_book"        label="Log Book"        hint="PDF"  required />
            <FileUploadField name="id_card"         label="ID Card"         hint="JPEG" required />
            <FileUploadField name="driving_license" label="Driving Licence" hint="JPEG" required />
            {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating…</> : "Create Cover"}
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
