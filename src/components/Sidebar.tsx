import type { NavItem, ScreenId } from '../types'

type SidebarProps = {
  items: NavItem[]
  activeScreen: ScreenId
  onSelect: (screen: ScreenId) => void
}

export function Sidebar({ items, activeScreen, onSelect }: SidebarProps) {
  return (
    <aside className="sidebar card">
      <div className="brand-lockup">
        <div className="brand-badge">BK</div>
        <div>
          <strong>Bambi Nightlife OS</strong>
          <p>Luxury bookings, hostess growth, service control, and management oversight.</p>
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
              <span>{item.label}</span>
              <small>{item.eyebrow}</small>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-note">
        <span className="eyebrow subtle">Product posture</span>
        <strong>Focused, mobile-friendly, and built from the signed scope.</strong>
        <p>
          This front-end is structured to split cleanly into production pages later without throwing away the
          information architecture established here.
        </p>
      </div>
    </aside>
  )
}
