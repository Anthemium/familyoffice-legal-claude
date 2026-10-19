import { use } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Wordmark } from "@/components/Seal";
import { LangSwitch } from "@/components/LangSwitch";
import { Art } from "@/components/Art";

// Палитра «Пигмента»: название пигмента, роль в интерфейсе, токен.
const PIGMENTS = [
  { name: "Lapis · Ultramarine", role: "primary / позитивный статус", token: "lapis", hex: "#23396B" },
  { name: "Madder lake", role: "гриф тайны / критичное", token: "madder", hex: "#7A2433" },
  { name: "Gold leaf", role: "тонкий акцент / внимание", token: "gold", hex: "#A88449" },
  { name: "Tyrian purple", role: "семья / governance", token: "tyrian", hex: "#5C3B61" },
  { name: "Smalt", role: "вторичные данные", token: "smalt", hex: "#6E7C9B" },
  { name: "Raw umber", role: "нейтральные статусы", token: "umber", hex: "#6B5644" },
  { name: "Lamp black", role: "текст", token: "ink", hex: "#1D1B20" },
  { name: "Carta · Lead white", role: "фон", token: "carta", hex: "#F5F0E7" },
  { name: "Notte", role: "Студиоло (тёмная тема)", token: "noct", hex: "#121117" },
];

export default function CanonPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("canon");
  const nav = useTranslations("nav");
  const rules = t.raw("artRules") as string[];

  return (
    <div className="min-h-screen">
      <header className="border-b border-hair">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-3"><ArrowLeft size={16} className="text-ink-3" /><Wordmark sub={nav("by")} /></Link>
          <LangSwitch />
        </div>
      </header>
      <main className="mx-auto max-w-[1200px] px-4 py-16 md:px-8">
        <h1 className="font-serif text-[52px] leading-none md:text-[80px]">{t("title")}</h1>
        <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-2">{t("lead")}</p>

        <section className="mt-20">
          <h2 className="font-serif text-[34px]">{t("pigments")}</h2>
          <p className="mt-3 max-w-2xl text-[14.5px] text-ink-2">{t("pigmentsNote")}</p>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {PIGMENTS.map((p) => (
              <div key={p.token} className="overflow-hidden rounded-[var(--radius-tile)] bg-vellum ring-1 ring-hair">
                <div className="h-24" style={{ background: p.hex }} />
                <div className="p-4">
                  <p className="text-[13.5px] font-semibold">{p.name}</p>
                  <p className="mt-1 text-[12px] text-ink-3">{p.role}</p>
                  <p className="mt-2 font-mono text-[11px] text-ink-2">--color-{p.token} · {p.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-[34px]">{t("type")}</h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">{t("typeNote")}</p>
          </div>
          <div className="space-y-6 rounded-[var(--radius-card)] bg-vellum p-8 ring-1 ring-hair">
            <p className="font-serif text-[44px] leading-none">Ügyvédi titoktartás</p>
            <p className="font-serif text-[30px] italic leading-tight text-lapis">Адвокатская тайна — норма закона</p>
            <p className="text-[15px] leading-relaxed">Manrope · Семейный баланс €186,4 млн · Családi mérleg · 14 entities</p>
            <p className="font-mono text-[13px] text-madder">ФЗ-63 ст. 8 · Ptk. 6:310. § · sha256 9f2c…a71e</p>
          </div>
        </section>

        <section className="mt-20 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Art src="/art/geographer.jpg" alt="Vermeer, The Geographer" caption={t("artCaption")} className="aspect-[4/5]" position="50% 35%" />
          <div className="flex flex-col justify-center">
            <h2 className="font-serif text-[34px]">{t("art")}</h2>
            <ol className="mt-6 space-y-4">
              {rules.map((r, i) => (
                <li key={r} className="flex gap-4 border-t border-hair pt-4 text-[15px]">
                  <span className="font-serif italic text-gold">{["I", "II", "III", "IV"][i]}</span>{r}
                </li>
              ))}
            </ol>
            <h2 className="mt-14 font-serif text-[34px]">{t("dash")}</h2>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-2">{t("dashNote")}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
