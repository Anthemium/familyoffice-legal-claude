-- Реестр действий FAMILY OFFICE LEGAL: append-only журнал с хэш-цепочкой (Timeweb Managed PostgreSQL).
-- Применяется после prisma migrate. Хэш и подпись считает приложение (src/lib/ledger/core.ts),
-- база гарантирует порядок, неизменяемость и связность.

CREATE TABLE IF NOT EXISTS ledger_event (
  seq         BIGINT PRIMARY KEY,                 -- позиция в цепочке, без пропусков
  id          UUID NOT NULL UNIQUE,               -- UUIDv7
  ts          TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(), -- время сервера, не клиента
  type        TEXT NOT NULL,
  family_id   UUID,                               -- для RLS
  actor_id    UUID NOT NULL,
  session_id  UUID NOT NULL,
  device_id   TEXT NOT NULL,
  ip          INET,                               -- фиксирует сервер
  subject     JSONB,
  perimeter   CHAR(1) CHECK (perimeter IN ('A','B')),
  parents     UUID[] NOT NULL DEFAULT '{}',
  body        JSONB NOT NULL,                     -- канонический JSON события
  prev_hash   CHAR(64) NOT NULL,
  hash        CHAR(64) NOT NULL UNIQUE,
  sig_client  TEXT,                               -- подпись ключом пользователя (WebAuthn) — для критичных действий
  sig_server  TEXT NOT NULL                       -- подпись ключом коллегии (KMS)
);

-- 1. Только INSERT: обновление и удаление запрещены даже владельцу таблицы.
CREATE OR REPLACE FUNCTION ledger_forbid_change() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'ledger_event is append-only';
END $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ledger_no_update ON ledger_event;
CREATE TRIGGER ledger_no_update BEFORE UPDATE OR DELETE OR TRUNCATE ON ledger_event
  FOR EACH STATEMENT EXECUTE FUNCTION ledger_forbid_change();

-- 2. Связность: seq идёт подряд, prev_hash совпадает с hash предыдущей записи,
--    причины (parents) уже есть в журнале.
CREATE OR REPLACE FUNCTION ledger_check_link() RETURNS trigger AS $$
DECLARE last ledger_event%ROWTYPE;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('ledger_event'));  -- один писатель за раз
  SELECT * INTO last FROM ledger_event ORDER BY seq DESC LIMIT 1;
  IF last IS NULL THEN
    IF NEW.seq <> 0 OR NEW.prev_hash <> repeat('0', 64) THEN RAISE EXCEPTION 'bad genesis'; END IF;
  ELSIF NEW.seq <> last.seq + 1 OR NEW.prev_hash <> last.hash THEN
    RAISE EXCEPTION 'chain mismatch at seq %', NEW.seq;
  END IF;
  IF EXISTS (SELECT 1 FROM unnest(NEW.parents) p WHERE NOT EXISTS (SELECT 1 FROM ledger_event e WHERE e.id = p)) THEN
    RAISE EXCEPTION 'unknown parent';
  END IF;
  RETURN NEW;
END $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ledger_link ON ledger_event;
CREATE TRIGGER ledger_link BEFORE INSERT ON ledger_event FOR EACH ROW EXECUTE FUNCTION ledger_check_link();

-- 3. Права: приложение может только добавлять и читать; аудитор — только читать.
REVOKE ALL ON ledger_event FROM PUBLIC;
GRANT SELECT, INSERT ON ledger_event TO fol_app;
GRANT SELECT ON ledger_event TO fol_auditor;

-- 4. RLS: семья видит только свои события; коллегия — события своих доверителей.
ALTER TABLE ledger_event ENABLE ROW LEVEL SECURITY;
CREATE POLICY ledger_family ON ledger_event FOR SELECT
  USING (family_id = current_setting('fol.family_id', true)::uuid OR current_setting('fol.role', true) IN ('PARTNER','ADVOCATE'));
CREATE POLICY ledger_insert ON ledger_event FOR INSERT WITH CHECK (true);

-- 5. Якоря: корень Меркла за период, подпись коллегии и квалифицированная метка времени.
CREATE TABLE IF NOT EXISTS ledger_anchor (
  id          BIGSERIAL PRIMARY KEY,
  from_seq    BIGINT NOT NULL,
  to_seq      BIGINT NOT NULL,
  merkle_root CHAR(64) NOT NULL,
  sig_server  TEXT NOT NULL,
  tsa_token   BYTEA NOT NULL,       -- RFC 3161 TimeStampToken от квалифицированного поставщика
  tsa_name    TEXT NOT NULL,
  s3_key      TEXT NOT NULL,        -- копия в бакете с Object Lock (WORM)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS anchor_no_update ON ledger_anchor;
CREATE TRIGGER anchor_no_update BEFORE UPDATE OR DELETE OR TRUNCATE ON ledger_anchor
  FOR EACH STATEMENT EXECUTE FUNCTION ledger_forbid_change();
