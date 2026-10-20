import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { ArrowRight, ArrowUpRight, Lock, Phone, Mail, MapPin, Fingerprint } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/PageShell";
import { Art } from "@/components/Art";
import { TiersDiagram } from "@/components/TiersDiagram";
import { getArticles } from "@/content/articles";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

function SectionHead({ eyebrow, title, lead, light = false }: { eyebrow: string; title: string; lead?: string; light?: boolean }) {
  return (
    <div className="max-w-3xl">
      <p className={`label-caps ${light ? "text-gold" : "text-gold"}`}>{eyebrow}</p>
      <h2 className={`mt-4 font-serif text-[38px] leading-[1.05] md:text-[56px] ${light ? "text-carta" : "text-ink"}`}>{title}</h2>
      {lead && <p className={`mt-5 max-w-2xl text-[16px] leading-relaxed md:text-[17px] ${light ? "text-carta/70" : "text-ink-2"}`}>{lead}</p>}
    </div>
  );
}

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations();

  const why = ["bank", "sfo", "ours"] as const;
  const practice = t.raw("practice.items") as { t: string; d: string }[];
  const juris = t.raw("juris.items") as { code: string; name: string; regime: string; figure: string; figureLabel: string }[];
  const rules = t.raw("privilege.rules") as { t: string; d: string }[];
  const stats = t.raw("stats.items") as { v: string; l: string }[];
  const itItems = t.raw("tiers.it.items") as { t: string; d: string }[];
  const articles = getArticles(locale);

  return (
    <PageShell>
        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="mx-auto grid max-w-[1320px] gap-10 px-4 pb-20 pt-12 md:px-8 md:pt-20 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <div className="rise flex flex-col justify-center">
            <p className="label-caps text-ink-3">{t("hero.eyebrow")}</p>
            <h1 className="mt-6 font-serif text-[46px] leading-[1] tracking-[-0.01em] md:text-[76px]">
              {t("hero.title")}
              <span className="mt-5 block text-[28px] italic leading-[1.15] text-lapis md:text-[40px]">— {t("hero.subtitle")}</span>
            </h1>
            <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-ink-2">{t("hero.lead")}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[14px] font-medium text-carta transition-colors hover:bg-lapis">
                {t("hero.cta")} <ArrowRight size={16} />
              </a>
              <a href="#platform" className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 text-[14px] transition-colors hover:border-ink">
                {t("hero.cta2")}
              </a>
            </div>
            <p className="mt-12 flex items-start gap-2.5 border-t border-hair pt-5 font-mono text-[11.5px] leading-relaxed text-madder">
              <Lock size={13} className="mt-0.5 shrink-0" />
              {t("hero.basis")}
            </p>
          </div>
          <Art
            src="/art/pantheon.jpg"
            alt="Piranesi, Pantheon"
            caption={t("hero.caption")}
            className="rise passe-partout aspect-[4/5] lg:aspect-auto [&>div]:h-[calc(100%-2.5rem)]"
            position="50% 40%"
          />
        </section>

        {/* ── РЫНОК: статистика из обзора ──────────────────── */}
        <section id="market" className="bg-ink text-carta">
          <div className="mx-auto max-w-[1320px] px-4 py-20 md:px-8 md:py-24">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-end">
              <SectionHead eyebrow={t("stats.eyebrow")} title={t("stats.title")} light />
              <p className="text-[16px] leading-relaxed text-carta/65">{t("stats.lead")}</p>
            </div>
            <dl className="mt-14 grid border-t border-white/12 sm:grid-cols-2 lg:grid-cols-3">
              {stats.map((s, i) => (
                <div key={s.v} className={`border-b border-white/12 py-8 sm:pr-8 ${i % 3 !== 0 ? "lg:border-l lg:pl-8" : ""} ${i % 2 === 1 ? "sm:max-lg:border-l sm:max-lg:pl-8" : ""}`}>
                  <dt className="font-serif text-[52px] leading-none text-carta md:text-[64px]">{s.v}</dt>
                  <dd className="mt-4 max-w-xs text-[14.5px] leading-relaxed text-carta/60">{s.l}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 font-mono text-[11px] text-carta/40">{t("stats.source")}</p>
          </div>
        </section>

        {/* ── I · ПРИНЦИП ──────────────────────────────────── */}
        <section id="principle" className="border-t border-hair bg-vellum">
          <div className="mx-auto max-w-[1320px] px-4 py-20 md:px-8 md:py-28">
            <SectionHead eyebrow={t("why.eyebrow")} title={t("why.title")} lead={t("why.lead")} />
            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {why.map((k) => {
                const ours = k === "ours";
                const points = t.raw(`why.${k}.points`) as string[];
                return (
                  <article
                    key={k}
                    className={`flex flex-col rounded-[var(--radius-card)] p-7 ${ours ? "bg-ink text-carta" : "bg-carta ring-1 ring-hair"}`}
                  >
                    <h3 className={`font-serif text-[26px] leading-tight ${ours ? "text-carta" : ""}`}>{t(`why.${k}.name`)}</h3>
                    <ul className="mt-6 flex-1 space-y-3.5">
                      {points.map((p) => (
                        <li key={p} className={`border-t pt-3.5 text-[14.5px] leading-snug ${ours ? "border-white/15 text-carta/80" : "border-hair text-ink-2"}`}>
                          {p}
                        </li>
                      ))}
                    </ul>
                    <p className={`mt-7 font-serif text-[19px] italic ${ours ? "text-gold" : "text-ink-3"}`}>{t(`why.${k}.verdict`)}</p>
                  </article>
                );
              })}
            </div>
            <p className="mt-6 font-mono text-[11px] text-ink-3">{t("why.source")}</p>
          </div>
        </section>

        {/* ── II · АРХИТЕКТУРА ─────────────────────────────── */}
        <section id="architecture" className="mx-auto grid max-w-[1320px] gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHead eyebrow={t("tiers.eyebrow")} title={t("tiers.title")} lead={t("tiers.lead")} />
            <Art
              src="/art/good-government.jpg"
              alt="Lorenzetti, Allegory of Good Government"
              caption={t("tiers.caption")}
              className="mt-10 hidden aspect-[16/9] lg:block"
              position="70% 30%"
            />
          </div>
          <TiersDiagram />
        </section>

        {/* ── Технологический контур: собственная IT-разработка под адвокатской тайной ── */}
        <section className="mx-auto max-w-[1320px] px-4 pb-20 md:px-8 md:pb-28">
          <div className="relative overflow-hidden rounded-[var(--radius-card)] bg-ink p-7 text-carta md:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="label-caps flex items-center gap-2 text-gold"><Fingerprint size={14} /> {t("tiers.it.eyebrow")}</p>
                <h3 className="mt-4 font-serif text-[32px] leading-[1.08] md:text-[44px]">{t("tiers.it.title")}</h3>
                <p className="mt-5 text-[15.5px] leading-relaxed text-carta/65">{t("tiers.it.lead")}</p>
                <Link href="/ledger" className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-gold">
                  {t("tiers.it.link")} <ArrowUpRight size={16} />
                </Link>
              </div>
              <dl className="grid border-t border-white/12 sm:grid-cols-2">
                {itItems.map((it, i) => (
                  <div key={it.t} className={`border-b border-white/12 py-6 ${i % 2 === 1 ? "sm:border-l sm:pl-7" : "sm:pr-7"}`}>
                    <dt className={`flex items-baseline gap-3 font-serif text-[22px] leading-tight ${i === 3 ? "text-[#e9b9c0]" : ""}`}>
                      <span className="font-mono text-[11px] text-gold">0{i + 1}</span>
                      {it.t}
                    </dt>
                    <dd className="mt-2.5 text-[13.5px] leading-relaxed text-carta/60">{it.d}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* ── III · ПРАКТИКА ───────────────────────────────── */}
        <section id="practice" className="bg-ink text-carta">
          <div className="mx-auto max-w-[1320px] px-4 py-20 md:px-8 md:py-28">
            <SectionHead eyebrow={t("practice.eyebrow")} title={t("practice.title")} lead={t("practice.lead")} light />
            <ol className="mt-14 grid border-t border-white/12 md:grid-cols-2">
              {practice.map((p, i) => (
                <li key={p.t} className={`group flex gap-6 border-b border-white/12 py-7 md:pr-10 ${i % 2 === 1 ? "md:border-l md:pl-10" : ""}`}>
                  <span className="w-10 shrink-0 font-serif text-[22px] italic text-gold">{ROMAN[i]}</span>
                  <div>
                    <h3 className="font-serif text-[25px] leading-tight">{p.t}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-carta/60">{p.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── V · ЮРИСДИКЦИИ ───────────────────────────────── */}
        <section id="jurisdictions" className="border-t border-hair bg-vellum">
          <div className="mx-auto max-w-[1320px] px-4 py-20 md:px-8 md:py-28">
            <div className="grid items-end gap-10 lg:grid-cols-[1fr_0.9fr]">
              <SectionHead eyebrow={t("juris.eyebrow")} title={t("juris.title")} lead={t("juris.lead")} />
              <Art src="/art/venice.jpg" alt="Canaletto" caption={t("juris.caption")} className="aspect-[2/1]" />
            </div>
            <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] bg-hair ring-1 ring-hair sm:grid-cols-2 lg:grid-cols-3">
              {juris.map((j) => (
                <article key={j.code} className="flex flex-col bg-carta p-7">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[12px] tracking-widest text-ink-3">{j.code}</span>
                    <span className={`h-2 w-2 rounded-full ${j.code === "RU" || j.code === "HU" ? "bg-madder" : "bg-lapis/50"}`} />
                  </div>
                  <h3 className="mt-3 font-serif text-[28px]">{j.name}</h3>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-2">{j.regime}</p>
                  <div className="mt-6 border-t border-hair pt-4">
                    <p className="text-[26px] font-semibold tracking-tight text-lapis tabular-nums">{j.figure}</p>
                    <p className="text-[12.5px] text-ink-3">{j.figureLabel}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── VI · ГИГИЕНА ТАЙНЫ ───────────────────────────── */}
        <section className="mx-auto grid max-w-[1320px] gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-2 lg:gap-20">
          <Art
            src="/art/ambassadors.jpg"
            alt="Holbein, The Ambassadors"
            caption={t("privilege.caption")}
            className="aspect-square"
          />
          <div className="flex flex-col justify-center">
            <SectionHead eyebrow={t("privilege.eyebrow")} title={t("privilege.title")} lead={t("privilege.lead")} />
            <dl className="mt-10 grid gap-x-8 sm:grid-cols-2">
              {rules.map((r, i) => (
                <div key={r.t} className="border-t border-hair py-5">
                  <dt className="flex items-baseline gap-3 font-serif text-[21px]">
                    <span className="font-mono text-[11px] text-madder">0{i + 1}</span>
                    {r.t}
                  </dt>
                  <dd className="mt-2 text-[14px] leading-relaxed text-ink-2">{r.d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── VII · ПЛАТФОРМА ──────────────────────────────── */}
        <section id="platform" className="border-t border-hair bg-carta-2/60">
          <div className="mx-auto max-w-[1320px] px-4 py-20 md:px-8 md:py-28">
            <SectionHead eyebrow={t("platform.eyebrow")} title={t("platform.title")} />
            <div className="mt-12 grid gap-4 lg:grid-cols-2">
              <Link href="/family" className="group flex flex-col justify-between rounded-[var(--radius-card)] bg-vellum p-8 ring-1 ring-hair transition-shadow hover:shadow-[0_20px_60px_-30px_rgba(35,57,107,.45)] md:p-10">
                <div>
                  <p className="label-caps text-lapis">I</p>
                  <h3 className="mt-4 font-serif text-[40px] leading-none">{t("platform.family.t")}</h3>
                  <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-2">{t("platform.family.d")}</p>
                </div>
                <FamilyPreview />
                <span className="mt-8 inline-flex items-center gap-2 text-[14px] font-medium text-lapis">
                  {t("platform.family.cta")} <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
              <Link href="/studiolo" className="group relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-card)] bg-noct p-8 text-carta md:p-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/art/studiolo.jpg`} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25 art-engraving" />
                <div className="absolute inset-0 bg-gradient-to-t from-noct via-noct/85 to-noct/40" />
                <div className="relative">
                  <p className="label-caps text-gold">II</p>
                  <h3 className="mt-4 font-serif text-[40px] leading-none">{t("platform.studiolo.t")}</h3>
                  <p className="mt-5 max-w-md text-[15px] leading-relaxed text-carta/70">{t("platform.studiolo.d")}</p>
                  <p className="mt-6 max-w-sm border-l border-gold/50 pl-4 font-serif text-[16px] italic text-carta/60">{t("platform.studioloNote")}</p>
                </div>
                <span className="relative mt-10 inline-flex items-center gap-2 text-[14px] font-medium text-gold">
                  <Lock size={15} /> {t("platform.studiolo.cta")}
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ── АНАЛИТИКА ────────────────────────────────────── */}
        <section id="journal" className="border-t border-hair">
          <div className="mx-auto max-w-[1320px] px-4 py-20 md:px-8 md:py-28">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHead eyebrow={`VII · ${t("journal.eyebrow")}`} title={t("journal.homeTitle")} />
              <Link href="/journal" className="inline-flex items-center gap-2 text-[14px] font-medium text-lapis">
                {t("journal.homeCta")} <ArrowUpRight size={16} />
              </Link>
            </div>
            <ol className="mt-12 grid border-t border-hair md:grid-cols-2">
              {articles.map((a, i) => (
                <li key={a.slug} className={`border-b border-hair ${i % 2 === 1 ? "md:border-l md:pl-10" : "md:pr-10"}`}>
                  <Link href={`/journal/${a.slug}`} className="group flex gap-6 py-6">
                    <span className="w-10 shrink-0 font-mono text-[12px] text-ink-3">{a.section}</span>
                    <span>
                      <span className="block font-serif text-[23px] leading-tight transition-colors group-hover:text-lapis">{a.title}</span>
                      <span className="mt-1.5 block text-[12.5px] text-ink-3">{a.minutes} {t("journal.min")}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── КОНТАКТ ──────────────────────────────────────── */}
        <section id="contact" className="mx-auto grid max-w-[1320px] gap-12 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="font-serif text-[40px] leading-[1.05] md:text-[60px]">{t("contact.title")}</h2>
            <p className="mt-6 max-w-lg text-[16px] leading-relaxed text-ink-2">{t("contact.lead")}</p>
          </div>
          <div className="rounded-[var(--radius-card)] bg-vellum p-7 ring-1 ring-hair md:p-9">
            <ul className="space-y-5 text-[15px]">
              <li className="flex items-center gap-4"><Phone size={17} className="text-lapis" /><a href="tel:+79257722582" className="hover:text-lapis">{t("contact.phone")}</a></li>
              <li className="flex items-center gap-4"><Mail size={17} className="text-lapis" /><a href={`mailto:${t("contact.email")}`} className="hover:text-lapis">{t("contact.email")}</a></li>
              <li className="flex items-start gap-4"><MapPin size={17} className="mt-0.5 shrink-0 text-lapis" /><span className="text-ink-2">{t("contact.address")}</span></li>
            </ul>
            <a href={`mailto:${t("contact.email")}`} className="mt-8 flex items-center justify-center gap-2 rounded-full bg-ink py-4 text-[14px] font-medium text-carta transition-colors hover:bg-lapis">
              {t("contact.cta")} <ArrowRight size={16} />
            </a>
          </div>
        </section>
    </PageShell>
  );
}

// Миниатюра кабинета семьи прямо в карточке витрины.
function FamilyPreview() {
  const bars = [
    { w: "38%", c: "bg-lapis" },
    { w: "24%", c: "bg-tyrian" },
    { w: "18%", c: "bg-gold" },
    { w: "12%", c: "bg-smalt" },
    { w: "8%", c: "bg-umber" },
  ];
  return (
    <div className="mt-8 grid grid-cols-3 gap-2" aria-hidden>
      <div className="col-span-2 rounded-2xl bg-carta p-4">
        <div className="h-2 w-16 rounded bg-ink-3/30" />
        <div className="mt-3 font-serif text-[30px] leading-none">€186,4</div>
        <div className="mt-4 flex h-2 overflow-hidden rounded-full">
          {bars.map((b, i) => <div key={i} className={b.c} style={{ width: b.w }} />)}
        </div>
      </div>
      <div className="rounded-2xl bg-madder-soft p-4">
        <Lock size={15} className="text-madder" />
        <div className="mt-3 text-[22px] font-semibold text-madder">128</div>
      </div>
      <div className="rounded-2xl bg-lapis-soft p-4"><div className="text-[22px] font-semibold text-lapis">14</div></div>
      <div className="col-span-2 rounded-2xl bg-gold-soft p-4"><div className="h-2 w-24 rounded bg-gold/50" /><div className="mt-2 h-2 w-36 rounded bg-gold/30" /></div>
    </div>
  );
}
