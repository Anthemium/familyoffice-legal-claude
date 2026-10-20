"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Wordmark } from "./Seal";
import { LangSwitch } from "./LangSwitch";

// Якоря главной; «Аналитика» — отдельный раздел. Ссылки через Link, чтобы работали и со страниц статей.
const items = [
  { key: "principle", href: "/#principle" },
  { key: "architecture", href: "/#architecture" },
  { key: "practice", href: "/#practice" },
  { key: "jurisdictions", href: "/#jurisdictions" },
  { key: "platform", href: "/#platform" },
  { key: "journal", href: "/journal" },
] as const;

export function SiteHeader() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 border-b border-hair bg-carta/90 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between gap-6 px-4 md:px-8">
        <Link href="/" aria-label="Family Office Legal">
          <Wordmark sub={t("by")} />
        </Link>
        <nav className="hidden items-center gap-7 xl:flex">
          {items.map((a) => (
            <Link key={a.key} href={a.href} className="text-[13.5px] text-ink-2 transition-colors hover:text-lapis">
              {t(a.key)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <LangSwitch />
          <Link
            href="/family"
            className="hidden rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-carta transition-colors hover:bg-lapis sm:inline-block"
          >
            {t("login")}
          </Link>
          <button className="xl:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-hair bg-carta px-4 pb-6 pt-2 xl:hidden">
          {items.map((a) => (
            <Link key={a.key} href={a.href} onClick={() => setOpen(false)} className="block border-b border-hair py-3.5 font-serif text-[22px]">
              {t(a.key)}
            </Link>
          ))}
          <div className="mt-5 flex gap-3">
            <Link href="/family" className="flex-1 rounded-full bg-ink py-3 text-center text-[14px] text-carta">{t("family")}</Link>
            <Link href="/studiolo" className="flex-1 rounded-full border border-ink py-3 text-center text-[14px]">{t("studiolo")}</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
