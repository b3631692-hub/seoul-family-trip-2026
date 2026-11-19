/* Non-browser DOM rendering smoke test for environments with restricted Chromium policies.
   It exercises the real JS template functions, but is NOT a visual browser test. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const seed=JSON.parse(readFileSync(new URL('../data/seoul2026.json',import.meta.url),'utf8'));
class FakeEl{
 constructor(id=''){this.id=id;this.innerHTML='';this.textContent='';this.hidden=false;this.isConnected=false;this.value='';this.attributes={};this.dataset={};this.classList={toggle(){},add(){},remove(){}};}
 setAttribute(k,v){this.attributes[k]=v}
 removeAttribute(k){delete this.attributes[k]}
 getAttribute(k){return this.attributes[k]||'false'}
 addEventListener(){}
 focus(){}
}
const el=new Map();const get=k=>{if(!el.has(k))el.set(k,new FakeEl(k));return el.get(k)};
const listeners={};const tabs=['planning','expenses','packing'].map(page=>{const x=new FakeEl();x.dataset.page=page;return x;});
globalThis.document={activeElement:null,addEventListener:(type,fn)=>listeners[type]=fn,querySelector(s){if(s==='#timelineCards'||s==='#weekScroller'||s==='#dayTimeScale'||s==='#scaleNow'||s==='#scaleFocus'||s==='#modalBackdrop .modal-x'||s==='#dateThumb')return null;return get(s)},querySelectorAll(s){if(s==='.tab-button')return tabs;return []}};
const viewportWidth=process.argv.includes('--mobile')?390:Number(process.env.WIDTH||1440);
globalThis.window={innerWidth:viewportWidth,addEventListener(){},matchMedia(){return {matches:false}},L:null};
globalThis.localStorage={getItem:()=>null,setItem(){}};
globalThis.fetch=async()=>({ok:true,json:async()=>structuredClone(seed)});
globalThis.requestAnimationFrame=callback=>setTimeout(callback,0);
globalThis.setInterval=()=>0;
globalThis.confirm=()=>true;
await import('../src/app.js');await new Promise(resolve=>setTimeout(resolve,80));
assert(get('#appMain').innerHTML.includes('id="workspace"'));
assert(get('#appMain').innerHTML.includes(viewportWidth<=700?'timeline-cards':'week-grid'));
assert(get('#appMain').innerHTML.includes(viewportWidth<=700?'d1-bus':'d4-aquarium'));
assert.equal(get('#tripDays').textContent,'5 天');
function action(act,rest={}){const target={closest:(s)=>s==='[data-page]'?null:s==='[data-action]'?{dataset:{action:act,...rest}}:null};listeners.click({target});}
function goPage(page){const target={closest:(s)=>s==='[data-page]'?{dataset:{page}}:null};listeners.click({target});}
action('view',{view:'day'});assert(get('#appMain').innerHTML.includes('timeline-cards'));
assert(get('#appMain').innerHTML.includes('d1-bus'));
action('select-date',{date:'2026-12-17'});assert(get('#appMain').innerHTML.includes('清溪川首爾燈節'));
goPage('expenses');assert(get('#appMain').innerHTML.includes('expense-totals'));
assert(get('#appMain').innerHTML.includes('韓元 KRW 已知金額'));
goPage('packing');assert(get('#appMain').innerHTML.includes('pack-summary'));
assert(get('#appMain').innerHTML.includes('護照正本'));
action('add-pack');assert(get('#modalRoot').innerHTML.includes('id="packForm"'));
action('trip-settings');assert(get('#modalRoot').innerHTML.includes('id="tripSettingsForm"'));
console.log('DOM 模板冒煙測試通過：週視圖、單日時軸、日期切換、費用、用品、表單與旅程設定。');
