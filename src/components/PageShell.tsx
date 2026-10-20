import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "./SiteHeader";
import { Wordmark } from "./Seal";

const LEGAL_LINKS = ["privacy", "terms", "consent"] as const;

// Шапка и подвал витрины — общие для главной, «Аналитики» и юридических страниц.
export function PageShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <footer className="border-t border-hair">
        <div className="mx-auto grid max-w-[1320px] gap-10 px-4 py-12 md:grid-cols-[1fr_auto] md:px-8">
          <div>
            <Wordmark sub={t("nav.by")} />
            <a
              href="https://markovgroup.legal"
              target="_blank"
              rel="noopener"
              className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] text-ink-2 underline decoration-hair underline-offset-4 hover:text-lapis"
            >
              {t("footer.markov")}: markovgroup.legal <ArrowUpRight size={14} />
            </a>
          </div>
          <nav aria-label={t("footer.legal")} className="flex flex-col gap-2.5 text-[13px] md:items-end">
            {LEGAL_LINKS.map((k) => (
              <Link key={k} href={`/legal/${k}`} className="text-ink-2 hover:text-lapis">{t(`footer.${k}`)}</Link>
            ))}
            <Link href="/canon" className="text-ink-3 hover:text-ink">{t("nav.canon")}</Link>
          </nav>
          <div className="text-[12px] leading-relaxed text-ink-3 md:col-span-2 md:flex md:justify-between md:gap-8 md:border-t md:border-hair md:pt-6">
            <p>© 2026 {t("footer.rights")}</p>
            <p>{t("footer.art")}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
