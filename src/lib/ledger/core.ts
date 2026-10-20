// Реестр действий: append-only журнал с хэш-цепочкой и причинными связями (DAG).
//
// Каждое событие:
//  - получает ID в формате UUIDv7 (упорядочен по времени, уникален без центрального счётчика);
//  - ссылается на хэш предыдущего события (prevHash) — цепочка, как в блокчейне:
//    изменение любой записи ломает все последующие;
//  - ссылается на события-причины (parents) — «открытие сообщения» → «отправка сообщения»,
//    «любое действие» → «вход в кабинет», что даёт граф действий;
//  - подписывается ключом сессии (ECDSA P-256); открытый ключ записан в событии входа.
// Все хэши — SHA-256 от канонического JSON. Модуль изоморфный: работает в браузере и в Node 20+.

export type EventType =
  | "session.start"
  | "session.end"
  | "document.upload"
  | "document.open"
  | "message.send"
  | "message.open"
  | "template.download"
  | "shield.call";

export type Actor = { id: string; name: string; role: "PRINCIPAL" | "FAMILY_MEMBER" | "PARTNER" | "ADVOCATE" | "PARALEGAL" };

export type Device = {
  id: string; // постоянный идентификатор устройства (в рабочей версии — id учётных данных WebAuthn)
  label: string; // «Chrome 141 · Windows»
  fingerprint: string; // SHA-256 от UA, платформы, экрана, языка, часового пояса
  platform: string;
  lang: string;
  tz: string;
  screen: string;
  ip: string | null; // фиксирует только сервер
};

export type Subject = {
  kind: "document" | "message" | "template" | "session";
  id: string;
  title?: string;
  sha256?: string; // хэш содержимого: сам документ или текст в реестр не попадает
  size?: number;
};

export type LedgerEvent = {
  id: string;
  seq: number;
  ts: string; // ISO 8601, мс, UTC
  type: EventType;
  actor: Actor;
  session: string; // id события session.start
  device: Device;
  subject?: Subject;
  perimeter?: "A" | "B";
  meta?: Record<string, string | number | boolean>;
  parents: string[];
  prevHash: string;
  hash: string;
  sig: string; // base64 подписи хэша ключом сессии
  pubKey?: JsonWebKey; // только в session.start
};

export const GENESIS = "0".repeat(64);

const enc = new TextEncoder();

export function canonical(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  const obj = value as Record<string, unknown>;
  return `{${Object.keys(obj)
    .filter((k) => obj[k] !== undefined)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${canonical(obj[k])}`)
    .join(",")}}`;
}

const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");

export async function sha256(data: string | ArrayBuffer): Promise<string> {
  const bytes = typeof data === "string" ? enc.encode(data) : data;
  return hex(await crypto.subtle.digest("SHA-256", bytes));
}

export function uuidv7(now = Date.now()): string {
  const b = crypto.getRandomValues(new Uint8Array(16));
  let ts = now;
  for (let i = 5; i >= 0; i--) {
    b[i] = ts % 256;
    ts = Math.floor(ts / 256);
  }
  b[6] = (b[6] & 0x0f) | 0x70;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

// Хэш покрывает всё, кроме самого хэша и подписи.
export function hashEvent(e: Omit<LedgerEvent, "hash" | "sig"> | LedgerEvent): Promise<string> {
  const { hash: _h, sig: _s, ...body } = e as LedgerEvent;
  return sha256(canonical(body));
}

const b64 = (buf: ArrayBuffer) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const ECDSA = { name: "ECDSA", namedCurve: "P-256" } as const;
const SIGN = { name: "ECDSA", hash: "SHA-256" } as const;

export async function generateSessionKey() {
  const pair = await crypto.subtle.generateKey(ECDSA, false, ["sign", "verify"]);
  const pubKey = await crypto.subtle.exportKey("jwk", pair.publicKey);
  return { privateKey: pair.privateKey, pubKey };
}

export async function signHash(key: CryptoKey, hash: string) {
  return b64(await crypto.subtle.sign(SIGN, key, enc.encode(hash)));
}

async function verifySig(pubKey: JsonWebKey, hash: string, sig: string) {
  try {
    const key = await crypto.subtle.importKey("jwk", pubKey, ECDSA, false, ["verify"]);
    return await crypto.subtle.verify(SIGN, key, unb64(sig), enc.encode(hash));
  } catch {
    return false;
  }
}

export type EventCheck = { hash: boolean; link: boolean; sig: boolean; parents: boolean };
export type Verification = { ok: boolean; firstBroken: number | null; checks: EventCheck[]; root: string; ms: number };

// Полная проверка: пересчёт хэшей, связность цепочки, подписи, существование и порядок причин.
export async function verifyLedger(events: LedgerEvent[]): Promise<Verification> {
  const t0 = performance.now();
  const byId = new Map(events.map((e) => [e.id, e]));
  const checks: EventCheck[] = [];
  let firstBroken: number | null = null;
  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    const hash = (await hashEvent(e)) === e.hash;
    const link = e.seq === i && e.prevHash === (i === 0 ? GENESIS : events[i - 1].hash);
    const start = e.type === "session.start" ? e : byId.get(e.session);
    const sig = !!start?.pubKey && (await verifySig(start.pubKey, e.hash, e.sig));
    const parents = e.parents.every((p) => (byId.get(p)?.seq ?? Infinity) < e.seq);
    checks.push({ hash, link, sig, parents });
    if (firstBroken === null && !(hash && link && sig && parents)) firstBroken = i;
  }
  const root = await merkleRoot(events.map((e) => e.hash));
  return { ok: firstBroken === null, firstBroken, checks, root, ms: Math.round(performance.now() - t0) };
}

// Корень Меркла: один хэш, который фиксирует весь журнал. В рабочей версии он периодически
// подписывается сервером и заверяется квалифицированной меткой времени (eIDAS / 63-ФЗ).
export async function merkleRoot(hashes: string[]): Promise<string> {
  if (!hashes.length) return GENESIS;
  let level = hashes;
  while (level.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < level.length; i += 2) next.push(await sha256(level[i] + (level[i + 1] ?? level[i])));
    level = next;
  }
  return level[0];
}

// Доказательство включения: путь от события к корню. Позволяет показать суду одно событие,
// не раскрывая остальные.
export async function merkleProof(hashes: string[], index: number) {
  const proof: { sibling: string; side: "L" | "R" }[] = [];
  let level = hashes;
  let i = index;
  while (level.length > 1) {
    const isRight = i % 2 === 1;
    const sibling = isRight ? level[i - 1] : level[i + 1] ?? level[i];
    proof.push({ sibling, side: isRight ? "L" : "R" });
    const next: string[] = [];
    for (let j = 0; j < level.length; j += 2) next.push(await sha256(level[j] + (level[j + 1] ?? level[j])));
    level = next;
    i = Math.floor(i / 2);
  }
  return proof;
}

export const shortId = (id: string) => `${id.slice(0, 8)}…${id.slice(-4)}`;
export const shortHash = (h: string) => `${h.slice(0, 6)}…${h.slice(-4)}`;
