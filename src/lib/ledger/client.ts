"use client";

// Демо-хранилище реестра в браузере (localStorage) — общее для кабинета семьи и Студиоло,
// поэтому в графе видно, как действие клиента вызывает действие адвоката.
// В рабочей версии append выполняет сервер в транзакции Postgres (см. docs/LEDGER.md),
// а клиент лишь передаёт событие и подпись.

import { useSyncExternalStore } from "react";
import {
  GENESIS,
  generateSessionKey,
  hashEvent,
  sha256,
  signHash,
  uuidv7,
  type Actor,
  type Device,
  type EventType,
  type LedgerEvent,
  type Subject,
} from "./core";

const LEDGER_KEY = "fol.ledger.v1";
const MESSAGES_KEY = "fol.messages.v1";
const DOCUMENTS_KEY = "fol.documents.v1";
const DEVICE_KEY = "fol.device.v1";

export type StoredMessage = { id: string; perimeter: "A" | "B"; text: string; sentEvent: string; ts: string; from: string };
export type StoredDocument = { id: string; title: string; size: number; mime: string; sha256: string; uploadEvent: string; ts: string };

export type Session = { id: string; actor: Actor; device: Device; privateKey: CryptoKey };

// ── чтение / запись ───────────────────────────────────────────────

function read<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]") as T[];
  } catch {
    return [];
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* приватный режим: журнал живёт до перезагрузки страницы */
  }
  emit();
}

export const readLedger = () => read<LedgerEvent>(LEDGER_KEY);
export const readMessages = () => read<StoredMessage>(MESSAGES_KEY);
export const readDocuments = () => read<StoredDocument>(DOCUMENTS_KEY);

// ── подписка для React ────────────────────────────────────────────

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(fn: () => void) {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => e.key?.startsWith("fol.") && fn();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

// useSyncExternalStore требует стабильный снимок: кэшируем по сырой строке.
function snapshot<T>(key: string) {
  let raw: string | null = null;
  let value: T[] = [];
  return () => {
    let next: string | null = null;
    try {
      next = localStorage.getItem(key);
    } catch {
      /* noop */
    }
    if (next !== raw) {
      raw = next;
      try {
        value = JSON.parse(next || "[]");
      } catch {
        value = [];
      }
    }
    return value;
  };
}

const EMPTY: never[] = [];
const ledgerSnap = snapshot<LedgerEvent>(LEDGER_KEY);
const messagesSnap = snapshot<StoredMessage>(MESSAGES_KEY);
const documentsSnap = snapshot<StoredDocument>(DOCUMENTS_KEY);

export const useLedgerEvents = () => useSyncExternalStore(subscribe, ledgerSnap, () => EMPTY as LedgerEvent[]);
export const useMessages = () => useSyncExternalStore(subscribe, messagesSnap, () => EMPTY as StoredMessage[]);
export const useDocuments = () => useSyncExternalStore(subscribe, documentsSnap, () => EMPTY as StoredDocument[]);

// ── устройство ────────────────────────────────────────────────────

function browserLabel(ua: string) {
  const b =
    ua.match(/Edg\/(\d+)/) ? `Edge ${RegExp.$1}` :
    ua.match(/OPR\/(\d+)/) ? `Opera ${RegExp.$1}` :
    ua.match(/Chrome\/(\d+)/) ? `Chrome ${RegExp.$1}` :
    ua.match(/Version\/(\d+).*Safari/) ? `Safari ${RegExp.$1}` :
    ua.match(/Firefox\/(\d+)/) ? `Firefox ${RegExp.$1}` : "Browser";
  const os = /iPhone|iPad/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS X/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "—";
  return `${b} · ${os}`;
}

export async function getDevice(): Promise<Device> {
  let id = "";
  try {
    id = localStorage.getItem(DEVICE_KEY) || "";
    if (!id) {
      id = uuidv7();
      localStorage.setItem(DEVICE_KEY, id);
    }
  } catch {
    id = uuidv7();
  }
  const ua = navigator.userAgent;
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform || navigator.platform || "—";
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const screenStr = `${screen.width}×${screen.height}@${window.devicePixelRatio}`;
  const lang = navigator.language;
  return {
    id,
    label: browserLabel(ua),
    fingerprint: await sha256([ua, platform, screenStr, lang, tz].join("|")),
    platform,
    lang,
    tz,
    screen: screenStr,
    ip: null,
  };
}

// ── добавление событий ────────────────────────────────────────────

// Очередь: события дописываются строго по одному, чтобы seq и prevHash не перепутались.
let queue: Promise<unknown> = Promise.resolve();

type AppendInput = {
  type: EventType;
  subject?: Subject;
  perimeter?: "A" | "B";
  parents?: string[];
  meta?: LedgerEvent["meta"];
};

async function appendRaw(
  session: { id: string; actor: Actor; device: Device; privateKey: CryptoKey },
  input: AppendInput,
  extra: { id?: string; pubKey?: JsonWebKey } = {},
): Promise<LedgerEvent> {
  const run = async () => {
    const events = readLedger();
    const prev = events[events.length - 1];
    const id = extra.id ?? uuidv7();
    const parents = [...new Set([...(input.type === "session.start" ? [] : [session.id]), ...(input.parents ?? [])])];
    const body = {
      id,
      seq: events.length,
      ts: new Date().toISOString(),
      type: input.type,
      actor: session.actor,
      session: input.type === "session.start" ? id : session.id,
      device: session.device,
      subject: input.subject,
      perimeter: input.perimeter,
      meta: input.meta,
      parents,
      prevHash: prev?.hash ?? GENESIS,
      pubKey: extra.pubKey,
    };
    const hash = await hashEvent(body);
    const sig = await signHash(session.privateKey, hash);
    const event: LedgerEvent = { ...body, hash, sig };
    write(LEDGER_KEY, [...events, event]);
    return event;
  };
  const p = queue.then(run, run);
  queue = p.catch(() => undefined);
  return p;
}

export async function startSession(actor: Actor, method: string): Promise<Session> {
  const [{ privateKey, pubKey }, device] = await Promise.all([generateSessionKey(), getDevice()]);
  const id = uuidv7();
  const session = { id, actor, device, privateKey };
  await appendRaw(session, { type: "session.start", meta: { method, ua: navigator.userAgent } }, { id, pubKey });
  return session;
}

export const append = (session: Session, input: AppendInput) => appendRaw(session, input);

// ── предметные операции ───────────────────────────────────────────

export async function sendMessage(session: Session, text: string, perimeter: "A" | "B") {
  const id = uuidv7();
  const ev = await append(session, {
    type: "message.send",
    perimeter,
    subject: { kind: "message", id, sha256: await sha256(text), size: text.length },
  });
  write(MESSAGES_KEY, [...readMessages(), { id, perimeter, text, sentEvent: ev.id, ts: ev.ts, from: session.actor.name }]);
  return ev;
}

export async function openMessage(session: Session, msg: StoredMessage) {
  return append(session, {
    type: "message.open",
    perimeter: msg.perimeter,
    subject: { kind: "message", id: msg.id, sha256: (await sha256(msg.text)) },
    parents: [msg.sentEvent],
  });
}

export async function uploadDocument(session: Session, file: File, perimeter: "A" | "B") {
  const id = uuidv7();
  const digest = await sha256(await file.arrayBuffer());
  const ev = await append(session, {
    type: "document.upload",
    perimeter,
    subject: { kind: "document", id, title: file.name, sha256: digest, size: file.size },
    meta: { mime: file.type || "application/octet-stream" },
  });
  write(DOCUMENTS_KEY, [
    ...readDocuments(),
    { id, title: file.name, size: file.size, mime: file.type, sha256: digest, uploadEvent: ev.id, ts: ev.ts },
  ]);
  return ev;
}

export async function openDocument(session: Session, doc: StoredDocument) {
  return append(session, {
    type: "document.open",
    subject: { kind: "document", id: doc.id, title: doc.title, sha256: doc.sha256, size: doc.size },
    parents: [doc.uploadEvent],
  });
}

// Последнее событие, вызванное данным предметом: для статусов «доставлено / прочитано».
export const findOpen = (events: LedgerEvent[], subjectId: string) =>
  events.filter((e) => e.type === "message.open" && e.subject?.id === subjectId);

export function resetDemo() {
  write(LEDGER_KEY, []);
  write(MESSAGES_KEY, []);
  write(DOCUMENTS_KEY, []);
}

// Подмена записи «в обход системы» — для демонстрации того, что проверка её обнаруживает.
export function tamperDemo(): number | null {
  const events = readLedger();
  if (events.length < 3) return null;
  const i = Math.floor(events.length / 2);
  const e = events[i];
  events[i] = { ...e, ts: new Date(new Date(e.ts).getTime() - 3_600_000).toISOString() };
  write(LEDGER_KEY, events);
  return i;
}

// Сценарий для показа: клиент загружает документ и пишет адвокату, адвокат открывает.
export async function runDemoScenario(client: Actor, counsel: Actor, texts: { msg: string; doc: string }) {
  const c = await startSession(client, "passkey");
  const docFile = new File([texts.doc], "Loan_agreement_Valden_Holding_v2.pdf", { type: "application/pdf" });
  const up = await uploadDocument(c, docFile, "A");
  await sendMessage(c, texts.msg, "A");
  const a = await startSession(counsel, "passkey + YubiKey");
  const msg = readMessages().slice(-1)[0];
  await openMessage(a, msg);
  const doc = readDocuments().find((d) => d.uploadEvent === up.id)!;
  await openDocument(a, doc);
  await append(a, {
    type: "template.download",
    subject: { kind: "template", id: "tpl-loan-review", title: "Loan review memo (RU/EN/HU)" },
    meta: { link: "S3 presigned · 300 s" },
  });
  await append(a, { type: "session.end" });
}
