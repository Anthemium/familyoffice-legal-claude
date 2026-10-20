import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SiteHeader } from "./SiteHeader";
import { Wordmark } from "./Seal";

// Шапка и подвал витрины — общие для главной и раздела «Аналитика».
export function PageShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <footer className="border-t border-hair">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-8">
          <Wordmark sub={t("nav.by")} />
          <div className="text-[12px] leading-relaxed text-ink-3 md:text-right">
            <p>© 2026 {t("footer.rights")}</p>
            <p>
              {t("footer.art")} ·{" "}
              <Link href="/canon" className="underline decoration-hair underline-offset-4 hover:text-ink">{t("nav.canon")}</Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
