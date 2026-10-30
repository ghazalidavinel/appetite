const $=s=>document.querySelector(s),A=f=>`assets/${f}`;
const c=(x,y,r)=>`M${x-r} ${y}a${r} ${r} 0 1 0 ${2*r} 0a${r} ${r} 0 1 0-${2*r} 0`;
const P={home:'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',search:c(11,11,7)+'m20 20-4-4',plus:'M12 5v14M5 12h14',
users:c(9,8,3.5)+'M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6'+c(17,9,2.5)+'M17 14c2.8 0 4.5 2 4.5 5',user:c(12,8,4)+'M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7',
send:'M21 3 10 14M21 3l-7 18-4-7-7-4z',bell:'M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4',
heart:'M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z',msg:'M4 5h16v11H9l-5 4z',share:'M4 12 14 4v5c6 0 7 5 6 9-2-3-4-4-6-4v5z',
mark:'M6 3h12v18l-6-4-6 4z',star:'m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',dots:c(5,12,1.3)+c(12,12,1.3)+c(19,12,1.3),
gear:'M12 3l1.5 2.2 2.6-.5.9 2.5 2.5.9-.5 2.6L21 12l-2.2 1.5.5 2.6-2.5.9-.9 2.5-2.6-.5L12 21l-1.5-2.2-2.6.5-.9-2.5-2.5-.9.5-2.6L3 12l2.2-1.5-.5-2.6 2.5-.9.9-2.5 2.6.5z'+c(12,12,3),
map:'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14',chev:'m9 6 6 6-6 6',pin:'M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z'+c(12,10,2),
clock:c(12,12,9)+'M12 7v5l3 2',sun:c(12,12,4)+'M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2',
check:c(12,12,9)+'m8 12 3 3 5-6',circ:c(12,12,9),filter:'M4 7h16M7 12h10M10 17h4',expand:'M4 20l6-6M4 20v-5M4 20h5M20 4l-6 6M20 4v5M20 4h-5',
fork:'M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 21V3c-2.5 1.5-3 4-3 7v4h3',store:'M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0A2.7 2.7 0 0 0 20 9M10 20v-5h4v5',
tag:'M3 12V3h9l9 9-9 9z'+c(7.5,7.5,1.2),cal:'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',up:'M12 20V6M6 12l6-6 6 6'};
const I=(n,s=18,f)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${f?'currentColor':'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${P[n]}"/></svg>`;

/* ---------- mock data (from MockData.swift) ---------- */
const U=[['u14','bighbigh','avatar_bighbigh.jpg'],['u15','elenlen','avatar_elenlen.jpg'],['u16','konhokenyang','avatar_konhokenyang.jpg'],['u17','davinvin','avatar_davinvin.jpg'],['u2','rayaruy','avatar_rayaruy.jpg']];
const ME=['u1','appetite','avatar_appetite.png'];
const CAT={cafe:'Coffee Shop',restaurant:'Restaurant',street:'Street Food'};
const PL=[['Giyanti Coffee Roastery','cafe','$$',4.6,92,'place_mango.jpg'],['Expat. Roasters','cafe','$$',4.5,88,'place_kitchenette.jpg'],['The Acre','cafe','$$',4.4,81,'place_tokyo2100.jpg'],
['Plataran Menteng','restaurant','$$$',4.7,85,'place_ramen.jpg'],['Lara Djonggrang','restaurant','$$$',4.6,79,'place_nasilemak.jpg'],['Jalan Sabang','street','$',4.4,83,'place_pepperlunch.jpg'],
['Wood-Fired Pizza House','restaurant','$$',4.6,86,'food_pizza_walnut.jpg'],['Dumpling & Noodle House','restaurant','$',4.4,82,'food_dumpling_soup.jpg'],['Jogoya Buffet','restaurant','$$$',4.5,78,'food_jogoya_buffet.jpg'],
['Pastry & Milk Tea Corner','cafe','$',4.3,84,'food_pastry_milktea.jpg'],['Kitty Pudding Dessert Bar','cafe','$$',4.7,88,'food_pudding_cat.jpg'],['Brownie & Gelato Corner','cafe','$$',4.5,85,'food_brownie.jpg'],['Home-style Lunch Kitchen','restaurant','$',4.2,80,'food_lunch_plate.jpg']];
const mk=a=>({id:a[0],u:a[1]<0?ME:U[a[1]],pl:a[2],img:a[3],cap:a[4],rev:a[5],r:a[6],m:a[7],l:a[8],c:a[9],t:a[10]});
const FEED=[['post1',4,0,'food_brownie.jpg','Best flat white in the city','Cozy and quiet, perfect for working.',4.5,10,128,7,['coffee','kemang']],
['fp1',0,6,'food_pizza_walnut.jpg','Walnut and honey on a blistered crust. Sweet, salty, creamy in every bite.','Crust had the perfect char.',4.5,60,428,7,['pizza','woodfired']],
['fp2',1,6,'food_pizza_mushroom.jpg','Mushroom pizza with a balsamic swirl. Earthy and a little sweet.',null,4.5,180,311,7,['pizza','mushroom']],
['fp3',2,12,'food_lunch_plate.jpg','Weekday lunch plate: roast chicken, creamy potatoes, and greens.','Simple, filling, and homey.',4,420,96,7,['lunch','homestyle']],
['fp4',3,8,'food_jogoya_buffet.jpg','Japanese buffet night. Sushi rolls, grills, and way too many desserts.','Go hungry, the spread is huge.',4.5,660,552,7,['buffet','sushi']]].map(mk);
const MINE=[['my1',-1,10,'food_pudding_cat.jpg','This pudding is too cute to eat. Still ate it.','Silky and not too sweet.',5,300,189,14,['dessert','pudding']],
['my2',-1,11,'food_brownie.jpg','Warm brownie with a scoop of gelato. No notes.',null,4.5,1560,143,9,['brownie','dessert']],
['my3',-1,7,'food_dumpling_soup.jpg','Creamy dumpling soup on a rainy afternoon.','Comfort in a bowl.',4.5,3000,121,11,['dumplings','soup']],
['my4',-1,9,'food_pastry_milktea.jpg','Flaky pastry and iced milk tea. Simple and perfect.',null,4,4440,88,5,['pastry','milktea']]].map(mk);
const EV=[['Kemang Night Market','Night Market','food_dumpling_soup.jpg',1,240,0,'Local food stalls, live music, and craft vendors.'],['Jalan Sabang Street Food Walk','Meetup','food_lunch_plate.jpg',2,86,0],
['Single-Origin Cupping Session','Meetup','food_brownie.jpg',3,32,1],['Menteng Heritage Dinner','Festival','food_jogoya_buffet.jpg',5,64,0],['Latte Art Throwdown','Sports','food_pastry_milktea.jpg',6,120,0],
['Jakarta Coffee Week Pop-up','Festival','food_brownie.jpg',8,410,0],['Sunday Brunch Social','Meetup','food_pizza_mushroom.jpg',9,58,0],['Traditional Sweets Workshop','Exhibition','food_pudding_cat.jpg',11,40,0],
['Acoustic Café Nights','Concert','food_pizza_walnut.jpg',12,150,0]].map((e,i)=>({id:'e'+i,t:e[0],c:e[1],img:e[2],d:new Date(Date.now()+e[3]*864e5),n:e[4],a:!!e[5]}));
const GR=[['Hidden Gem Hunters',1204,1,'food_pizza_walnut.jpg'],['Coffee Lovers',980,0,'food_pastry_milktea.jpg'],['Street Food Explorers',1560,0,'food_dumpling_soup.jpg'],['Brunch Club Jakarta',720,0,'food_pizza_mushroom.jpg'],
['Indonesian Classics',845,1,'food_lunch_plate.jpg'],['Sweet Tooth Society',610,0,'food_pudding_cat.jpg'],['Budget Eats',1320,0,'food_dumpling_soup.jpg'],['Café Workers',540,0,'food_brownie.jpg'],['Food Photographers',430,0,'food_pizza_mushroom.jpg']].map((g,i)=>({id:'g'+i,n:g[0],m:g[1],j:!!g[2],img:g[3]}));

/* ---------- state & helpers ---------- */
const S={auth:false,role:'foodie',tab:'home',q:'',seg:'Events',pt:'Reviews',liked:new Set(),saved:new Set(),circle:false,all:false};
const rel=m=>m<60?`${m} min. ago`:m<1440?`${Math.round(m/60)} hr. ago`:`${Math.round(m/1440)} days ago`;
const fd=d=>d.toLocaleString('en-US',{dateStyle:'medium',timeStyle:'short'});
const empty=(i,t,m)=>`<div class=em>${I(i,40)}<b class=sb>${t}</b><span>${m}</span></div>`;
const toast=t=>{const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),1800)};
const WM=`<img src="${A('AppetiteWordmark.png')}" alt="appètite">`;

const post=p=>{const pl=PL[p.pl],L=S.liked.has(p.id),V=S.saved.has(p.id);
return `<article class="card pc"><div class=ph><img class=av src="${A(p.u[2])}" alt=""><div><div class=sb>${p.u[1]}</div><div class="fn s2">${rel(p.m)}</div></div><button class=ic>${I('dots',20)}</button></div>
<div class=pm><div class=pt><div class=b>${pl[0]}</div><div>${p.cap}</div>${p.rev?`<div class="serif s2 it">“${p.rev}”</div>`:''}</div><img class=th src="${A(p.img)}" alt=""></div>
<div class=tg><span class="pill r">${I('star',12,1)}${p.r.toFixed(1)}</span><span class=pill>${CAT[pl[1]]}</span>${p.t.map(t=>`<span class=pill>#${t}</span>`).join('')}</div>
<div class=ac><button class="${L?'on':''}" data-like=${p.id}>${I('heart',18,L)}${p.l+(L?1:0)}</button><span>${I('msg',18)}${p.c}</span><span>${I('share',18)}</span><i></i><button class="${V?'on':''}" data-save=${p.id}>${I('mark',18,V)}</button></div></article>`};

const evCard=e=>`<div class="card ev"><img class=cov src="${A(e.img)}" alt=""><div><span class="c2 acc" style="display:flex;gap:4px;align-items:center;color:var(--accent)">${I('tag',11,1)}${e.c}</span><div class=sb>${e.t}</div><div class="cp s2">${fd(e.d)}</div><div class=row2><span class="cp s2" style="display:flex;gap:5px;align-items:center">${I('users',13)}${e.n} going</span><button class=gb data-att=${e.id}>${e.a?'Going':'Attend'}</button></div></div></div>`;
const grCard=g=>`<div class="card gc"><img src="${A(g.img)}" alt=""><div class=rt><div class=sb>${g.n}</div><div class="cp s2">${g.m} members</div></div><button class=gb data-join=${g.id}>${g.j?'Joined':'Join'}</button></div>`;
const rw=(l,t,s,r)=>`<div class=rw>${l}<div class=rt><div class=sb>${t}</div><div class="serif fn s2">${s}</div></div>${r}</div>`;
const chev=`<span class=s2>${I('chev',14)}</span>`;

const results=q=>{q=q.toLowerCase();const f=s=>s.toLowerCase().includes(q);
const pls=PL.filter(p=>f(p[0])),ppl=U.filter(u=>f(u[1])),evs=EV.filter(e=>f(e.t)),grs=GR.filter(g=>f(g.n));
if(!(pls.length+ppl.length+evs.length+grs.length))return empty('search','No results','Try a different word, or check another tab above.');
const sec=(t,n)=>`<div class="serif s2 lbl">${t} · ${n}</div>`;let h='';
if(pls.length)h+=sec('Places',pls.length)+pls.map(p=>rw(`<span class=ico>${I(p[1]=='cafe'?'sun':'fork',18)}</span>`,p[0],`${CAT[p[1]]} · ${p[2]} · ★ ${p[3].toFixed(1)}`,chev)).join('');
h+=ppl.map(u=>rw(`<img class=av src="${A(u[2])}" alt="">`,u[1],'@'+u[1],chev)).join('');
if(evs.length)h+=sec('Events',evs.length)+evs.map(e=>rw(`<img class=im src="${A(e.img)}" alt="">`,e.t,`${fd(e.d)}`,`<button class=gb data-att=${e.id}>${e.a?'Going':'Attend'}</button>`)).join('');
if(grs.length)h+=sec('Groups',grs.length)+grs.map(g=>rw(`<img class=im src="${A(g.img)}" alt="">`,g.n,`${g.m} members`,`<button class=gb data-join=${g.id}>${g.j?'Joined':'Join'}</button>`)).join('');
return `<div class=pad>${h}</div>`};

/* ---------- screens ---------- */
const bar=(l,r)=>`<header class=nav>${l||'<i style="width:36px"></i>'}${WM}${r||'<i style="width:36px"></i>'}</header>`;
const V={
home:{h:()=>bar(`<button class=ic>${I('send',20)}</button>`,`<button class=ic>${I('bell',20)}<i class=dot></i></button>`)+`<div class=sr>${I('search',16)}<input id=q value="${S.q}" placeholder="Search places, people, groups, events"></div>`,
 b:()=>S.q.trim()?results(S.q.trim()):`<div class=pad>${FEED.map(post).join('')}</div>`},
explore:{h:()=>bar('',`<button class=ic>${I('filter',20)}</button>`),b:()=>{
 const h=new Date().getHours(),tod=h<12?'Morning':h<17?'Afternoon':h<21?'Evening':'Night',list=(S.circle?PL.filter((_,i)=>i%2):PL).slice().sort((a,b)=>b[4]-a[4]),show=S.all?list:list.slice(0,4);
 return `<div class=pad><div class=info><span>${I('pin',14,1)}Jakarta</span><span>${I('clock',14)}${tod}</span><span>${I('sun',14)}28°C</span></div>
 <button class="card circ" data-circle><span class=ico>${I(S.circle?'users':'users',20)}</span><div><div class=b>My Circle</div><div class="cp s2">${S.circle?"Showing your friends' picks":'Show places your friends love'}</div></div><span class=acc style="color:var(--accent)">${I(S.circle?'check':'circ',22)}</span></button>
 <button class=crave data-crave><div class=k><span>${I('fork',14)} PICK MY CRAVING</span>${I('expand',14)}</div><div class=q>Hungry but don't know\nwhat to eat?</div><div class=h>4 quick questions, 3 picks you'll actually want.</div></button>
 <div class=row2><span class=b>${S.circle?'From My Circle':'Trending Near You'}</span><button class="fn sb acc" style="color:var(--accent)" data-all>${S.all?'Show less':'See all'} →</button></div>
 ${show.map(p=>`<div class="card plc pl"><img src="${A(p[5])}" alt=""><div><div class=row2><span class=b>${p[0]}</span><span class="m" style="color:${p[4]>=80?'#34c759':p[4]>=50?'#ff9500':'gray'}">${p[4]}% match</span></div><div class="fn s2">${CAT[p[1]]} · ${p[2]} · ★ ${p[3].toFixed(1)}</div></div></div>`).join('')}</div>`}},
community:{h:()=>bar('',S.seg=='Groups'?`<button class=ic style="color:var(--accent)" data-newgrp>${I('plus',22)}</button>`:''),b:()=>{
 const seg=`<div class=seg>${['Events','Groups'].map(s=>`<button class="pill ${S.seg==s?'sel':''}" data-seg=${s}>${s}</button>`).join('')}</div>`;
 const ev=EV.filter(e=>e.a),gr=GR.filter(g=>g.j);
 return seg+(S.seg=='Events'?(ev.length?`<div class=pad style="padding-top:0">${ev.map(evCard).join('')}</div>`:empty('cal','No events yet','Search for events on Home and join them to see them here.')):
 (gr.length?`<div class=pad style="padding-top:0">${gr.map(grCard).join('')}</div>`:empty('users','No groups yet','Search for groups on Home and join them to see them here.')))}},
you:{h:()=>bar('',`<button class=ic>${I('gear',20)}</button>`),b:()=>{
 const t=S.pt,tabs=['Reviews','Replies','Media'].map(x=>`<button class="${t==x?'on':''}" data-pt=${x}>${x}</button>`).join('');
 return `<div class=pro><div><div class=b>appètite</div><div class=s2>@appetite</div><div class=sb style="margin-top:8px;font-weight:500">842 Followers</div></div><img class=av src="${A(ME[2])}" alt=""></div>
 <div class=act><button class=nb data-toast="Edit profile isn't in the web version yet">Edit Profile</button><button class=nb data-toast="Link copied">Share Profile</button></div>
 <div style="display:grid;place-items:center;padding:12px 0 4px">${I('map',22)}</div><div class=tabs>${tabs}</div>
 ${t=='Reviews'?`<div class=pad>${MINE.map(post).join('')}</div>`:t=='Media'?`<div class=grid style="padding-bottom:110px">${MINE.map(p=>`<img src="${A(p.img)}" alt="">`).join('')}</div>`:empty('msg','No replies yet','')}`}}};

const login=()=>`<div class=login><img src="${A('AppetiteWordmarkCream.png')}" alt="appètite"><div class=lb><div class=roles>${[['foodie','Foodie','Discover & review places','fork'],['partner','Restaurant Partner','Manage your restaurant','store']].map(r=>`<button class="role ${S.role==r[0]?'on':''}" data-role=${r[0]}>${I(r[3],18)}<b>${r[1]}</b><small>${r[2]}</small></button>`).join('')}</div><button class=apple data-go>Sign in with Apple</button><button class=dev data-go>Skip Login (Dev Mode)</button><small class=terms>By continuing you agree to appètite's Terms &amp; Privacy Policy.</small></div></div>`;
const tabbar=()=>`<nav class=tb id=tb><div class=cap>${[['home','home'],['explore','search'],['',''],['community','users'],['you','user']].map(([k,i])=>k?`<button class="${S.tab==k?'on':''}" data-tab=${k} aria-label=${k}>${I(i,17)}</button>`:'<span></span>').join('')}</div><button class=plus data-toast="Create post isn't in the web version yet" aria-label="Create post">${I('plus',20)}</button></nav>`;

function body(){$('#b').innerHTML=V[S.tab].b()}
function render(){const a=$('#app');if(!S.auth){a.innerHTML=login();return}
 a.innerHTML=V[S.tab].h()+'<main id=b></main>'+tabbar();body()}

/* ---------- events ---------- */
document.addEventListener('click',e=>{const t=e.target.closest('[data-role],[data-go],[data-tab],[data-like],[data-save],[data-att],[data-join],[data-seg],[data-pt],[data-circle],[data-all],[data-crave],[data-toast],[data-newgrp]');if(!t)return;const d=t.dataset;
 if(d.role){S.role=d.role;render()}else if('go' in d){S.auth=true;render();scrollTo(0,0)}
 else if(d.tab){if(S.tab!=d.tab){S.tab=d.tab;render();scrollTo(0,0)}}
 else if(d.like){S.liked.has(d.like)?S.liked.delete(d.like):S.liked.add(d.like);body()}
 else if(d.save){S.saved.has(d.save)?S.saved.delete(d.save):S.saved.add(d.save);body()}
 else if(d.att){const x=EV.find(v=>v.id==d.att);x.a=!x.a;body()}
 else if(d.join){const x=GR.find(v=>v.id==d.join);x.j=!x.j;body()}
 else if(d.seg){S.seg=d.seg;render()}else if(d.pt){S.pt=d.pt;body()}
 else if('circle' in d){S.circle=!S.circle;body()}else if('all' in d){S.all=!S.all;body()}
 else if('crave' in d)toast("Pick My Craving isn't in the web version yet");
 else if('newgrp' in d)toast("Create group isn't in the web version yet");
 else if(d.toast)toast(d.toast)});
document.addEventListener('input',e=>{if(e.target.id=='q'){S.q=e.target.value;body()}});
let last=0;addEventListener('scroll',()=>{const y=scrollY,t=$('#tb');if(!t)return;
 if(y>60&&y>last+4)t.classList.add('h');else if(y<last-4||y<=10)t.classList.remove('h');last=y},{passive:true});
render();
