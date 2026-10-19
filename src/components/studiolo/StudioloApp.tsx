"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { KeyRound, Check, Lock, LogOut, Briefcase, FileText, Scale, KeySquare, History, ArrowLeft, Download, Fingerprint } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Seal } from "@/components/Seal";
import { LangSwitch } from "@/components/LangSwitch";
import { LAW } from "@/lib/law";
import { asset } from "@/lib/asset";

type Access = "full" | "read" | "none";
// Матрица доступов: строки — роли, столбцы — Контур A, Контур B, Шаблоны, Журнал.
const MATRIX: Access[][] = [
  ["full", "full", "full", "full"],
  ["full", "full", "full", "read"],
  ["read", "full", "read", "none"],
  ["read", "full", "none", "read"],
  ["none", "read", "none", "none"],
  ["none", "read", "none", "none"],
];

const MENU_ICONS = [Briefcase, FileText, Scale, KeySquare, History];

export function StudioloApp() {
  const t = useTranslations("studiolo");
  const nav = useTranslations("nav");
  const [stage, setStage] = useState<"gate" | "checking" | "open">("gate");
  const [checks, setChecks] = useState(0);
  const [section, setSection] = useState(0);
  const [lawTab, setLawTab] = useState(0);
  const [now, setNow] = useState("");

  useEffect(() => {
    if (stage !== "checking") return;
    setChecks(0);
    const timers = [1, 2, 3].map((n) => setTimeout(() => setChecks(n), n * 450));
    const done = setTimeout(() => setStage("open"), 1700);
    return () => { timers.forEach(clearTimeout); clearTimeout(done); };
  }, [stage]);

  useEffect(() => { setNow(new Date().toISOString().slice(0, 16).replace("T", " ")); }, [stage]);

  // Водяной знак: имя адвоката + время сессии, повторяется по всему экрану.
  const watermark = useMemo(() => {
    const text = `${t("watermark")} · ${now}`;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='420' height='200'><text x='0' y='120' transform='rotate(-24 0 120)' font-family='monospace' font-size='13' fill='%23f5f0e7'>${text}</text></svg>`;
    return `url("data:image/svg+xml;utf8,${svg.replace(/"/g, "'").replace(/#/g, "%23")}")`;
  }, [t, now]);

  const gateChecks = t.raw("gateChecks") as string[];

  if (stage !== "open") {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-noct px-4 text-carta">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/art/carceri.jpg")} alt="" className="art-engraving absolute inset-0 h-full w-full object-cover opacity-[0.13]" />
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,transparent,var(--color-noct))]" />
        <Link href="/" className="absolute left-4 top-5 flex items-center gap-2 text-[13px] text-carta/60 hover:text-carta md:left-8">
          <ArrowLeft size={16} /> {nav("back")}
        </Link>
        <div className="absolute right-4 top-5 md:right-8"><LangSwitch tone="light" /></div>

        <div className="relative w-full max-w-[420px] text-center">
          <Seal size={64} className="mx-auto text-gold" />
          <h1 className="mt-6 font-serif text-[56px] italic leading-none">{t("gateTitle")}</h1>
          <p className="mx-auto mt-5 max-w-sm text-[14.5px] leading-relaxed text-carta/60">{t("gateLead")}</p>

          <ul className="mx-auto mt-9 max-w-xs space-y-2.5 text-left">
            {gateChecks.map((c, i) => {
              const ok = stage === "checking" && checks > i;
              return (
                <li key={c} className="flex items-center gap-3 text-[13px]">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full border transition-colors ${ok ? "border-gold bg-gold text-noct" : "border-noct-line"}`}>
                    {ok && <Check size={12} strokeWidth={3} />}
                  </span>
                  <span className={ok ? "text-carta" : "text-carta/50"}>{c}</span>
                </li>
              );
            })}
          </ul>

          <button
            onClick={() => setStage("checking")}
            disabled={stage === "checking"}
            className="mt-9 flex w-full items-center justify-center gap-2.5 rounded-full bg-gold py-4 text-[14px] font-semibold text-noct transition-opacity disabled:opacity-70"
          >
            {stage === "checking" ? <Fingerprint size={18} className="animate-pulse" /> : <KeyRound size={18} />}
            {stage === "checking" ? t("unlocking") : t("gateKey")}
          </button>
          <p className="mt-5 font-mono text-[10.5px] uppercase tracking-wider text-carta/35">{t("gateSession")}</p>
        </div>
      </div>
    );
  }

  const menu = t.raw("menu") as string[];
  const matters = t.raw("mattersItems") as { t: string; f: string; j: string; c: "A" | "B"; d: string }[];
  const cols = t.raw("mattersCols") as string[];
  const templates = t.raw("templatesItems") as { t: string; k: string; langs: string[] }[];
  const lawTabs = t.raw("lawTabs") as string[];
  const roles = t.raw("accessRoles") as string[];
  const accessCols = t.raw("accessCols") as string[];
  const audit = t.raw("auditItems") as { t: string; a: string; h: string }[];

  const panel = "rounded-[var(--radius-card)] bg-noct-2 p-6 ring-1 ring-noct-line";

  return (
    <div className="min-h-screen bg-noct text-carta select-none">
      <div className="watermark" style={{ ["--wm" as string]: watermark }} aria-hidden />

      <header className="sticky top-0 z-30 border-b border-noct-line bg-noct/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <Seal size={30} className="text-gold" />
            <span className="font-serif text-[22px] italic">{t("title")}</span>
            <span className="hidden items-center gap-1.5 rounded-full bg-madder/25 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[#e9b9c0] sm:flex">
              <Lock size={10} /> LPP
            </span>
          </div>
          <div className="flex items-center gap-4">
            <LangSwitch tone="light" />
            <span className="hidden text-[12.5px] text-carta/60 md:inline">{t("user")}</span>
            <button onClick={() => setStage("gate")} className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[12.5px] text-carta/70 ring-1 ring-noct-line hover:text-carta">
              <LogOut size={14} /> <span className="hidden sm:inline">{t("lock")}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-6 md:px-8 lg:grid-cols-[220px_1fr]">
        {/* Боковое меню / на телефоне — горизонтальные вкладки */}
        <nav className="scroll-x -mx-4 flex gap-1 px-4 lg:mx-0 lg:flex-col lg:px-0">
          {menu.map((m, i) => {
            const Icon = MENU_ICONS[i];
            return (
              <button
                key={m}
                onClick={() => setSection(i)}
                aria-current={section === i ? "page" : undefined}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-left text-[13.5px] transition-colors ${section === i ? "bg-noct-3 text-carta" : "text-carta/55 hover:text-carta"}`}
              >
                <Icon size={16} className={section === i ? "text-gold" : ""} />
                {m}
              </button>
            );
          })}
        </nav>

        <main className="min-w-0 space-y-6">
          {section === 0 && (
            <section className={panel}>
              <h2 className="font-serif text-[28px]">{t("matters")}</h2>
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[620px] text-left text-[13.5px]">
                  <thead>
                    <tr className="text-carta/45">
                      {cols.map((c) => <th key={c} className="label-caps border-b border-noct-line pb-3 !text-[10px] font-semibold">{c}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {matters.map((m) => (
                      <tr key={m.t} className="border-b border-noct-line/60 last:border-0">
                        <td className="py-4 pr-4">{m.t}</td>
                        <td className="py-4 pr-4 text-carta/70">{m.f}</td>
                        <td className="py-4 pr-4 font-mono text-[12px] text-carta/70">{m.j}</td>
                        <td className="py-4 pr-4">
                          <span className={`rounded-full px-2.5 py-1 font-mono text-[11px] ${m.c === "A" ? "bg-madder/30 text-[#efc3ca]" : "bg-lapis/40 text-[#c4d0ee]"}`}>{m.c}</span>
                        </td>
                        <td className={`py-4 font-mono text-[12px] ${/\d/.test(m.d) ? "text-carta/70" : "text-gold"}`}>{m.d}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {section === 1 && (
            <section className={panel}>
              <h2 className="font-serif text-[28px]">{t("templates")}</h2>
              <p className="mt-2 max-w-2xl text-[13px] text-carta/55">{t("templatesNote")}</p>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {templates.map((tp) => (
                  <article key={tp.t} className="group flex flex-col justify-between rounded-2xl bg-noct-3 p-5">
                    <div>
                      <p className="font-mono text-[10.5px] uppercase tracking-wider text-gold/80">{tp.k}</p>
                      <h3 className="mt-2 text-[15px] leading-snug">{tp.t}</h3>
                    </div>
                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {["RU", "EN", "HU"].map((l) => (
                          <span key={l} className={`rounded-md px-2 py-0.5 font-mono text-[10.5px] ${tp.langs.includes(l) ? "bg-carta/10 text-carta" : "text-carta/25 line-through"}`}>{l}</span>
                        ))}
                      </div>
                      <Download size={16} className="text-carta/40 transition-colors group-hover:text-gold" />
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {section === 2 && (
            <section className={panel}>
              <h2 className="font-serif text-[28px]">{t("law")}</h2>
              <p className="mt-2 max-w-2xl text-[13px] text-carta/55">{t("lawNote")}</p>
              <div className="scroll-x mt-5 flex gap-2">
                {lawTabs.map((l, i) => (
                  <button key={l} onClick={() => setLawTab(i)} className={`shrink-0 rounded-full px-4 py-2 text-[12.5px] ${lawTab === i ? "bg-carta text-noct" : "bg-noct-3 text-carta/65"}`}>{l}</button>
                ))}
              </div>
              <div className="mt-6 space-y-6">
                {LAW[lawTab].map((n) => (
                  <article key={n.ref} className="rounded-2xl bg-noct-3 p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-mono text-[13px] text-gold">{n.ref}</h3>
                      <span className="font-mono text-[10.5px] text-carta/40">{n.source}</span>
                    </div>
                    <div className="mt-4 grid gap-4 lg:grid-cols-3">
                      {(["ru", "en", "hu"] as const).map((l) => (
                        <div key={l} className="border-t border-noct-line pt-3">
                          <p className="label-caps !text-[9.5px] text-carta/40">
                            {l.toUpperCase()} {n.orig === l && <span className="ml-1 text-gold">· original</span>}
                          </p>
                          <p className={`mt-2 font-serif text-[16.5px] leading-[1.45] ${n.orig === l ? "text-carta" : "text-carta/75"}`}>{n[l]}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {section === 3 && (
            <section className={panel}>
              <h2 className="font-serif text-[28px]">{t("accessTitle")}</h2>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[560px] text-[13px]">
                  <thead>
                    <tr>
                      <th />
                      {accessCols.map((c, i) => (
                        <th key={c} className={`label-caps pb-3 !text-[10px] ${i === 0 ? "text-[#e9b9c0]" : "text-carta/45"}`}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((r, ri) => (
                      <tr key={r} className="border-t border-noct-line/70">
                        <td className="py-3.5 pr-4 text-carta/80">{r}</td>
                        {MATRIX[ri].map((a, ci) => (
                          <td key={ci} className="py-3.5 text-center">
                            <span
                              title={a}
                              className={`inline-block h-3 w-3 rounded-full ${a === "full" ? (ci === 0 ? "bg-madder" : "bg-gold") : a === "read" ? "ring-2 ring-inset ring-gold/70" : "bg-noct-line"}`}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-5 flex flex-wrap gap-5 text-[11.5px] text-carta/50">
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-gold" /> full</span>
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full ring-2 ring-inset ring-gold/70" /> read</span>
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-noct-line" /> none</span>
              </div>
            </section>
          )}

          {section === 4 && (
            <section className={panel}>
              <h2 className="font-serif text-[28px]">{t("audit")}</h2>
              <ul className="mt-5 divide-y divide-noct-line/70">
                {audit.map((a) => (
                  <li key={a.h} className="flex flex-wrap items-center gap-x-5 gap-y-1 py-4 text-[13.5px]">
                    <span className="w-12 font-mono text-[12px] text-carta/50">{a.t}</span>
                    <span className="min-w-0 flex-1">{a.a}</span>
                    <span className="font-mono text-[11px] text-gold/70">sha256 {a.h}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Сводка по безопасности сессии — видна во всех разделах */}
          <section className="grid gap-3 sm:grid-cols-3">
            {[
              { k: "Passkey + YubiKey", v: "FIDO2" },
              { k: "S3 · SSE-C", v: "AES-256" },
              { k: "Session", v: "15:00" },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl bg-noct-2 px-5 py-4 ring-1 ring-noct-line">
                <p className="font-mono text-[10.5px] uppercase tracking-wider text-carta/40">{s.k}</p>
                <p className="mt-1 text-[20px] font-semibold text-gold">{s.v}</p>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
