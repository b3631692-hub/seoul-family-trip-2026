/* Optional online OpenStreetMap backdrop. In offline mode we show a coordinate schematic,
   never a fictitious road/route. True route geometries are rendered only if supplied. */
import {COLORS,esc} from './lib.js';
let currentMap=null;
const safeCoords=e=>Number.isFinite(Number(e.lat))&&Number.isFinite(Number(e.lng))&&e.lat!==null&&e.lng!==null;
export function disposeMap(){if(currentMap){currentMap.remove();currentMap=null;}}
export const navLink = e=>`https://map.naver.com/p/search/${encodeURIComponent(e.address||e.placeName||e.title)}`;
const uniqPlaces=events=>{const seen=new Set();return events.filter(e=>{const key=e.locationId||e.placeName||e.title;if(seen.has(key))return false;seen.add(key);return true;});};
function fallback(container,points,segments,mode,callback){
 const has=points.filter(safeCoords);
 if(!has.length){container.innerHTML=`<div class="map-blank"><div class="map-blank-icon">⌖</div><strong>尚無可定位的地點</strong><span>請在行程編輯中加入經緯度</span></div>`;return;}
 let minLat=Math.min(...has.map(e=>e.lat)),maxLat=Math.max(...has.map(e=>e.lat)),minLng=Math.min(...has.map(e=>e.lng)),maxLng=Math.max(...has.map(e=>e.lng));
 const spreadLat=Math.max(.025,maxLat-minLat),spreadLng=Math.max(.035,maxLng-minLng);
 minLat-=spreadLat*.23;maxLat+=spreadLat*.23;minLng-=spreadLng*.22;maxLng+=spreadLng*.22;
 const toXY=e=>({x:8+84*(e.lng-minLng)/(maxLng-minLng),y:9+82*(maxLat-e.lat)/(maxLat-minLat)});
 const byId=new Map(points.filter(safeCoords).map(e=>[e.id,e]));
 const lines=mode==='route'?segments.filter(s=>byId.has(s.from.id)&&byId.has(s.to.id)).map(s=>{const a=toXY(byId.get(s.from.id)),b=toXY(byId.get(s.to.id));return `<path d="M${a.x} ${a.y}L${b.x} ${b.y}" stroke="${s.mode==='walk'?'#84909E':s.mode==='subway'?'#9266C2':s.mode==='charter'?'#D77968':'#3A9B80'}" stroke-width=".75" stroke-dasharray="1.8 1.5" stroke-linecap="round" fill="none"/>`}).join(''):'';
 const dots=has.map((e,i)=>{const p=toXY(e);return `<button class="schematic-pin" type="button" style="left:${p.x}%;top:${p.y}%;--pin:${COLORS[e.category]||COLORS.spot}" data-map-id="${esc(e.id)}" aria-label="查看 ${esc(e.title)}" title="${esc(e.title)}">${i+1}</button>`}).join('');
 container.innerHTML=`<div class="schematic-bg" aria-hidden="true"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M-20 90Q15 25 50 56T120 12" fill="none" stroke="#A8D3E6" stroke-width="8" opacity=".75"/><path d="M-10 90Q15 25 50 56T120 12" fill="none" stroke="#CFEAF3" stroke-width="3" opacity=".9"/><path d="M-10 25 110 68M-10 62 110 25" stroke="#D5D5D0" stroke-width="1.5" stroke-dasharray="1 2" opacity=".5"/>${lines}</svg></div><div class="schematic-caption">位置比例示意・非實際道路／車程</div>${dots}`;
 container.querySelectorAll('[data-map-id]').forEach(el=>el.addEventListener('click',()=>{const e=has.find(e=>e.id===el.dataset.mapId);if(e)callback(e)}));
}
export function drawMap(container,dayEvents,segments,mode,onSelect,trip){
 disposeMap();const places=uniqPlaces(dayEvents.filter(e=>e.group!=='optional'));
 if(!container)return;
 if(!window.L){fallback(container,places,segments,mode,onSelect);return;}
 container.innerHTML='';try{
  const L=window.L;currentMap=L.map(container,{zoomControl:false,scrollWheelZoom:false,attributionControl:true,preferCanvas:true});
  L.tileLayer(trip.mapTileUrl||'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap contributors'}).addTo(currentMap);
  L.control.zoom({position:'bottomright'}).addTo(currentMap);
  const ll=[];places.forEach((e,i)=>{if(!safeCoords(e))return;const latlng=[e.lat,e.lng],color=COLORS[e.category]||COLORS.spot;ll.push(latlng);
   const marker=L.marker(latlng,{icon:L.divIcon({className:'map-pin-wrap',html:`<span class="map-pin" style="--pin:${color}">${i+1}</span>`,iconSize:[33,37],iconAnchor:[16,35]})}).addTo(currentMap);
   marker.bindPopup(`<strong>${esc(e.title)}</strong><div class="popup-memo">${esc(e.placeName||'')}</div>`);
   marker.on('click',()=>onSelect(e));
  });
  if(mode==='route')for(const s of segments){if(!safeCoords(s.from)||!safeCoords(s.to))continue;
    const original=trip.routeOverrides?.[s.key];if(Array.isArray(original?.geometry)&&original.geometry.length>1){L.polyline(original.geometry.map(p=>[p[1],p[0]]),{color:'#4678C5',weight:4,opacity:.8}).addTo(currentMap);}
    else L.polyline([[s.from.lat,s.from.lng],[s.to.lat,s.to.lng]],{color:s.mode==='walk'?'#84909E':s.mode==='charter'?'#D77968':'#3A9B80',weight:3,dashArray:'6 9',opacity:.67}).addTo(currentMap);
  }
  if(ll.length>1)currentMap.fitBounds(ll,{padding:[30,35],maxZoom:13});else if(ll.length)currentMap.setView(ll[0],12);else currentMap.setView([37.568,126.998],11);
  setTimeout(()=>{try{currentMap?.invalidateSize();}catch{}},60);
 }catch(err){console.warn('地圖底圖載入未完成；顯示示意圖',err);disposeMap();fallback(container,places,segments,mode,onSelect);}
}
