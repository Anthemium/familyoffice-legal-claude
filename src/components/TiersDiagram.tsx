import { useTranslations } from "next-intl";
import { Lock } from "lucide-react";

// Трёхуровневая схема в духе каталожной гравюры: тонкие линии, антиква, без цветных плашек.
// Ядро обведено двойной рамкой краплаком — контур адвокатской тайны, как оттиск печати.

function Storey({ numeral, label, items }: { numeral: string; label: string; items: string[] }) {
  return (
    <div className="rounded-[var(--radius-card)] bg-vellum px-6 py-6 ring-1 ring-hair md:px-8">
      <p className="flex items-baseline gap-3">
        <span className="font-serif text-[20px] italic text-gold">{numeral}</span>
        <span className="label-caps text-ink-3">{label}</span>
      </p>
      <ul className="mt-4 grid divide-y divide-hair border-t border-hair sm:grid-cols-2 sm:divide-y-0 lg:flex lg:divide-x">
        {items.map((x) => (
          <li key={x} className="py-3 font-serif text-[19px] font-medium leading-snug text-ink sm:py-4 lg:flex-1 lg:px-5 lg:first:pl-0 lg:last:pr-0">
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TiersDiagram() {
  const t = useTranslations("tiers");
  const upper = t.raw("upperItems") as string[];
  const core = t.raw("coreItems") as string[];
  const lower = t.raw("lowerItems") as string[];

  const flow = (
    <div className="flex items-center justify-center gap-4 py-2" aria-hidden>
      <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-3">↓ {t("control")}</span>
      <span className="h-9 w-px bg-ink-3/40" />
      <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-3">{t("report")} ↑</span>
    </div>
  );

  return (
    <div>
      <Storey numeral="I" label={t("upper")} items={upper} />
      {flow}
      <div className="relative rounded-[30px] border border-madder/45 p-[5px]">
        <span className="absolute -top-2.5 left-7 flex items-center gap-1.5 bg-carta px-2.5 font-mono text-[10px] uppercase tracking-wider text-madder">
          <Lock size={10} /> {t("ring")}
        </span>
        <div className="rounded-[24px] border border-madder/20 bg-vellum px-6 py-7 md:px-8">
          <p className="flex items-baseline gap-3">
            <span className="font-serif text-[20px] italic text-gold">II</span>
            <span className="label-caps text-ink-3">{t("core")}</span>
          </p>
          <ul className="mt-4 grid border-t border-hair sm:grid-cols-2">
            {core.map((x, i) => (
              <li
                key={x}
                className={`border-b border-hair py-4 font-serif text-[21px] font-medium leading-snug text-ink ${i % 2 === 1 ? "sm:border-l sm:pl-6" : "sm:pr-6"} ${i >= core.length - 2 ? "sm:border-b-0" : ""} ${i === core.length - 1 ? "border-b-0" : ""}`}
              >
                {x}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {flow}
      <Storey numeral="III" label={t("lower")} items={lower} />
    </div>
  );
}
