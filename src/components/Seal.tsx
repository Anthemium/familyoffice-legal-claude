// Монограмма-печать: двойное кольцо, как оттиск сургучной печати, без герольдики.
export function Seal({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="20" r="19" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="20" cy="20" r="15.5" fill="none" stroke="currentColor" strokeWidth="0.6" />
      <text x="20" y="25.5" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="15" fontStyle="italic" fill="currentColor">
        fl
      </text>
    </svg>
  );
}

export function Wordmark({ tone = "ink", sub }: { tone?: "ink" | "light"; sub: string }) {
  const color = tone === "ink" ? "text-ink" : "text-carta";
  return (
    <span className={`inline-flex items-center gap-3 ${color}`}>
      <Seal size={38} className={tone === "ink" ? "text-lapis" : "text-gold"} />
      <span className="flex flex-col leading-none">
        <span className="whitespace-nowrap font-serif text-[19px] tracking-[0.02em] sm:text-[21px]">
          Family Office <span className="italic">Legal</span>
        </span>
        <span className={`label-caps mt-1 !text-[9.5px] ${tone === "ink" ? "text-ink-3" : "text-ink-3"}`}>{sub}</span>
      </span>
    </span>
  );
}
