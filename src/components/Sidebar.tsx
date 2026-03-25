import type { NavItem, ScreenId } from '../types'
import { useRef, useEffect } from 'react'
import anime from 'animejs'

type SidebarProps = {
  items: NavItem[]
  activeScreen: ScreenId
  onSelect: (screen: ScreenId) => void
}

// Map screen IDs to SVG icon IDs in public/icons.svg
const iconMap: Record<ScreenId, string> = {
  overview: 'x-icon',
  bookings: 'bluesky-icon',
  hostess: 'social-icon',
  service: 'discord-icon',
  operations: 'github-icon',
  analytics: 'documentation-icon',
}

export function Sidebar({ items, activeScreen, onSelect }: SidebarProps) {
  // Animate nav item on hover using animejs
  const navRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    navRefs.current.forEach((btn) => {
      if (!btn) return
      // Remove previous listeners to avoid stacking
      btn.onmouseenter = null
      btn.onmouseleave = null
      btn.onmouseenter = () => {
        anime({
          targets: btn,
          scale: 1.08,
          rotateY: 12,
          boxShadow: '0 4px 24px rgba(45,226,230,0.18)',
          duration: 500,
          easing: 'easeOutElastic(1, .7)'
        })
      }
      btn.onmouseleave = () => {
        anime({
          targets: btn,
          scale: 1,
          rotateY: 0,
          boxShadow: '0 0px 0px rgba(0,0,0,0)',
          duration: 500,
          easing: 'easeOutExpo'
        })
      }
    })
  }, [items])

  return (
    <aside className="sidebar card">
      <div className="brand-lockup">
        <svg width="32" height="32" className="modern-brand-icon">
          <use href="/icons.svg#x-icon" />
        </svg>
        <div>
          <strong>Bambi Nightlife OS</strong>
          <p>Fast control for bookings, guests, service, and ops.</p>
        </div>
      </div>

      <nav className="nav-stack" aria-label="Primary navigation">
        {items.map((item, idx) => {
          const isActive = item.id === activeScreen
          return (
            <button
              key={item.id}
              type="button"
              ref={el => navRefs.current[idx] = el}
              className={`nav-item modern-nav${isActive ? ' active' : ''}`}
              data-module={item.id}
              onClick={() => onSelect(item.id)}
              data-active={isActive ? 'true' : undefined}
            >
              <svg width="28" height="28" className="modern-nav-icon">
                <use href={`/icons.svg#${iconMap[item.id]}`} />
              </svg>
              <span className="modern-nav-label">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
