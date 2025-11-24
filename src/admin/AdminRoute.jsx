import React, { useState, useEffect } from 'react'
import AdminApp from './AdminApp'
import Login from './Login'

const AdminRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const authenticated = sessionStorage.getItem('admin_authenticated') === 'true'
      const loginTime = sessionStorage.getItem('admin_login_time')
      
      // Check if session is still valid (24 hours)
      if (authenticated && loginTime) {
        const timeDiff = Date.now() - parseInt(loginTime)
        const hoursDiff = timeDiff / (1000 * 60 * 60)
        
        if (hoursDiff > 24) {
          // Session expired
          sessionStorage.removeItem('admin_authenticated')
          sessionStorage.removeItem('admin_login_time')
          setIsAuthenticated(false)
        } else {
          setIsAuthenticated(true)
        }
      } else {
        setIsAuthenticated(false)
      }
      
      setChecking(false)
    }

    checkAuth()

    // Check for logout events (e.g., from other tabs)
    const handleStorageChange = (e) => {
      if (e.key === 'admin_authenticated' && e.newValue !== 'true') {
        setIsAuthenticated(false)
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleLogin = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated')
    sessionStorage.removeItem('admin_login_time')
    setIsAuthenticated(false)
  }

  if (checking) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#fafafa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: '#667eea', marginBottom: '16px' }}></i>
          <p style={{ color: '#6e6e73' }}>Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  return <AdminApp onLogout={handleLogout} />
}

export default AdminRoute
