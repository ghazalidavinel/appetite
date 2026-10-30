import React from 'react'
import * as L from 'lucide-react'
import { CATEGORY } from './data.js'

const ICONS = { coffee: L.Coffee, fork: L.UtensilsCrossed, bag: L.ShoppingBag, sparkles: L.Sparkles, flame: L.Flame,
  cake: L.Cake, banknote: L.Banknote, laptop: L.Laptop, camera: L.Camera }
export const catIcon = (c) => ICONS[CATEGORY[c]?.icon] || L.UtensilsCrossed
export const groupIcon = (k) => ICONS[k] || L.Sparkles

export function Ico({ n, size = 18, fill, color, sw }) {
  const C = typeof n === 'string' ? L[n] : n
  return <C size={size} fill={fill ? 'currentColor' : 'none'} color={color} strokeWidth={sw || (size > 22 ? 1.6 : 2)} />
}
export const Avatar = ({ src, size = 40 }) =>
  src ? <img className="avatar" src={src} width={size} height={size} style={{ width: size, height: size }} alt="" />
      : <div className="avatar" style={{ width: size, height: size, display: 'grid', placeItems: 'center' }}><L.HelpCircle size={size * .4} color="var(--text2)" /></div>

export function Rating({ value, size = 12 }) {
  return (
    <span className="row" style={{ gap: 2, fontSize: size }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const full = value >= i + 1, half = !full && value >= i + .5
        return (
          <span key={i} style={{ position: 'relative', display: 'inline-flex' }}>
            <L.Star size={size} color="var(--star)" strokeWidth={2} />
            {(full || half) && <span style={{ position: 'absolute', inset: 0, width: full ? '100%' : '50%', overflow: 'hidden' }}>
              <L.Star size={size} color="var(--star)" fill="var(--star)" strokeWidth={2} /></span>}
          </span>
        )
      })}
      <span className="t2" style={{ marginLeft: 2 }}>{value.toFixed(1)}</span>
    </span>
  )
}
export const Empty = ({ icon, title, message, action, onAction }) => (
  <div className="empty"><Ico n={icon} size={40} sw={1.4} /><b className="sb">{title}</b>
    {message && <span>{message}</span>}{action && <button className="btn" onClick={onAction}>{action}</button>}</div>
)
export const Loading = ({ msg = 'Loading…' }) => <div className="empty" style={{ flex: 1, justifyContent: 'center' }}><div className="spin" /><span>{msg}</span></div>
export const Chip = ({ on, icon, children, onClick }) => (
  <button className={'chip' + (on ? ' on' : '')} onClick={onClick}>{icon && <Ico n={icon} size={14} />}{children}</button>
)
export const Nav = ({ left, right, title, wordmark, onBack }) => (
  <div className="nav">
    <div className="side">{onBack ? <button onClick={onBack} aria-label="Back"><L.ChevronLeft size={24} /></button> : left}</div>
    {wordmark ? <img className="wm" src="/img/AppetiteWordmark.png" alt="appètite" /> : <div className="title">{title}</div>}
    <div className="side">{right}</div>
  </div>
)
export const Sheet = ({ onClose, children }) => (<><div className="sheet-back" onClick={onClose} /><div className="sheet">{children}</div></>)
