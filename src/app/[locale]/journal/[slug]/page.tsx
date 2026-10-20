import { use } from "react";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { PageShell } from "@/components/PageShell";
import { ArticleBody } from "@/components/ArticleBody";
import { ARTICLE_SLUGS, getArticle, getArticles, getSources } from "@/content/articles";
import { asset } from "@/lib/asset";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => ARTICLE_SLUGS.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const a = getArticle(locale, slug);
  const t = await getTranslations({ locale, namespace: "meta" });
  return a ? { title: `${a.title} · FAMILY OFFICE LEGAL`, description: a.lead } : { title: t("title") };
}

export default function ArticlePage({ params }: { params: Params }) {
  const { locale, slug } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("journal");
  const article = getArticle(locale, slug);
  if (!article) notFound();

  const all = getArticles(locale);
  const idx = all.findIndex((a) => a.slug === slug);
  const next = all[(idx + 1) % all.length];

  return (
    <PageShell>
      <article className="mx-auto max-w-[1320px] px-4 pb-24 pt-10 md:px-8 md:pt-14">
        <Link href="/journal" className="inline-flex items-center gap-2 text-[13px] text-ink-3 hover:text-ink">
          <ArrowLeft size={15} /> {t("all")}
        </Link>
        <header className="mx-auto mt-10 max-w-3xl text-center">
          <p className="font-mono text-[12px] text-ink-3">{article.section} · {article.minutes} {t("min")}</p>
          <h1 className="mt-4 font-serif text-[40px] leading-[1.05] md:text-[64px]">{article.title}</h1>
          <p className="mt-6 text-[18px] leading-relaxed text-ink-2">{article.lead}</p>
        </header>
        <div className="art-frame mx-auto mt-12 aspect-[21/9] max-w-5xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(article.art.src)} alt="" className="art-engraving h-full w-full object-cover" style={{ objectPosition: article.art.pos }} />
        </div>
        <div className="mx-auto mt-14 max-w-[680px]">
          <ArticleBody body={article.body} />
          {getSources(slug).length > 0 && (
            <section className="mt-14 border-t border-hair pt-6">
              <h2 className="label-caps text-ink-3">{t("sources")}</h2>
              <ol className="mt-4 space-y-2 text-[13px] leading-snug">
                {getSources(slug).map((s) => (
                  <li key={s.n} className="flex gap-3">
                    <span className="w-7 shrink-0 font-mono text-[11px] text-ink-3">[{s.n}]</span>
                    <a href={s.u} target="_blank" rel="noopener noreferrer" className="text-ink-2 underline decoration-hair underline-offset-4 hover:text-lapis">{s.t}</a>
                  </li>
                ))}
              </ol>
            </section>
          )}
          <p className="mt-10 text-[12.5px] leading-relaxed text-ink-3">{t("disclaimer")}</p>
        </div>
        <Link href={`/journal/${next.slug}`} className="group mx-auto mt-16 block max-w-[680px] rounded-[var(--radius-card)] bg-vellum p-8 ring-1 ring-hair">
          <p className="label-caps text-ink-3">{t("next")}</p>
          <p className="mt-3 flex items-start justify-between gap-6 font-serif text-[28px] leading-tight transition-colors group-hover:text-lapis">
            {next.title} <ArrowRight size={22} className="mt-1.5 shrink-0" />
          </p>
        </Link>
      </article>
    </PageShell>
  );
}
