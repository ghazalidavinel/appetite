import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as L from 'lucide-react'
import { Ico, Avatar, Rating, Empty, Loading, Chip, Nav, Sheet, catIcon, groupIcon } from './ui.jsx'
import * as D from './data.js'
import { PRICE, CATEGORY, currentUser, places, circlePlaceIDs, relTime, fmtDate } from './data.js'

const TABS = [['home', 'House', 'Home'], ['explore', 'Search', 'Explore'], ['community', 'Users', 'Community'], ['you', 'User', 'You']]

export default function App() {
  const [authed, setAuthed] = useState(() => { try { return localStorage.getItem('chilcha-auth') === '1' } catch { return false } })
  const [tab, setTab] = useState('home')
  const [stacks, setStacks] = useState({ home: [], explore: [], community: [], you: [] })
  const [hideBar, setHideBar] = useState(false)
  const [upload, setUpload] = useState(false)
  const [toast, setToast] = useState(null)
  const [posts, setPosts] = useState(D.feedPosts)
  const [mine, setMine] = useState(D.myPosts)
  const [events, setEvents] = useState(D.events)
  const [groups, setGroups] = useState(D.groups)

  const say = (m) => { setToast(m); setTimeout(() => setToast(null), 1800) }
  const push = (r) => setStacks((s) => ({ ...s, [tab]: [...s[tab], r] }))
  const pop = () => { setHideBar(false); setStacks((s) => ({ ...s, [tab]: s[tab].slice(0, -1) })) }
  const login = () => { try { localStorage.setItem('chilcha-auth', '1') } catch {} setAuthed(true) }
  const logout = () => { try { localStorage.removeItem('chilcha-auth') } catch {} setAuthed(false); setTab('home') }
  const toggle = (id, key, delta) => {
    const f = (p) => (p.id === id ? { ...p, [key]: !p[key], ...(delta ? { likes: p.likes + (p[key] ? -1 : 1) } : {}) } : p)
    setPosts((a) => a.map(f)); setMine((a) => a.map(f))
  }
  const ctx = { push, pop, toggle, say, posts, mine, events, groups, setHideBar, logout,
    toggleEvent: (id) => setEvents((a) => a.map((e) => e.id === id ? { ...e, attending: !e.attending, going: e.going + (e.attending ? -1 : 1) } : e)),
    toggleGroup: (id) => setGroups((a) => a.map((g) => g.id === id ? { ...g, joined: !g.joined, members: g.members + (g.joined ? -1 : 1) } : g)),
    addGroup: (g) => setGroups((a) => [g, ...a]) }

  if (!authed) return <div className="app"><Login onLogin={login} /></div>

  const stack = stacks[tab]
  const top = stack[stack.length - 1]
  const Root = { home: Home, explore: Explore, community: Community, you: () => <Profile user={currentUser} own ctx={ctx} /> }[tab]
  return (
    <div className="app">
      <div className="screen" key={tab}>
        {tab === 'you' ? <Profile user={currentUser} own ctx={ctx} /> : <Root ctx={ctx} />}
      </div>
      {stack.map((r, i) => (
        <div className="screen push" key={tab + i} style={{ zIndex: 5 + i, display: i === stack.length - 1 ? 'flex' : 'none' }}>
          <Route r={r} ctx={ctx} />
        </div>
      ))}
      <div className={'tabbar' + (hideBar || stack.length ? ' hide' : '')}>
        <div className="bar">
          {TABS.slice(0, 2).map((t) => <TabBtn key={t[0]} t={t} tab={tab} set={(x) => { setHideBar(false); setTab(x) }} />)}
          <div />
          {TABS.slice(2).map((t) => <TabBtn key={t[0]} t={t} tab={tab} set={(x) => { setHideBar(false); setTab(x) }} />)}
          <button className="plus" aria-label="Create post" onClick={() => setUpload(true)}><L.Plus size={22} strokeWidth={3} /></button>
        </div>
      </div>
      {upload && <CreatePost onClose={() => setUpload(false)} onPost={(p) => { setPosts((a) => [p, ...a]); setMine((a) => [p, ...a]); setUpload(false); setTab('home'); say('Posted!') }} />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function TabBtn({ t, tab, set }) {
  const on = tab === t[0]
  return <button className={'tab' + (on ? ' on' : '')} aria-label={t[2]} onClick={() => set(t[0])}><Ico n={t[1]} size={19} fill={on && t[0] !== 'explore'} sw={on ? 2.4 : 2} /></button>
}

function Route({ r, ctx }) {
  switch (r.t) {
    case 'post': return <PostDetail post={r.post} ctx={ctx} />
    case 'place': return <PlaceDetail place={r.place} ctx={ctx} />
    case 'user': return <Profile user={r.user} ctx={ctx} />
    case 'circle': return <Circle ctx={ctx} />
    case 'tracker': return <Tracker ctx={ctx} />
    case 'notifs': return <Notifs ctx={ctx} />
    case 'messages': return <Messages ctx={ctx} />
    case 'chat': return <Chat user={r.user} ctx={ctx} />
    default: return null
  }
}

/* ---------------- Login ---------------- */
function Login({ onLogin }) {
  return (
    <div className="login">
      <div className="sp" style={{ display: 'grid', placeItems: 'center' }}><img src="/img/AppetiteWordmarkCream.png" width="240" alt="appètite" /></div>
      <div className="col g16" style={{ width: '100%', maxWidth: 340, alignItems: 'center' }}>
        <button className="white-btn press" onClick={onLogin}>Login</button>
        <p className="cap2" style={{ color: 'rgba(251,231,162,.6)', textAlign: 'center' }}>By continuing you agree to appètite's Terms &amp; Privacy Policy.</p>
      </div>
    </div>
  )
}

/* ---------------- Home ---------------- */
const SCOPES = ['All', 'Places', 'People', 'Groups', 'Events']
function Home({ ctx }) {
  const { posts, events, groups, push } = ctx
  const [q, setQ] = useState('')
  const [focus, setFocus] = useState(false)
  const [scope, setScope] = useState('All')
  const [recents, setRecents] = useState(() => { try { return JSON.parse(localStorage.getItem('chilcha-recents') || '[]') } catch { return [] } })
  const [loading, setLoading] = useState(true)
  const last = useRef(0)
  useEffect(() => { const t = setTimeout(() => setLoading(false), 450); return () => clearTimeout(t) }, [])
  const saveRecents = (r) => { setRecents(r); try { localStorage.setItem('chilcha-recents', JSON.stringify(r)) } catch {} }
  const commit = () => { const s = q.trim(); if (s) saveRecents([s, ...recents.filter((x) => x !== s)].slice(0, 6)) }
  const onScroll = (e) => { const y = e.target.scrollTop; if (y > 60 && y > last.current + 4) ctx.setHideBar(true); else if (y < last.current - 4 || y <= 10) ctx.setHideBar(false); last.current = y }
  const searching = q.trim() !== ''
  const showScope = (s) => scope === 'All' || scope === s
  const ql = q.trim().toLowerCase()
  const r = useMemo(() => ({
    places: places.filter((p) => (p.name + CATEGORY[p.category].name).toLowerCase().includes(ql)),
    people: D.allUsers.filter((u) => u.username.toLowerCase().includes(ql)),
    events: events.filter((e) => (e.title + e.category).toLowerCase().includes(ql)),
    groups: groups.filter((g) => g.name.toLowerCase().includes(ql)),
  }), [ql, events, groups])
  return (<>
    <Nav wordmark left={<button onClick={() => push({ t: 'messages' })} aria-label="Messages"><L.Send size={20} /></button>}
      right={<button style={{ position: 'relative' }} onClick={() => push({ t: 'notifs' })} aria-label="Notifications"><L.Bell size={20} /><i style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4, background: '#FF3B30' }} /></button>} />
    <label className="search"><L.Search size={16} color="var(--text2)" />
      <input value={q} onChange={(e) => setQ(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setTimeout(() => setFocus(false), 150)}
        onKeyDown={(e) => e.key === 'Enter' && commit()} placeholder="Search places, people, groups, events" />
      {q && <button onClick={() => setQ('')}><L.XCircle size={16} fill="var(--text2)" color="var(--fill)" /></button>}</label>
    {(searching || focus) && <div className="hs" style={{ paddingTop: 4 }}>{SCOPES.map((s) => <Chip key={s} on={scope === s} onClick={() => setScope(s)}>{s}</Chip>)}</div>}
    <div className="scroll" onScroll={onScroll}>
      {searching ? (
        <div className="pad col g12">
          {['places', 'people', 'events', 'groups'].every((k) => !showScope(k[0].toUpperCase() + k.slice(1)) || !r[k].length) &&
            <Empty icon="Search" title="No results" message="Try a different word, or check another tab above." />}
          {showScope('Places') && r.places.length > 0 && <><div className="sec">Places · {r.places.length}</div>
            {r.places.map((p) => <button key={p.id} className="list-row" onClick={() => push({ t: 'place', place: p })}>
              <div className="round-ico"><Ico n={catIcon(p.category)} size={18} /></div>
              <div className="sp" style={{ minWidth: 0 }}><div className="sb ell">{p.name}</div><div className="sec fn ell">{CATEGORY[p.category].name} · {PRICE[p.price]} · ★ {p.rating.toFixed(1)}</div></div>
              <L.ChevronRight size={16} color="var(--text2)" /></button>)}</>}
          {showScope('People') && r.people.map((u) => <button key={u.id} className="list-row" onClick={() => push({ t: 'user', user: u })}>
            <Avatar src={u.avatar} size={40} /><div className="sp"><div className="sb">{u.displayName}</div><div className="sec fn">@{u.username}</div></div><L.ChevronRight size={16} color="var(--text2)" /></button>)}
          {showScope('Events') && r.events.length > 0 && <><div className="sec">Events · {r.events.length}</div>
            {r.events.map((e) => <div key={e.id} className="list-row"><div className="thumb"><img className="photo" src={e.photo} alt="" /></div>
              <div className="sp" style={{ minWidth: 0 }}><div className="sb ell">{e.title}</div><div className="sec fn ell">{fmtDate(e.start)} · {e.place.name}</div></div>
              <button className="btn sm press" onClick={() => ctx.toggleEvent(e.id)}>{e.attending ? 'Going' : 'Attend'}</button></div>)}</>}
          {showScope('Groups') && r.groups.length > 0 && <><div className="sec">Groups · {r.groups.length}</div>
            {r.groups.map((g) => <div key={g.id} className="list-row"><div className="thumb"><img className="photo" src={g.photo} alt="" /></div>
              <div className="sp" style={{ minWidth: 0 }}><div className="sb ell">{g.name}</div><div className="sec fn">{g.members} members</div></div>
              <button className="btn sm press" onClick={() => ctx.toggleGroup(g.id)}>{g.joined ? 'Joined' : 'Join'}</button></div>)}</>}
        </div>
      ) : focus ? (
        <div className="pad col g16" style={{ paddingTop: 16 }}>
          {recents.length > 0 && <div className="col g8"><div className="row"><span className="sec sp">Recent</span><button className="fn sb acc" onClick={() => saveRecents([])}>Clear</button></div>
            {recents.map((s) => <div key={s} className="row g12" style={{ padding: '4px 0' }}><L.History size={16} color="var(--text2)" /><button className="sp" style={{ textAlign: 'left' }} onMouseDown={() => setQ(s)}>{s}</button>
              <button onMouseDown={() => saveRecents(recents.filter((x) => x !== s))}><L.X size={14} color="var(--text2)" /></button></div>)}</div>}
          <div className="col g8"><span className="sec">Popular searches</span>
            <div className="grid2" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(96px,1fr))', gap: 8 }}>
              {['Coffee', 'Street food', 'Brunch', 'Night market', 'Hidden gem', 'Dessert'].map((s) => <button key={s} className="chip" style={{ justifyContent: 'center' }} onMouseDown={() => setQ(s)}>{s}</button>)}</div></div>
        </div>
      ) : loading ? <Loading msg="Loading your feed…" /> : (
        <div className="pad col g12">
          {posts.map((p) => <PostRow key={p.id} p={p} ctx={ctx} />)}
        </div>
      )}
    </div>
  </>)
}

function PostRow({ p, ctx }) {
  const rating = p.rating ?? p.place?.rating
  const labels = [p.place && CATEGORY[p.place.category].name, ...p.tags.slice(0, 2).map((t) => '#' + t)].filter(Boolean)
  return (
    <div className="card press" style={{ borderRadius: 22, padding: 14, cursor: 'pointer' }} onClick={() => ctx.push({ t: 'post', post: p })}>
      <div className="col g12">
        <div className="row g12">
          <button className="row g12" onClick={(e) => { e.stopPropagation(); ctx.push({ t: 'user', user: p.author }) }}>
            <Avatar src={p.author.avatar} size={40} />
            <div className="col" style={{ textAlign: 'left', gap: 1 }}><span className="sb">{p.author.username}</span><span className="fn t2">{relTime(p.createdAt)}</span></div></button>
          <div className="sp" /><button style={{ width: 32, height: 32, display: 'grid', placeItems: 'center' }} onClick={(e) => { e.stopPropagation(); ctx.toggle(p.id, 'saved'); ctx.say(p.saved ? 'Removed from saved' : 'Saved') }}><L.Ellipsis size={18} /></button>
        </div>
        <div className="row g12" style={{ alignItems: 'flex-start' }}>
          <div className="col sp" style={{ gap: 6, minWidth: 0 }}>
            <div className="b" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.place?.name ?? p.caption}</div>
            {p.place && <div style={{ opacity: .85 }}>{p.caption}</div>}
            {p.review && <div className="sec" style={{ fontStyle: 'italic' }}>“{p.review}”</div>}
          </div>
          <div style={{ width: 104, height: 104, borderRadius: 16, overflow: 'hidden', flex: 'none' }}><img className="photo" src={p.photo} alt="" /></div>
        </div>
        <div className="row g8" style={{ overflow: 'hidden' }}>
          {rating && <span className="pill acc"><L.Star size={13} fill="currentColor" />{rating.toFixed(1)}</span>}
          {labels.map((l) => <span key={l} className="pill ell">{l}</span>)}
        </div>
        <div className="row" style={{ gap: 22 }}>
          <button className="row g4" style={{ color: p.liked ? 'var(--accent)' : 'inherit' }} onClick={(e) => { e.stopPropagation(); ctx.toggle(p.id, 'liked', true) }}><L.Heart size={18} fill={p.liked ? 'currentColor' : 'none'} />{p.likes}</button>
          <span className="row g4"><L.MessageCircle size={18} />{p.comments}</span><L.Share size={18} />
          <div className="sp" />
          <button style={{ color: p.saved ? 'var(--accent)' : 'inherit' }} onClick={(e) => { e.stopPropagation(); ctx.toggle(p.id, 'saved') }}><L.Bookmark size={18} fill={p.saved ? 'currentColor' : 'none'} /></button>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Post detail ---------------- */
function PostDetail({ post: p0, ctx }) {
  const p = [...ctx.posts, ...ctx.mine].find((x) => x.id === p0.id) || p0
  const [cm, setCm] = useState(() => D.commentsFor(p0))
  const [txt, setTxt] = useState('')
  const send = () => { if (!txt.trim()) return; setCm([...cm, { id: 'n' + Date.now(), author: currentUser, text: txt.trim(), createdAt: Date.now(), likes: 0 }]); setTxt('') }
  const top = cm.filter((c) => !c.parent)
  return (<>
    <Nav title="Post" onBack={ctx.pop} />
    <div className="scroll"><div className="pad col g12">
      <div className="card" style={{ borderRadius: 22 }}>
        <div className="row g12" style={{ padding: 14 }}>
          <button className="row g12" onClick={() => ctx.push({ t: 'user', user: p.author })}><Avatar src={p.author.avatar} size={40} />
            <div className="col" style={{ textAlign: 'left' }}><span className="sb">{p.author.username}</span><span className="fn t2">{relTime(p.createdAt)}</span></div></button></div>
        <div style={{ height: 300 }}><img className="photo" src={p.photo} alt="" /></div>
        <div className="col g8" style={{ padding: 14 }}>
          {p.place && <button className="row g8 sb" onClick={() => ctx.push({ t: 'place', place: p.place })}><L.MapPin size={15} />{p.place.name}<L.ChevronRight size={14} color="var(--text2)" /></button>}
          {p.rating && <Rating value={p.rating} size={14} />}
          <div>{p.caption}</div>
          {p.review && <div className="sec" style={{ fontStyle: 'italic' }}>“{p.review}”</div>}
          <div className="fn acc">{p.tags.map((t) => '#' + t).join(' ')}</div>
          <div className="row" style={{ gap: 22, paddingTop: 4 }}>
            <button className="row g4" style={{ color: p.liked ? 'var(--accent)' : 'inherit' }} onClick={() => ctx.toggle(p.id, 'liked', true)}><L.Heart size={18} fill={p.liked ? 'currentColor' : 'none'} />{p.likes}</button>
            <span className="row g4"><L.MessageCircle size={18} />{cm.length}</span><div className="sp" />
            <button style={{ color: p.saved ? 'var(--accent)' : 'inherit' }} onClick={() => ctx.toggle(p.id, 'saved')}><L.Bookmark size={18} fill={p.saved ? 'currentColor' : 'none'} /></button></div>
        </div>
      </div>
      <div className="sec">Comments · {cm.length}</div>
      {top.map((c) => [c, ...cm.filter((r) => r.parent === c.id)].map((x) => (
        <div key={x.id} className={'cm' + (x.parent ? ' reply' : '')}><Avatar src={x.author.avatar} size={x.parent ? 28 : 34} />
          <div className="col sp" style={{ gap: 2 }}><div className="row g8"><span className="fn sb">{x.author.username}</span><span className="cap t2">{relTime(x.createdAt)}</span></div>
            <div>{x.text}</div></div>
          <span className="row g4 cap t2"><L.Heart size={13} />{x.likes}</span></div>)))}
    </div></div>
    <div className="row g8" style={{ padding: '8px 16px calc(12px + env(safe-area-inset-bottom))', borderTop: '1px solid var(--fill)' }}>
      <input className="field" style={{ borderRadius: 999 }} placeholder="Add a comment…" value={txt} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
      <button className="iconbtn" style={{ background: 'var(--accent)', color: '#fff' }} onClick={send}><L.ArrowUp size={18} strokeWidth={3} /></button></div>
  </>)
}

/* ---------------- Explore ---------------- */
const DIST = { '<5km': (k) => k < 5, '>5km': (k) => k > 5, '>10km': (k) => k > 10, '>20km': (k) => k > 20 }
const RATE = { '<4.0': (r) => r < 4, '>4.0': (r) => r > 4, '>4.5': (r) => r > 4.5, '5.0': (r) => r >= 5 }
function Explore({ ctx }) {
  const [cat, setCat] = useState(null)
  const [circle, setCircle] = useState(false)
  const [all, setAll] = useState(false)
  const [filters, setFilters] = useState(false)
  const [f, setF] = useState({ io: null, dist: null, rate: null })
  const [quiz, setQuiz] = useState(false)
  const [temp, setTemp] = useState(null)
  const [busy, setBusy] = useState(false)
  const hr = new Date().getHours()
  const tod = hr >= 5 && hr < 11 ? 'Morning' : hr < 15 && hr >= 11 ? 'Midday' : hr >= 15 && hr < 18 ? 'Afternoon' : hr >= 18 && hr < 22 ? 'Evening' : 'Late Night'
  const refresh = async () => { setBusy(true); try { const r = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.82&current=temperature_2m'); const j = await r.json(); setTemp(Math.round(j.current.temperature_2m)) } catch { setTemp((t) => t ?? 30) } setBusy(false) }
  useEffect(() => { refresh() }, [])
  const active = f.io || f.dist || f.rate
  let list = places.filter((p) => (!cat || p.category === cat) && (!f.dist || DIST[f.dist](p.dist / 1000)) && (!f.rate || RATE[f.rate](p.rating)))
  if (f.io) list = list.filter((p) => (f.io === 'Outdoor') === (p.id === 'p3' || p.category === 'streetFood'))
  const sorted = [...list].sort((a, b) => b.rating - a.rating)
  const shown = circle ? list.filter((p) => circlePlaceIDs.includes(p.id)) : all ? sorted : sorted.slice(0, 4)
  return (<>
    <Nav wordmark right={<button style={{ position: 'relative' }} onClick={() => setFilters(true)} aria-label="Filters"><L.SlidersHorizontal size={20} />{active && <i style={{ position: 'absolute', top: -4, right: -5, width: 7, height: 7, borderRadius: 4, background: 'var(--accent)' }} />}</button>} />
    <div className="scroll"><div style={{ paddingBottom: 110 }}>
      <button className="banner press" onClick={refresh} disabled={busy}>
        <span><L.Navigation size={11} fill="currentColor" />Jakarta</span><span><L.Clock size={11} />{tod}</span>{temp != null && <span><L.Thermometer size={11} />{temp}°C</span>}<div className="sp" />{busy ? <div className="spin" style={{ width: 11, height: 11, borderWidth: 2 }} /> : <L.RefreshCw size={10} />}</button>
      <button className="craving press" onClick={() => setQuiz(true)}><L.UtensilsCrossed className="bg" size={76} strokeWidth={3} />
        <div className="col g8" style={{ position: 'relative' }}><div className="row"><span className="cap b sp" style={{ letterSpacing: 1.4, opacity: .8 }}>PICK MY CRAVING</span><L.Maximize2 size={13} strokeWidth={3} /></div>
          <div className="col" style={{ gap: 3 }}><span className="b" style={{ whiteSpace: 'pre-line' }}>{"Hungry but don't know\nwhat to eat?"}</span><span className="fn" style={{ opacity: .85 }}>4 quick questions, 3 picks you'll actually want.</span></div></div></button>
      <div className="circle"><button className={'main press' + (circle ? ' on' : '')} onClick={() => setCircle(!circle)}>
        <div className="ico"><L.Users size={20} /></div><div className="col sp" style={{ gap: 1 }}><span className="b">My Circle</span><span className="fn" style={{ color: circle ? 'rgba(255,248,232,.85)' : 'var(--text2)' }}>{circle ? "Showing your friends' picks" : 'Show places your friends love'}</span></div>
        {circle ? <L.CheckCircle2 size={20} /> : <L.Circle size={20} color="var(--text2)" />}</button>
        <button className="iconbtn press" style={{ width: 44, height: 44 }} onClick={() => ctx.push({ t: 'circle' })} aria-label="Manage My Circle"><L.UserPlus size={19} /></button></div>
      <div className="row" style={{ padding: '16px 16px 0' }}><span className="b sp">{circle ? 'From My Circle' : 'Trending Near You'}</span>
        {!circle && sorted.length > 4 && <button className="fn sb acc row g4" onClick={() => setAll(!all)}>{all ? 'Show less' : 'See all'}<L.ArrowRight size={14} style={{ transform: all ? 'rotate(-90deg)' : 'none', transition: 'transform .3s' }} /></button>}</div>
      <div className="hs"><Chip on={!cat} onClick={() => setCat(null)}>All</Chip>
        {['cafe', 'restaurant', 'streetFood'].map((c) => <Chip key={c} icon={catIcon(c)} on={cat === c} onClick={() => setCat(cat === c ? null : c)}>{CATEGORY[c].name}</Chip>)}</div>
      {shown.length === 0 && <Empty icon="Users" title={circle ? 'Nothing from your circle yet' : 'No matches'} message={circle ? "When your friends post places, they'll show up here." : 'Try adjusting your filters.'} />}
      <div className="grid2" style={{ padding: 16 }}>
        {shown.map((p) => <button key={p.id} className="card press" style={{ textAlign: 'left', animation: 'fade .3s' }} onClick={() => ctx.push({ t: 'place', place: p })}>
          <div style={{ height: 160 }}><img className="photo" src={p.photo} alt="" /></div>
          <div className="col" style={{ gap: 2, padding: '8px 8px 8px' }}><span className="sb ell">{p.name}</span><span className="sec ell" style={{ fontSize: 13 }}>{CATEGORY[p.category].name}</span></div></button>)}
      </div>
    </div></div>
    {filters && <Sheet onClose={() => setFilters(false)}>
      <div className="row" style={{ marginBottom: 12 }}><b className="sp">Filters</b><button className="fn sb acc" onClick={() => { setF({ io: null, dist: null, rate: null }) }}>Reset</button></div>
      {[['Setting', 'io', ['Indoor', 'Outdoor']], ['Distance', 'dist', Object.keys(DIST)], ['Rating', 'rate', Object.keys(RATE)]].map(([t, k, opts]) => (
        <div key={k} className="col g8" style={{ marginBottom: 14 }}><span className="sec">{t}</span><div className="row g8" style={{ flexWrap: 'wrap' }}>
          <Chip on={!f[k]} onClick={() => setF({ ...f, [k]: null })}>Any</Chip>{opts.map((o) => <Chip key={o} on={f[k] === o} onClick={() => setF({ ...f, [k]: o })}>{o}</Chip>)}</div></div>))}
      <button className="btn full" onClick={() => setFilters(false)}>Done</button></Sheet>}
    {quiz && <Quiz onClose={() => setQuiz(false)} onPick={(p) => { setQuiz(false); ctx.push({ t: 'place', place: p }) }} />}
  </>)
}

const QUIZ = [
  { q: 'What are you in the mood for?', o: [['☕', 'Coffee & chill', { cafe: 3 }], ['🍝', 'A proper meal', { restaurant: 3 }], ['🥟', 'Quick street bite', { streetFood: 3 }], ['🍰', 'Something sweet', { cafe: 2, sweet: 2 }]] },
  { q: 'How much do you want to spend?', o: [['💸', 'Budget', { price: 'low' }], ['🙂', 'Mid-range', { price: 'medium' }], ['✨', 'Treat myself', { price: 'high' }]] },
  { q: 'What vibe?', o: [['🤫', 'Quiet', { crowd: 'Low' }], ['🙂', 'Easygoing', { crowd: 'Moderate' }], ['🎉', 'Lively', { crowd: 'High' }]] },
  { q: 'How far will you go?', o: [['🚶', 'Super close', { max: 1000 }], ['🛵', 'A short ride', { max: 1600 }], ['🚗', 'Worth the trip', { max: 9999 }]] },
]
function Quiz({ onClose, onPick }) {
  const [i, setI] = useState(0)
  const [ans, setAns] = useState([])
  const done = i >= QUIZ.length
  const picks = useMemo(() => {
    if (!done) return []
    const a = Object.assign({}, ...ans)
    return places.map((p) => ({ p, s: (a[p.category] || 0) + (a.sweet && /pudding|brownie|pastry/i.test(p.name) ? 2 : 0) + (a.price === p.price ? 2 : 0) + (a.crowd === p.crowd ? 1.5 : 0) + (p.dist <= (a.max || 9999) ? 1.5 : 0) + p.rating / 5 })).sort((x, y) => y.s - x.s).slice(0, 3).map((x) => x.p)
  }, [done])
  const pick = (o) => { setAns([...ans, o[2]]); setI(i + 1) }
  return (
    <div className="full-over">
      <div className="row" style={{ padding: '16px 16px 0', gap: 12 }}>
        <button className="iconbtn" onClick={onClose}><L.X size={18} /></button>
        {i > 0 && !done && <button className="iconbtn" onClick={() => { setI(i - 1); setAns(ans.slice(0, -1)) }}><L.ChevronLeft size={18} /></button>}
        <div className="sp" style={{ height: 4, borderRadius: 2, background: 'var(--fill)', overflow: 'hidden' }}><div style={{ height: '100%', width: `${Math.min(i, 4) / 4 * 100}%`, background: 'var(--accent)', transition: 'width .4s' }} /></div>
        <span className="fn sb t2">{Math.min(i + 1, 4)}/4</span></div>
      <div className="scroll"><div style={{ padding: 24 }} className="col g16" key={i}>
        {!done ? <><div className="b" style={{ fontSize: 22, lineHeight: 1.2 }}>{QUIZ[i].q}</div>
          <div className="grid2">{QUIZ[i].o.map((o) => <button key={o[1]} className="qopt press" onClick={() => pick(o)}><span style={{ fontSize: 28 }}>{o[0]}</span><span className="fn sb">{o[1]}</span></button>)}</div></>
          : <><div className="b" style={{ fontSize: 22 }}>Your 3 picks</div><span className="fn t2">Matched to your cravings.</span>
            {picks.map((p) => <button key={p.id} className="card press row g12" style={{ padding: 10, textAlign: 'left' }} onClick={() => onPick(p)}>
              <div className="thumb" style={{ width: 40, height: 40 }}><img className="photo" src={p.photo} alt="" /></div><div className="sp" style={{ minWidth: 0 }}><div className="b ell">{p.name}</div><div className="fn t2 ell">{CATEGORY[p.category].name} · ★ {p.rating}</div></div><L.ChevronRight size={14} color="var(--text2)" /></button>)}
            <div className="row g8"><button className="btn sp" onClick={() => { setI(0); setAns([]) }}>Pick again</button><button className="btn sp" onClick={onClose}>Start over</button></div></>}
      </div></div>
    </div>
  )
}

/* ---------------- Place detail ---------------- */
function PlaceDetail({ place: p, ctx }) {
  const [saved, setSaved] = useState(false)
  const mc = p.match >= 80 ? 'var(--green)' : p.match >= 50 ? 'var(--orange)' : 'var(--gray)'
  return (<>
    <Nav title={p.name} onBack={ctx.pop} />
    <div className="scroll"><div style={{ paddingBottom: 40 }}>
      <div style={{ height: 220 }}><img className="photo" src={p.photo} alt="" /></div>
      <div className="col g12" style={{ padding: 16 }}>
        <div className="row"><div className="col sp" style={{ gap: 2 }}><span className="b">{p.name}</span><span className="t2">{p.address}</span></div>
          <span className="pill sb" style={{ color: mc }}>{p.match}% match</span></div>
        <div className="row g8" style={{ flexWrap: 'wrap' }}>
          <span className="pill"><Ico n={catIcon(p.category)} size={13} />{CATEGORY[p.category].name}</span><span className="pill">{PRICE[p.price]}</span>
          <span className="pill"><L.Users size={13} />{p.crowd} crowd</span>{p.gem && <span className="pill acc"><L.Gem size={13} />Hidden Gem</span>}
          {p.transit && <span className="pill cap md"><L.Bus size={13} />Public Transportation Friendly</span>}</div>
        <div className="row g12"><Rating value={p.rating} size={14} /><span className="fn t2">({p.reviews} reviews)</span></div>
        <div className="card" style={{ padding: 14, borderRadius: 16 }}><div className="row g8 sb" style={{ marginBottom: 4 }}><L.Sparkles size={15} color="var(--accent)" />Why it fits you</div><div style={{ opacity: .9 }}>{p.ai}</div></div>
        <div className="card row g12" style={{ padding: 14, borderRadius: 16 }}><L.MapPin size={20} color="var(--accent)" /><div className="col sp"><span className="sb">{(p.dist / 1000).toFixed(1)} km away</span><span className="fn t2">About {p.mins} min</span></div></div>
        <div className="row g8"><a className="btn sp press" style={{ textDecoration: 'none', color: 'inherit' }} target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`}><L.Navigation size={14} />Directions</a>
          <button className="btn sp press" onClick={() => { setSaved(!saved); ctx.say(saved ? 'Removed' : 'Saved place') }}><L.Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />{saved ? 'Saved' : 'Save'}</button></div>
      </div>
    </div></div>
  </>)
}

/* ---------------- Community ---------------- */
function Community({ ctx }) {
  const [seg, setSeg] = useState('Events')
  const [create, setCreate] = useState(false)
  const evs = ctx.events.filter((e) => e.attending), gs = ctx.groups.filter((g) => g.joined)
  return (<>
    <Nav wordmark right={seg === 'Groups' ? <button onClick={() => setCreate(true)} aria-label="Create group"><L.PlusCircle size={22} fill="currentColor" color="var(--bg)" /></button> : null} />
    <div className="row g8" style={{ padding: '10px 16px' }}>{['Events', 'Groups'].map((s) => <Chip key={s} on={seg === s} onClick={() => setSeg(s)}>{s}</Chip>)}</div>
    <div className="scroll"><div className="pad col g16" key={seg} style={{ animation: 'fade .28s' }}>
      {seg === 'Events' ? (evs.length ? evs.map((e) => (
        <div key={e.id} className="card"><div style={{ height: 140 }}><img className="photo" src={e.photo} alt="" /></div>
          <div className="col" style={{ gap: 6, padding: 8 }}><span className="cap2 acc row g4"><L.Tag size={11} fill="currentColor" />{e.category}</span><span className="sb">{e.title}</span>
            <span className="cap t2">{fmtDate(e.start)}</span><div className="row"><span className="cap t2 row g4 sp"><L.Users size={12} fill="currentColor" />{e.going} going</span>
              <button className="btn sm press" onClick={() => ctx.toggleEvent(e.id)}>{e.attending ? 'Going' : 'Attend'}</button></div></div></div>))
        : <Empty icon="Calendar" title="No events yet" message="Search for events on Home and join them to see them here." />)
      : (gs.length ? gs.map((g) => (
        <div key={g.id} className="card row g12" style={{ padding: 12 }}>
          <div style={{ width: 60, height: 60, borderRadius: 14, overflow: 'hidden', position: 'relative', flex: 'none', background: 'var(--fill)' }}>{g.photo && <img className="photo" src={g.photo} alt="" />}
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,.28)', color: '#fff' }}><Ico n={groupIcon(g.icon)} size={18} /></div></div>
          <div className="col sp" style={{ gap: 2, minWidth: 0 }}><span className="sb ell">{g.name}</span><span className="cap t2">{g.members} members</span></div>
          <button className="btn sm press" onClick={() => ctx.toggleGroup(g.id)}>{g.joined ? 'Joined' : 'Join'}</button></div>))
        : <Empty icon="Users" title="No groups yet" message="Search for groups on Home and join them to see them here." />)}
    </div></div>
    {create && <CreateGroup ctx={ctx} onClose={() => setCreate(false)} />}
  </>)
}
function CreateGroup({ ctx, onClose }) {
  const [name, setName] = useState(''); const [desc, setDesc] = useState(''); const [icon, setIcon] = useState('sparkles')
  return <Sheet onClose={onClose}><div className="row" style={{ marginBottom: 12 }}><button className="fn" onClick={onClose}>Cancel</button><b className="sp" style={{ textAlign: 'center' }}>New Group</b>
    <button className="fn sb acc" style={{ opacity: name.trim() ? 1 : .4 }} disabled={!name.trim()} onClick={() => { ctx.addGroup({ id: 'g' + Date.now(), name: name.trim(), icon, members: 1, joined: true, description: desc, photo: null }); onClose() }}>Create</button></div>
    <div className="sec" style={{ marginBottom: 8 }}>Icon</div><div className="row g8" style={{ flexWrap: 'wrap', marginBottom: 16 }}>
      {['sparkles', 'coffee', 'fork', 'flame', 'cake', 'camera', 'laptop', 'banknote'].map((k) => <button key={k} className="round-ico" style={{ background: icon === k ? 'var(--accent)' : 'var(--fill)', color: icon === k ? 'var(--onAccent)' : 'inherit' }} onClick={() => setIcon(k)}><Ico n={groupIcon(k)} size={18} /></button>)}</div>
    <div className="col g8"><input className="field" placeholder="Group name" value={name} onChange={(e) => setName(e.target.value)} /><input className="field" placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} /></div></Sheet>
}

/* ---------------- Profile ---------------- */
function Profile({ user, own, ctx }) {
  const [tab, setTab] = useState('Reviews')
  const [following, setFollowing] = useState(false)
  const [settings, setSettings] = useState(false)
  const [edit, setEdit] = useState(false)
  const [u, setU] = useState(user)
  const posts = own ? ctx.mine : D.profilePosts(user)
  const reviews = posts.filter((p) => p.rating || p.review)
  const replies = useMemo(() => D.commentsFor(posts[0] || D.feedPosts[0]).filter((c) => c.parent).slice(0, 3).map((c) => ({ ...c, author: u, parentPost: posts[0] })), [u.id])
  const last = useRef(0)
  return (<>
    {own ? <Nav wordmark right={<button onClick={() => setSettings(true)} aria-label="Settings"><L.Settings size={20} /></button>} /> : <Nav title={user.username} onBack={ctx.pop} />}
    <div className="scroll" onScroll={(e) => { const y = e.target.scrollTop; if (own) { if (y > 60 && y > last.current + 4) ctx.setHideBar(true); else if (y < last.current - 4 || y <= 10) ctx.setHideBar(false) } last.current = y }}>
      <div className="col g16" style={{ paddingBottom: 110 }}>
        <div className="row" style={{ alignItems: 'flex-start', padding: '0 16px' }}><div className="col sp" style={{ gap: 4 }}><span className="b">{u.displayName}</span><span className="t2">@{u.username}</span>
          {u.bio && <span className="fn t2">{u.bio}</span>}<span className="md" style={{ paddingTop: 8 }}>{u.followers + (following ? 1 : 0)} Followers</span>
          <span className="pill cap sb" style={{ alignSelf: 'flex-start', marginTop: 6 }}><L.Zap size={13} fill="#FFCC00" color="#FFCC00" />Lv. {u.level} · {u.xp} XP</span></div>
          <Avatar src={u.avatar} size={84} /></div>
        <div className="row g8" style={{ padding: '0 16px' }}>
          {own ? <><button className="btn sp press" onClick={() => setEdit(true)}>Edit Profile</button><button className="btn sp press" onClick={() => { navigator.clipboard?.writeText(location.href); ctx.say('Link copied') }}><L.Upload size={14} />Share Profile</button></>
            : <><button className="btn sp press" style={following ? {} : { background: 'var(--accent)', color: 'var(--onAccent)' }} onClick={() => setFollowing(!following)}>{following ? 'Following' : 'Follow'}</button>
              <button className="btn sp press" onClick={() => ctx.push({ t: 'chat', user })}>Message</button></>}</div>
        {own && <div className="row" style={{ justifyContent: 'space-around', padding: '4px 0' }}><button onClick={() => ctx.push({ t: 'tracker' })} aria-label="Travel Tracker"><L.Map size={22} /></button></div>}
        <div className="seg">{['Reviews', 'Replies', 'Media'].map((t) => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}<i /></button>)}</div>
        <div key={tab} style={{ animation: 'fade .28s' }}>
          {tab === 'Reviews' && (reviews.length ? <div className="col">{reviews.map((p) => (
            <button key={p.id} className="col g8" style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid var(--fill)' }} onClick={() => ctx.push({ t: 'post', post: p })}>
              <div className="row g8"><span className="sb sp ell">{p.place?.name}</span>{p.rating && <span className="fn sb acc row g4"><L.Star size={12} fill="currentColor" />{p.rating.toFixed(1)}</span>}</div>
              {p.caption && <span>{p.caption}</span>}{p.review && <span className="sec" style={{ fontStyle: 'italic' }}>“{p.review}”</span>}
              <div style={{ height: 200, borderRadius: 16, overflow: 'hidden', width: '100%' }}><img className="photo" src={p.photo} alt="" /></div>
              <span className="fn t2">{p.comments} replies · {p.likes} likes</span></button>))}</div> : <Empty icon="Star" title="No reviews yet" message={own ? 'Share your first review.' : 'Nothing here yet.'} />)}
          {tab === 'Replies' && <div className="col g12" style={{ padding: '0 16px' }}>{replies.map((r) => (
            <div key={r.id} className="col g8" style={{ padding: '8px 0' }}><span className="fn md t2 row g4"><L.Reply size={13} />Replying to @{r.parentPost?.author.username}</span>
              <div className="fn" style={{ background: 'var(--fill)', borderRadius: 12, padding: '8px 12px' }}><span className="sb">{r.parentPost?.place?.name}</span></div>
              <span>{r.text}</span><span className="fn t2 row g4"><L.Heart size={13} />{r.likes}</span></div>))}</div>}
          {tab === 'Media' && <div className="grid3">{posts.map((p) => <button key={p.id} style={{ aspectRatio: '1', overflow: 'hidden' }} onClick={() => ctx.push({ t: 'post', post: p })}><img className="photo" src={p.photo} alt="" /></button>)}</div>}
        </div>
      </div>
    </div>
    {settings && <Sheet onClose={() => setSettings(false)}><b style={{ display: 'block', textAlign: 'center', marginBottom: 12 }}>Settings</b>
      {[['Moon', 'Dark Mode follows system'], ['BellRing', 'Push Notifications'], ['Lock', 'Privacy']].map(([i, t]) => <div key={t} className="row g12" style={{ padding: '12px 0', borderBottom: '1px solid var(--fill)' }}><Ico n={i} size={18} />{t}</div>)}
      <button className="btn full" style={{ marginTop: 16, color: '#FF3B30' }} onClick={logout(ctx, setSettings)}>Sign Out</button></Sheet>}
    {edit && <Sheet onClose={() => setEdit(false)}><b style={{ display: 'block', textAlign: 'center', marginBottom: 12 }}>Edit Profile</b>
      <div className="col g8"><input className="field" value={u.displayName} onChange={(e) => setU({ ...u, displayName: e.target.value })} placeholder="Name" />
        <input className="field" value={u.bio || ''} onChange={(e) => setU({ ...u, bio: e.target.value })} placeholder="Bio" /></div>
      <button className="btn full" style={{ marginTop: 16 }} onClick={() => setEdit(false)}>Done</button></Sheet>}
  </>)
}
const logout = (ctx, close) => () => { close(false); ctx.logout() }

/* ---------------- Misc pages ---------------- */
function Circle({ ctx }) {
  const [on, setOn] = useState(['u14', 'u15'])
  return (<><Nav title="My Circle" onBack={ctx.pop} /><div className="scroll"><div className="pad col g12">
    <span className="fn t2">Connect with up to 5 people for shared recommendations</span>
    {D.cast.map((u) => <div key={u.id} className="list-row"><Avatar src={u.avatar} size={44} /><div className="sp"><div className="sb">{u.displayName}</div><div className="sec fn">@{u.username}</div></div>
      <button className="btn sm press" onClick={() => setOn(on.includes(u.id) ? on.filter((x) => x !== u.id) : [...on, u.id])}>{on.includes(u.id) ? 'In circle' : 'Add'}</button></div>)}</div></div></>)
}
function Tracker({ ctx }) {
  const s = D.stats
  const cells = [['Places', s.places], ['Cities', s.cities], ['Countries', s.countries], ['Hidden gems', s.gems], ['Restaurants', s.restaurants], ['Cafés', s.cafes], ['Events', s.events], ['Distance (km)', s.km]]
  return (<><Nav title="Travel Tracker" onBack={ctx.pop} /><div className="scroll"><div className="pad col g16">
    <div className="grid2">{cells.map(([l, v]) => <div key={l} className="card col" style={{ padding: 14, alignItems: 'center', gap: 2 }}><b>{v}</b><span className="cap t2">{l}</span></div>)}</div>
    <div className="sec">Recent visits</div>
    <div className="card row g12" style={{ padding: 12 }}><div className="thumb"><img className="photo" src={places[0].photo} alt="" /></div><div className="col sp" style={{ gap: 2 }}><span className="sb">{places[0].name}</span><span className="fn t2">Morning coffee run</span>
      <span className="cap acc">Your 3rd café visit this month — you're building a real coffee streak!</span></div></div></div></div></>)
}
function Notifs({ ctx }) {
  const n = [[D.cast[0], 'liked your post', '2m'], [D.cast[1], 'started following you', '1h'], [D.cast[3], 'commented: "Need this place!"', '3h'], [D.cast[2], 'invited you to Hidden Gem Hunters', '1d']]
  return (<><Nav title="Notifications" onBack={ctx.pop} /><div className="scroll"><div className="pad col g12">{n.map(([u, t, w], i) => <div key={i} className="list-row"><Avatar src={u.avatar} size={40} /><div className="sp fn"><b className="sb">{u.username}</b> {t}</div><span className="cap t2">{w}</span></div>)}</div></div></>)
}
function Messages({ ctx }) {
  return (<><Nav title="Messages" onBack={ctx.pop} /><div className="scroll"><div className="pad col g12">{D.cast.map((u) => <button key={u.id} className="list-row" onClick={() => ctx.push({ t: 'chat', user: u })}>
    <Avatar src={u.avatar} size={46} /><div className="sp"><div className="sb">{u.displayName}</div><div className="sec fn">Tap to chat</div></div><L.ChevronRight size={16} color="var(--text2)" /></button>)}</div></div></>)
}
function Chat({ user, ctx }) {
  const [m, setM] = useState([{ me: false, t: 'Hey! Found any good spots lately?' }]); const [t, setT] = useState('')
  const send = () => { if (!t.trim()) return; setM((a) => [...a, { me: true, t: t.trim() }]); setT('') }
  return (<><Nav title={user.displayName} onBack={ctx.pop} /><div className="scroll"><div className="pad col g8">
    <div className="col" style={{ alignItems: 'center', gap: 4, padding: 12 }}><Avatar src={user.avatar} size={64} /><b>{user.displayName}</b><span className="fn t2">@{user.username}</span></div>
    {m.map((x, i) => x.me ? <div key={i} className="bubble">{x.t}</div> : <div key={i} style={{ background: 'var(--fill)', borderRadius: 18, padding: '9px 14px', alignSelf: 'flex-start', maxWidth: '80%' }}>{x.t}</div>)}</div></div>
    <div className="row g8" style={{ padding: '8px 16px calc(12px + env(safe-area-inset-bottom))', borderTop: '1px solid var(--fill)' }}>
      <input className="field" style={{ borderRadius: 999 }} placeholder="Message…" value={t} onChange={(e) => setT(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
      <button className="iconbtn" style={{ background: 'var(--accent)', color: '#fff', width: 36, height: 36 }} onClick={send}><L.ArrowUp size={18} strokeWidth={3} /></button></div></>)
}

/* ---------------- Create post ---------------- */
function CreatePost({ onClose, onPost }) {
  const [photo, setPhoto] = useState(null); const [pid, setPid] = useState(places[0].id); const [rating, setRating] = useState(4)
  const [caption, setCaption] = useState(''); const [review, setReview] = useState('')
  const file = useRef()
  const pick = (e) => { const f = e.target.files[0]; if (f) setPhoto(URL.createObjectURL(f)) }
  const place = places.find((p) => p.id === pid)
  const ok = caption.trim() && photo
  return (
    <div className="full-over">
      <div className="row" style={{ padding: '16px' }}><button className="fn" onClick={onClose}>Cancel</button><b className="sp" style={{ textAlign: 'center' }}>New Post</b>
        <button className="btn sm" disabled={!ok} style={{ opacity: ok ? 1 : .4, background: 'var(--accent)', color: 'var(--onAccent)' }}
          onClick={() => onPost({ id: 'n' + Date.now(), author: currentUser, place, photo, caption: caption.trim(), review: review.trim() || null, rating, createdAt: Date.now(), likes: 0, comments: 0, tags: [], liked: false, saved: false })}>Post</button></div>
      <div className="scroll"><div className="col g16" style={{ padding: '0 16px 40px' }}>
        <button className="card" style={{ height: 220, display: 'grid', placeItems: 'center', borderStyle: photo ? 'solid' : 'dashed' }} onClick={() => file.current.click()}>
          {photo ? <img className="photo" src={photo} alt="" /> : <div className="col t2" style={{ alignItems: 'center', gap: 6 }}><L.ImagePlus size={32} /><span className="fn">Add a photo</span></div>}</button>
        <input ref={file} type="file" accept="image/*" hidden onChange={pick} />
        <div className="col g8"><span className="sec">Place</span><select className="field" value={pid} onChange={(e) => setPid(e.target.value)}>{places.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
        <div className="col g8"><span className="sec">Rating</span><div className="row g8">{[1, 2, 3, 4, 5].map((n) => <button key={n} onClick={() => setRating(n)}><L.Star size={28} color="var(--star)" fill={n <= rating ? 'var(--star)' : 'none'} /></button>)}</div></div>
        <textarea className="field" rows={3} placeholder="Write a caption…" value={caption} onChange={(e) => setCaption(e.target.value)} />
        <textarea className="field" rows={2} placeholder="Your review (optional)" value={review} onChange={(e) => setReview(e.target.value)} />
      </div></div>
    </div>
  )
}
