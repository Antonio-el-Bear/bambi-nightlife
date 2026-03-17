import { SectionHeader } from '../components/SectionHeader'
import { ServiceQueuePanel } from '../components/ServiceQueuePanel'
import { StatCard } from '../components/StatCard'
import { serviceStats } from '../data/platformData'
import { useServiceQueue } from '../hooks/useServiceQueue'

export function ServiceScreen() {
  const { activeQueue, acceptBooking, reassignBooking } = useServiceQueue()

  return (
    <div className="screen-stack">
      <section className="card">
        <SectionHeader
          eyebrow="Waitress assignment"
          title="The service queue is timed and transparent"
          description="Assignments arrive instantly, guests can request a preferred waitress, and the platform handles fallbacks without manual chasing."
        />
        <div className="stats-grid three-up">
          {serviceStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <ServiceQueuePanel
        activeQueue={activeQueue}
        acceptBooking={acceptBooking}
        reassignBooking={reassignBooking}
      />
    </div>
  )
}
