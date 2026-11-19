/** Zero-dependency local server. Defaults to 127.0.0.1 for privacy. */
import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,dirname,extname,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=dirname(fileURLToPath(import.meta.url));
const PORT=Number(process.env.PORT||4173);
const TYPES={'.html':'text/html;charset=utf-8','.js':'text/javascript;charset=utf-8','.css':'text/css;charset=utf-8','.json':'application/json;charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.txt':'text/plain;charset=utf-8'};
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url||'/',`http://localhost:${PORT}`);
  const pathname=decodeURIComponent(url.pathname);
  const relative=pathname==='/'?'index.html':pathname.replace(/^\/+/, '');
  const target=resolve(ROOT,relative);
  if(!target.startsWith(ROOT+sep)){res.writeHead(403);res.end('Forbidden');return;}
  const st=await stat(target);if(!st.isFile())throw new Error('not a file');
  const bytes=await readFile(target);
  res.writeHead(200,{'Content-Type':TYPES[extname(target)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  if(req.method==='HEAD')res.end();else res.end(bytes);
 }catch(err){res.writeHead(404,{'Content-Type':'text/plain;charset=utf-8'});res.end('找不到檔案 / Not found');}
});
server.listen(PORT,'127.0.0.1',()=>console.log(`首爾旅行手帖已啟動：http://localhost:${PORT}`));
