import { SectionHeader } from '../components/SectionHeader'
import { hostessChecks, rewardTiers } from '../data/platformData'
import { useHostessActions } from '../hooks/useHostessActions'

export function HostessScreen() {
  const { hostessProfiles, updateBottleRequest, updateHostessApproval } = useHostessActions()

  return (
    <div className="screen-stack">
      <section className="card split-layout">
        <div>
          <SectionHeader
            eyebrow="Female guest system"
            title="Verification and rewards are product features, not back-office notes"
            description="The platform replaces promoter dependency with a controlled female guest growth loop that stays visible and measurable."
          />
          <div className="checklist-grid">
            {hostessChecks.map((item) => (
              <article className="checklist-card" key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
        <div>
          <SectionHeader
            eyebrow="Reward engine"
            title="Group size to reward mapping"
            description="The reward system is explicit and easy for management to monitor as group sizes grow."
          />
          <div className="reward-grid">
            {rewardTiers.map((tier) => (
              <article className="reward-card" key={tier.groupSize}>
                <strong>{tier.groupSize}</strong>
                <p>{tier.reward}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="card">
        <SectionHeader
          eyebrow="Live queue"
          title="Approvals, requests, and reward preparation"
          description="This screen gives management and operations a concise picture of what needs attention right now."
        />
        <div className="status-grid three-up">
          {hostessProfiles.map((profile) => (
            <article className="status-card" key={profile.id}>
              <div className="status-top">
                <strong>{profile.name}</strong>
                <span>{profile.tier}</span>
              </div>
              <p>
                {profile.handle} brings a group of {profile.groupSize}. Reward package: {profile.reward}.
              </p>
              <div className="action-meta">
                <span>Approval: {profile.approvalStatus}</span>
                <span>Bottle request: {profile.bottleRequestStatus}</span>
              </div>
              <div className="action-row">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => updateHostessApproval(profile.id, 'approved')}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => updateBottleRequest(profile.id, 'accepted')}
                >
                  Accept request
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
