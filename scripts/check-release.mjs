import {readFileSync,existsSync,readdirSync,statSync} from 'node:fs';
import {resolve} from 'node:path';
const c=JSON.parse(readFileSync('src/data/site.json','utf8'));
const errors=[];
if(c.demoMode!==false)errors.push('demoModeをfalseにする前に、架空の会社・事例・記事・FAQを自社情報に置換してください。');
function url(value,label){try{const u=new URL(value);if(u.protocol!=='https:'||/example\.(com|org|net)$/.test(u.hostname)||u.username||u.password)throw Error();}catch{errors.push(`${label}: 本番のHTTPS URLが必要です。`);}}
url(c.siteUrl,'siteUrl');
for(const k of ['primaryUrl','privacyUrl'])url(c.cta[k],`cta.${k}`);
// LINE is optional: the page hides its buttons until secondaryUrl is set.
if(c.cta.secondaryUrl)url(c.cta.secondaryUrl,'cta.secondaryUrl');
const strings=JSON.stringify(c);
if(/サンプル|架空|変更してください|記載してください|書き換えて|{{[^}]+}}|sample-(workflow|document|chart)/.test(strings))errors.push('設定にサンプル文言・画像・置換指示が残っています。');
for(const p of c.proof){if(!p.label||!p.value||!p.note)errors.push('実績にはラベル・値・対象期間や母集団の注記が必要です。');url(p.sourceUrl,'proof.sourceUrl');}
for(const p of [...c.articles,...c.media])url(p.url,'記事・メディアURL');
if(c.profile)url(c.profile.url,'profile.url');
function walk(v,k=''){if(Array.isArray(v))return v.forEach(x=>walk(x,k));if(v&&typeof v==='object')return Object.entries(v).forEach(([a,b])=>walk(b,a));if(['image','src'].includes(k)&&typeof v==='string'){if(v.startsWith('/')){if(!existsSync(resolve('public',v.slice(1))))errors.push(`画像が見つかりません: ${v}`);}else url(v,k);}}
walk(c);
if(!existsSync('public/og-image.png'))errors.push('public/og-image.png がありません。');
if(!existsSync('dist/index.html'))errors.push('npm run build を先に実行してください。');
else {
 const html=readFileSync('dist/index.html','utf8');
 if(/noindex|サンプル|架空|{{[^}]+}}/.test(html))errors.push('ビルド出力にnoindexまたはサンプル文言が残っています。');
 if(!html.includes(c.companyName))errors.push('ビルドが古い可能性があります。再ビルドしてください。');
 const forbidden=/G-WFEC9V1BX0|masahirochaen|chaen_channel|info@digirise|claudecode\.digirise\.ai/;
 const scan=p=>{for(const n of readdirSync(p)){const f=resolve(p,n);if(statSync(f).isDirectory())scan(f);else if(/\.(html|js|css|json|xml|txt)$/.test(f)&&forbidden.test(readFileSync(f,'utf8')))errors.push(`配布元固有の識別情報を検出: ${f}`);}};
 scan('dist');
}
if(errors.length){console.error('公開チェック: NG\n'+errors.map(e=>'- '+e).join('\n'));process.exit(1);}
console.log('公開前の静的チェック: OK。PC/モバイル、リンク先、フォーム受信、画像権利・実績根拠は別途確認してください。');
