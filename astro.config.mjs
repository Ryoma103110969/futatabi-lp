import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';
const c=JSON.parse(readFileSync(new URL('./src/data/site.json',import.meta.url),'utf8'));
// base follows the path part of siteUrl (e.g. /futatabi-lp on GitHub Pages).
export default defineConfig({site:c.siteUrl,base:new URL(c.siteUrl).pathname,output:'static'});
