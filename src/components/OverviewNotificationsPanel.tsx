import { Link } from 'react-router-dom'
import { SectionHeader } from './SectionHeader'
import type { NotificationRecord } from '../types'

type OverviewNotificationsPanelProps = {
  notifications: NotificationRecord[]
}

export function OverviewNotificationsPanel({
  notifications,
}: OverviewNotificationsPanelProps) {
  return (
    <section className="card split-layout wide-right">
      <div>
        <SectionHeader
          eyebrow="Notification flow"
          title="Role-aware alerts are now part of the operating model"
          description="Bookings, moderation, and hostess actions generate live signals so each role gets the next action without reading the whole system."
        />
        <div className="status-grid">
          {notifications.slice(0, 3).map((notification) => (
            <article className="status-card" key={notification.id}>
              <div className="status-top">
                <strong>{notification.title}</strong>
                <span>{notification.createdAt}</span>
              </div>
              <p>{notification.detail}</p>
              {notification.link ? (
                <Link className="inline-link" to={notification.link}>
                  Open related workflow
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </div>
      <aside className="summary-card accent">
        <span className="eyebrow subtle">Inbox health</span>
        <strong>{notifications.filter((notification) => notification.unread).length}</strong>
        <p>
          Unread notifications are filtered by the active profile so guests, service staff, and management each see only their own work.
        </p>
        <div className="action-meta">
          <span>Total visible alerts: {notifications.length}</span>
          <span>Source: bookings, hostess, operations</span>
        </div>
      </aside>
    </section>
  )
}