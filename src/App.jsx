import React, { useEffect, useState } from 'react'
import HolidayHeader from './components/HolidayHeader'
import ShopHeader from './components/ShopHeader'
import Navigation from './components/Navigation'
import Shelf from './components/Shelf'
import ElfsightInstagram from './components/ElfsightInstagram'
import Footer from './components/Footer'
import './App.css'

// Dynamically determine API base URL based on current hostname
const getApiBase = () => {
  // Use environment variable if available (for production)
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }
  
  const hostname = window.location.hostname
  // If accessing from localhost, use localhost for API
  // Otherwise use the same hostname (for network access)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001/api'
  }
  // For network access, use the same hostname but different port
  return `http://${hostname}:3001/api`
}

const API_BASE = getApiBase()

function App() {
  const [shelves, setShelves] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Ensure body has the background theme class
    if (!document.body.classList.contains('dd-holiday-202511-theme')) {
      document.body.classList.add('dd-holiday-202511-theme')
    }
    
    // Ensure html has js class (remove nojs if present)
    const html = document.documentElement
    html.className = html.className.replace(/\bnojs\b/, 'js')
    if (!html.className.includes('js')) {
      html.className += ' js'
    }

    // Load shelves from API
    loadShelves()
  }, [])

  const loadShelves = async () => {
    try {
      const response = await fetch(`${API_BASE}/shelves`)
      const data = await response.json()
      setShelves(data)
    } catch (error) {
      console.error('Error loading shelves:', error)
      // Fallback to empty array if API fails
      setShelves([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="app">
        <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>
      </div>
    )
  }

  return (
    <div className="app">
      <HolidayHeader />
      <ShopHeader />
      <Navigation />
      <main className="main-content">
        {shelves.map((shelf) => (
          <Shelf
            key={shelf.id}
            id={shelf.id}
            title={shelf.title}
            secondaryTitle={shelf.secondaryTitle}
            items={shelf.items || []}
            eyebrow={shelf.eyebrow}
          />
        ))}
      </main>
      <ElfsightInstagram />
      <Footer />
    </div>
  )
}

export default App
