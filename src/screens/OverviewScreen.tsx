import { AttendanceSocialPanel } from '../components/AttendanceSocialPanel'
import { OverviewAuditPanel } from '../components/OverviewAuditPanel'
import { PosterArtwork } from '../components/PosterArtwork'
import { ProfileSettingsPanel } from '../components/ProfileSettingsPanel'
import { VenueFocusPanel } from '../components/VenueFocusPanel'
import { VenueManagementPanel } from '../components/VenueManagementPanel'
import { OverviewNotificationsPanel } from '../components/OverviewNotificationsPanel'
import { OverviewSnapshotPanel } from '../components/OverviewSnapshotPanel'
import { StatCard } from '../components/StatCard'
import { getAccessibleNavItems, screenToRoute } from '../data/access'
import { useOverviewModel } from '../hooks/useOverviewModel'
import { Link } from 'react-router-dom'

export function OverviewScreen() {
  const {
    currentUser,
    visibleBookings,
    visibleAttendancePosts,
    dynamicStats,
    visibleNotifications,
    operationsHighlights,
    venueManagementSettings,
    updateVenueManagementSettings,
    updateCurrentUserProfile,
    createAttendancePost,
    canCreateAttendancePosts,
    canManageVenueSettings,
  } =
    useOverviewModel()

  const quickAccessItems = getAccessibleNavItems(currentUser?.role ?? 'guest').filter((item) => item.id !== 'overview')
  const quickAccessBadges: Record<(typeof quickAccessItems)[number]['id'] | 'overview', string> = {
    overview: 'OV',
    bookings: 'BK',
    hostess: 'FG',
    service: 'SV',
    operations: 'OP',
    analytics: 'AN',
  }

  return (
    <div className="screen-stack">
      <section className="hero-panel card dashboard-hero">
        <div className="hero-copy-block">
          <span className="eyebrow">Built from the signed brief and scope</span>
          <h1>
            {currentUser ? `Welcome back, ${currentUser.name.split(' ')[0]}.` : 'Run the venue from one focused operating surface.'}
          </h1>
          <p className="hero-copy">
            Bookings, guest growth, service, and floor control in one fast dashboard.
          </p>
        </div>
        <div className="hero-visual-shell">
          <PosterArtwork
            alt={venueManagementSettings.featuredEventTitle}
            className="hero-poster"
            fallbackDetail="The active campaign artwork will appear here."
            fallbackTitle={venueManagementSettings.featuredEventTitle}
            src={venueManagementSettings.featuredEventPosterUrl}
          />
        </div>
        <div className="stats-grid four-up">
          {dynamicStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section className="card quick-access-panel">
        <div className="quick-access-head">
          <span className="eyebrow">Quick access</span>
        </div>
        <div className="shortcut-grid">
          {quickAccessItems.map((item) => (
            <Link className="shortcut-card" key={item.id} to={screenToRoute[item.id]}>
              <span className="shortcut-badge">{quickAccessBadges[item.id]}</span>
              <strong>{item.label}</strong>
              <span>{item.shortLabel}</span>
            </Link>
          ))}
        </div>
      </section>

      {currentUser ? (
        <ProfileSettingsPanel currentUser={currentUser} onUpdate={updateCurrentUserProfile} />
      ) : null}

      <AttendanceSocialPanel
        canCreatePosts={canCreateAttendancePosts}
        currentUser={currentUser}
        defaultClubName="Bambi Nightclub"
        defaultAttendingDate={venueManagementSettings.featuredEventDate}
        defaultCaption={`Heading to Bambi for ${venueManagementSettings.featuredEventTitle}. ${venueManagementSettings.featuredEventSummary}`}
        onCreatePost={createAttendancePost}
        posts={visibleAttendancePosts}
      />

      <VenueFocusPanel settings={venueManagementSettings} />

      <OverviewNotificationsPanel notifications={visibleNotifications} />

      {canManageVenueSettings ? (
        <VenueManagementPanel
          actorName={currentUser?.name ?? 'Management'}
          settings={venueManagementSettings}
          onUpdate={updateVenueManagementSettings}
        />
      ) : null}

      <OverviewAuditPanel events={operationsHighlights} />

      <OverviewSnapshotPanel bookings={visibleBookings} />
    </div>
  )
}
