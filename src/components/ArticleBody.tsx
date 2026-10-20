import { Fragment } from "react";

// Минимальная разметка статей: «## », «- », «> », «| таблица |», **жирный**, пустая строка — абзац.
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
        if (b.startsWith("|")) {
          const rows = b
            .split("\n")
            .filter((r) => !/^\|[\s|:-]+\|$/.test(r.trim())) // строка-разделитель |---|---|
            .map((r) => r.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
          const [head, ...body] = rows;
          return (
            // Таблицы от четырёх колонок выходят за поля текста, чтобы не обрезаться.
            <div key={i} className={`!my-10 -mx-4 overflow-x-auto px-4 md:mx-0 md:px-0 ${head.length >= 4 ? "lg:-mx-52 xl:-mx-64" : ""}`}>
              <table className={`w-full border-collapse text-left text-[14px] leading-snug ${head.length >= 4 ? "min-w-[860px] lg:min-w-0" : "min-w-[560px] md:min-w-0"}`}>
                <thead>
                  <tr>
                    {head.map((h, j) => (
                      <th key={j} className="label-caps border-b border-ink/30 px-3 pb-3 align-bottom !text-[10px] text-ink-3 first:pl-0">{inline(h)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {body.map((r, j) => (
                    <tr key={j} className="border-b border-hair align-top">
                      {r.map((c, k) => (
                        <td key={k} className={`px-3 py-3 first:pl-0 ${k === 0 ? "font-medium text-ink" : ""}`}>{inline(c)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
