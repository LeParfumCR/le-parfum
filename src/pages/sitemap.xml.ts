import type { APIRoute } from 'astro';
import config from '../data/config.json';
import perfumesData from '../data/perfumes.json';

export const GET: APIRoute = () => {
  const siteUrl = config.siteUrl.replace(/\/$/, '');

  const staticPaths = [
    '/',
    '/nosotros',
    '/preguntas-frecuentes',
    '/politica-de-envios',
    '/terminos',
    '/privacidad',
  ];

  const productPaths = perfumesData.perfumes.map((p) => `/producto/${p.slug}`);

  const urls = [...staticPaths, ...productPaths];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (path) => `  <url>
    <loc>${siteUrl}${path}</loc>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
