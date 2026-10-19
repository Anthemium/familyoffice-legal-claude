import { setRequestLocale } from "next-intl/server";
import { StudioloApp } from "@/components/studiolo/StudioloApp";

// Демо работает целиком в браузере. В рабочей версии этот маршрут закрыт на сервере:
// WebAuthn (passkey + аппаратный ключ), allow-list устройств, короткая сессия, аудит каждого запроса.
export default async function StudioloPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <StudioloApp />;
}
