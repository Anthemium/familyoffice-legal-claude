"use client";

import { useLocale } from "next-intl";
import { usePathname, Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LangSwitch({ tone = "ink" }: { tone?: "ink" | "light" }) {
  const locale = useLocale();
  const pathname = usePathname();
  const idle = tone === "ink" ? "text-ink-3 hover:text-ink" : "text-ink-3 hover:text-carta";
  const active = tone === "ink" ? "text-ink" : "text-carta";
  return (
    <nav aria-label="Language" className="flex items-center gap-1 font-mono text-[12px]">
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-ink-3/50">·</span>}
          <Link
            href={pathname}
            locale={l}
            aria-current={l === locale ? "true" : undefined}
            className={`uppercase px-1 py-1 transition-colors ${l === locale ? active + " underline underline-offset-4 decoration-gold" : idle}`}
          >
            {l}
          </Link>
        </span>
      ))}
    </nav>
  );
}
