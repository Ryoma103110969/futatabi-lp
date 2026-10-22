import c from '../data/site.json';
export function GET(){return new Response(c.demoMode ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\nSitemap: ${c.siteUrl.replace(/\/$/,'')}/sitemap.xml\n`, {headers:{'Content-Type':'text/plain'}})}
