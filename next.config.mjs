import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Static export → GitHub Pages preview. On Timeweb the same code runs as a Node server
// once server features (auth, S3 presign, Postgres) are switched on: set FOL_TARGET=server.
const isStatic = process.env.FOL_TARGET !== "server";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const config = {
  output: isStatic ? "export" : "standalone",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default withNextIntl(config);
