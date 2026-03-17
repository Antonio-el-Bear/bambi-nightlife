import { SectionHeader } from './SectionHeader'
import { arrivalBoard } from '../data/platformData'
import type { ModerationCase } from '../types'

type OperationsWorkflowPanelProps = {
  moderationCases: ModerationCase[]
  updateModerationCase: (
    caseId: string,
    state: ModerationCase['state'],
    confirmationCount?: number,
  ) => void
}

export function OperationsWorkflowPanel({
  moderationCases,
  updateModerationCase,
}: OperationsWorkflowPanelProps) {
  return (
    <section className="card split-layout">
      <div>
        <SectionHeader
          eyebrow="Moderation workflow"
          title="No one can ban a profile alone"
          description="The UI reflects the brief’s two-person confirmation rule and separates security flags from management decisions."
        />
        <div className="status-grid">
          {moderationCases.map((item) => (
            <article className="status-card" key={item.id}>
              <div className="status-top">
                <strong>{item.profileName}</strong>
                <span>{item.state}</span>
              </div>
              <p>{item.reason}</p>
              <div className="action-meta">
                <span>Confirmations: {item.confirmationCount}</span>
              </div>
              <div className="action-row">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    updateModerationCase(
                      item.id,
                      'under-review',
                      Math.max(item.confirmationCount, 2),
                    )
                  }
                >
                  Escalate
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    updateModerationCase(
                      item.id,
                      item.state === 'banned' ? 'reversed' : 'banned',
                    )
                  }
                >
                  {item.state === 'banned' ? 'Reverse ban' : 'Confirm ban'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div>
        <SectionHeader
          eyebrow="IoT arrival view"
          title="Door staff see the right information, and nothing more"
          description="Connected entrance screens stay read-only while still showing profile photo context, tier, group size, and ETA."
        />
        <div className="status-grid">
          {arrivalBoard.map((item) => (
            <article className="status-card" key={item.title}>
              <div className="status-top">
                <strong>{item.title}</strong>
                <span>{item.meta}</span>
              </div>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}