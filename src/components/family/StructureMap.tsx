"use client";

import { useState } from "react";

type Node = { id: string; name: string; kind: string; j: string; who: string; tier: 0 | 1 | 2; tone: string };

// Демо-структура семьи Вальден. В рабочей версии — из таблицы entities (Postgres, RLS по family_id).
const NODES: Node[] = [
  { id: "fam", name: "Valden", kind: "Family council", j: "—", who: "A. Markov", tier: 0, tone: "bg-tyrian text-carta" },
  { id: "pf", name: "Личный фонд «Вальден»", kind: "ГК РФ 123.20-4", j: "RU", who: "A. Markov", tier: 1, tone: "bg-tyrian-soft" },
  { id: "bv", name: "Valden Bizalmi Vagyonkezelés", kind: "Ptk. 6:310", j: "HU", who: "D. Kovács", tier: 1, tone: "bg-tyrian-soft" },
  { id: "hold", name: "Valden Holding Kft.", kind: "Holding", j: "HU", who: "D. Kovács", tier: 1, tone: "bg-lapis-soft" },
  { id: "op", name: "ООО «Северный порт»", kind: "Operating", j: "RU", who: "E. Sokolova", tier: 2, tone: "bg-umber-soft" },
  { id: "re", name: "Ringstraße Immobilien GmbH", kind: "Real estate", j: "AT", who: "D. Kovács", tier: 2, tone: "bg-umber-soft" },
  { id: "pe", name: "Valden Capital SCSp", kind: "Private equity", j: "LU", who: "E. Sokolova", tier: 2, tone: "bg-umber-soft" },
  { id: "art", name: "Collection Valden", kind: "Art · freeport", j: "CH", who: "A. Markov", tier: 2, tone: "bg-umber-soft" },
];

export function StructureMap({ note }: { note: string }) {
  const [sel, setSel] = useState<string>("hold");
  const active = NODES.find((n) => n.id === sel)!;
  return (
    <div>
      <div className="space-y-2">
        {[0, 1, 2].map((tier) => (
          <div key={tier} className="flex flex-wrap justify-center gap-2">
            {NODES.filter((n) => n.tier === tier).map((n) => (
              <button
                key={n.id}
                onClick={() => setSel(n.id)}
                className={`rounded-xl px-3 py-2 text-left text-[12px] leading-tight transition-all ${n.tone} ${sel === n.id ? "ring-2 ring-ink ring-offset-2 ring-offset-vellum" : "hover:ring-1 hover:ring-ink/30"}`}
              >
                <span className="block font-medium">{n.name}</span>
                <span className="font-mono text-[10px] opacity-70">{n.j}</span>
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-carta px-4 py-3 text-[12.5px]">
        <span className="font-medium">{active.name}</span>
        <span className="text-ink-3">{active.kind} · {active.j} · {active.who}</span>
      </div>
      <p className="mt-2 text-[11.5px] text-ink-3">{note}</p>
    </div>
  );
}
