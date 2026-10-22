import c from '../data/site.json';
// GitHub Pages serves the site under a sub-path, so every root path goes through these helpers.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const origin = c.siteUrl.replace(/\/$/, '');
export const asset = (p: string) => (p.startsWith('/') ? base + p : p);
export const absolute = (p: string) => origin + p;
