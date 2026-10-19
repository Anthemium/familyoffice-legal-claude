import { asset } from "@/lib/asset";

// Static export has no middleware: send visitors to the default locale.
export default function Root() {
  const target = asset("/ru/");
  return (
    <html lang="ru">
      <head>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
        <title>FAMILY OFFICE LEGAL</title>
      </head>
      <body>
        <a href={target}>FAMILY OFFICE LEGAL — перейти</a>
      </body>
    </html>
  );
}
