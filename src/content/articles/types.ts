export type Article = {
  slug: string;
  section: string; // раздел исходного обзора
  title: string;
  lead: string;
  minutes: number;
  art: { src: string; pos: string };
  body: string;
};
