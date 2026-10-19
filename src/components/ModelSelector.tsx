"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

const CAPITAL_STEPS = [30, 50, 100, 150, 250, 400, 500, 750, 1000, 1500, 2500]; // $M

// Правило из §8 исследования: капитал и сложность структуры определяют модель.
function pickModel(capital: number, complexity: number): 1 | 2 | 3 | 4 {
  if (capital >= 1000) return 4;
  if (capital >= 250) return complexity >= 2 ? 3 : 2;
  if (capital >= 100 && complexity >= 2) return 2;
  return 1;
}

// Оценки годовой стоимости, $M: банк 0,8% от активов; штат SFO по бенчмаркам исследования;
// ретейнер — иллюстративная шкала по сложности.
function costs(capital: number, complexity: number) {
  const bank = capital * 0.008;
  const sfo = capital >= 1000 ? 6.6 : capital >= 500 ? 3.2 : 1.5 + capital * 0.002;
  const ours = [0.18, 0.32, 0.55][complexity] + capital * 0.0004;
  return { bank, sfo, ours };
}

const UNIT = { ru: [" млн", " млрд"], en: ["M", "B"], hu: [" M", " Mrd"] } as const;

export function ModelSelector() {
  const t = useTranslations("models");
  const locale = useLocale() as keyof typeof UNIT;
  const [ci, setCi] = useState(3);
  const [cx, setCx] = useState(1);
  const capital = CAPITAL_STEPS[ci];
  const model = pickModel(capital, cx);
  const c = costs(capital, cx);
  const levels = t.raw("complexityLevels") as string[];
  const max = Math.max(c.bank, c.sfo, c.ours);
  const fmt = (n: number, d: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: d }).format(n);
  const money = (m: number) => `$${fmt(m, m < 1 ? 2 : 1)}${UNIT[locale][0]}`;
  const capLabel = capital >= 1000 ? `$${fmt(capital / 1000, 1)}${UNIT[locale][1]}` : `$${capital}${UNIT[locale][0]}`;

  const bars = [
    { k: "bank", v: c.bank, color: "bg-smalt" },
    { k: "sfo", v: c.sfo, color: "bg-umber" },
    { k: "ours", v: c.ours, color: "bg-lapis" },
  ] as const;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.15fr]">
      <div className="rounded-[var(--radius-card)] bg-vellum p-6 ring-1 ring-hair md:p-8">
        <div className="flex items-baseline justify-between gap-4">
          <label htmlFor="cap" className="label-caps text-ink-3">{t("capital")}</label>
          <span className="font-serif text-[40px] leading-none text-ink tabular-nums">{capLabel}</span>
        </div>
        <input
          id="cap"
          type="range"
          min={0}
          max={CAPITAL_STEPS.length - 1}
          value={ci}
          onChange={(e) => setCi(+e.target.value)}
          className="mt-5 w-full accent-[var(--color-lapis)]"
        />
        <p className="label-caps mt-10 text-ink-3">{t("complexity")}</p>
        <div className="mt-4 grid gap-2">
          {levels.map((l, i) => (
            <button
              key={l}
              onClick={() => setCx(i)}
              aria-pressed={cx === i}
              className={`rounded-2xl px-4 py-3.5 text-left text-[14px] transition-all ${cx === i ? "bg-ink text-carta" : "bg-carta-2/70 text-ink-2 hover:bg-carta-2"}`}
            >
              <span className="mr-3 font-mono text-[11px] opacity-60">{["I", "II", "III"][i]}</span>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-[var(--radius-card)] bg-lapis p-6 text-carta md:p-8">
          <p className="label-caps text-gold">{t("recommended")} · {["I", "II", "III", "IV"][model - 1]}</p>
          <p className="mt-3 font-serif text-[34px] leading-[1.05] md:text-[40px]">{t(`m${model}.name`)}</p>
          <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-carta/75">{t(`m${model}.who`)}</p>
          <p className="mt-5 inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[12px] text-carta/90">{t(`m${model}.privilege`)}</p>
        </div>
        <div className="rounded-[var(--radius-card)] bg-vellum p-6 ring-1 ring-hair md:p-8">
          <p className="label-caps text-ink-3">{t("cost")}</p>
          <div className="mt-5 space-y-4">
            {bars.map((b) => (
              <div key={b.k}>
                <div className="flex justify-between gap-3 text-[13.5px]">
                  <span className={b.k === "ours" ? "font-semibold text-lapis" : "text-ink-2"}>{t(b.k)}</span>
                  <span className="whitespace-nowrap font-mono tabular-nums">
                    {money(b.v)} <span className="text-ink-3">{t("perYear")}</span>
                  </span>
                </div>
                <div className="mt-2 h-2.5 rounded-full bg-carta-2">
                  <div className={`h-full rounded-full ${b.color} transition-all duration-500`} style={{ width: `${Math.max(3, (b.v / max) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[11.5px] leading-relaxed text-ink-3">{t("note")}</p>
        </div>
      </div>
    </div>
  );
}
