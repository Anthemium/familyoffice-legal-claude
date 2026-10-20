"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ShieldCheck, ShieldAlert, Download, RefreshCw, Play, Trash2, FlaskConical, Check, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { merkleProof, shortHash, shortId, verifyLedger, type LedgerEvent, type Verification } from "@/lib/ledger/core";
import { resetDemo, runDemoScenario, tamperDemo, useLedgerEvents } from "@/lib/ledger/client";
import { LedgerGraph } from "./LedgerGraph";

const CLIENT = { id: "usr-valden-principal", name: "V. Valden", role: "PRINCIPAL" } as const;
const COUNSEL = { id: "usr-amarkov", name: "A. Markov", role: "PARTNER" } as const;

export function LedgerView({ showLinks = true }: { showLinks?: boolean }) {
  const t = useTranslations("ledger");
  const locale = useLocale();
  const events = useLedgerEvents();
  const [v, setV] = useState<Verification | null>(null);
  const [checking, setChecking] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [tampered, setTampered] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [proofSteps, setProofSteps] = useState<number | null>(null);

  const verify = async (list: LedgerEvent[]) => {
    setChecking(true);
    setV(await verifyLedger(list));
    setChecking(false);
  };

  // Проверка при каждом изменении журнала (в т.ч. из другой вкладки).
  useEffect(() => {
    verify(events);
  }, [events]);

  const sel = events.find((e) => e.id === selected) ?? null;
  const selIndex = sel ? events.indexOf(sel) : -1;

  useEffect(() => {
    setProofSteps(null);
    if (selIndex >= 0) merkleProof(events.map((e) => e.hash), selIndex).then((p) => setProofSteps(p.length));
  }, [selIndex, events]);

  const stats = useMemo(
    () => ({
      sessions: new Set(events.map((e) => e.session)).size,
      devices: new Set(events.map((e) => e.device.id)).size,
    }),
    [events],
  );

  const exportStatement = () => {
    const statement = {
      title: "FAMILY OFFICE LEGAL · ledger statement",
      generatedAt: new Date().toISOString(),
      merkleRoot: v?.root,
      chainIntact: v?.ok,
      firstBroken: v?.firstBroken,
      algorithm: { id: "UUIDv7", hash: "SHA-256 over canonical JSON", signature: "ECDSA P-256 / SHA-256", chain: "prevHash", tree: "binary Merkle, duplicate last" },
      events,
    };
    const blob = new Blob([JSON.stringify(statement, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `fol-ledger-${(v?.root ?? "").slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const playDemo = async () => {
    setBusy(true);
    setTampered(null);
    await runDemoScenario(CLIENT, COUNSEL, { msg: t("demo.msg"), doc: t("demo.doc") });
    setBusy(false);
  };

  const fmtLocal = (iso: string) => new Date(iso).toLocaleString(locale, { dateStyle: "medium", timeStyle: "medium" });
  const btn = "inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium transition-colors disabled:opacity-40";

  return (
    <div>
      {/* Сводка и статус цепочки */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className={`flex items-center gap-3 rounded-[var(--radius-tile)] p-5 lg:col-span-2 ${!events.length ? "bg-carta-2" : v?.ok ? "bg-lapis text-carta" : "bg-madder text-carta"}`}>
          {v?.ok || !events.length ? <ShieldCheck size={26} className={events.length ? "text-gold" : "text-ink-3"} /> : <ShieldAlert size={26} className="text-gold" />}
          <div>
            <p className="text-[17px] font-semibold">
              {!events.length ? t("status.empty") : checking ? t("status.checking") : v?.ok ? t("status.ok") : t("status.broken", { n: v?.firstBroken ?? 0 })}
            </p>
            {v && events.length > 0 && <p className="text-[12px] opacity-75">{t("verifiedIn", { n: events.length, ms: v.ms })}</p>}
          </div>
        </div>
        {[
          { k: t("stats.events"), v: events.length },
          { k: t("stats.sessions"), v: stats.sessions },
          { k: t("stats.devices"), v: stats.devices },
        ].map((s) => (
          <div key={s.k} className="rounded-[var(--radius-tile)] bg-vellum p-5 ring-1 ring-hair">
            <p className="text-[28px] font-semibold leading-none tabular-nums">{s.v}</p>
            <p className="mt-2 text-[12.5px] text-ink-3">{s.k}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 break-all font-mono text-[11px] text-ink-3">
        {t("stats.root")}: {v?.root ?? "—"}
      </p>

      {/* Действия */}
      <div className="mt-5 flex flex-wrap gap-2">
        <button onClick={() => verify(events)} disabled={!events.length} className={`${btn} bg-ink text-carta hover:bg-lapis`}>
          <RefreshCw size={14} /> {t("actions.verify")}
        </button>
        <button onClick={exportStatement} disabled={!events.length} className={`${btn} bg-vellum ring-1 ring-hair hover:ring-ink/40`}>
          <Download size={14} /> {t("actions.export")}
        </button>
        <button onClick={playDemo} disabled={busy} className={`${btn} bg-vellum ring-1 ring-hair hover:ring-ink/40`}>
          <Play size={14} /> {t("actions.demo")}
        </button>
        <button onClick={() => setTampered(tamperDemo())} disabled={events.length < 3} className={`${btn} bg-madder-soft text-madder hover:bg-madder hover:text-carta`}>
          <FlaskConical size={14} /> {t("actions.tamper")}
        </button>
        <button onClick={() => { resetDemo(); setSelected(null); setTampered(null); }} disabled={!events.length} className={`${btn} text-ink-3 hover:text-ink`}>
          <Trash2 size={14} /> {t("actions.reset")}
        </button>
      </div>
      {tampered !== null && <p className="mt-3 rounded-2xl bg-madder-soft p-3.5 text-[13px] text-madder">{t("tampered", { n: tampered })}</p>}

      {!events.length ? (
        <div className="mt-8 rounded-[var(--radius-card)] border border-dashed border-hair p-10 text-center">
          <p className="mx-auto max-w-md text-[14.5px] leading-relaxed text-ink-2">{t("empty")}</p>
          {showLinks && (
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/family" className={`${btn} bg-ink text-carta`}>{t("openFamily")}</Link>
              <Link href="/studiolo" className={`${btn} ring-1 ring-ink/30`}>{t("openStudiolo")}</Link>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <section className="rounded-[var(--radius-card)] bg-vellum p-5 ring-1 ring-hair md:p-6">
            <h3 className="text-[17px] font-semibold">{t("graph")}</h3>
            <p className="mt-1 text-[12px] text-ink-3">{t("graphNote")}</p>
            <div className="mt-4 overflow-x-auto">
              <LedgerGraph events={events} checks={v?.checks ?? null} selected={selected} onSelect={setSelected} />
            </div>
          </section>

          <section className="rounded-[var(--radius-card)] bg-vellum p-5 ring-1 ring-hair md:p-6 lg:sticky lg:top-24 lg:self-start">
            {!sel ? (
              <p className="py-10 text-center text-[14px] text-ink-3">{t("select")}</p>
            ) : (
              <>
                <p className="label-caps text-ink-3">#{sel.seq}</p>
                <h3 className="mt-1 font-serif text-[28px] leading-tight">{t(`types.${sel.type.replace(".", "_")}`)}</h3>
                <ul className="mt-4 space-y-1.5">
                  {(["hash", "link", "sig", "parents"] as const).map((k) => {
                    const ok = v?.checks[selIndex]?.[k];
                    return (
                      <li key={k} className={`flex items-center gap-2 text-[12.5px] ${ok ? "text-lapis" : "text-madder"}`}>
                        {ok ? <Check size={14} /> : <X size={14} />} {t(`checks.${k}`)}
                      </li>
                    );
                  })}
                </ul>
                <dl className="mt-5 divide-y divide-hair text-[12.5px]">
                  <Field k={t("f.id")} v={sel.id} mono />
                  <Field k={t("f.time")} v={sel.ts} mono />
                  <Field k={t("f.local")} v={fmtLocal(sel.ts)} />
                  <Field k={t("f.actor")} v={`${sel.actor.name} · ${t(`roles.${sel.actor.role}`)}`} />
                  <Field k={t("f.session")} v={shortId(sel.session)} mono />
                  <Field k={t("f.device")} v={`${sel.device.label} · ${sel.device.platform} · ${sel.device.screen} · ${sel.device.tz} · ${sel.device.lang}`} />
                  <Field k={t("f.deviceId")} v={sel.device.id} mono />
                  <Field k={t("f.fingerprint")} v={shortHash(sel.device.fingerprint)} mono />
                  <Field k={t("f.ip")} v={sel.device.ip ?? `— (${t("f.ipNote")})`} />
                  {sel.subject && <Field k={t("f.subject")} v={`${sel.subject.kind} · ${sel.subject.title ?? shortId(sel.subject.id)}${sel.subject.size ? ` · ${sel.subject.size} B` : ""}`} />}
                  {sel.subject?.sha256 && <Field k={t("f.contentHash")} v={sel.subject.sha256} mono />}
                  {sel.perimeter && <Field k={t("f.perimeter")} v={sel.perimeter} />}
                  <div className="py-2.5">
                    <dt className="text-ink-3">{t("f.parents")}</dt>
                    <dd className="mt-1 flex flex-wrap gap-1.5">
                      {sel.parents.length ? sel.parents.map((p) => (
                        <button key={p} onClick={() => setSelected(p)} className="rounded-md bg-carta-2 px-2 py-0.5 font-mono text-[11px] hover:bg-hair">
                          {shortId(p)}
                        </button>
                      )) : "—"}
                    </dd>
                  </div>
                  <Field k={t("f.prevHash")} v={sel.prevHash} mono />
                  <Field k={t("f.hash")} v={sel.hash} mono />
                  <Field k={t("f.sig")} v={`${sel.sig.slice(0, 24)}…`} mono />
                  {proofSteps !== null && <Field k={t("f.proof")} v={t("f.proofSteps", { n: proofSteps })} />}
                </dl>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function Field({ k, v, mono = false }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="py-2.5">
      <dt className="text-ink-3">{k}</dt>
      <dd className={`mt-0.5 break-all ${mono ? "font-mono text-[11.5px]" : ""}`}>{v}</dd>
    </div>
  );
}
