const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const lnk=u=>/^https?:\/\//i.test(u||"")?esc(u):"#";
const Store=(()=>{
const F=window.FB_CONFIG;
const D={name:"Daily Avenue",tag:"News, education and opportunities",cats:["News","Articles","Business","Tech","GES Files","NTC Updates","Jobs & Scholarships"],ticker:true,color:"#0e5a3c",accent:"#f2b705",wa:"",fb:"",yt:"",ad:"",foot:"\u00a9 2026 Daily Avenue. All rights reserved.",about:"Daily Avenue publishes news, articles and opportunities."};
let db,au,rdy;
const js=u=>new Promise((r,j)=>{const s=document.createElement("script");s.src=u;s.onload=r;s.onerror=j;document.head.append(s)});
const init=()=>rdy||(rdy=F?(async()=>{const b="https://www.gstatic.com/firebasejs/10.12.2/firebase-";await js(b+"app-compat.js");await Promise.all([js(b+"auth-compat.js"),js(b+"firestore-compat.js")]);firebase.initializeApp(F);db=firebase.firestore();au=firebase.auth()})():Promise.resolve());
const need=()=>{if(!F)throw Error("Firebase is not connected yet. See README.md")};
return{live:!!F,init,
async cfg(){await init();if(!F)return D;const d=await db.doc("site/settings").get();return{...D,...(d.data()||{})}},
async setCfg(o){await init();need();await db.doc("site/settings").set(o)},
async posts(){await init();if(!F)return[];return(await db.collection("posts").get()).docs.map(d=>({...d.data(),id:d.id}))},
async put(p){await init();need();return db.collection("posts").doc(p.id).set(p)},
async del(id){await init();need();return db.collection("posts").doc(id).delete()},
async who(){await init();if(!F)return null;return new Promise(r=>au.onAuthStateChanged(u=>r(u&&u.email)))},
async login(u,p){await init();need();await au.signInWithEmailAndPassword(u,p);return true},
async out(){await init();if(F)await au.signOut()}}})();
