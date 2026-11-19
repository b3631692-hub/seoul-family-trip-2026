/* Standalone SVG deliverables. The live UI also draws from src/illustrations.js and current trip JSON. */
import {readFileSync,writeFileSync} from 'node:fs';
import {dateRange} from '../src/lib.js';
import {dayArt,pickDayVisual,brandArt} from '../src/illustrations.js';
const root=new URL('../',import.meta.url);const trip=JSON.parse(readFileSync(new URL('data/seoul2026.json',root),'utf8'));
writeFileSync(new URL('assets/brand-seoul.svg',root),brandArt(trip)+'\n');
for(const [i,date] of dateRange(trip.startDate,trip.endDate).entries()){
 const es=trip.events.filter(e=>e.date===date),key=pickDayVisual(es);const path=new URL(`assets/day-${String(i+1).padStart(2,'0')}-${key}.svg`,root);
 writeFileSync(path,dayArt(key)+'\n');console.log(path.pathname);
}
