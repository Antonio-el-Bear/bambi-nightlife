import { useMemo, useState } from 'react'
import type { AttendancePost, AuthUser, SocialPlatform } from '../types'
import { Avatar } from './Avatar'
import { SectionHeader } from './SectionHeader'

type AttendanceSocialPanelProps = {
  canCreatePosts: boolean
  currentUser: AuthUser | null
  defaultClubName: string
  defaultAttendingDate: string
  defaultCaption: string
  posts: AttendancePost[]
  onCreatePost: (input: Pick<AttendancePost, 'clubName' | 'attendingDate' | 'caption' | 'platforms'>) => void
}

const platformOptions: Array<{ id: SocialPlatform; label: string }> = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'x', label: 'X' },
]

function buildShareText(post: Pick<AttendancePost, 'authorName' | 'clubName' | 'attendingDate' | 'caption'>) {
  return `${post.authorName} is heading to ${post.clubName} on ${post.attendingDate}. ${post.caption} #BambiNight`
}

function buildShareUrl(platform: Exclude<SocialPlatform, 'instagram'>, message: string, pageUrl: string) {
  const encodedMessage = encodeURIComponent(message)
  const encodedPageUrl = encodeURIComponent(pageUrl)

  if (platform === 'whatsapp') {
    return `https://wa.me/?text=${encodedMessage}%20${encodedPageUrl}`
  }

  if (platform === 'facebook') {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodedPageUrl}&quote=${encodedMessage}`
  }

  return `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedPageUrl}`
}

export function AttendanceSocialPanel({
  canCreatePosts,
  currentUser,
  defaultClubName,
  defaultAttendingDate,
  defaultCaption,
  posts,
  onCreatePost,
}: AttendanceSocialPanelProps) {
  const [clubName, setClubName] = useState(defaultClubName)
  const [attendingDate, setAttendingDate] = useState(defaultAttendingDate)
  const [caption, setCaption] = useState(defaultCaption)
  const [platforms, setPlatforms] = useState<SocialPlatform[]>(['instagram', 'whatsapp'])
  const [feedback, setFeedback] = useState('Create a post and share where you will be attending tonight.')

  const previewAuthor = currentUser?.name ?? 'Guest'
  const previewMessage = useMemo(
    () => buildShareText({ authorName: previewAuthor, clubName, attendingDate, caption }),
    [attendingDate, caption, clubName, previewAuthor],
  )

  const sharePageUrl = typeof window !== 'undefined' ? window.location.href : 'https://bambi.local/app'

  const togglePlatform = (platform: SocialPlatform) => {
    setPlatforms((current) =>
      current.includes(platform)
        ? current.filter((entry) => entry !== platform)
        : [...current, platform],
    )
  }

  const copyText = async (message: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(message)
      return true
    }

    return false
  }

  const shareOut = async (platform: SocialPlatform, message: string) => {
    if (platform === 'instagram') {
      const copied = await copyText(message)
      setFeedback(
        copied
          ? 'Caption copied. Paste it into Instagram with your story or post.'
          : 'Instagram web posting is limited. Copy the preview text and paste it into Instagram manually.',
      )
      return
    }

    window.open(buildShareUrl(platform, message, sharePageUrl), '_blank', 'noopener,noreferrer')
    setFeedback(`Share flow opened for ${platform}.`)
  }

  const handleNativeShare = async (message: string) => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({
        title: `${clubName} attendance`,
        text: message,
        url: sharePageUrl,
      })
      setFeedback('Native share sheet opened.')
      return
    }

    const copied = await copyText(`${message} ${sharePageUrl}`)
    setFeedback(copied ? 'Share text copied. Paste it into any social app.' : 'Share text is ready in the preview block.')
  }

  return (
    <section className="card split-layout wide-right">
      <div>
        <SectionHeader
          eyebrow="Attendance social"
          title="Let guests and staff post where they will be attending"
          description="Guests, female guests, and waitresses can publish where they are going, then push that message out to their social channels from one composer."
        />
        {canCreatePosts && currentUser ? (
          <form
            className="management-form"
            onSubmit={(event) => {
              event.preventDefault()

              onCreatePost({
                clubName,
                attendingDate,
                caption,
                platforms,
              })

              setFeedback('Attendance post saved to the live feed. Use the share buttons to push it out.')
            }}
          >
            <div className="form-grid">
              <label>
                <span>Club / venue</span>
                <input value={clubName} onChange={(event) => setClubName(event.target.value)} />
              </label>
              <label>
                <span>Attending date</span>
                <input type="date" value={attendingDate} onChange={(event) => setAttendingDate(event.target.value)} />
              </label>
            </div>
            <label>
              <span>Social caption</span>
              <textarea rows={4} value={caption} onChange={(event) => setCaption(event.target.value)} />
            </label>
            <div className="platform-grid" role="group" aria-label="Social platforms">
              {platformOptions.map((platform) => {
                const isSelected = platforms.includes(platform.id)

                return (
                  <button
                    key={platform.id}
                    type="button"
                    className={`preset-button ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => togglePlatform(platform.id)}
                  >
                    {platform.label}
                  </button>
                )
              })}
            </div>
            <div className="social-preview-card">
              <div className="profile-preview-head">
                <Avatar name={currentUser.name} avatarUrl={currentUser.avatarUrl} size="sm" />
                <div className="profile-meta">
                  <strong>{currentUser.name}</strong>
                  <span>{currentUser.role}</span>
                </div>
              </div>
              <strong>{clubName}</strong>
              <p>{previewMessage}</p>
            </div>
            <p className="field-hint">{feedback}</p>
            <div className="form-actions">
              <button type="submit" className="primary-button">Post attendance update</button>
              <button type="button" className="secondary-button" onClick={() => void handleNativeShare(previewMessage)}>
                Share now
              </button>
              {platforms.map((platform) => (
                <button
                  key={platform}
                  type="button"
                  className="secondary-button"
                  onClick={() => void shareOut(platform, previewMessage)}
                >
                  {platform === 'instagram' ? 'Copy for Instagram' : `Share to ${platform}`}
                </button>
              ))}
            </div>
          </form>
        ) : (
          <article className="summary-card accent">
            <strong>Posting is limited to guest-facing roles</strong>
            <p>Management and admin can still watch the live attendance feed, but only guests, female guests, and waitresses can create and share these posts.</p>
          </article>
        )}
      </div>

      <aside className="summary-card social-feed-card">
        <span className="eyebrow subtle">Recent attendance posts</span>
        <div className="social-feed-list">
          {posts.map((post) => {
            const postMessage = buildShareText(post)

            return (
              <article className="social-feed-item" key={post.id}>
                <div className="profile-preview-head">
                  <Avatar name={post.authorName} avatarUrl={post.authorAvatarUrl} size="sm" />
                  <div className="profile-meta">
                    <strong>{post.authorName}</strong>
                    <span>{post.authorRole}</span>
                  </div>
                </div>
                <strong>{post.clubName}</strong>
                <p>{post.caption}</p>
                <div className="action-meta compact-meta">
                  <span>{post.attendingDate}</span>
                  <span>{post.createdAt}</span>
                  <span>{post.platforms.join(', ')}</span>
                </div>
                <div className="form-actions compact-actions">
                  <button type="button" className="secondary-button" onClick={() => void handleNativeShare(postMessage)}>
                    Share
                  </button>
                  {post.platforms.slice(0, 2).map((platform) => (
                    <button
                      key={`${post.id}-${platform}`}
                      type="button"
                      className="secondary-button"
                      onClick={() => void shareOut(platform, postMessage)}
                    >
                      {platform === 'instagram' ? 'Instagram copy' : platform}
                    </button>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      </aside>
    </section>
  )
}