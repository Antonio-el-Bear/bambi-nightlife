// Default icon fallback for each module
type DefaultShortcutIconProps = { id: string }
const DefaultShortcutIcon: React.FC<DefaultShortcutIconProps> = ({ id }) => {
  switch (id) {
    case 'bookings':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="8" width="20" height="14" rx="4" fill="#FFB84D"/><rect x="8" y="4" width="12" height="6" rx="2" fill="#FF5FA2"/></svg>
      );
    case 'hostess':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><ellipse cx="14" cy="16" rx="8" ry="6" fill="#FF5FA2"/><ellipse cx="14" cy="10" rx="4" ry="4" fill="#FFB84D"/></svg>
      );
    case 'service':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="6" y="10" width="16" height="8" rx="4" fill="#2DE2E6"/><rect x="10" y="6" width="8" height="4" rx="2" fill="#8B5CF6"/></svg>
      );
    case 'operations':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="8" y="8" width="12" height="12" rx="6" fill="#8B5CF6"/><rect x="12" y="4" width="4" height="8" rx="2" fill="#FF5FA2"/></svg>
      );
    case 'analytics':
      return (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="6" y="16" width="4" height="6" rx="2" fill="#2DE2E6"/><rect x="12" y="10" width="4" height="12" rx="2" fill="#FFB84D"/><rect x="18" y="6" width="4" height="16" rx="2" fill="#FF5FA2"/></svg>
      );
    default:
      return null;
  }
};
import { AttendanceSocialPanel } from '../components/AttendanceSocialPanel'
import { OverviewAuditPanel } from '../components/OverviewAuditPanel'
import { PosterArtwork } from '../components/PosterArtwork'
import { ProfileSettingsPanel } from '../components/ProfileSettingsPanel'
import { TonightStrip } from '../components/TonightStrip'
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
    tonightSignals,
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
            <Link className="shortcut-card animated-pulse" data-module={item.id} key={item.id} to={screenToRoute[item.id]}>
              <span className="shortcut-icon">
                <DefaultShortcutIcon id={item.id} />
              </span>
              <span className="shortcut-badge">{quickAccessBadges[item.id]}</span>
              <strong>{item.label}</strong>
              <span>{item.shortLabel}</span>
            </Link>
          ))}
        </div>



      </section>

      <TonightStrip signals={tonightSignals} />

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
