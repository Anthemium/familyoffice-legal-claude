"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Lock, Send, Split, AlertTriangle, ShieldCheck, Briefcase } from "lucide-react";

// Маркеры коммерческого/инвестиционного вопроса на трёх языках.
// В рабочей версии — классификатор на сервере коллегии; здесь — словарная эвристика для демо.
const BUSINESS = /(доходн|купит|покупк|продат|продаж|портфел|инвест|ставк|дивиденд|return|yield|\bbuy|\bsell|portfolio|invest|\brate\b|hozam|vásárol|elad|portfóli|befektet|kamat)/i;

const sentences = (s: string) => s.split(/(?<=[.!?…])\s+/).map((x) => x.trim()).filter(Boolean);

export function Composer() {
  const t = useTranslations("family.compose");
  const [contour, setContour] = useState<"A" | "B">("A");
  const [text, setText] = useState("");
  const [split, setSplit] = useState(false);
  const [sent, setSent] = useState(false);

  const mixed = contour === "A" && BUSINESS.test(text);
  const parts = useMemo(() => {
    const all = sentences(text);
    return { legal: all.filter((s) => !BUSINESS.test(s)), business: all.filter((s) => BUSINESS.test(s)) };
  }, [text]);

  const reset = () => { setText(""); setSplit(false); setSent(true); setTimeout(() => setSent(false), 3500); };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[17px] font-semibold">{t("title")}</h3>
        <div className="flex rounded-full bg-carta-2 p-1 text-[12px]">
          {(["A", "B"] as const).map((c) => (
            <button
              key={c}
              onClick={() => { setContour(c); setSplit(false); }}
              aria-pressed={contour === c}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${contour === c ? (c === "A" ? "bg-madder text-carta" : "bg-lapis text-carta") : "text-ink-2"}`}
            >
              {c === "A" ? <Lock size={12} /> : <Briefcase size={12} />}
              {c}
            </button>
          ))}
        </div>
      </div>
      <p className={`mt-1 text-[12px] ${contour === "A" ? "text-madder" : "text-lapis"}`}>{contour === "A" ? t("contourA") : t("contourB")}</p>

      <textarea
        value={text}
        onChange={(e) => { setText(e.target.value); setSplit(false); }}
        placeholder={t("placeholder")}
        rows={4}
        className={`mt-3 w-full flex-1 resize-none rounded-2xl bg-carta p-4 text-[14px] leading-relaxed outline-none ring-1 transition-shadow placeholder:text-ink-3 focus:ring-2 ${mixed ? "ring-gold" : contour === "A" ? "ring-hair focus:ring-madder/40" : "ring-hair focus:ring-lapis/40"}`}
      />

      {contour === "A" && text.length > 12 && !split && (
        mixed ? (
          <div className="mt-3 rounded-2xl bg-gold-soft p-3.5 text-[12.5px] leading-relaxed text-ink">
            <p className="flex gap-2"><AlertTriangle size={15} className="mt-0.5 shrink-0 text-gold" />{t("warn")}</p>
            <button onClick={() => setSplit(true)} className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-[12px] text-carta">
              <Split size={13} /> {t("split")}
            </button>
          </div>
        ) : (
          <p className="mt-3 flex gap-2 text-[12.5px] text-lapis"><ShieldCheck size={15} className="shrink-0" />{t("ok")}</p>
        )
      )}

      {split && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-2xl bg-madder-soft p-3.5">
            <p className="label-caps !text-[9.5px] text-madder">A · {t("contourA").split("·")[1]}</p>
            <p className="mt-1.5 text-[12.5px] leading-snug">{parts.legal.join(" ") || "—"}</p>
          </div>
          <div className="rounded-2xl bg-lapis-soft p-3.5">
            <p className="label-caps !text-[9.5px] text-lapis">B · {t("contourB").split("·")[1]}</p>
            <p className="mt-1.5 text-[12.5px] leading-snug">{parts.business.join(" ")}</p>
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="hidden text-[11px] text-ink-3 sm:block">{t("hint")}</p>
        <button
          disabled={!text.trim() || (mixed && !split)}
          onClick={reset}
          className={`ml-auto inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium text-carta transition-opacity disabled:opacity-35 ${contour === "A" ? "bg-madder" : "bg-lapis"}`}
        >
          <Send size={14} /> {contour === "A" ? t("send") : t("sendB")}
        </button>
      </div>
      {sent && <p className="mt-2 text-[12px] text-lapis" role="status">{t("sent")}</p>}
    </div>
  );
}
