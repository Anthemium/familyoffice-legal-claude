"use client";

import { useTranslations } from "next-intl";
import { shortId, type EventCheck, type LedgerEvent } from "@/lib/ledger/core";

const ROW = 52;
const LANE = 56;
const PAD = 30;
const HEAD = 44;

const LANE_COLORS = ["var(--color-tyrian)", "var(--color-lapis)", "var(--color-umber)", "var(--color-smalt)"];
const TYPE_COLORS: Record<string, string> = {
  message: "var(--color-madder)",
  document: "var(--color-lapis)",
  template: "var(--color-gold)",
  shield: "var(--color-madder)",
  session: "var(--color-ink-3)",
};
const typeColor = (type: string) => TYPE_COLORS[type.split(".")[0]] ?? "var(--color-smalt)";

// Граф: колонки — участники, строки — события по порядку цепочки.
// Тонкая линия — хэш-цепочка (prevHash), цветные дуги — причинные связи (parents),
// вертикальная полоса — сессия от входа до последнего действия.
export function LedgerGraph({
  events,
  checks,
  selected,
  onSelect,
}: {
  events: LedgerEvent[];
  checks: EventCheck[] | null;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const t = useTranslations("ledger");
  const lanes = [...new Map(events.map((e) => [e.actor.id, e.actor])).values()];
  const laneOf = new Map(lanes.map((a, i) => [a.id, i]));
  const width = PAD + lanes.length * LANE;
  const height = HEAD + events.length * ROW;
  const pos = new Map(events.map((e, i) => [e.id, { x: PAD + laneOf.get(e.actor.id)! * LANE, y: HEAD + i * ROW + ROW / 2 }]));
  const broken = (i: number) => checks && !(checks[i].hash && checks[i].link && checks[i].sig && checks[i].parents);

  const sessions = [...new Set(events.map((e) => e.session))].map((sid) => {
    const rows = events.filter((e) => e.session === sid);
    const a = pos.get(rows[0].id)!;
    const b = pos.get(rows[rows.length - 1].id)!;
    return { sid, x: a.x, y1: a.y, y2: b.y, lane: laneOf.get(rows[0].actor.id)! };
  });

  return (
    <div className="relative" style={{ minHeight: height }}>
      <svg width={width} height={height} className="absolute left-0 top-0" aria-hidden>
        {lanes.map((a, i) => (
          <g key={a.id}>
            <circle cx={PAD + i * LANE} cy={18} r={14} fill={LANE_COLORS[i % LANE_COLORS.length]} />
            <text x={PAD + i * LANE} y={22.5} textAnchor="middle" fontSize="12" fill="var(--color-carta)" fontFamily="var(--font-serif)">
              {a.name.replace(/^[A-ZА-ЯЁ]\.\s*/u, "").slice(0, 1)}
            </text>
          </g>
        ))}
        {sessions.map((s) => (
          <line key={s.sid} x1={s.x} x2={s.x} y1={s.y1} y2={s.y2} stroke={LANE_COLORS[s.lane % LANE_COLORS.length]} strokeWidth={4} strokeLinecap="round" opacity={0.18} />
        ))}
        <polyline
          points={events.map((e) => `${pos.get(e.id)!.x},${pos.get(e.id)!.y}`).join(" ")}
          fill="none"
          stroke="var(--color-ink-3)"
          strokeWidth={1}
          strokeDasharray="2 3"
          opacity={0.6}
        />
        {events.flatMap((e) =>
          e.parents
            .filter((p) => p !== e.session && pos.has(p))
            .map((p) => {
              const a = pos.get(p)!;
              const b = pos.get(e.id)!;
              const d =
                a.x === b.x
                  ? `M${a.x},${a.y} C${a.x + 30},${a.y} ${b.x + 30},${b.y} ${b.x},${b.y}`
                  : `M${a.x},${a.y} C${a.x},${(a.y + b.y) / 2} ${b.x},${(a.y + b.y) / 2} ${b.x},${b.y}`;
              return <path key={`${p}-${e.id}`} d={d} fill="none" stroke={typeColor(e.type)} strokeWidth={1.6} opacity={0.75} />;
            }),
        )}
        {events.map((e, i) => {
          const { x, y } = pos.get(e.id)!;
          const isSession = e.type.startsWith("session");
          return (
            <g key={e.id}>
              {selected === e.id && <circle cx={x} cy={y} r={12} fill="none" stroke="var(--color-ink)" strokeWidth={1.2} />}
              <circle
                cx={x}
                cy={y}
                r={isSession ? 5.5 : 7}
                fill={broken(i) ? "var(--color-madder)" : isSession ? "var(--color-vellum)" : typeColor(e.type)}
                stroke={broken(i) ? "var(--color-madder)" : isSession ? "var(--color-ink-3)" : "none"}
                strokeWidth={1.5}
              />
            </g>
          );
        })}
      </svg>

      <ol style={{ paddingTop: HEAD }}>
        {events.map((e, i) => (
          <li key={e.id} style={{ height: ROW }}>
            <button
              onClick={() => onSelect(e.id)}
              aria-pressed={selected === e.id}
              style={{ paddingLeft: width + 8 }}
              className={`flex h-full w-full items-center gap-4 rounded-xl pr-3 text-left transition-colors ${selected === e.id ? "bg-carta-2" : "hover:bg-carta-2/60"}`}
            >
              <span className="w-7 shrink-0 font-mono text-[11px] text-ink-3">#{e.seq}</span>
              <span className="min-w-0 flex-1">
                <span className={`block truncate text-[13.5px] ${broken(i) ? "text-madder" : "text-ink"}`}>{t(`types.${e.type.replace(".", "_")}`)}</span>
                <span className="block truncate text-[11.5px] text-ink-3">
                  {e.actor.name}
                  {e.subject?.title ? ` · ${e.subject.title}` : ""}
                </span>
              </span>
              <span className="hidden shrink-0 text-right font-mono text-[11px] text-ink-3 sm:block">
                {shortId(e.id)}
                <br />
                {e.ts.slice(11, 23)}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
