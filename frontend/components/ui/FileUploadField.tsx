"use client";
import { useRef, useState } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  label: string;
  required?: boolean;
  accept?: string; // e.g. "image/jpeg,application/pdf"
  hint?: string;
};

const ALLOWED: Record<string, string> = {
  "image/jpeg": "JPEG",
  "image/jpg":  "JPEG",
  "application/pdf": "PDF",
};

export default function FileUploadField({ name, label, required, hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile]     = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError]   = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0] ?? null;
    setError("");
    setPreview(null);
    setFile(null);

    if (!picked) return;

    const mime = picked.type.toLowerCase();
    if (!ALLOWED[mime]) {
      setError(`Invalid format. Only JPEG and PDF are accepted.`);
      e.target.value = "";
      return;
    }

    setFile(picked);
    if (mime.startsWith("image/")) {
      setPreview(URL.createObjectURL(picked));
    }
  }

  function clear(e: React.MouseEvent) {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  const isPdf = file && file.type === "application/pdf";

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        {hint && <span className="ml-1.5 text-xs font-normal text-slate-400">({hint})</span>}
      </label>

      {/* Hidden real input */}
      <input
        ref={inputRef}
        id={name}
        name={name}
        type="file"
        accept="image/jpeg,image/jpg,application/pdf"
        required={required}
        onChange={handleChange}
        className="hidden"
      />

      {/* Drop zone / preview */}
      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "w-full flex flex-col items-center justify-center gap-2 h-24 border-2 border-dashed rounded-lg transition-colors text-center px-3",
            error
              ? "border-red-300 bg-red-50 hover:border-red-400"
              : "border-slate-200 hover:border-blue-400 hover:bg-blue-50"
          )}
        >
          <Upload className={cn("w-5 h-5", error ? "text-red-400" : "text-slate-400")} />
          <span className={cn("text-xs", error ? "text-red-500" : "text-slate-500")}>
            Click to upload <span className="font-medium">{label.toLowerCase()}</span>
          </span>
          <span className="text-xs text-slate-400">JPEG or PDF only</span>
        </button>
      ) : (
        <div className="relative rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
          {preview ? (
            /* Image preview */
            <div className="relative h-32 w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt={file.name} className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2">
                <p className="text-white text-xs font-medium truncate">{file.name}</p>
                <p className="text-white/70 text-xs">{(file.size / 1024).toFixed(0)} KB · JPEG</p>
              </div>
            </div>
          ) : isPdf ? (
            /* PDF preview */
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-red-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(0)} KB · PDF</p>
              </div>
            </div>
          ) : null}

          {/* Remove button */}
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
            title="Remove file"
          >
            <X className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      )}

      {error && (
        <p className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{error}
        </p>
      )}
    </div>
  );
}
