#!/usr/bin/env bash
# Выкладка статического сайта на familyoffice.legal (Timeweb, общий сервер с Caddy).
#   bash scripts/deploy.sh
# Берёт SERVER_IP / SERVER_USER / SERVER_SSH_KEY из .env. Caddy уже настроен (блок familyoffice.legal
# в /etc/caddy/Caddyfile) и раздаёт /var/www/familyoffice.legal — перезагружать его не нужно.
# Подмена папки атомарная: сайт не бывает «наполовину обновлённым».
set -euo pipefail
cd "$(dirname "$0")/.."

get() { grep -E "^$1=" .env | head -1 | cut -d= -f2-; }
HOST="$(get SERVER_IP)"
USER_="$(get SERVER_USER)"
KEY="$(get SERVER_SSH_KEY)"; KEY="${KEY/#\~/$HOME}"
SSH=(ssh -i "$KEY" -o BatchMode=yes "$USER_@$HOST")

echo "→ build"
rm -rf out
NEXT_PUBLIC_BASE_PATH= npx next build >/dev/null

echo "→ upload"
ARCHIVE="$(mktemp -d)/fol-site.tgz"
tar --force-local -czf "$ARCHIVE" -C out .
scp -i "$KEY" -o BatchMode=yes "$ARCHIVE" "$USER_@$HOST:/tmp/fol-site.tgz"

echo "→ switch"
"${SSH[@]}" 'set -e
  rm -rf /var/www/familyoffice.legal.new && mkdir -p /var/www/familyoffice.legal.new
  tar -xzf /tmp/fol-site.tgz -C /var/www/familyoffice.legal.new && rm /tmp/fol-site.tgz
  chmod -R a+rX /var/www/familyoffice.legal.new
  rm -rf /var/www/familyoffice.legal.prev
  [ -d /var/www/familyoffice.legal ] && mv /var/www/familyoffice.legal /var/www/familyoffice.legal.prev
  mv /var/www/familyoffice.legal.new /var/www/familyoffice.legal'

echo "→ check"
curl -s -o /dev/null -w "familyoffice.legal/ru/ → %{http_code}\n" https://familyoffice.legal/ru/
# Откат: ssh … 'rm -rf /var/www/familyoffice.legal && mv /var/www/familyoffice.legal.prev /var/www/familyoffice.legal'
