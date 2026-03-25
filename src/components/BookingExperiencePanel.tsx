import { SectionHeader } from './SectionHeader'
import { TableMap } from './TableMap'
import { bookingPolicies, bookingTables } from '../data/platformData'

type BookingExperiencePanelProps = {
  selectedTableId: string
  onSelectTable: (tableId: string) => void
}

export function BookingExperiencePanel({
  selectedTableId,
  onSelectTable,
}: BookingExperiencePanelProps) {
  // Only show available tables (fake/demo data)
  const availableTables = bookingTables.filter((t) => t.status === 'available')
  return (
    <section className="card split-layout wide-right">
      <div>
        <SectionHeader
          eyebrow="Choose a table"
          title="Book a club table"
        />
        <TableMap
          tables={availableTables}
          selectedTableId={selectedTableId}
          onSelect={onSelectTable}
        />
      </div>
      <div>
        <SectionHeader
          eyebrow="Booking info"
          title="Demo only"
        />
        <div className="checklist-grid">
          <article className="checklist-card">
            <strong>Fake club info</strong>
            <p>All data is for demo purposes only.</p>
          </article>
        </div>
      </div>
    </section>
  )
}