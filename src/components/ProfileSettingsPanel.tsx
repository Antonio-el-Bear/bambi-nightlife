import { useEffect, useState, type ChangeEvent } from 'react'
import type { AuthUser } from '../types'
import { Avatar } from './Avatar'
import { SectionHeader } from './SectionHeader'

type ProfileSettingsPanelProps = {
  currentUser: AuthUser
  onUpdate: (updates: Partial<Pick<AuthUser, 'name' | 'avatarUrl'>>) => void
}

export function ProfileSettingsPanel({ currentUser, onUpdate }: ProfileSettingsPanelProps) {
  const [displayName, setDisplayName] = useState(currentUser.name)
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl)
  const [feedback, setFeedback] = useState('Update your display name or profile image. Changes apply across the app and the login chooser.')

  useEffect(() => {
    setDisplayName(currentUser.name)
    setAvatarUrl(currentUser.avatarUrl)
    setFeedback('Update your display name or profile image. Changes apply across the app and the login chooser.')
  }, [currentUser.avatarUrl, currentUser.name])

  const handleAvatarUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    if (file.size > 1_000_000) {
      setFeedback('Profile image is too large. Use a file smaller than 1 MB.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    setFeedback(`Uploading ${file.name}...`)

    reader.onload = () => {
      if (typeof reader.result === 'string' && reader.result.length > 0) {
        setAvatarUrl(reader.result)
        setFeedback(`${file.name} is ready. Save profile changes to publish it.`)
        return
      }

      setFeedback('Profile image upload failed. Try another image or paste a hosted URL.')
    }

    reader.onerror = () => {
      setFeedback('Profile image upload failed. Try another image or paste a hosted URL.')
    }

    reader.readAsDataURL(file)
    event.target.value = ''
  }

  return (
    <section className="card split-layout profile-settings-layout">
      <form
        className="management-form"
        onSubmit={(event) => {
          event.preventDefault()
          onUpdate({
            name: displayName,
            avatarUrl,
          })
          setFeedback('Profile saved. Your updated name and avatar are now live across the app.')
        }}
      >
        <SectionHeader
          eyebrow="Profile settings"
          title="Let each person manage their own identity"
          description="Staff and guests can keep their name and profile picture current without leaving the overview screen."
        />
        <label>
          <span>Display name</span>
          <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} />
        </label>
        <label>
          <span>Avatar image URL</span>
          <input value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} />
        </label>
        <label>
          <span>Upload profile image</span>
          <input accept="image/*" onChange={handleAvatarUpload} type="file" />
        </label>
        <p className="field-hint">{feedback}</p>
        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setAvatarUrl('')
              setFeedback('Avatar cleared. Save your profile to switch back to initials.')
            }}
          >
            Clear avatar
          </button>
          <button type="submit" className="primary-button">Save profile</button>
        </div>
      </form>

      <aside className="summary-card profile-preview-card">
        <span className="eyebrow subtle">Live preview</span>
        <div className="profile-preview-head">
          <Avatar name={displayName || currentUser.name} avatarUrl={avatarUrl} size="lg" />
          <div className="profile-meta">
            <strong>{displayName || currentUser.name}</strong>
            <span>{currentUser.role}</span>
          </div>
        </div>
        <div className="summary-grid compact-grid">
          <div className="summary-chip">
            <span>Email</span>
            <strong>{currentUser.email}</strong>
          </div>
          <div className="summary-chip">
            <span>Avatar source</span>
            <strong>{avatarUrl ? 'Custom image' : 'Initials fallback'}</strong>
          </div>
        </div>
        <p className="field-hint">This preview matches the avatar shown in the top bar, login chooser, and role-aware views.</p>
      </aside>
    </section>
  )
}