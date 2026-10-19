import { use } from "react";
import { useLocale, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Home, Network, FolderLock, Users, MoreHorizontal, Bell, ArrowLeft, Lock, CalendarDays, Landmark, Gauge, ScrollText } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Seal } from "@/components/Seal";
import { LangSwitch } from "@/components/LangSwitch";
import { Donut } from "@/components/family/Donut";
import { Composer } from "@/components/family/Composer";
import { StructureMap } from "@/components/family/StructureMap";
import { Shield } from "@/components/family/Shield";
import { asset } from "@/lib/asset";

// Доли семейного баланса (демо): € млн
const BALANCE = [
  { value: 71.2, color: "var(--color-lapis)" },
  { value: 44.6, color: "var(--color-tyrian)" },
  { value: 32.9, color: "var(--color-gold)" },
  { value: 24.1, color: "var(--color-smalt)" },
  { value: 13.6, color: "var(--color-umber)" },
];

const STORY_ART = [
  { src: "/art/geographer.jpg", pos: "45% 30%" },
  { src: "/art/good-government.jpg", pos: "62% 35%" },
  { src: "/art/ambassadors.jpg", pos: "22% 22%" },
  { src: "/art/studiolo.jpg", pos: "50% 40%" },
  { src: "/art/pantheon.jpg", pos: "50% 35%" },
];

const TAG_TONE: Record<string, string> = {
  EU: "bg-lapis-soft text-lapis",
  RU: "bg-madder-soft text-madder",
  HU: "bg-tyrian-soft text-tyrian",
};

const card = "rounded-[var(--radius-card)] bg-vellum p-6";

export default function FamilyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  return <FamilyDashboard />;
}

function FamilyDashboard() {
  const t = useTranslations("family");
  const nav = useTranslations("nav");
  const locale = useLocale();
  const stories = t.raw("stories") as string[];
  const tabs = t.raw("tabs") as string[];
  const classes = t.raw("classes") as string[];
  const calendar = t.raw("calendarItems") as { date: string; t: string; tag: string }[];
  const agenda = t.raw("councilAgenda") as string[];
  const matters = t.raw("mattersItems") as { t: string; who: string; p: number }[];
  const bottom = t.raw("nav") as string[];
  const total = BALANCE.reduce((s, x) => s + x.value, 0);
  const nf = (n: number) => new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(n);
  const mln = locale === "ru" ? "млн" : locale === "hu" ? "M" : "M";

  const kpis = [
    { icon: Landmark, v: "14", l: t("kpi.entities"), s: t("kpi.entitiesSub"), tone: "text-lapis bg-lapis-soft" },
    { icon: Lock, v: "128", l: t("kpi.vault"), s: t("kpi.vaultSub"), tone: "text-madder bg-madder-soft" },
    { icon: Gauge, v: "86", l: t("kpi.shield"), s: t("kpi.shieldSub"), tone: "text-gold bg-gold-soft" },
    { icon: ScrollText, v: "7", l: t("kpi.matters"), s: t("kpi.mattersSub"), tone: "text-tyrian bg-tyrian-soft" },
  ];

  return (
    <div className="min-h-screen bg-carta-2 pb-24 lg:pb-0">
      {/* Верхняя панель */}
      <header className="sticky top-0 z-30 border-b border-hair/70 bg-carta-2/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label={nav("back")} className="rounded-full p-2 text-ink-2 hover:bg-vellum"><ArrowLeft size={18} /></Link>
            <Seal size={30} className="text-lapis" />
            <span className="hidden font-serif text-[19px] sm:inline">{t("title")}</span>
            <span className="rounded-full bg-gold-soft px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-umber">{t("demo")}</span>
          </div>
          <div className="flex items-center gap-3">
            <LangSwitch />
            <button aria-label="Notifications" className="relative rounded-full bg-vellum p-2.5">
              <Bell size={17} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-madder" />
            </button>
            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-tyrian font-serif text-[16px] text-carta sm:flex">V</div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1320px] px-4 pt-6 md:px-8 md:pt-8">
        <h1 className="font-serif text-[34px] leading-tight md:text-[44px]">{t("greeting")}</h1>

        {/* Истории — как в банковских приложениях, но обложки — фрагменты живописи */}
        <div className="scroll-x -mx-4 mt-5 flex gap-4 px-4 pb-1">
          {stories.map((s, i) => (
            <button key={s} className="flex w-[84px] shrink-0 flex-col items-center gap-2 text-center">
              <span className={`rounded-full p-[3px] ${i < 2 ? "bg-gradient-to-br from-gold to-madder" : "bg-hair"}`}>
                <span className="block h-[70px] w-[70px] overflow-hidden rounded-full border-[3px] border-carta-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset(STORY_ART[i].src)} alt="" className="art-engraving h-full w-full object-cover" style={{ objectPosition: STORY_ART[i].pos }} />
                </span>
              </span>
              <span className="text-[11.5px] leading-tight text-ink-2">{s}</span>
            </button>
          ))}
        </div>

        {/* Вкладки-чипы */}
        <div className="scroll-x -mx-4 mt-6 flex gap-2 px-4">
          {tabs.map((tab, i) => (
            <span key={tab} className={`shrink-0 rounded-full px-4 py-2 text-[13px] ${i === 0 ? "bg-ink text-carta" : "bg-vellum text-ink-2"}`}>{tab}</span>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-12">
          {/* Баланс */}
          <section className={`${card} lg:col-span-7`}>
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="text-[17px] font-semibold">{t("balance")}</h2>
              <span className="text-[11.5px] text-ink-3">{t("balanceNote")}</span>
            </div>
            <div className="mt-6 flex flex-col items-center gap-8 sm:flex-row">
              <Donut slices={BALANCE} size={196}>
                <span className="font-serif text-[38px] leading-none">€{nf(total)}</span>
                <span className="mt-1 text-[12px] text-ink-3">{mln}</span>
              </Donut>
              <ul className="w-full flex-1 space-y-3">
                {BALANCE.map((b, i) => (
                  <li key={i} className="flex items-center gap-3 text-[13.5px]">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: b.color }} />
                    <span className="flex-1 text-ink-2">{classes[i]}</span>
                    <span className="font-semibold tabular-nums">€{nf(b.value)}</span>
                    <span className="w-10 text-right text-[12px] text-ink-3 tabular-nums">{Math.round((b.value / total) * 100)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* KPI */}
          <section className="grid grid-cols-2 gap-4 lg:col-span-5">
            {kpis.map(({ icon: Icon, v, l, s, tone }) => (
              <div key={l} className={`${card} flex flex-col justify-between !p-5`}>
                <span className={`flex h-9 w-9 items-center justify-center rounded-full ${tone}`}><Icon size={17} /></span>
                <div className="mt-5">
                  <p className="text-[32px] font-semibold leading-none tracking-tight tabular-nums">{v}</p>
                  <p className="mt-2 text-[13px] leading-tight">{l}</p>
                  <p className="mt-1 text-[11.5px] text-ink-3">{s}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Переписка с двумя контурами */}
          <section className={`${card} lg:col-span-7`}>
            <Composer />
          </section>

          {/* Щит */}
          <section className="lg:col-span-5">
            <Shield />
          </section>

          {/* Структура */}
          <section className={`${card} lg:col-span-7`}>
            <div className="flex items-center gap-2"><Network size={17} className="text-lapis" /><h2 className="text-[17px] font-semibold">{t("structure")}</h2></div>
            <div className="mt-5"><StructureMap note={t("structureNote")} /></div>
          </section>

          {/* Регуляторный календарь */}
          <section className={`${card} lg:col-span-5`}>
            <div className="flex items-center gap-2"><CalendarDays size={17} className="text-lapis" /><h2 className="text-[17px] font-semibold">{t("calendar")}</h2></div>
            <ul className="mt-4 divide-y divide-hair">
              {calendar.map((c) => (
                <li key={c.t} className="flex items-center gap-4 py-3.5">
                  <span className="w-12 font-mono text-[13px] text-ink-2">{c.date}</span>
                  <span className="flex-1 text-[13.5px] leading-snug">{c.t}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${TAG_TONE[c.tag] ?? "bg-gold-soft text-umber"}`}>{c.tag}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Совет семьи */}
          <section className="relative overflow-hidden rounded-[var(--radius-card)] bg-tyrian p-6 text-carta lg:col-span-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/art/good-government.jpg")} alt="" className="art-engraving absolute inset-0 h-full w-full object-cover opacity-15" style={{ objectPosition: "65% 30%" }} />
            <div className="relative">
              <div className="flex items-center gap-2"><Users size={17} className="text-gold" /><h2 className="text-[17px] font-semibold">{t("council")}</h2></div>
              <p className="mt-3 font-serif text-[24px] leading-tight">{t("councilNext")}</p>
              <ul className="mt-4 space-y-2">
                {agenda.map((a, i) => (
                  <li key={a} className="flex gap-3 text-[13.5px] text-carta/80"><span className="font-mono text-[11px] text-gold">{["I", "II", "III"][i]}</span>{a}</li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl bg-white/10 p-4">
                <div className="flex justify-between text-[12.5px]"><span>{t("charter")}</span><span className="text-carta/70">{t("charterProgress")}</span></div>
                <div className="mt-2.5 h-1.5 rounded-full bg-white/15"><div className="h-full w-[78%] rounded-full bg-gold" /></div>
              </div>
            </div>
          </section>

          {/* Поручения */}
          <section className={`${card} lg:col-span-7`}>
            <div className="flex items-center gap-2"><FolderLock size={17} className="text-madder" /><h2 className="text-[17px] font-semibold">{t("matters")}</h2></div>
            <ul className="mt-4 space-y-4">
              {matters.map((m) => (
                <li key={m.t}>
                  <div className="flex items-baseline justify-between gap-3 text-[13.5px]">
                    <span>{m.t}</span>
                    <span className="shrink-0 text-[12px] text-ink-3">{m.who}</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-carta-2"><div className="h-full rounded-full bg-lapis" style={{ width: `${m.p}%` }} /></div>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div className="h-10" />
      </main>

      {/* Нижняя навигация на телефоне */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-hair bg-vellum/95 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-5 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2">
          {[Home, Network, FolderLock, Users, MoreHorizontal].map((Icon, i) => (
            <span key={i} className={`flex flex-col items-center gap-1 py-1 text-[10.5px] ${i === 0 ? "text-lapis" : "text-ink-3"}`}>
              <Icon size={20} />
              {bottom[i]}
            </span>
          ))}
        </div>
      </nav>
    </div>
  );
}
