import { useEffect, useState } from 'react'

type PosterArtworkProps = {
  src: string
  alt: string
  className?: string
  fallbackTitle: string
  fallbackDetail: string
}

export function PosterArtwork({ src, alt, className, fallbackTitle, fallbackDetail }: PosterArtworkProps) {
  const [hasError, setHasError] = useState(!src.trim())

  useEffect(() => {
    setHasError(!src.trim())
  }, [src])

  if (!src.trim() || hasError) {
    return (
      <div className="poster-fallback">
        <span className="eyebrow subtle">Poster preview</span>
        <strong>{fallbackTitle}</strong>
        <p>{fallbackDetail}</p>
      </div>
    )
  }

  return <img alt={alt} className={className} onError={() => setHasError(true)} src={src} />
}