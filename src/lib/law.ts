// Демонстрационные выдержки для параллельного просмотра RU / EN / HU.
// Оригинал помечен `orig`; остальные языки — рабочие переводы коллегии.
// В рабочей версии тексты приходят из таблицы legal_norms с датой редакции и ссылкой на официальный источник.

export type Norm = {
  ref: string;
  source: string;
  orig: "ru" | "en" | "hu";
  ru: string;
  en: string;
  hu: string;
};

export const LAW: Norm[][] = [
  [
    {
      ref: "ФЗ-63, ст. 8, п. 1–2",
      source: "pravo.gov.ru",
      orig: "ru",
      ru: "1. Адвокатской тайной являются любые сведения, связанные с оказанием адвокатом юридической помощи своему доверителю. 2. Адвокат не может быть вызван и допрошен в качестве свидетеля об обстоятельствах, ставших ему известными в связи с обращением к нему за юридической помощью или в связи с ее оказанием.",
      en: "1. Advocate secrecy covers any information connected with the legal assistance an advocate provides to the client. 2. An advocate may not be summoned or questioned as a witness about circumstances that became known to them in connection with a request for, or the provision of, legal assistance.",
      hu: "1. Ügyvédi titoknak minősül minden olyan adat, amely azzal kapcsolatos, hogy az ügyvéd megbízójának jogi segítséget nyújt. 2. Az ügyvéd nem idézhető és nem hallgatható meg tanúként olyan körülményekről, amelyekről a jogi segítség kérése vagy nyújtása során szerzett tudomást.",
    },
    {
      ref: "2017. évi LXXVIII. tv. (Üttv.), 9. § (1)",
      source: "njt.hu",
      orig: "hu",
      ru: "Адвокат, если законом не предусмотрено иное, обязан хранить в тайне все факты, сведения и информацию, ставшие ему известными при осуществлении профессиональной деятельности.",
      en: "Unless the law provides otherwise, an attorney is bound by confidentiality as to every fact, data and information that came to their knowledge in the course of practising the profession.",
      hu: "Az ügyvédet – ha törvény eltérően nem rendelkezik – titoktartási kötelezettség terheli minden olyan tény, adat és információ tekintetében, amelyről hivatása gyakorlása során szerzett tudomást.",
    },
  ],
  [
    {
      ref: "Ptk. 6:310. § (1)",
      source: "njt.hu",
      orig: "hu",
      ru: "По договору доверительного управления (bizalmi vagyonkezelés) управляющий обязан управлять переданными ему в собственность учредителем вещами, денежными средствами, требованиями и иными правами в пользу выгодоприобретателя, а учредитель — уплатить вознаграждение.",
      en: "Under a fiduciary asset management contract the trustee undertakes to manage the assets, money, claims and other rights transferred into its ownership by the settlor for the benefit of the beneficiary, and the settlor undertakes to pay a fee.",
      hu: "Bizalmi vagyonkezelési szerződés alapján a vagyonkezelő a vagyonrendelő által tulajdonába adott vagyontárgyak, pénz, követelések és más jogok kezelésére a kedvezményezett javára, a vagyonrendelő díj fizetésére köteles.",
    },
    {
      ref: "ГК РФ, ст. 123.20-4 (изложение)",
      source: "pravo.gov.ru",
      orig: "ru",
      ru: "Личный фонд — унитарная некоммерческая организация, создаваемая гражданином или нотариусом после его смерти на основе имущества гражданина для управления этим имуществом в интересах учредителя и (или) выгодоприобретателей.",
      en: "A private (personal) foundation is a unitary non-profit organisation established by a citizen, or by a notary after the citizen's death, on the basis of the citizen's property in order to manage it in the interests of the founder and/or beneficiaries.",
      hu: "A személyes alapítvány egységes nonprofit szervezet, amelyet magánszemély – vagy halála után közjegyző – a magánszemély vagyonából hoz létre e vagyon kezelésére az alapító és/vagy a kedvezményezettek érdekében.",
    },
  ],
  [
    {
      ref: "Regulation (EU) 2024/1624 (AMLR), Art. 52 (summary)",
      source: "eur-lex.europa.eu",
      orig: "en",
      ru: "Прямым или косвенным владением считается владение 25% или более акций, голосов или иной доли участия, рассчитанной с учётом всех цепочек владения. Комиссия вправе снизить порог до 15% для категорий повышенного риска.",
      en: "Direct or indirect ownership means holding 25% or more of the shares, voting rights or other ownership interest, calculated across every chain of ownership. The Commission may lower the threshold to 15% for higher-risk categories.",
      hu: "Közvetlen vagy közvetett tulajdonnak minősül a részvények, szavazati jogok vagy más tulajdoni részesedés legalább 25%-a, valamennyi tulajdonosi láncon keresztül számítva. A Bizottság a magasabb kockázatú kategóriáknál a küszöböt 15%-ra csökkentheti.",
    },
  ],
];
