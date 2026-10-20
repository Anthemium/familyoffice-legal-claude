import { Fragment } from "react";

// Минимальная разметка статей: «## », «- », «> », **жирный**, пустая строка — абзац.
function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") ? <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong> : <Fragment key={i}>{part}</Fragment>
  );
}

export function ArticleBody({ body }: { body: string }) {
  const blocks = body.trim().split(/\n\s*\n/);
  return (
    <div className="space-y-6 text-[17px] leading-[1.75] text-ink-2">
      {blocks.map((block, i) => {
        const b = block.trim();
        if (b.startsWith("## ")) {
          return <h2 key={i} className="!mt-12 font-serif text-[30px] leading-tight text-ink">{b.slice(3)}</h2>;
        }
        if (b.startsWith("> ")) {
          return (
            <blockquote key={i} className="border-l-2 border-gold py-1 pl-6 font-serif text-[22px] italic leading-snug text-ink">
              {inline(b.slice(2))}
            </blockquote>
          );
        }
        if (b.startsWith("- ")) {
          return (
            <ul key={i} className="space-y-3">
              {b.split("\n").map((li, j) => (
                <li key={j} className="flex gap-4">
                  <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                  <span>{inline(li.replace(/^- /, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{inline(b)}</p>;
      })}
    </div>
  );
}
