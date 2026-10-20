import { use } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PageShell } from "@/components/PageShell";
import { getArticles } from "@/content/articles";
import { asset } from "@/lib/asset";

export default function JournalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("journal");
  const articles = getArticles(locale);
  const [first, ...rest] = articles;

  return (
    <PageShell>
      <section className="mx-auto max-w-[1320px] px-4 pb-24 pt-14 md:px-8 md:pt-20">
        <p className="label-caps text-gold">{t("eyebrow")}</p>
        <h1 className="mt-4 font-serif text-[48px] leading-none md:text-[80px]">{t("title")}</h1>
        <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-2">{t("lead")}</p>

        <Link href={`/journal/${first.slug}`} className="group mt-14 grid gap-8 border-t border-hair pt-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="art-frame aspect-[16/10]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(first.art.src)} alt="" className="art-engraving h-full w-full object-cover" style={{ objectPosition: first.art.pos }} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-mono text-[12px] text-ink-3">{first.section} · {first.minutes} {t("min")}</p>
            <h2 className="mt-3 font-serif text-[36px] leading-[1.08] transition-colors group-hover:text-lapis md:text-[46px]">{first.title}</h2>
            <p className="mt-5 text-[16px] leading-relaxed text-ink-2">{first.lead}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-lapis">{t("read")} <ArrowUpRight size={16} /></span>
          </div>
        </Link>

        <div className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((a) => (
            <Link key={a.slug} href={`/journal/${a.slug}`} className="group flex flex-col border-t border-hair pt-6">
              <div className="art-frame aspect-[3/2]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(a.art.src)} alt="" loading="lazy" className="art-engraving h-full w-full object-cover" style={{ objectPosition: a.art.pos }} />
              </div>
              <p className="mt-5 font-mono text-[12px] text-ink-3">{a.section} · {a.minutes} {t("min")}</p>
              <h3 className="mt-2 font-serif text-[26px] leading-tight transition-colors group-hover:text-lapis">{a.title}</h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">{a.lead}</p>
            </Link>
          ))}
        </div>
        <p className="mt-16 max-w-3xl border-t border-hair pt-6 text-[12.5px] leading-relaxed text-ink-3">{t("disclaimer")}</p>
      </section>
    </PageShell>
  );
}
