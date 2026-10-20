"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { FileUp, FileText, Eye } from "lucide-react";
import { openDocument, uploadDocument, useDocuments } from "@/lib/ledger/client";
import { shortHash } from "@/lib/ledger/core";
import { useLedgerSession } from "@/components/ledger/LedgerSession";

// Хранилище документов: SHA-256 считается в браузере, в реестр уходит событие document.upload.
// В рабочей версии файл шифруется и загружается в S3 по presigned URL, хэш сверяет сервер.
export function Vault() {
  const t = useTranslations("ledger.vault");
  const session = useLedgerSession();
  const docs = useDocuments();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const onFiles = async (files: FileList | null) => {
    if (!session || !files?.length) return;
    setBusy(true);
    for (const f of Array.from(files)) await uploadDocument(session, f, "A");
    setBusy(false);
    if (input.current) input.current.value = "";
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[17px] font-semibold">{t("title")}</h2>
        <button
          onClick={() => input.current?.click()}
          disabled={!session || busy}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[12.5px] font-medium text-carta disabled:opacity-40"
        >
          <FileUp size={14} /> {t("upload")}
        </button>
        <input ref={input} type="file" multiple className="hidden" onChange={(e) => onFiles(e.target.files)} />
      </div>
      <p className="mt-1 text-[11.5px] text-ink-3">{t("hint")}</p>
      {docs.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-hair py-8 text-center text-[13px] text-ink-3">{t("empty")}</p>
      ) : (
        <ul className="mt-4 divide-y divide-hair">
          {docs.slice(-5).reverse().map((d) => (
            <li key={d.id} className="flex items-center gap-3 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-madder-soft text-madder"><FileText size={16} /></span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px]">{d.title}</span>
                <span className="block font-mono text-[10.5px] text-ink-3">sha256 {shortHash(d.sha256)} · {Math.max(1, Math.round(d.size / 1024))} KB</span>
              </span>
              <button
                onClick={() => session && openDocument(session, d)}
                disabled={!session}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] text-lapis ring-1 ring-lapis/30 hover:bg-lapis-soft"
              >
                <Eye size={13} /> {t("open")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
