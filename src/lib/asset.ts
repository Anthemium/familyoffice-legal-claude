// Static export on GitHub Pages lives under /<repo>; public assets need the prefix.
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;
