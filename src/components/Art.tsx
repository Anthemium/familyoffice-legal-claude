import { asset } from "@/lib/asset";

type Props = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  imgClassName?: string;
  position?: string;
  treatment?: "engraving" | "none";
};

// Картина в «музейной» подаче: гравюрная обработка, виньетка, этикетка под изображением.
export function Art({ src, alt, caption, className = "", imgClassName = "", position = "center", treatment = "engraving" }: Props) {
  return (
    <figure className={className}>
      <div className="art-frame h-full w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(src)}
          alt={alt}
          loading="lazy"
          className={`h-full w-full object-cover ${treatment === "engraving" ? "art-engraving" : ""} ${imgClassName}`}
          style={{ objectPosition: position }}
        />
      </div>
      {caption && <figcaption className="mt-3 font-mono text-[10.5px] leading-relaxed tracking-wide text-ink-3 uppercase">{caption}</figcaption>}
    </figure>
  );
}
