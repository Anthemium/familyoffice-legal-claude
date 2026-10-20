"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Eye, FileText, Lock, Briefcase, Download } from "lucide-react";
import { findOpen, openDocument, openMessage, useDocuments, useLedgerEvents, useMessages, append } from "@/lib/ledger/client";
import { shortHash, shortId } from "@/lib/ledger/core";
import { useLedgerSession } from "@/components/ledger/LedgerSession";

// Входящие от семей: текст скрыт до открытия; открытие — событие message.open,
// которое ссылается на message.send клиента. Клиент видит статус «прочитано».
export function StudioloInbox() {
  const t = useTranslations("ledger.inbox");
  const session = useLedgerSession();
  const messages = useMessages();
  const docs = useDocuments();
  const events = useLedgerEvents();
  const [shown, setShown] = useState<Set<string>>(new Set());

  const open = async (id: string) => {
    const m = messages.find((x) => x.id === id);
    if (!m || !session) return;
    await openMessage(session, m);
    setShown(new Set(shown).add(id));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[var(--radius-card)] bg-noct-2 p-6 ring-1 ring-noct-line">
        <h2 className="font-serif text-[28px]">{t("title")}</h2>
        {messages.length === 0 ? (
          <p className="mt-5 text-[13.5px] text-carta/50">{t("empty")}</p>
        ) : (
          <ul className="mt-5 divide-y divide-noct-line/70">
            {messages.slice().reverse().map((m) => {
              const opened = findOpen(events, m.id).some((e) => e.actor.id === session?.actor.id) || shown.has(m.id);
              return (
                <li key={m.id} className="py-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10.5px] ${m.perimeter === "A" ? "bg-madder/30 text-[#efc3ca]" : "bg-lapis/40 text-[#c4d0ee]"}`}>
                      {m.perimeter === "A" ? <Lock size={10} /> : <Briefcase size={10} />} {m.perimeter}
                    </span>
                    <span className="text-[13.5px]">{m.from}</span>
                    <span className="font-mono text-[11px] text-carta/40">{m.ts.slice(0, 16).replace("T", " ")} UTC · {shortId(m.sentEvent)}</span>
                    <button
                      onClick={() => open(m.id)}
                      disabled={!session}
                      className={`ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] ${opened ? "text-carta/50 ring-1 ring-noct-line" : "bg-gold text-noct"}`}
                    >
                      <Eye size={13} /> {opened ? t("opened") : t("open")}
                    </button>
                  </div>
                  {opened && <p className="mt-3 rounded-2xl bg-noct-3 p-4 font-serif text-[17px] leading-relaxed text-carta/90">{m.text}</p>}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {docs.length > 0 && (
        <section className="rounded-[var(--radius-card)] bg-noct-2 p-6 ring-1 ring-noct-line">
          <h2 className="font-serif text-[24px]">{t("docs")}</h2>
          <ul className="mt-4 divide-y divide-noct-line/70">
            {docs.slice().reverse().map((d) => (
              <li key={d.id} className="flex items-center gap-3 py-3">
                <FileText size={16} className="text-gold" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px]">{d.title}</span>
                  <span className="font-mono text-[10.5px] text-carta/40">sha256 {shortHash(d.sha256)}</span>
                </span>
                <button onClick={() => session && openDocument(session, d)} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] text-carta/70 ring-1 ring-noct-line hover:text-carta">
                  <Eye size={13} /> {t("open")}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

// Выдача шаблона из библиотеки — тоже шаг реестра.
export function TemplateDownload({ title }: { title: string }) {
  const session = useLedgerSession();
  return (
    <button
      aria-label="Download"
      onClick={() => session && append(session, { type: "template.download", subject: { kind: "template", id: `tpl-${title}`, title }, meta: { link: "S3 presigned · 300 s" } })}
      className="text-carta/40 transition-colors hover:text-gold"
    >
      <Download size={16} />
    </button>
  );
}
