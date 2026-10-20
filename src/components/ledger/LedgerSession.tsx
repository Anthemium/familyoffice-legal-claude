"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { append, startSession, type Session } from "@/lib/ledger/client";
import type { Actor } from "@/lib/ledger/core";

const Ctx = createContext<Session | null>(null);

// Открывает сессию в реестре при входе в кабинет (событие session.start с устройством и ключом)
// и закрывает её при выходе. Все действия внутри кабинета ссылаются на эту сессию.
export function LedgerSessionProvider({ actor, method, children }: { actor: Actor; method: string; children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let current: Session | null = null;
    startSession(actor, method).then((s) => {
      current = s;
      setSession(s);
    });
    return () => {
      if (current) append(current, { type: "session.end" });
    };
  }, [actor, method]);

  return <Ctx.Provider value={session}>{children}</Ctx.Provider>;
}

export const useLedgerSession = () => useContext(Ctx);
