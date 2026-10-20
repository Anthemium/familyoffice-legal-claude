import { use } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Seal } from "@/components/Seal";
import { LangSwitch } from "@/components/LangSwitch";
import { LedgerView } from "@/components/ledger/LedgerView";

export default function LedgerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("ledger");
  const nav = useTranslations("nav");
  const how = t.raw("how.items") as string[];

  return (
    <div className="min-h-screen bg-carta-2">
      <header className="sticky top-0 z-30 border-b border-hair/70 bg-carta-2/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 px-4 md:px-8">
          <div className="flex items-center gap-3">
            <Link href="/family" aria-label={nav("family")} className="rounded-full p-2 text-ink-2 hover:bg-vellum"><ArrowLeft size={18} /></Link>
            <Seal size={30} className="text-lapis" />
            <span className="font-serif text-[19px]">{t("title")}</span>
          </div>
          <LangSwitch />
        </div>
      </header>
      <main className="mx-auto max-w-[1320px] px-4 py-8 md:px-8 md:py-10">
        <h1 className="font-serif text-[40px] leading-none md:text-[56px]">{t("title")}</h1>
        <p className="mt-4 max-w-3xl text-[15.5px] leading-relaxed text-ink-2">{t("lead")}</p>
        <div className="mt-8">
          <LedgerView />
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <section className="rounded-[var(--radius-card)] bg-vellum p-6 ring-1 ring-hair md:p-8">
            <h2 className="font-serif text-[28px]">{t("how.title")}</h2>
            <ol className="mt-4 space-y-3">
              {how.map((h, i) => (
                <li key={h} className="flex gap-4 border-t border-hair pt-3 text-[14px] leading-relaxed text-ink-2">
                  <span className="font-serif italic text-gold">{["I", "II", "III", "IV"][i]}</span>
                  {h}
                </li>
              ))}
            </ol>
          </section>
          <section className="rounded-[var(--radius-card)] bg-ink p-6 text-carta md:p-8">
            <h2 className="font-serif text-[28px]">{t("legal.title")}</h2>
            <p className="mt-4 text-[14px] leading-relaxed text-carta/75">{t("legal.text")}</p>
          </section>
        </div>
      </main>
    </div>
  );
}
