import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dateRange,validateTrip,costTotal,costSummary,getDayRoutes,getDayIssues,createICS} from '../src/lib.js';
import {pickDayVisual,dayArt,brandArt,inferVisualKey} from '../src/illustrations.js';
const initial=validateTrip(JSON.parse(readFileSync(new URL('../data/seoul2026.json',import.meta.url),'utf8')));
const get=id=>initial.events.find(e=>e.id===id);
test('手冊資料已建立五日、34 筆、10 位旅客及 31 件用品',()=>{
 assert.equal(dateRange(initial.startDate,initial.endDate).length,5);assert.equal(initial.events.length,34);assert.equal(initial.travellers.adults+initial.travellers.children.length,10);assert.equal(initial.packing.length,31);
});
test('每人、每車、全團明細能計算且未填仍是 null',()=>{
 assert.equal(costTotal(get('d1-bus').cost),143000);assert.equal(costTotal(get('d3-rail').cost),152000);assert.equal(costTotal(get('d2-festival').cost),0);assert.equal(costTotal(get('d4-aquarium').cost),null);
 const x=costSummary(initial);assert.equal(x.sums.KRW,316000);assert.equal(x.converted,null);assert(x.notFilled>0);
});
test('匯率先換算合計再取整，未知金額不當成免費',()=>{
 const copy=structuredClone(initial);copy.exchangeRates.KRW_TWD=.02235;let result=costSummary(copy);assert.equal(result.converted,Math.round(316000*.02235));assert(result.notFilled>10);
 copy.events.find(e=>e.id==='d2-festival').cost.items[0].unitPrice=0;assert.equal(costTotal(copy.events.find(e=>e.id==='d2-festival').cost),0);
});
test('Day 4 A/B 兩組同時活動不會判定互相時間重疊',()=>{
 const routes=getDayRoutes(initial,'2026-12-19');assert(routes.some(r=>r.from.id==='d4-busA'&&r.to.id==='d4-clinic'));assert(routes.some(r=>r.from.id==='d4-busB'&&r.to.id==='d4-aquarium'));
 const issues=getDayIssues(initial,'2026-12-19');assert(!issues.some(x=>x.text.includes('林克醫美 與 COEX 水族館')));
});
test('移動行程只更改相鄰配對，人工路段資料保留',()=>{
 const copy=structuredClone(initial);const before=getDayRoutes(copy,'2026-12-18');const key='d3-eobi=>d3-nami';const override=JSON.stringify(copy.routeOverrides[key]);
 copy.events.find(e=>e.id==='d3-nami').date='2026-12-19';const after=getDayRoutes(copy,'2026-12-18');assert(before.some(r=>r.key===key));assert(!after.some(r=>r.key===key));assert.equal(JSON.stringify(copy.routeOverrides[key]),override);
});
test('人工路段費用只在有效相鄰時納入總額',()=>{
 const copy=structuredClone(initial),key='d3-eobi=>d3-nami';
 copy.routeOverrides[key].cost={currency:'KRW',status:'estimated',items:[{id:'route-fee',label:'包車區段補價',unit:'perCar',unitPrice:25000,quantity:2}]};
 assert.equal(costSummary(copy).sums.KRW,366000);
 copy.events.find(e=>e.id==='d3-nami').date='2026-12-19';
 assert.equal(costSummary(copy).sums.KRW,316000);
 assert.equal(copy.routeOverrides[key].cost.items[0].unitPrice,25000);
});
test('ICS 匯出使用旅程當地時區與穩定行程 UID',()=>{
 const ics=createICS(initial);assert(ics.includes('TZID:Asia/Seoul'));assert(ics.includes('DTSTART;TZID=Asia/Seoul:20261216T160000'));assert(ics.includes('UID:d1-arrival@seoul-family-2026.local'));assert.equal((ics.match(/BEGIN:VEVENT/g)||[]).length,initial.events.length);assert(ics.includes('X-WR-TIMEZONE:Asia/Seoul'));
});
test('原創 SVG 日期圖示由活動資料決定，修改後更新',()=>{
 const day1=initial.events.filter(e=>e.date==='2026-12-16');assert.equal(pickDayVisual(day1),'plane');assert.equal(pickDayVisual(initial.events.filter(e=>e.date==='2026-12-17')),'palace');
 const day2=structuredClone(initial.events.filter(e=>e.date==='2026-12-17'));day2.find(e=>e.id==='d2-palace').title='動物園';day2.find(e=>e.id==='d2-palace').visualKey='generic';day2.find(e=>e.id==='d2-palace').visualPriority=1;assert.notEqual(pickDayVisual(day2),'palace');
 assert(dayArt('plane').includes('viewBox="0 0 40 30"'));assert(brandArt(initial).includes('viewBox="0 0 251 66"'));
});
test('匯入校驗拒絕重複 ID、無效時區、旅程外日期',()=>{
 const dup=structuredClone(initial);dup.events[1].id=dup.events[0].id;assert.throws(()=>validateTrip(dup));const zone=structuredClone(initial);zone.timezone='Invalid/Zone';assert.throws(()=>validateTrip(zone));const date=structuredClone(initial);date.events[0].date='2027-03-03';assert.throws(()=>validateTrip(date));
});
test('checklist 紀錄必要的安全衝突與官方來源',()=>{
 assert(initial.checks.find(c=>c.id==='check-rail').detail.includes('幼兒'));
 assert(initial.checks.find(c=>c.id==='check-lasttransport').level==='critical');
 assert(initial.checks.filter(c=>c.source.startsWith('https://')).length>=5);
});
