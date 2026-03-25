import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { Topbar } from '../components/Topbar'
import { useAppShellModel } from '../hooks/useAppShellModel'
import { canAccessScreen, getDefaultRouteForRole, screenToRoute } from '../data/access'

export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    activeItem,
    activeScreen,
    accessibleItems,
    currentUser,
    logout,
    markAllNotificationsRead,
    markNotificationRead,
    visibleNotifications,
  } = useAppShellModel(location.pathname)

  useEffect(() => {
    if (!currentUser) {
      return
    }
    if (!canAccessScreen(currentUser.role, activeScreen)) {
      navigate(getDefaultRouteForRole(currentUser.role), { replace: true })
    }
  }, [activeScreen, currentUser, navigate])

  return (
    <div className="twitter-shell">
      <aside className="twitter-sidebar">
        <Sidebar
          items={accessibleItems}
          activeScreen={activeScreen}
          onSelect={(screen) => navigate(screenToRoute[screen])}
        />
      </aside>
      <div className="twitter-main">
        <Topbar
          activeItem={activeItem}
          items={accessibleItems}
          activeScreen={activeScreen}
          onSelect={(screen) => navigate(screenToRoute[screen])}
          currentUserName={currentUser?.name ?? 'Demo user'}
          currentUserRole={currentUser?.role ?? 'guest'}
          currentUserAvatarUrl={currentUser?.avatarUrl}
          notifications={visibleNotifications}
          onMarkNotificationRead={(notificationId) => {
            markNotificationRead(notificationId)
            const selected = visibleNotifications.find((notification) => notification.id === notificationId)
            if (selected?.link) {
              navigate(selected.link)
            }
          }}
          onMarkAllNotificationsRead={markAllNotificationsRead}
          onLogout={() => {
            logout()
            navigate('/login')
          }}
        />
        <main className="twitter-content">
          <Outlet />
        </main>
      </div>
      <aside className="twitter-rightbar">
        {/* Optional: Add trending, suggestions, or extra info here */}
      </aside>
    </div>
  )
}
