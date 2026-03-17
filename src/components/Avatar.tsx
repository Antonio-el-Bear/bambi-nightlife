import { useEffect, useState } from 'react'

type AvatarProps = {
  name: string
  avatarUrl?: string
  size?: 'sm' | 'md' | 'lg'
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function Avatar({ name, avatarUrl, size = 'md' }: AvatarProps) {
  const [hasImageError, setHasImageError] = useState(false)

  useEffect(() => {
    setHasImageError(false)
  }, [avatarUrl])

  return (
    <div className={`avatar avatar-${size}`} aria-hidden="true">
      {avatarUrl && !hasImageError ? <img alt="" onError={() => setHasImageError(true)} src={avatarUrl} /> : getInitials(name)}
    </div>
  )
}