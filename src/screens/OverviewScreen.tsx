import { AttendanceSocialPanel } from '../components/AttendanceSocialPanel'
import { OverviewAuditPanel } from '../components/OverviewAuditPanel'
import { ProfileSettingsPanel } from '../components/ProfileSettingsPanel'
import { VenueFocusPanel } from '../components/VenueFocusPanel'
import { VenueManagementPanel } from '../components/VenueManagementPanel'
import { OverviewNotificationsPanel } from '../components/OverviewNotificationsPanel'
import { OverviewSnapshotPanel } from '../components/OverviewSnapshotPanel'
import { SectionHeader } from '../components/SectionHeader'
import { StatCard } from '../components/StatCard'
import { deliveryPhases, overviewPillars } from '../data/platformData'
import { useOverviewModel } from '../hooks/useOverviewModel'

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

  return (
    <div className="screen-stack">
      <section className="hero-panel card">
        <div>
          <span className="eyebrow">Built from the signed brief and scope</span>
          <h1>
            {currentUser ? `Welcome back, ${currentUser.name.split(' ')[0]}.` : 'Run the venue from one focused operating surface.'}
          </h1>
          <p className="hero-copy">
            This front-end turns the proposal into a usable product shell. It brings together premium bookings,
            female guest profile growth, waitress assignment workflows, moderation controls, and management visibility.
          </p>
        </div>
        <div className="stats-grid four-up">
          {dynamicStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
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

      <section className="card">
        <SectionHeader
          eyebrow="Product pillars"
          title="What the app is solving"
          description="The platform is designed around operational certainty, organic guest acquisition, and management control rather than generic nightlife promotion."
        />
        <div className="insight-grid three-up">
          {overviewPillars.map((item) => (
            <article className="insight-card" key={item.title}>
              <span className="eyebrow subtle">{item.eyebrow}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="card">
        <SectionHeader
          eyebrow="App structure"
          title="How the user journey unfolds"
          description="Each stage from booking to operations is reflected in a dedicated product surface, not hidden inside one overloaded dashboard."
        />
        <div className="timeline-grid">
          {deliveryPhases.map((phase) => (
            <article className="timeline-card" key={phase.step}>
              <span className="timeline-step">{phase.step}</span>
              <div>
                <strong>{phase.title}</strong>
                <p>{phase.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <OverviewSnapshotPanel bookings={visibleBookings} />
    </div>
  )
}
