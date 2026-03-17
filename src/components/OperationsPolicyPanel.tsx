import { SectionHeader } from './SectionHeader'
import { moderationQueue } from '../data/platformData'

export function OperationsPolicyPanel() {
  return (
    <section className="card">
      <SectionHeader
        eyebrow="Policy constraint"
        title="Moderation logic remains aligned to the brief"
        description="The action controls above simulate staff escalation, management confirmation, and administrator reversal without breaking the two-step rule concept."
      />
      <div className="status-grid three-up">
        {moderationQueue.map((item) => (
          <article className="status-card" key={item.title}>
            <div className="status-top">
              <strong>{item.title}</strong>
              <span>{item.meta}</span>
            </div>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  )
}