import type { APIRoute } from "astro";

export const prerender = true;

const SITE = "https://flottwomenscircle.com";

// Public, indexable pages only (admin/API/404 excluded).
const pages = import.meta.glob("./*.astro");
const paths = Object.keys(pages)
  .map((file) => file.replace(/^\.\//, "").replace(/\.astro$/, ""))
  .filter((name) => name !== "404")
  .map((name) => (name === "index" ? "/" : `/${name}/`))
  .sort();

export const GET: APIRoute = () => {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${SITE}${p}</loc>${p === "/grand-table/" ? "<changefreq>weekly</changefreq><priority>0.9</priority>" : ""}</url>`).join("\n")}
</urlset>
`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
