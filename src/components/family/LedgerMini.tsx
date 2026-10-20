"use client";

import { useTranslations } from "next-intl";
import { Fingerprint, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { shortId } from "@/lib/ledger/core";
import { useLedgerEvents } from "@/lib/ledger/client";

// Последние события реестра прямо в кабинете — у каждого шага виден его ID.
export function LedgerMini() {
  const t = useTranslations("ledger");
  const events = useLedgerEvents();
  const last = events.slice(-6).reverse();
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2"><Fingerprint size={17} className="text-lapis" /><h2 className="text-[17px] font-semibold">{t("mini.title")}</h2></div>
        <Link href="/ledger" className="inline-flex items-center gap-1 text-[12.5px] font-medium text-lapis">{t("mini.all")} <ArrowUpRight size={14} /></Link>
      </div>
      {last.length === 0 ? (
        <p className="mt-6 text-center text-[13px] text-ink-3">{t("mini.none")}</p>
      ) : (
        <ol className="mt-4 space-y-2.5">
          {last.map((e) => (
            <li key={e.id} className="flex items-center gap-3 text-[12.5px]">
              <span className="w-8 font-mono text-[11px] text-ink-3">#{e.seq}</span>
              <span className="min-w-0 flex-1 truncate">{t(`types.${e.type.replace(".", "_")}`)} <span className="text-ink-3">· {e.actor.name}</span></span>
              <span className="hidden font-mono text-[10.5px] text-ink-3 sm:inline">{shortId(e.id)}</span>
              <span className="font-mono text-[10.5px] text-ink-3">{e.ts.slice(11, 19)}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
