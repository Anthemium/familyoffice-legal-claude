import { useTranslations } from "next-intl";
import { ArrowDown, ArrowUp } from "lucide-react";

// Трёхуровневая схема из исследования: семья → адвокатское ядро → активы,
// ядро окружено контуром адвокатской тайны (пунктир краплаком).
export function TiersDiagram() {
  const t = useTranslations("tiers");
  const upper = t.raw("upperItems") as string[];
  const core = t.raw("coreItems") as string[];
  const lower = t.raw("lowerItems") as string[];

  const flow = (
    <div className="flex justify-center gap-10 py-3 text-[11px] text-ink-3">
      <span className="flex items-center gap-1.5"><ArrowDown size={13} className="text-lapis" />{t("control")}</span>
      <span className="flex items-center gap-1.5"><ArrowUp size={13} className="text-gold" />{t("report")}</span>
    </div>
  );

  return (
    <div>
      <div className="rounded-[var(--radius-card)] border border-hair bg-vellum p-5 md:p-6">
        <p className="label-caps text-tyrian">{t("upper")}</p>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {upper.map((x) => (
            <div key={x} className="rounded-xl bg-tyrian-soft px-4 py-3 text-[14px] text-ink">{x}</div>
          ))}
        </div>
      </div>
      {flow}
      <div className="relative rounded-[28px] border border-dashed border-madder/60 p-2.5">
        <span className="absolute -top-2.5 left-6 bg-carta px-2 font-mono text-[10px] uppercase tracking-wider text-madder">
          {t("ring")}
        </span>
        <div className="rounded-[var(--radius-card)] bg-lapis p-5 text-carta md:p-6">
          <p className="label-caps text-gold">{t("core")}</p>
          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
            {core.map((x) => (
              <div key={x} className="rounded-xl bg-white/[0.07] px-4 py-3 text-[14px] ring-1 ring-white/10">{x}</div>
            ))}
          </div>
        </div>
      </div>
      {flow}
      <div className="rounded-[var(--radius-card)] border border-hair bg-vellum p-5 md:p-6">
        <p className="label-caps text-umber">{t("lower")}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
          {lower.map((x) => (
            <div key={x} className="rounded-xl bg-umber-soft px-4 py-3 text-[14px] text-ink">{x}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
