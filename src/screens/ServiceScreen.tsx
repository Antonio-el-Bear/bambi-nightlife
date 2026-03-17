import { ScreenBanner } from '../components/ScreenBanner'
import { SectionHeader } from '../components/SectionHeader'
import { ServiceQueuePanel } from '../components/ServiceQueuePanel'
import { StatCard } from '../components/StatCard'
import { serviceStats } from '../data/platformData'
import { useServiceQueue } from '../hooks/useServiceQueue'

export function ServiceScreen() {
  const { activeQueue, acceptBooking, reassignBooking, currentWaitressOffer } = useServiceQueue()

  return (
    <div className="screen-stack">
      <ScreenBanner
        chips={['Live queue', 'Response SLA', 'Shift offer']}
        detail="Service assignments should feel active, fast, and premium from the first glance."
        eyebrow="Service"
        imageAlt="Bottle service at a nightclub"
        imageUrl="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80"
        module="service"
        title="Keep the service floor moving in real time"
      />

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
        <div className="summary-card accent">
          <span className="eyebrow subtle">Current waitress offer</span>
          <strong>{currentWaitressOffer.title}</strong>
          <p>{currentWaitressOffer.detail}</p>
          <div className="action-meta">
            <span>{currentWaitressOffer.value}</span>
          </div>
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
