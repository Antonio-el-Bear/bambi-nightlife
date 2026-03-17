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
  return (
    <section className="card split-layout wide-right">
      <div>
        <SectionHeader
          eyebrow="Interactive floor view"
          title="Visual table selection"
          description="The map gives guests immediate context on what they are buying instead of forcing them through an abstract form."
        />
        <TableMap
          tables={bookingTables}
          selectedTableId={selectedTableId}
          onSelect={onSelectTable}
        />
      </div>
      <div>
        <SectionHeader
          eyebrow="Booking rules"
          title="Checkout behaviors tied to the brief"
          description="These controls reflect the commercial rules already defined in the project documents."
        />
        <div className="checklist-grid">
          {bookingPolicies.map((policy) => (
            <article className="checklist-card" key={policy.title}>
              <strong>{policy.title}</strong>
              <p>{policy.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}