import { use } from "react";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { PageShell } from "@/components/PageShell";
import { ArticleBody } from "@/components/ArticleBody";
import { LEGAL, LEGAL_NOTE, LEGAL_REVISION } from "@/content/legal";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => LEGAL.map((d) => ({ locale, slug: d.slug })));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const doc = LEGAL.find((d) => d.slug === slug);
  return { title: doc ? `${doc.title} · FAMILY OFFICE LEGAL` : "FAMILY OFFICE LEGAL", robots: { index: true } };
}

export default function LegalPage({ params }: { params: Params }) {
  const { locale, slug } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("footer");
  const doc = LEGAL.find((d) => d.slug === slug);
  if (!doc) notFound();

  return (
    <PageShell>
      <article className="mx-auto max-w-[1320px] px-4 pb-24 pt-12 md:px-8 md:pt-16">
        <div className="mx-auto max-w-[760px]">
          <p className="label-caps text-ink-3">{t("legal")}</p>
          <h1 lang="ru" className="mt-4 font-serif text-[38px] leading-[1.08] md:text-[52px]">{doc.title}</h1>
          <p className="mt-4 font-mono text-[12px] text-ink-3">Редакция от {LEGAL_REVISION}</p>

          {LEGAL_NOTE[locale] && (
            <p className="mt-8 rounded-[var(--radius-tile)] bg-vellum p-5 text-[14px] leading-relaxed text-ink-2 ring-1 ring-hair">{LEGAL_NOTE[locale]}</p>
          )}

          {/* Переключение между документами */}
          <nav className="mt-8 flex flex-wrap gap-2">
            {LEGAL.map((d) => (
              <Link
                key={d.slug}
                href={`/legal/${d.slug}`}
                className={`rounded-full px-4 py-2 text-[12.5px] ${d.slug === slug ? "bg-ink text-carta" : "bg-vellum text-ink-2 ring-1 ring-hair hover:ring-ink/40"}`}
              >
                {t(d.slug)}
              </Link>
            ))}
          </nav>

          <div lang="ru" className="mt-12">
            <ArticleBody body={doc.body} />
          </div>
        </div>
      </article>
    </PageShell>
  );
}
