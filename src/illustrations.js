import {sortEvents} from './lib.js';
const INK='#3E3A39',Y='#F6D27A',P='#F2A497',B='#A8D3E6',G='#B9DAA5',V='#DED2ED';
const art={
 plane:{name:'飛機抵達／返航',body:`<path d="M3 18 18 13 19 5l4-2 2 10 12 3v4l-12 1-4 6-3-1 1-8-9 2-3 3-3-1Z" fill="white"/><path d="m10 16 9-2" stroke="${P}"/><path d="M4 9h8M2 12h7M28 7h6" stroke="${B}"/>`},
 palace:{name:'景福宮古宮',body:`<path d="M3 15 9 10h22l6 5-3 2H6Z" fill="${Y}"/><path d="M6 11 10 6h20l4 5-3 1H9Z" fill="${B}"/><path d="M8 17h24v10H8Z" fill="white"/><path d="M12 19v8M28 19v8M19 19v8"/><path d="M17 21h6v6h-6Z" fill="${P}"/><path d="M5 27h30"/>`},
 bike:{name:'江村鐵道自行車與雪松',body:`<circle cx="9" cy="23" r="5" fill="white"/><circle cx="30" cy="23" r="5" fill="white"/><path d="m9 23 8-10 5 10H9l5-6h9l7 6M17 13h-4M20 11l4-2" fill="none"/><path d="M24 11 28 5l4 6Z" fill="${G}"/><path d="M28 11v-5"/><circle cx="5" cy="4" r="1" fill="${B}"/><circle cx="10" cy="8" r="1" fill="${B}"/>`},
 pine:{name:'南怡島雪松小徑',body:`<path d="m3 23 8-17 8 17Z" fill="${G}"/><path d="m20 25 8-22 9 22Z" fill="${B}"/><path d="M11 19v9M28 21v7"/><path d="M3 18 11 4l8 14M20 16 28 2l9 14" fill="none"/><path d="M2 27h36" stroke="${P}"/><circle cx="6" cy="5" r="1.5" fill="white"/><circle cx="34" cy="8" r="1" fill="white"/>`},
 snow:{name:'魚飛冰谷冰瀑',body:`<path d="M3 8 11 4l6 7 5-6 6 2 9-3v22H3Z" fill="${B}"/><path d="M12 10v11m7-8v13m5-16v16m7-16v13" stroke="white" stroke-width="2.4"/><path d="M4 26h32"/><circle cx="5" cy="3" r="1" fill="${B}"/><circle cx="33" cy="10" r="1" fill="${B}"/>`},
 lantern:{name:'清溪川首爾燈節',body:`<path d="M4 7h32M10 7v3M30 7v3"/><path d="M4 13c2-4 10-4 12 0v8c-2 4-10 4-12 0Z" fill="${P}"/><path d="M24 13c2-4 10-4 12 0v8c-2 4-10 4-12 0Z" fill="${Y}"/><path d="M10 13v11M30 13v11M10 25v2M30 25v2"/><path d="M5 28c6-2 9-2 15 0 7-2 12-2 16 0" stroke="${B}"/>`},
 lights:{name:'冬夜燈景',body:`<path d="M4 7h32M8 7v5M20 7v5M32 7v5"/><circle cx="8" cy="16" r="5" fill="${Y}"/><circle cx="20" cy="16" r="5" fill="${P}"/><circle cx="32" cy="16" r="5" fill="${B}"/><path d="M4 27h32"/>`},
 tower:{name:'首爾樂天世界塔',body:`<path d="M15 27 17 5h7l2 22Z" fill="${B}"/><path d="M16 10h9M16 14h9M16 18h9M15 23h12"/><path d="M20 5V2"/><path d="M4 27V15h8v12M29 27V19h8v8" fill="${Y}"/><path d="M6 18h4M6 22h4M31 22h4"/><circle cx="32" cy="7" r="4" fill="${P}"/>`},
 fish:{name:'COEX 水族館',body:`<path d="M6 16c8-10 18-8 24 0-6 8-16 10-24 0l-4-6v12Z" fill="${B}"/><circle cx="23" cy="15" r="1.6" fill="${INK}" stroke="none"/><path d="M11 17c2 2 4 2 6 0" fill="none"/><circle cx="34" cy="8" r="3" fill="white"/><circle cx="35" cy="22" r="2" fill="white"/><path d="M12 6c2-2 4-2 6 0" stroke="${P}"/>`},
 hotel:{name:'東大門住宿',body:`<rect x="7" y="9" width="26" height="19" rx="2" fill="${B}"/><path d="M4 9 20 2l16 7Z" fill="${P}"/><rect x="16" y="17" width="8" height="11" rx="1" fill="white"/><path d="M10 13h4m12 0h4M4 28h32"/>`},
 food:{name:'韓式暖心料理',body:`<path d="M5 14c0 9 4 13 15 13s15-4 15-13Z" fill="${P}"/><path d="M4 14h32M13 11c-4-3-1-6 0-7M21 11c-4-3-1-6 0-7M28 11c-4-3-1-6 0-7" fill="none"/><path d="M15 21h10" stroke="white"/>`},
 building:{name:'江南街區',body:`<rect x="6" y="7" width="15" height="21" rx="1" fill="${B}"/><rect x="22" y="3" width="12" height="25" rx="1" fill="${Y}"/><path d="M10 12h6m-6 5h6m-6 5h6M26 8h4m-4 5h4m-4 5h4"/><path d="M3 28h34"/>`},
 generic:{name:'旅行散步',body:`<path d="M4 27h32"/><path d="M9 26V15l6-3 6 3v11" fill="${Y}"/><rect x="22" y="10" width="11" height="16" rx="2" fill="${B}"/><path d="M18 9V5M13 9l5-5 5 5"/><circle cx="28" cy="6" r="3" fill="${P}"/>`}
};
export function inferVisualKey(title='',category='spot'){
 const t=title.toLowerCase();
 if(/飛機|機場|起飛|返台|航班|airport/.test(t))return 'plane';
 if(/自行車|鐵道|腳踏車|rail bike/.test(t))return 'bike';
 if(/景福宮|古宮|韓服|宮殿/.test(t))return 'palace';
 if(/南怡島|島上/.test(t))return 'pine';
 if(/冰谷|冰瀑|雪/.test(t))return 'snow';
 if(/燈節|清溪川|燈會/.test(t))return 'lantern';
 if(/水族館|企鵝|海底/.test(t))return 'fish';
 if(/Seoul Sky|首爾塔|樂天世界塔|觀景/.test(t))return 'tower';
 if(/飯店|住宿|旅館/.test(t))return 'hotel';
 if(/午餐|晚餐|早餐|早午餐|美食|用餐/.test(t))return 'food';
 if(/醫美|高樓|江南/.test(t))return 'building';
 return category==='food'?'food':category==='lodging'?'hotel':'generic';
}
export function pickDayVisual(events){
 const list=sortEvents(events);
 if(!list.length)return 'generic';
 const chosen=list.map(e=>({key:e.visualKey&&art[e.visualKey]?e.visualKey:inferVisualKey(e.title,e.category),priority:e.visualPriority||({flight:90,spot:75,lodging:20,food:10,transport:15}[e.category]||10)})).sort((a,b)=>b.priority-a.priority);
 return chosen[0]?.key||'generic';
}
export function dayArt(key, title){const item=art[key]||art.generic;return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 30" role="img" aria-label="${title||item.name}" class="day-icon-vector"><title>${title||item.name}</title><g fill="none" stroke="${INK}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${item.body}</g></svg>`;}
export function brandArt(trip){
 const themes=trip.events.map(e=>e.visualKey||inferVisualKey(e.title,e.category));
 const hasPalace=themes.includes('palace'),hasTower=themes.includes('tower'),hasPine=themes.includes('pine');
 return `<svg class="brand-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 251 66" aria-hidden="true"><g fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <path d="M2 58h246" stroke-width="2" opacity=".45"/>
  ${hasPalace?`<path d="M7 32 19 26h48l13 6-5 5H12Z" fill="${B}"/><path d="M15 26 24 16h36l10 10Z" fill="${Y}"/><path d="M17 36h54v22H17Z" fill="white"/><path d="M27 41v17M58 41v17M38 42h12v16H38Z" fill="${P}"/>`:`<path d="M8 34 30 17l22 17Z" fill="${Y}"/><rect x="14" y="34" width="32" height="24" fill="white"/>`}
  <g class="brand-train"><rect x="82" y="35" width="95" height="23" rx="9" fill="${G}"/><path d="M87 46h84" stroke="white" stroke-width="2"/><rect x="95" y="39" width="23" height="12" rx="3" fill="white"/><rect x="125" y="39" width="23" height="12" rx="3" fill="white"/><circle cx="100" cy="57" r="5" fill="${INK}"/><circle cx="159" cy="57" r="5" fill="${INK}"/><path d="M79 34h77" stroke="${INK}" stroke-width="2"/></g>
  ${hasTower?`<path d="M198 58 205 13h14l7 45Z" fill="${B}"/><path d="M204 25h17M202 37h21M199 49h27M212 13V5"/>`:`<path d="M196 58V25l12-9 12 9v33Z" fill="${B}"/>`}
  ${hasPine?`<path d="m231 48 9-21 9 21Z" fill="${G}"/><path d="M240 45v13"/>`:`<circle cx="239" cy="13" r="7" fill="${Y}"/>`}
  <circle cx="184" cy="17" r="3" fill="${P}" stroke-width="1.4"/><path d="M187 25l5 4M187 10l5-2" stroke-width="1.8"/><circle cx="83" cy="14" r="2" fill="${B}"/><path d="M94 6v6m-3-3h6" stroke="${B}" stroke-width="2"/>
  </g></svg>`;
}
