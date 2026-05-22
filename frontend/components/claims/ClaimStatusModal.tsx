"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { DEFAULT_API_KEY } from "@/lib/auth";
import StatusBadge from "./StatusBadge";

type Status = "pending" | "under_review" | "approved" | "rejected" | "paid";
type Result  = { claim_id: string; status: string; updated_at: string; notes: string };
type Props   = { claimId: string; open: boolean; onClose: () => void; onStatusUpdated?: () => void };

export default function ClaimStatusModal({ claimId, open, onClose, onStatusUpdated }: Props) {
  const [loading, setLoading]   = useState(false);
  const [saving, setSaving]     = useState(false);
  const [result, setResult]     = useState<Result | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [error, setError]       = useState("");

  async function check() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/claims/status?claim_id=${encodeURIComponent(claimId)}`, {
        headers: { "x-api-key": DEFAULT_API_KEY },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setResult(data);
      setNewStatus(data.status);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function saveStatus() {
    if (!newStatus || newStatus === result?.status) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/claims/${encodeURIComponent(claimId)}`, {
        method: "PATCH",
        headers: { "x-api-key": DEFAULT_API_KEY, "content-type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Update failed");
      setResult({ claim_id: claimId, status: data.status, updated_at: data.updatedAt, notes: data.notes });
      onStatusUpdated?.();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  function handleOpenChange(open: boolean) {
    if (!open) { setResult(null); setError(""); setNewStatus(""); onClose(); }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Claim Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg bg-slate-50 px-4 py-3 font-mono text-sm text-slate-700">{claimId}</div>

          {!result && !loading && (
            <Button onClick={check} className="w-full">Check Status</Button>
          )}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          )}
          {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">{error}</p>}

          {result && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Current status</span>
                <StatusBadge status={result.status as Status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Last updated</span>
                <span className="text-sm text-slate-700">{new Date(result.updated_at).toLocaleString()}</span>
              </div>
              <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">{result.notes}</div>

              {/* Inline status update */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Update Status</p>
                <div className="flex gap-2">
                  <Select value={newStatus} onValueChange={v => { if (v) setNewStatus(v); }}>
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    onClick={saveStatus}
                    disabled={saving || newStatus === result.status}
                    className="px-4"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                  </Button>
                </div>
              </div>

              <Button variant="outline" onClick={check} className="w-full">Refresh</Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
