import c from '../data/site.json';
export function GET(){const u=(c.siteUrl.replace(/\/$/,'')+'/').replaceAll('&','&amp;');return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${u}</loc></url></urlset>`,{headers:{'Content-Type':'application/xml'}})}
