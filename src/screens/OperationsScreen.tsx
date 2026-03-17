import { OperationsFeedPanel } from '../components/OperationsFeedPanel'
import { OperationsPolicyPanel } from '../components/OperationsPolicyPanel'
import { OperationsWorkflowPanel } from '../components/OperationsWorkflowPanel'
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
