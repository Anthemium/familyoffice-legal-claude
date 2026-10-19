"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ShieldAlert, PhoneCall, Check } from "lucide-react";

// «Щит семьи»: экстренный вызов дежурного адвоката + памятка, открывается сразу.
export function Shield() {
  const t = useTranslations("family");
  const [sent, setSent] = useState(false);
  const steps = t.raw("shieldSteps") as string[];
  return (
    <div className="flex h-full flex-col rounded-[var(--radius-card)] bg-madder p-6 text-carta">
      <div className="flex items-center gap-2.5">
        <ShieldAlert size={20} className="text-gold" />
        <h3 className="text-[17px] font-semibold">{t("shieldTitle")}</h3>
      </div>
      {!sent ? (
        <>
          <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-carta/80">{t("shieldText")}</p>
          <button
            onClick={() => setSent(true)}
            className="mt-5 flex items-center justify-center gap-2 rounded-full bg-carta py-3.5 text-[14px] font-semibold text-madder transition-transform active:scale-[0.98]"
          >
            <PhoneCall size={16} /> {t("shieldCta")}
          </button>
        </>
      ) : (
        <div className="mt-3 flex-1" role="status">
          <p className="flex gap-2 rounded-2xl bg-white/10 p-3 text-[12.5px] leading-snug"><Check size={15} className="mt-0.5 shrink-0 text-gold" />{t("shieldSent")}</p>
          <ol className="mt-3 space-y-2">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-3 text-[13px] leading-snug">
                <span className="font-mono text-[11px] text-gold">0{i + 1}</span>{s}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
