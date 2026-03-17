import type { NavItem, ScreenId } from '../types'

type SidebarProps = {
  items: NavItem[]
  activeScreen: ScreenId
  onSelect: (screen: ScreenId) => void
}

export function Sidebar({ items, activeScreen, onSelect }: SidebarProps) {
  const badges: Record<ScreenId, string> = {
    overview: 'OV',
    bookings: 'BK',
    hostess: 'FG',
    service: 'SV',
    operations: 'OP',
    analytics: 'AN',
  }

  return (
    <aside className="sidebar card">
      <div className="brand-lockup">
        <div className="brand-badge">BK</div>
        <div>
          <strong>Bambi Nightlife OS</strong>
          <p>Fast control for bookings, guests, service, and ops.</p>
        </div>
      </div>

      <nav className="nav-stack" aria-label="Primary navigation">
        {items.map((item) => {
          const isActive = item.id === activeScreen

          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelect(item.id)}
            >
              <span className="nav-badge">{badges[item.id]}</span>
              <div className="nav-copy">
                <span>{item.label}</span>
                <small>{item.shortLabel}</small>
              </div>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
