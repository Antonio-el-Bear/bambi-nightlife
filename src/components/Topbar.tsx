import { useState } from 'react'
import type { NavItem, NotificationRecord, ScreenId } from '../types'
import { Avatar } from './Avatar'

type TopbarProps = {
  activeItem: NavItem
  items: NavItem[]
  activeScreen: ScreenId
  onSelect: (screen: ScreenId) => void
  currentUserName: string
  currentUserRole: string
  currentUserAvatarUrl?: string
  notifications: NotificationRecord[]
  onMarkNotificationRead: (notificationId: string) => void
  onMarkAllNotificationsRead: () => void
  onLogout: () => void
}

export function Topbar({
  activeItem,
  items,
  activeScreen,
  onSelect,
  currentUserName,
  currentUserRole,
  currentUserAvatarUrl,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onLogout,
}: TopbarProps) {
  const [isInboxOpen, setIsInboxOpen] = useState(false)
  const unreadCount = notifications.filter((notification) => notification.unread).length

  return (
    <>
      <header className="topbar card" data-module={activeItem.id}>
        <div>
          <span className="eyebrow">{activeItem.eyebrow}</span>
          <h2>{activeItem.title}</h2>
        </div>
        <div className="topbar-actions">
          <div className="notification-shell">
            <button
              type="button"
              className={`secondary-button notification-trigger ${unreadCount > 0 ? 'has-unread' : ''}`}
              onClick={() => setIsInboxOpen((current) => !current)}
            >
              Inbox {unreadCount > 0 ? `(${unreadCount})` : ''}
            </button>
            {isInboxOpen ? (
              <div className="notification-panel card">
                <div className="notification-panel-header">
                  <strong>Recent signals</strong>
                  <button
                    type="button"
                    className="text-button"
                    onClick={onMarkAllNotificationsRead}
                  >
                    Mark all read
                  </button>
                </div>
                <div className="notification-list">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 6).map((notification) => (
                      <button
                        key={notification.id}
                        type="button"
                        className={`notification-item ${notification.unread ? 'unread' : ''}`}
                        onClick={() => {
                          onMarkNotificationRead(notification.id)
                          setIsInboxOpen(false)
                        }}
                      >
                        <div className="notification-row">
                          <strong>{notification.title}</strong>
                          <span>{notification.createdAt}</span>
                        </div>
                        <p>{notification.detail}</p>
                      </button>
                    ))
                  ) : (
                    <p className="notification-empty">No alerts are waiting for this role.</p>
                  )}
                </div>
              </div>
            ) : null}
          </div>
          <div className="user-chip">
            <Avatar name={currentUserName} avatarUrl={currentUserAvatarUrl} size="sm" />
            <div className="user-chip-copy">
              <strong>{currentUserName}</strong>
              <span>{currentUserRole}</span>
            </div>
          </div>
          <button type="button" className="secondary-button" onClick={onLogout}>
            Log out
          </button>
        </div>
      </header>

      <nav className="mobile-nav card" aria-label="Mobile navigation">
        {items.map((item) => {
          const isActive = item.id === activeScreen

          return (
            <button
              key={item.id}
              type="button"
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              data-module={item.id}
              onClick={() => onSelect(item.id)}
            >
              {item.shortLabel}
            </button>
          )
        })}
      </nav>
    </>
  )
}
