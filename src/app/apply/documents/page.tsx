"use client";

import { useActionState, useState, useRef } from "react";
import { ArrowRight, AlertCircle, Upload, CheckCircle, FileText, Loader2 } from "lucide-react";
import { saveDocuments } from "@/actions/apply";

type DocField = {
  key: "passportPhotoUrl" | "waecResultUrl" | "ninDocUrl" | "medicalCertUrl" | "seaServiceUrl";
  docType: "passport" | "waec" | "nin" | "medical" | "seaservice";
  label: string;
  hint: string;
  required: boolean;
  accept: string;
};

const DOC_FIELDS: DocField[] = [
  {
    key: "passportPhotoUrl",
    docType: "passport",
    label: "Passport Photograph",
    hint: "Recent colour passport photo, white background. JPEG/PNG, max 2 MB.",
    required: true,
    accept: "image/jpeg,image/png,image/webp",
  },
  {
    key: "waecResultUrl",
    docType: "waec",
    label: "WAEC / NECO Result",
    hint: "Scanned original result slip. PDF or JPEG.",
    required: true,
    accept: "image/jpeg,image/png,application/pdf",
  },
  {
    key: "ninDocUrl",
    docType: "nin",
    label: "NIN Slip / NIMC Card",
    hint: "National Identity Number document. PDF or image.",
    required: true,
    accept: "image/jpeg,image/png,application/pdf",
  },
  {
    key: "medicalCertUrl",
    docType: "medical",
    label: "Medical Certificate (ENG1 / ML5)",
    hint: "Seafarer medical fitness certificate from a recognised medical examiner.",
    required: true,
    accept: "image/jpeg,image/png,application/pdf",
  },
  {
    key: "seaServiceUrl",
    docType: "seaservice",
    label: "Sea Service / Experience Letter",
    hint: "Optional — Discharge book or employer letter confirming prior sea service.",
    required: false,
    accept: "image/jpeg,image/png,application/pdf",
  },
];

async function uploadFile(
  file: File,
  docType: string
): Promise<string> {
  // Get presigned URL
  const res = await fetch("/api/upload/application-doc", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, contentType: file.type, docType }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "Upload failed");
  }

  const { uploadUrl, publicUrl } = await res.json();

  // Upload to R2
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadRes.ok) throw new Error("Failed to upload file to storage.");

  return publicUrl as string;
}

export default function DocumentsPage() {
  const [state, formAction, pending] = useActionState(saveDocuments, null);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  async function handleFile(field: DocField, file: File | null) {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadErrors((prev) => ({ ...prev, [field.key]: "File must be under 5 MB." }));
      return;
    }

    setUploading((prev) => ({ ...prev, [field.key]: true }));
    setUploadErrors((prev) => ({ ...prev, [field.key]: "" }));

    try {
      const url = await uploadFile(file, field.docType);
      setUrls((prev) => ({ ...prev, [field.key]: url }));
    } catch (err) {
      setUploadErrors((prev) => ({
        ...prev,
        [field.key]: (err as Error).message ?? "Upload failed",
      }));
    } finally {
      setUploading((prev) => ({ ...prev, [field.key]: false }));
    }
  }

  const requiredUploaded = DOC_FIELDS.filter((f) => f.required).every((f) => urls[f.key]);

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="px-8 pt-7 pb-2">
        <div className="flex items-center gap-2 mb-1">
          <FileText size={18} className="text-ocean" />
          <h1 className="font-cinzel text-navy text-xl font-bold">Upload Documents</h1>
        </div>
        <p className="text-muted text-sm">
          Step 4 of 5 — Upload scanned copies. PDF, JPEG or PNG. Max 5 MB each.
        </p>
      </div>

      <div className="px-8 py-6">
        {state?.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2 mb-5">
            <AlertCircle size={14} className="shrink-0" />
            {state.error}
          </div>
        )}

        <form action={formAction} ref={formRef} className="space-y-4">
          {/* Hidden inputs for uploaded URLs */}
          {DOC_FIELDS.map((f) => (
            <input key={f.key} type="hidden" name={f.key} value={urls[f.key] ?? ""} />
          ))}

          {DOC_FIELDS.map((field) => {
            const uploaded = !!urls[field.key];
            const isUploading = uploading[field.key];
            const err = uploadErrors[field.key];

            return (
              <div key={field.key} className={`border rounded-xl p-4 transition-colors ${
                uploaded ? "border-jade/40 bg-jade/5" :
                err ? "border-danger/40 bg-red-50" :
                "border-border"
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    uploaded ? "bg-jade/15" : "bg-surface"
                  }`}>
                    {uploaded ? (
                      <CheckCircle size={18} className="text-jade" />
                    ) : (
                      <FileText size={18} className="text-muted" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-navy text-sm">{field.label}</span>
                      {field.required && (
                        <span className="text-[10px] font-bold text-danger bg-danger/10 px-1.5 py-0.5 rounded-full">Required</span>
                      )}
                      {!field.required && (
                        <span className="text-[10px] text-muted bg-surface px-1.5 py-0.5 rounded-full">Optional</span>
                      )}
                    </div>
                    <p className="text-xs text-muted">{field.hint}</p>

                    {err && <p className="text-xs text-danger mt-1">{err}</p>}

                    {uploaded && (
                      <p className="text-xs text-jade mt-1 font-semibold">✓ Uploaded successfully</p>
                    )}
                  </div>

                  <div className="shrink-0">
                    {isUploading ? (
                      <div className="flex items-center gap-1 text-xs text-muted px-3 py-2">
                        <Loader2 size={14} className="animate-spin" /> Uploading…
                      </div>
                    ) : (
                      <label className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        uploaded
                          ? "text-muted border border-border hover:bg-surface"
                          : "text-ocean border border-ocean/30 hover:bg-ocean/10"
                      }`}>
                        <Upload size={13} />
                        {uploaded ? "Replace" : "Choose File"}
                        <input
                          type="file"
                          accept={field.accept}
                          className="hidden"
                          onChange={(e) => handleFile(field, e.target.files?.[0] ?? null)}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="bg-navy/5 border border-navy/15 rounded-lg p-3 text-xs text-muted">
            🔒 Your documents are encrypted and stored securely in compliance with the NDPR. Only admissions staff can access them.
          </div>

          <button
            type="submit"
            disabled={pending || !requiredUploaded}
            className="w-full flex items-center justify-center gap-2 bg-gold text-navy font-bold py-3.5 rounded-lg hover:bg-yellow-400 transition-colors text-sm disabled:opacity-60"
          >
            {pending ? "Saving…" : !requiredUploaded ? "Upload all required documents to continue" : <><span>Review & Submit Application</span> <ArrowRight size={14} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
