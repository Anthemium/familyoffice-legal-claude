import type { Article } from "./types";
import { ru } from "./ru";
import { en } from "./en";
import { hu } from "./hu";

export type { Article };

const byLocale: Record<string, Article[]> = { ru, en, hu };

export const getArticles = (locale: string) => byLocale[locale] ?? ru;
export const getArticle = (locale: string, slug: string) => getArticles(locale).find((a) => a.slug === slug);
export const ARTICLE_SLUGS = ru.map((a) => a.slug);

// Источники из списка литературы аналитического обзора (нумерация обзора сохранена).
type Source = { n: number; t: string; u: string };
const S: Record<number, Omit<Source, "n">> = {
  1: { t: "Family Office Capital & Investment Strategies — McDermott Will & Emery", u: "https://www.mcdermottlaw.com/capabilities/private-client/family-office-capital-investment/" },
  2: { t: "About — Dialogue Private Office", u: "https://www.dialogueprivate.com/about" },
  3: { t: "Family Office Services for High-Net-Worth Estate Planning — Dana Whiting Law", u: "https://danawhitinglaw.com/family-office/" },
  4: { t: "Family Offices — Mishcon de Reya", u: "https://www.mishcon.com/services/family-offices" },
  5: { t: "2026 Global Family Office Report — J.P. Morgan Private Bank", u: "https://privatebank.jpmorgan.com/nam/en/insights/reports/2026-family-office-report" },
  6: { t: "The 50 Largest Family Offices in the World (2026) — Altss", u: "https://altss.com/blog/the-50-largest-family-offices-in-the-world-2026" },
  7: { t: "Navigating Governance Models in Family Offices — Creative Planning", u: "https://creativeplanning.com/insights/family-office/family-office-governance-models/" },
  9: { t: "Family Office Lawyers: SFO Setup, Governance & Compliance — PBL", u: "https://pbl.legal/uhnwi-private-client/family-office-uhnw/" },
  10: { t: "The Family Office Landscape: Models, Services and Options — ACTEC Foundation", u: "https://actecfoundation.org/podcasts/family-office-landscape-models-services-options/" },
  11: { t: "Family Office vs. Wealth Management — Rev Group", u: "https://revgroupllc.com/family-office-vs-wealth-management/" },
  13: { t: "Family Office — Akerman LLP", u: "https://www.akerman.com/en/work/services/practices/tax/family-office.html" },
  14: { t: "Family Offices — Ropes & Gray", u: "https://www.ropesgray.com/en/services/practices/family-offices" },
  15: { t: "Family Offices — Macfarlanes", u: "https://www.macfarlanes.com/what-we-do/private-wealth/family-offices/" },
  16: { t: "Families and Family Offices — Withers", u: "https://www.withersworldwide.com/en-gb/experience/families-and-their-advisors/families-and-family-offices" },
  17: { t: "Advisory and Private Family Office Support — MDR Mayfair", u: "https://mdrmayfair.com/services/" },
  19: { t: "Family Office Singapore 2026: 13O vs 13U and Setup Guide — StashAway", u: "https://www.stashaway.sg/r/guide-to-establish-family-offices-singapore" },
  21: { t: "Trustees, Executors, Fiduciaries — Withers", u: "https://www.withersworldwide.com/en-gb/experience/families-and-their-advisors/trustees-executors-and-fiduciaries" },
  22: { t: "Do You Need to Register as an Investment Adviser? — Kelley Clarke", u: "https://kelleyclarkelaw.com/caution-do-you-need-to-register-as-an-investment-adviser/" },
  24: { t: "Malta Private Clients Law Firm — Chetcuti Cauchi", u: "https://www.ccmalta.com/practices/malta-private-clients-law-firm" },
  37: { t: "Family Office — Ogier", u: "https://www.ogier.com/expertise/sectors/family-office/" },
  40: { t: "Family Office Careers and Comp — Mr. Family Office", u: "https://www.mrfamilyoffice.com/p/careers-and-comp-the-full-list" },
  42: { t: "Compensation Practices of Investment-Focused Family Offices — Morgan Stanley", u: "https://www.morganstanley.com/content/dam/msdotcom/articles/single-family-office-compensation/ms-sfo-compensation-report.pdf" },
  45: { t: "Family Office Insights: Beneficial Ownership Reporting — Squire Patton Boggs", u: "https://www.squirepattonboggs.com/insights/publications/family-office-insights-an-update-on-beneficial-ownership-reporting-requirements/" },
  46: { t: "Dual-Purpose Communications: Separating Legal and Business Advice — American Bar Association", u: "https://www.americanbar.org/groups/litigation/resources/litigation-news/2023/summer/dual-purpose-communications-separating-legal-business-advice/" },
  47: { t: "Understanding the Limits of Attorney-Client Privilege — Peckar & Abramson", u: "https://www.pecklaw.com/client_alerts/understanding-the-limits-of-attorney-client-privilege/" },
  50: { t: "Trust, Estate and Inheritance Disputes — Withers", u: "https://www.withersworldwide.com/en-gb/experience/our-practices/trust-estate-and-inheritance-disputes" },
  57: { t: "Exemptions for Trustee and Portfolio Managers under FinIA — CapLaw", u: "https://caplaw.ch/2020/exemptions-for-trustee-and-portfolio-managers-under-finia/" },
  63: { t: "Why Switzerland Is Poised to Become a Prime Jurisdiction for Families — Charles Russell Speechlys", u: "https://www.charlesrussellspeechlys.com/en/insights/expert-insights/private-client/2024/right-on-time-why-switzerland-is-poised-to-become-a-prime-jurisdiction-for-families-to-establish-their-private-trust-companies/" },
  66: { t: "S13O & S13U Tax Exemptions — SG Wealth Law", u: "https://www.sgwealthlaw.com/s13o-s13u-tax-exemption/" },
  67: { t: "Further Amendments to the Singapore Fund Tax Incentive Schemes — DLA Piper", u: "https://www.dlapiper.com/en/insights/publications/singapore-asset-management-newsletter/2026/further-amendments-to-the-singapore-fund-tax-incentive-schemes" },
  71: { t: "Guide to Setting Up a Single Family Office in Singapore — EDB", u: "https://invest.edb.gov.sg/gov-support/sfo-setup-guide" },
  74: { t: "EU AML Regulation (AMLR): What Changes on 10 July 2027 — One Constellation", u: "https://one-constellation.com/blog/eu-aml-regulation-amlr-2027-readiness/" },
  75: { t: "Wealth & Tax Mobility — Sovereign Residence", u: "https://sovereignresidence.com/wealth-tax-mobility" },
  76: { t: "UK Non-Dom Tax Changes: Key Implications — Hubbis", u: "https://www.hubbis.com/article/uk-non-dom-tax-changes-some-key-implications-for-wealthy-private-clients-and-advisors" },
  80: { t: "BOI Reporting: What Happened and Current Status (2026) — Acuity", u: "https://acuity.co/beneficial-ownership-information-report/" },
  86: { t: "Navigating the Changing UK Tax Landscape — Alpadis", u: "https://www.alpadis.com/insights/navigating-the-changing-tax-uk-landscape-alternatives-for-high-net-worth-individuals" },
  91: { t: "How Financial Advisors Actually Charge for Their Services — Kitces", u: "https://www.kitces.com/blog/financial-advisors-charge-services-fee-structure-advisory-firm-profession-aum-pricing-insight/" },
  97: { t: "Chief Legal Officer & General Counsel Salary Guide (2026) — Cowen Partners", u: "https://cowenpartners.com/what-is-the-average-salary-of-a-chief-legal-officer-or-general-counsel/" },
  98: { t: "J.P. Morgan's Latest Family Office Report — Modus", u: "https://www.modus.news/p/in-j-p-morgans-latest-family-office-report-a-delta-between-objectives-and-actions" },
};

const BY_SLUG: Record<string, number[]> = {
  "lawyer-led-family-office": [1, 3, 4, 5, 6, 10, 11],
  "four-models": [1, 2, 3, 14, 16, 17, 21, 24, 37],
  "functional-perimeter": [3, 4, 7, 13, 15, 16, 50],
  privilege: [24, 46, 47],
  "law-vs-investment-advice": [17, 19, 22, 57, 63, 66, 67, 71],
  "transparency-relocation": [9, 45, 74, 75, 76, 80, 86],
  economics: [3, 5, 10, 17, 40, 42, 91, 97, 98],
  "choosing-a-model": [1, 3, 4, 5, 9, 17, 19],
};

export const getSources = (slug: string): Source[] => (BY_SLUG[slug] ?? []).filter((n) => S[n]).map((n) => ({ n, ...S[n] }));
