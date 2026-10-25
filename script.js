(async()=>{
const $=s=>document.querySelector(s),enc=encodeURIComponent;
await Store.init();const C=await Store.cfg();
document.documentElement.style.setProperty("--g",C.color);document.documentElement.style.setProperty("--y",C.accent);
const all=(await Store.posts()).filter(p=>p.status=="published").sort((a,b)=>b.date-a.date);
const ago=t=>{const m=(Date.now()-t)/6e4|0;return m<1?"just now":m<60?m+" min ago":m<1440?(m/60|0)+" hours ago":(m/1440|0)+" days ago"};
const th=(p,i)=>`<div class="th" style="--a:${120+i*23}deg">${p.img?`<img src="${esc(p.img)}" alt="" loading="lazy">`:""}</div>`;
const fr=(p,i)=>`<a class="fr" href="#/p/${p.id}">${th(p,i)}<div><span class="cat">${esc(p.cat)}</span><h4>${esc(p.title)}</h4><small>${ago(p.date)}</small><p>${esc(p.excerpt)}</p></div></a>`;
const cap=(p,t)=>`<div class="cap"><span class="cat">${esc(p.cat)}</span><${t}>${esc(p.title)}</${t}><small>${ago(p.date)}</small></div>`;
const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2400)};
document.title=C.name;$("#logo").innerHTML=`<i>${esc(C.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase())}</i><span>${esc(C.name)}</span>`;
$("#date").textContent=new Date().toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
$(".top .brk").hidden=!C.ticker||!all.length;
$("#tick").innerHTML=all.slice(0,8).map(p=>`<a href="#/p/${p.id}">${esc(p.title)}</a>`).join("");
const wa=C.wa?"https://wa.me/"+C.wa.replace(/\D/g,""):"";
$("#links").innerHTML=`<li><a href="#/">Home</a></li>`+C.cats.map(c=>`<li><a href="#/c/${enc(c)}">${esc(c)}</a></li>`).join("")+`<li><a href="#/about">About Us</a></li>`+(wa?`<li><a href="${wa}" target="_blank" rel="noopener">Contact Us</a></li>`:"");
$("#foot").innerHTML=`<div>${esc(C.foot)}</div><nav><a href="#/">Home</a><a href="#/about">About Us</a>${C.fb?`<a href="${lnk(C.fb)}" target="_blank" rel="noopener">Facebook</a>`:""}${C.yt?`<a href="${lnk(C.yt)}" target="_blank" rel="noopener">YouTube</a>`:""}<a href="admin.html">Admin</a></nav>`;
const side=()=>`<aside>${C.ad?`<a class="ad" href="${lnk(C.ad)}" target="_blank" rel="noopener">ADVERTISEMENT<br>Place your ad here</a>`:""}<div class="box"><h3>Categories</h3><ul>${C.cats.map(c=>`<li><a href="#/c/${enc(c)}">${esc(c)}</a><span>${all.filter(p=>p.cat==c).length}</span></li>`).join("")}</ul></div>${C.fb?`<a class="fb" href="${lnk(C.fb)}" target="_blank" rel="noopener">Follow ${esc(C.name)}<br>on Facebook</a>`:""}</aside>`;
let shown=6;
function view(){let h="";try{h=decodeURIComponent(location.hash.slice(1))}catch(e){}
const[,t,...r]=h.split("/"),a=r.join("/"),m=$("#main");scrollTo(0,0);document.title=C.name;$("#links").classList.remove("open");
document.querySelectorAll("#links a").forEach(x=>x.classList.toggle("on",x.getAttribute("href")==="#/"+(t?t+"/"+enc(a):"")||(!t&&x.getAttribute("href")==="#/")));
if(t=="p"){const p=all.find(x=>x.id==a);if(!p){m.innerHTML=`<p class="empty">Post not found. <a href="#/">Back to home</a></p>`;return}
document.title=p.title+" | "+C.name;
m.innerHTML=`<div class="cols"><article class="post"><span class="cat">${esc(p.cat)}</span><h1>${esc(p.title)}</h1><small>${esc(p.author||C.name)}, ${ago(p.date)}</small>${p.img?`<img class="hi" src="${esc(p.img)}" alt="">`:""}${esc(p.body||p.excerpt).split(/\n+/).map(x=>`<p>${x}</p>`).join("")}${p.file?`<a class="btn" href="${lnk(p.file)}" target="_blank" rel="noopener">Download file</a>`:""}<div class="share"><a class="btn s" target="_blank" rel="noopener" href="https://wa.me/?text=${enc(p.title+" "+location.href)}">Share on WhatsApp</a><a class="btn s" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=${enc(location.href)}">Share on Facebook</a><button class="btn s o" id="cp">Copy link</button></div></article>${side()}</div>`;
$("#cp").onclick=()=>navigator.clipboard.writeText(location.href).then(()=>toast("Link copied"),()=>toast("Copy failed"))}
else if(t=="c"||t=="s"){const s=a.toLowerCase(),l=t=="c"?all.filter(p=>p.cat==a):all.filter(p=>(p.title+" "+p.excerpt+" "+p.cat).toLowerCase().includes(s));
m.innerHTML=`<div class="cols"><main><h2 class="logo" style="margin:18px 0 8px;font-size:24px">${t=="c"?esc(a):"Search: "+esc(a)}</h2>${l.length?l.map(fr).join(""):'<p class="empty">No posts found.</p>'}</main>${side()}</div>`}
else if(t=="about")m.innerHTML=`<div class="cols"><article class="post"><h1>About ${esc(C.name)}</h1>${esc(C.about).split(/\n+/).map(x=>`<p>${x}</p>`).join("")}</article>${side()}</div>`;
else{if(!all.length){m.innerHTML=`<p class="empty">No posts yet. Publish your first story from <a href="admin.html">the admin dashboard</a>.</p>`;return}
const f=all.find(p=>p.featured)||all[0],rest=all.filter(p=>p!=f),feed=rest.slice(2);
m.innerHTML=`<section class="hero"><a class="slide" href="#/p/${f.id}">${th(f,0)}${cap(f,"h2")}</a><div class="s2">${rest.slice(0,2).map((p,i)=>`<a class="tile" href="#/p/${p.id}">${th(p,i+1)}${cap(p,"h3")}</a>`).join("")}</div></section><div class="cols"><main><h2 class="logo" style="font-size:22px">Latest news</h2><div id="feed"></div><div style="text-align:center;margin:16px 0"><button class="btn" id="more"></button></div></main>${side()}</div>`;
const draw=()=>{$("#feed").innerHTML=feed.slice(0,shown).map((p,i)=>fr(p,i+3)).join("")||'<p class="empty">More stories coming soon.</p>';const b=$("#more"),d=shown>=feed.length;b.disabled=d;b.textContent=d?"No more posts":"Load More";b.hidden=!feed.length};
$("#more").onclick=()=>{shown+=6;draw()};draw()}}
addEventListener("hashchange",view);view();
$("#sf").onsubmit=e=>{e.preventDefault();const v=$("#q").value.trim();if(v)location.hash="#/s/"+enc(v)};
$("#bg").onclick=()=>$("#links").classList.toggle("open");
$("#th").onclick=()=>{const r=document.documentElement,d=(r.dataset.theme||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"))=="dark";r.dataset.theme=d?"light":"dark"};
$("#up").onclick=()=>scrollTo({top:0,behavior:"smooth"});
addEventListener("scroll",()=>$("#up").classList.toggle("show",scrollY>600),{passive:true});
})();
