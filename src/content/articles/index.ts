import type { Article } from "./types";
import { ru } from "./ru";
import { en } from "./en";
import { hu } from "./hu";

export type { Article };

const byLocale: Record<string, Article[]> = { ru, en, hu };

export const getArticles = (locale: string) => byLocale[locale] ?? ru;
export const getArticle = (locale: string, slug: string) => getArticles(locale).find((a) => a.slug === slug);
export const ARTICLE_SLUGS = ru.map((a) => a.slug);
