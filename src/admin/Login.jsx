import React, { useState } from 'react'
import './Login.css'

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simple password check (you can enhance this with proper authentication)
    // Default password is 'admin123' - change this in production!
    const correctPassword = 'admin123'

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300))

    if (password === correctPassword) {
      // Store authentication in sessionStorage
      sessionStorage.setItem('admin_authenticated', 'true')
      sessionStorage.setItem('admin_login_time', Date.now().toString())
      onLogin()
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }

    setLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <i className="fas fa-lock"></i>
          <h1>Admin Login</h1>
          <p>Enter password to access Simukitaa Store Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-key"></i> Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="Enter admin password"
              autoFocus
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading || !password}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Verifying...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i> Login
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            <i className="fas fa-shield-alt"></i> Secure Admin Access
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login



