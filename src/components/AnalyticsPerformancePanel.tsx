import { SectionHeader } from './SectionHeader'
import { analyticsBars } from '../data/platformData'

export function AnalyticsPerformancePanel() {
  return (
    <div>
      <SectionHeader
        eyebrow="Performance bars"
        title="Key nightly signals"
        description="These indicators show management where the operating model is performing well and where leakage still exists."
      />
      <div className="bar-chart">
        {analyticsBars.map((bar) => (
          <article className="bar-row" key={bar.label}>
            <div className="bar-head">
              <strong>{bar.label}</strong>
              <span>{bar.value}%</span>
            </div>
            <div className="bar-track">
              <div className={`bar-fill ${bar.fillClass}`} />
            </div>
            <p>{bar.detail}</p>
          </article>
        ))}
      </div>
    </div>
  )
}