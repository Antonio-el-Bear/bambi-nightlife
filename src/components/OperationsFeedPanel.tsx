import { SectionHeader } from './SectionHeader'
import type {
  OperationsFeedCategoryFilter,
  OperationsFeedSourceFilter,
} from '../hooks/useOperationsFeedView'
import type { OperationsFeedEntry } from '../utils/operationsFeed'
import { downloadCsv } from '../utils/csv'
import { formatRelativeAge, getFeedSignal } from '../utils/opsSignals'

type OperationsFeedPanelProps = {
  currentUserEmail?: string
  sourceFilter: OperationsFeedSourceFilter
  setSourceFilter: (value: OperationsFeedSourceFilter) => void
  categoryFilter: OperationsFeedCategoryFilter
  setCategoryFilter: (value: OperationsFeedCategoryFilter) => void
  savedViewAvailable: boolean
  filteredFeed: OperationsFeedEntry[]
  bookingsCount: number
  moderationCount: number
  notificationsCount: number
  saveView: () => void
  loadView: () => void
  clearView: () => void
  applyPreset: (preset: 'critical' | 'commercial' | 'reset') => void
}

export function OperationsFeedPanel({
  currentUserEmail,
  sourceFilter,
  setSourceFilter,
  categoryFilter,
  setCategoryFilter,
  savedViewAvailable,
  filteredFeed,
  bookingsCount,
  moderationCount,
  notificationsCount,
  saveView,
  loadView,
  clearView,
  applyPreset,
}: OperationsFeedPanelProps) {
  return (
    <section className="card split-layout wide-right">
      <div>
        <SectionHeader
          eyebrow="Operations timeline"
          title="One audit feed across bookings, payment, moderation, and alerts"
          description="Instead of hunting through separate modules, operators can review the latest cross-system events in one sorted control-room timeline."
        />
        <div className="form-actions export-actions">
          <button type="button" className="secondary-button" onClick={() => applyPreset('critical')}>
            Critical review
          </button>
          <button type="button" className="secondary-button" onClick={() => applyPreset('commercial')}>
            Commercial events
          </button>
          <button type="button" className="secondary-button" onClick={() => applyPreset('reset')}>
            Reset filters
          </button>
          <button type="button" className="secondary-button" onClick={saveView}>
            Save feed view
          </button>
          <button type="button" className="secondary-button" onClick={loadView}>
            Load feed view
          </button>
          <button type="button" className="secondary-button" onClick={clearView}>
            Clear feed view
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              downloadCsv(
                'bambi-operations-feed.csv',
                ['Timestamp', 'Source', 'Title', 'Detail'],
                filteredFeed.map((entry) => [entry.at, entry.source, entry.title, entry.detail]),
              )
            }
          >
            Export feed CSV
          </button>
        </div>
        <div className="action-meta compact-meta preset-meta">
          <span>{savedViewAvailable ? 'Saved feed view available' : 'No saved feed view stored'}</span>
          <span>{currentUserEmail ?? 'operations profile'}</span>
          <span>{filteredFeed.length} visible events</span>
        </div>
        <div className="filter-toolbar">
          <label>
            <span>Source</span>
            <select
              value={sourceFilter}
              onChange={(event) => setSourceFilter(event.target.value as OperationsFeedSourceFilter)}
            >
              <option value="all">All</option>
              <option value="Booking">Booking</option>
              <option value="Moderation">Moderation</option>
              <option value="Notification">Notification</option>
            </select>
          </label>
          <label>
            <span>Category</span>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value as OperationsFeedCategoryFilter)}
            >
              <option value="all">All</option>
              <option value="booking">Booking</option>
              <option value="payments">Payments</option>
              <option value="attendance">Attendance</option>
              <option value="recovery">Recovery</option>
              <option value="moderation">Moderation</option>
              <option value="system">System</option>
            </select>
          </label>
        </div>
        <div className="history-list">
          {filteredFeed.map((entry) => {
            const signal = getFeedSignal(entry.source, entry.title, entry.detail)

            return (
              <article className="history-item" key={entry.id}>
                <div className="history-marker" />
                <div>
                  <strong>{entry.title}</strong>
                  <span>{entry.at}</span>
                  <p>{entry.detail}</p>
                  <div className="action-meta compact-meta">
                    <span>{entry.source}</span>
                    <span>{entry.category}</span>
                    {entry.actor ? <span>{entry.actor}</span> : null}
                    <span>{formatRelativeAge(entry.at)}</span>
                    <span className={`signal-badge tone-${signal.tone}`}>{signal.label}</span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
      <aside className="summary-card accent">
        <span className="eyebrow subtle">Feed health</span>
        <strong>{filteredFeed.length}</strong>
        <p>
          The audit feed now merges the main operational systems so management can review current risk and flow in one place.
        </p>
        <div className="action-meta">
          <span>Bookings: {bookingsCount}</span>
          <span>Moderation: {moderationCount}</span>
          <span>Notifications: {notificationsCount}</span>
        </div>
      </aside>
    </section>
  )
}