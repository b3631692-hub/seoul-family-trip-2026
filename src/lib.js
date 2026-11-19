/* Pure trip/data functions. The UI never owns itinerary facts. */
export const COLORS = {spot:'#F6D27A',food:'#F2A497',lodging:'#A8D3E6',transport:'#B9DAA5',flight:'#B9DAA5',other:'#DED2ED'};
export const CATEGORY_LABELS = {spot:'景點活動',food:'餐飲',lodging:'住宿',transport:'交通',flight:'航班',other:'其他'};
export const GROUP_LABELS = {all:'全團',A:'A 組',B:'B 組',optional:'自選'};
export const TRANSPORT_LABELS = {walk:'步行',subway:'地鐵',train:'火車',shinkansen:'高鐵',bus:'公車',charter:'包車',taxi:'計程車',car:'自駕',plane:'航班',unknown:'未指定'};
export const STATUS_LABELS = {verified:'已查證',estimated:'估算',scenario:'情境試算',unknown:'待估／未填'};
export const PACK_COLORS = ['#F6D27A','#A8D3E6','#F2A497','#B9DAA5','#DED2ED','#F4C7AA'];
export const WEEKDAYS = ['日','一','二','三','四','五','六'];
export const esc = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const num = x => new Intl.NumberFormat('zh-TW',{maximumFractionDigits:2}).format(Number(x)||0);
export const money = (n,c='KRW') => n===null || n===undefined || !Number.isFinite(Number(n)) ? '待填' : (c==='KRW'?'₩':c==='TWD'?'NT$':`${c} `)+new Intl.NumberFormat('zh-TW',{maximumFractionDigits:c==='KRW'||c==='TWD'?0:2}).format(Number(n));
export const timeMin = s=> {if(!/^\d{2}:\d{2}$/.test(String(s))) return NaN;const [h,m]=s.split(':').map(Number);return h<24&&m<60?h*60+m:NaN;};
export const minuteTime = n=>{let x=((Math.round(n)%1440)+1440)%1440;return String(Math.floor(x/60)).padStart(2,'0')+':'+String(x%60).padStart(2,'0');};
export const durationText = minutes => { const m=Number(minutes)||0;return m<60?`${m} 分鐘`:m%60===0?`${m/60} 小時`:`${Math.floor(m/60)} 小時 ${m%60} 分`; };
export const sortEvents = es => [...es].sort((a,b)=>a.date.localeCompare(b.date)||timeMin(a.start)-timeMin(b.start)||a.id.localeCompare(b.id));
export const dateRange = (start,end) => { const list=[];const a=Date.parse(start+'T00:00:00Z'),b=Date.parse(end+'T00:00:00Z');if(!/^\d{4}-\d{2}-\d{2}$/.test(start)||!/^\d{4}-\d{2}-\d{2}$/.test(end)||!Number.isFinite(a)||!Number.isFinite(b)||new Date(a).toISOString().slice(0,10)!==start||new Date(b).toISOString().slice(0,10)!==end||b<a||b-a>86400000*100)return list;for(let t=a;t<=b;t+=86400000)list.push(new Date(t).toISOString().slice(0,10));return list;};
export const dateLabel = (date,full=false) => {const [y,m,d]=date.split('-').map(Number);const w=WEEKDAYS[new Date(Date.UTC(y,m-1,d)).getUTCDay()];return full?`${m} 月 ${d} 日（週${w}）`:`${m}/${d} 週${w}`;};
export const dayIndex = (trip,date) => dateRange(trip.startDate,trip.endDate).indexOf(date);
export const endMinute = e=>timeMin(e.start)+Number(e.durationMinutes);
export const costEntries = c => (c?.items||[]).filter(line=>line.unitPrice!==null && line.unitPrice!==undefined && line.unitPrice!=='' && Number.isFinite(Number(line.unitPrice)) && Number.isFinite(Number(line.quantity)));
export const costTotal = c => {if(!c || !Array.isArray(c.items) || !c.items.length)return null;const valid=costEntries(c);return valid.length===c.items.length ? valid.reduce((s,x)=>s+Number(x.unitPrice)*Number(x.quantity),0):null;};
export const costSummary = trip=>{
 const sums={};let complete=0,notFilled=0,estimates=0,verified=0;
 for(const ev of trip.events){const total=costTotal(ev.cost);if(total===null){notFilled++;continue;}const currency=ev.cost.currency||trip.currency;sums[currency]=(sums[currency]||0)+total;complete++;if(ev.cost.status==='verified')verified++;else estimates++;}
 const activeKeys=new Set(dateRange(trip.startDate,trip.endDate).flatMap(d=>getDayRoutes(trip,d).map(r=>r.key)));const routes=Object.entries(trip.routeOverrides||{}).filter(([key])=>activeKeys.has(key)).map(([,r])=>r);for(const r of routes){const total=costTotal(r.cost);if(total!==null){const currency=r.cost.currency||trip.currency;sums[currency]=(sums[currency]||0)+total;complete++;if(r.cost.status==='verified')verified++;else estimates++;}}
 const rate=Number(trip.exchangeRates?.KRW_TWD);const rateOK=trip.exchangeRates?.KRW_TWD!==null&&trip.exchangeRates?.KRW_TWD!==''&&Number.isFinite(rate)&&rate>0;
 const unknownCurrency=Object.keys(sums).filter(c=>!['KRW','TWD'].includes(c) && sums[c]!==0);
 const converted= rateOK && unknownCurrency.length===0 ? Math.round((sums.KRW||0)*rate+(sums.TWD||0)) : !((sums.KRW||0)>0) && unknownCurrency.length===0 ? Math.round(sums.TWD||0) : null;
 return {sums,complete,notFilled,estimates,verified,converted,rateOK,rate:rateOK?rate:null,unknownCurrency};
};
export const costComposition = trip => {
 const out={};for(const e of trip.events){const val=costTotal(e.cost);if(val===null)continue;const c=e.cost.currency||trip.currency;if(c!=='KRW'&&c!=='TWD')continue;if(c==='TWD'&&!(Number(trip.exchangeRates?.KRW_TWD)>0))continue;const rate=c==='TWD'?1:Number(trip.exchangeRates?.KRW_TWD);if(c==='KRW'&&(!(rate>0))) {out[e.category]=(out[e.category]||0)+val;continue;}out[e.category]=(out[e.category]||0)+(val*rate);}
 for(const day of dateRange(trip.startDate,trip.endDate)){for(const route of getDayRoutes(trip,day)){const c=route.cost,val=costTotal(c);if(val===null)continue;const currency=c.currency||trip.currency;if(currency!=='KRW'&&currency!=='TWD')continue;if(currency==='TWD'&&!(Number(trip.exchangeRates?.KRW_TWD)>0))continue;const rate=currency==='TWD'?1:Number(trip.exchangeRates?.KRW_TWD);out.transport=(out.transport||0)+(currency==='KRW'&&!(rate>0)?val:val*rate);}}
 return out;
};
export const eventsForDate = (trip,date) => sortEvents(trip.events.filter(e=>e.date===date));
export function getDayRoutes(trip,date){
 const events=eventsForDate(trip,date).filter(e=>e.group!=='optional');
 const groups=events.some(e=>e.group==='A'||e.group==='B')?['A','B']:['all'];
 const edges=[];const seen=new Set();
 for(const g of groups){const seq=events.filter(e=>e.group==='all'||e.group===g);
  for(let i=0;i<seq.length-1;i++){
   const from=seq[i],to=seq[i+1],key=`${from.id}=>${to.id}`;
   if(seen.has(key))continue;seen.add(key);
   const override=trip.routeOverrides?.[key];const samePlace=(from.locationId&&from.locationId===to.locationId)||(from.address&&from.address===to.address);
   const mode=override?.mode||(samePlace?'walk':'unknown');
   edges.push({key,from,to,group:g,mode,minutes:override?.minutes??(samePlace?0:null),status:override?.status||(samePlace?'estimated':'unknown'),cost:override?.cost||{currency:trip.currency,items:[],status:'unknown'},notes:override?.notes||'',gap:timeMin(to.start)-endMinute(from),samePlace});
  }
 }
 return edges.sort((a,b)=>timeMin(a.from.start)-timeMin(b.from.start)||a.key.localeCompare(b.key));
}
export function getDayIssues(trip,date){
 const warnings=[];const unique=new Set();
 for(const r of getDayRoutes(trip,date)){
  let type='',msg='';
  if(r.gap<0){type='danger';msg=`${r.from.title} 與 ${r.to.title} 重疊 ${Math.abs(r.gap)} 分鐘`}
  else if(r.minutes!==null && r.minutes>r.gap){type='danger';msg=`${r.to.title}：預留 ${r.gap} 分，交通估 ${r.minutes} 分，可能遲到 ${r.minutes-r.gap} 分`}
  else if(r.minutes===null && r.gap<30 && !r.samePlace){type='warning';msg=`${r.from.title} → ${r.to.title}：交通未估，僅有 ${r.gap} 分鐘空檔`}
  if(type&& !unique.has(msg)){unique.add(msg);warnings.push({type,text:msg,key:r.key});}
 }
 return warnings;
}
export function getTripIssues(trip){return dateRange(trip.startDate,trip.endDate).flatMap(d=>getDayIssues(trip,d).map(x=>({...x,date:d})));}
export const makeUid = (prefix='evt') => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
export function validateTrip(x){
 if(!x||typeof x!=='object'||x.schemaVersion!==1||!Array.isArray(x.events)||!Array.isArray(x.packing)||typeof x.startDate!=='string'||typeof x.endDate!=='string'||!Array.isArray(dateRange(x.startDate,x.endDate)))throw Error('JSON 格式不是支援的旅程版本。');
 if(!dateRange(x.startDate,x.endDate).length)throw Error('旅程日期範圍錯誤。');
 if(!x.timezone||!x.currency||!x.settlementCurrency)throw Error('缺少時區或幣別設定。');
 try{new Intl.DateTimeFormat('en',{timeZone:x.timezone});}catch{throw Error('旅程時區不是有效的 IANA 時區。');}
 const ids=new Set();for(const e of x.events){if(!e.id||ids.has(e.id)||!/^\d{4}-\d{2}-\d{2}$/.test(e.date)||!Number.isFinite(timeMin(e.start))||!Number.isInteger(Number(e.durationMinutes))||e.durationMinutes<=0||!e.title)throw Error(`行程資料無效或 ID 重複：${e.id||'（無 ID）'}`);ids.add(e.id);if(!dateRange(x.startDate,x.endDate).includes(e.date))throw Error(`${e.title} 的日期不在旅程內。`);}
 const clean=structuredClone(x);clean.routeOverrides ||= {};clean.exchangeRates ||= {};clean.checks ||= [];clean.travellers ||= {adults:0,children:[]};clean.dayHours ||= {start:'07:00',end:'22:00'};clean.destination ||= '';clean.name ||= '我的旅行手帖';clean.events=clean.events.map(e=>({...e,category:e.category||'other',group:e.group||'all',bookingStatus:e.bookingStatus||'unverified',locked:Boolean(e.locked),cost:{currency:e.cost?.currency||clean.currency,status:e.cost?.status||'unknown',items:Array.isArray(e.cost?.items)?e.cost.items:[]}}));clean.packing=clean.packing.map(p=>({...p,checked:Boolean(p.checked),notes:p.notes||'',quantity:p.quantity||1}));return clean;
}
export function pruneRoutes(trip){const ids=new Set(trip.events.map(e=>e.id));for(const k of Object.keys(trip.routeOverrides||{})){const [a,b]=k.split('=>');if(!ids.has(a)||!ids.has(b))delete trip.routeOverrides[k];}}
export const download = (text,name,type='application/json;charset=utf-8') => {const blob=new Blob([text],{type}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);};
function icsEsc(s){return String(s??'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');}
function icsStamp(s){return s.replace(/[-:]/g,'')+'00';}
function shifted(date,time,duration){const ts=Date.parse(date+'T'+time+':00Z')+duration*60000;return new Date(ts).toISOString().slice(0,16);}
function icsFold(s){let out='';for(const row of s.split('\r\n')){let rest=row;while(new TextEncoder().encode(rest).length>74){let len=0,i=0;for(const c of rest){let bytes=new TextEncoder().encode(c).length;if(len+bytes>72)break;len+=bytes;i+=c.length;}out+=rest.slice(0,i)+'\r\n ';rest=rest.slice(i);}out+=rest+'\r\n';}return out;}
export function createICS(trip){
 const zone=icsEsc(trip.timezone),ts=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');let rows=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Trip Notebook//TW//ZH-HANT','CALSCALE:GREGORIAN','METHOD:PUBLISH',`X-WR-CALNAME:${icsEsc(trip.name)}`,`X-WR-TIMEZONE:${zone}`];
 if(trip.timezone==='Asia/Seoul') rows.push('BEGIN:VTIMEZONE','TZID:Asia/Seoul','BEGIN:STANDARD','DTSTART:19700101T000000','TZOFFSETFROM:+0900','TZOFFSETTO:+0900','TZNAME:KST','END:STANDARD','END:VTIMEZONE');
 for(const e of sortEvents(trip.events)){
  const start=e.date+'T'+e.start;const end=shifted(e.date,e.start,e.durationMinutes);const details=[e.notes||'',e.group&&e.group!=='all'?`分組：${GROUP_LABELS[e.group]||e.group}`:'',e.locked?'已確認時段':'時間待確認',e.sourceUrl||''].filter(Boolean).join('\n');
  rows.push('BEGIN:VEVENT',`UID:${e.id}@${trip.id||'trip-notebook'}.local`,`DTSTAMP:${ts}`,`DTSTART;TZID=${zone}:${icsStamp(start)}`,`DTEND;TZID=${zone}:${icsStamp(end)}`,`SUMMARY:${icsEsc(e.title)}`,`LOCATION:${icsEsc(e.address||e.placeName||'')}`,`DESCRIPTION:${icsEsc(details)}`,'END:VEVENT');
 }
 rows.push('END:VCALENDAR');return icsFold(rows.join('\r\n'));
}
