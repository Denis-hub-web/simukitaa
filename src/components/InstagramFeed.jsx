import React, { useState, useEffect } from 'react'
import './InstagramFeed.css'

const INSTAGRAM_USERNAME = 'simukitaa_'
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_USERNAME}/`

// Dynamically determine API base URL
const getApiBase = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }
  const hostname = window.location.hostname
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:3001/api'
  }
  return `http://${hostname}:3001/api`
}

const API_BASE = getApiBase()

const InstagramFeed = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`${API_BASE}/instagram`)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `HTTP ${response.status}`)
        }
        
        const data = await response.json()
        setPosts(data)
      } catch (err) {
        console.error('Error loading Instagram posts:', err)
        setError(err.message)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  return (
    <section className="instagram-section">
      <div className="as-l-container">
        <div className="instagram-header">
          <div className="instagram-header-content">
            <div className="instagram-icon-wrapper">
              <i className="fab fa-instagram"></i>
            </div>
            <div className="instagram-header-text">
              <h2 className="instagram-title">Follow Us on Instagram</h2>
              <p className="instagram-subtitle">@simukitaa_</p>
            </div>
          </div>
          <a 
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-follow-btn"
          >
            Follow Us
            <i className="fas fa-external-link-alt"></i>
          </a>
        </div>

        {loading ? (
          <div className="instagram-loading">
            <i className="fab fa-instagram"></i>
            <p>Loading Instagram posts...</p>
          </div>
        ) : error ? (
          <div className="instagram-placeholder">
            <div className="instagram-placeholder-content">
              <i className="fab fa-instagram"></i>
              <h3>Instagram Feed Unavailable</h3>
              <p>{error}</p>
              <p style={{ fontSize: '14px', color: '#8e8e8e', marginTop: '10px' }}>
                Make sure INSTAGRAM_ACCESS_TOKEN is set in your server environment variables.
              </p>
              <a 
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-link-btn"
              >
                Visit Our Instagram
                <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="instagram-placeholder">
            <div className="instagram-placeholder-content">
              <i className="fab fa-instagram"></i>
              <h3>No Posts Yet</h3>
              <p>Check back soon for updates!</p>
              <a 
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-link-btn"
              >
                Visit Our Instagram
                <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          </div>
        ) : (
          <div className="instagram-grid">
            {posts.map((post, index) => (
              <div key={index} className="instagram-post">
                <a
                  href={post.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="instagram-post-link"
                >
                  <div className="instagram-post-image">
                    <img
                      src={post.media_url}
                      alt={post.caption || 'Instagram post'}
                      loading="lazy"
                    />
                    <div className="instagram-post-overlay">
                      <div className="instagram-post-stats">
                        <span><i className="fas fa-heart"></i> {post.like_count || 0}</span>
                        <span><i className="fas fa-comment"></i> {post.comments_count || 0}</span>
                      </div>
                      {post.media_type === 'VIDEO' && (
                        <div className="instagram-video-badge">
                          <i className="fas fa-play"></i>
                        </div>
                      )}
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default InstagramFeed

