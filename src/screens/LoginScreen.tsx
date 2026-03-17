import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function LoginScreen() {
  const navigate = useNavigate()
  const { loginAs, loginOptions } = useAuth()

  return (
    <div className="auth-shell">
      <section className="auth-panel card">
        <div>
          <span className="eyebrow">Prototype access</span>
          <h1>Enter the platform by role.</h1>
          <p className="hero-copy">
            This is a front-end product simulation, so the sign-in flow uses role-based demo access instead of a live identity provider.
          </p>
        </div>

        <div className="auth-grid">
          {loginOptions.map((option) => (
            <button
              key={option.email}
              type="button"
              className="auth-option"
              onClick={() => {
                loginAs(option.email)
                navigate('/app')
              }}
            >
              <strong>{option.label}</strong>
              <span>{option.name}</span>
              <small>{option.email}</small>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
