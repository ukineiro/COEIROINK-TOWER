// 自動生成（書き出しのたびに作り直されます）。編集しないでください。
const BUILD = "sha256-d1f8d66dc3ca01d1f1bb1a5607f27a797518db65bae7ec2ab2c2efb28d0f16b3";
const PREFIX = 'ashbound:' + new URL(self.registration.scope).pathname + ':';   // 同じサイトに別のゲームがあっても、保存領域が混ざらないように、場所ごとに分ける
const CACHE = PREFIX + BUILD;
const FILES = {"core":["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png"],"assets":["assets/a_az7lx5ey.png","assets/a_jmxqyg02.png","assets/a_dgab6e3b.png","assets/a_soomswr2.png","assets/a_b1zbl3mh.png","assets/a_eozqekmv.png","assets/a_vjirafhx.png","assets/a_ey8uiiu3.png","assets/a_u893biwq.png","assets/a_neuzxkdr.png","assets/a_rdrmvavo.png","assets/a_m99wdd5g.png","assets/a_dn6wa42c.wav","assets/a_dmv1wnw2.wav","assets/a_jywr55dn.wav","assets/a_6eyz5kd3.wav","assets/a_82u0huwi.wav","assets/a_qxtvmi8q.wav","assets/a_5kjqn0gb.wav","assets/a_e1sv57ry.wav","assets/a_pqy9g889.wav","assets/a_bpy7qfq3.wav","assets/a_3tb39pe3.wav","assets/a_34imxvru.wav","assets/a_akdbrdbq.wav","assets/a_cbjew5oo.wav","assets/a_hhph3fpq.wav","assets/a_chm69jul.wav"]};
self.addEventListener('install', e=>{
  e.waitUntil((async()=>{
    const c = await caches.open(CACHE);
    // 本体は必ず入れる。素材は、1つ失敗しても、ほかは入れる
    await c.addAll(FILES.core.map(u=>new Request(u,{cache:'reload'})));
    for(const u of FILES.assets){ try{ await c.add(new Request(u,{cache:'reload'})); }catch(_){} }
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', e=>{
  e.waitUntil((async()=>{
    for(const k of await caches.keys()) if(k.startsWith(PREFIX) && k!==CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});
async function ranged(req, res){   // 音声など、Rangeつきの要求（Safariなど）に、保存した全体から答える
  const m = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range')||''); if(!m) return res;
  const buf = await res.arrayBuffer(), n = buf.byteLength;
  let a = m[1]==='' ? Math.max(0, n-Number(m[2])) : Number(m[1]), b = (m[1]==='' || m[2]==='') ? n-1 : Math.min(n-1, Number(m[2]));
  if(!(a<=b) || a>=n) return new Response(null, {status:416, headers:{'Content-Range':'bytes */'+n}});
  return new Response(buf.slice(a,b+1), {status:206, headers:{'Content-Type':res.headers.get('Content-Type')||'application/octet-stream','Content-Range':'bytes '+a+'-'+b+'/'+n,'Content-Length':String(b-a+1)}});
}
self.addEventListener('fetch', e=>{
  const req = e.request, url = new URL(req.url);
  if(req.method!=='GET' || url.origin!==location.origin) return;
  e.respondWith((async()=>{
    const c = await caches.open(CACHE);
    let hit = await c.match(req, {ignoreSearch:true});
    if(!hit && req.mode==='navigate') hit = await c.match('index.html');
    if(hit) return req.headers.has('range') ? ranged(req, hit) : hit;
    try{ return await fetch(req); }catch(err){ return new Response('オフラインです。', {status:503, headers:{'Content-Type':'text/plain; charset=utf-8'}}); }
  })());
});
