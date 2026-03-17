import { OperationsFeedPanel } from '../components/OperationsFeedPanel'
import { OperationsPolicyPanel } from '../components/OperationsPolicyPanel'
import { OperationsWorkflowPanel } from '../components/OperationsWorkflowPanel'
import { ScreenBanner } from '../components/ScreenBanner'
import { useOperationsActions } from '../hooks/useOperationsActions'
import { useOperationsFeedView } from '../hooks/useOperationsFeedView'

export function OperationsScreen() {
  const { updateModerationCase } = useOperationsActions()
  const {
    bookings,
    currentUserEmail,
    sourceFilter,
    setSourceFilter,
    categoryFilter,
    setCategoryFilter,
    savedViewAvailable,
    filteredFeed,
    moderationCases,
    notifications,
    saveView,
    loadView,
    clearView,
    applyPreset,
  } = useOperationsFeedView()

  return (
    <div className="screen-stack">
      <ScreenBanner
        chips={['Door control', 'Moderation', 'Audit feed']}
        detail="See the whole floor like an event control room instead of a plain admin page."
        eyebrow="Operations"
        imageAlt="Nightclub lights and crowd"
        imageUrl="https://images.unsplash.com/photo-1571266028243-d220c9f8fd56?auto=format&fit=crop&w=1200&q=80"
        module="operations"
        title="Run the venue floor with faster visual context"
      />

      <OperationsWorkflowPanel
        moderationCases={moderationCases}
        updateModerationCase={updateModerationCase}
      />

      <OperationsPolicyPanel />

      <OperationsFeedPanel
        currentUserEmail={currentUserEmail}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        savedViewAvailable={savedViewAvailable}
        filteredFeed={filteredFeed}
        bookingsCount={bookings.length}
        moderationCount={moderationCases.length}
        notificationsCount={notifications.length}
        saveView={saveView}
        loadView={loadView}
        clearView={clearView}
        applyPreset={applyPreset}
      />
    </div>
  )
}
