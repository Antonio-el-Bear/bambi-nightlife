import { PosterArtwork } from './PosterArtwork'

type ScreenBannerProps = {
  eyebrow: string
  title: string
  detail: string
  imageUrl: string
  imageAlt: string
  module: 'bookings' | 'hostess' | 'service' | 'operations' | 'analytics'
  chips: string[]
}

export function ScreenBanner({ eyebrow, title, detail, imageUrl, imageAlt, module, chips }: ScreenBannerProps) {
  return (
    <section className="card screen-banner" data-module={module}>
      <div className="screen-banner-copy">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{detail}</p>
        <div className="screen-banner-chips">
          {chips.map((chip) => (
            <span key={chip}>{chip}</span>
          ))}
        </div>
      </div>
      <div className="screen-banner-media">
        <PosterArtwork
          alt={imageAlt}
          className="screen-banner-image"
          fallbackDetail={detail}
          fallbackTitle={title}
          src={imageUrl}
        />
      </div>
    </section>
  )
}