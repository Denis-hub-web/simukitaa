import React, { useState, useEffect, useRef } from 'react'
import './Navigation.css'

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('shelf-iphone_section')
  const scrollerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const navItems = [
    { id: 'shelf-iphone_section', label: 'iPhone' },
    { id: 'shelf-samsung_section', label: 'Samsung' },
    { id: 'shelf-google-pixel_section', label: 'Google Pixel' },
    { id: 'shelf-macbook_section', label: 'MacBook' },
    { id: 'shelf-airpods_section', label: 'AirPods' },
    { id: 'shelf-jbl_section', label: 'JBL Speakers' }
  ]

  const checkScrollability = () => {
    if (scrollerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    // Initial check after a delay to ensure layout is complete
    const timer = setTimeout(() => {
      checkScrollability()
    }, 100)
    
    const scroller = scrollerRef.current
    if (scroller) {
      scroller.addEventListener('scroll', checkScrollability)
      window.addEventListener('resize', checkScrollability)
      
      return () => {
        clearTimeout(timer)
        scroller.removeEventListener('scroll', checkScrollability)
        window.removeEventListener('resize', checkScrollability)
      }
    }
  }, [])

  const scroll = (direction) => {
    if (scrollerRef.current) {
      const scrollAmount = 200
      scrollerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
      
      // Update button states after scroll animation
      setTimeout(checkScrollability, 300)
    }
  }

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="rf-navbar" id="rf-navbar">
      <div className="rf-navbar-content-wrapper">
        <div className="rf-navbar-content" aria-label="local" role="navigation">
          <div className="paddlenav paddlenav-compact rf-navbar-paddlenav rf-navbar-paddlenav-previous">
            <button
              type="button"
              className="paddlenav-arrow paddlenav-arrow-previous rf-navbar-paddlenav-arrow-previous typography-quote-reduced"
              disabled={!canScrollLeft}
              onClick={() => scroll('left')}
              aria-label="Previous"
            >
              <span className="a11y">Previous</span>
            </button>
            <div className="rf-navbar-fade"></div>
          </div>
          
          <div data-core-scroller="" style={{ overflowX: 'scroll', overflowY: 'hidden' }} ref={scrollerRef}>
            <div data-core-scroller-platter="" role="list" style={{ display: 'flex' }}>
              {navItems.map((item) => (
                <div key={item.id} data-core-scroller-item="" role="listitem" style={{ flexShrink: 0 }}>
                  <div className="rf-navbar-item">
                    <a
                      href={`#${item.id}`}
                      className={`rf-navbar-item-link ${activeSection === item.id ? 'rf-navbar-item-link-active active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault()
                        handleNavClick(item.id)
                      }}
                    >
                      {item.label}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="paddlenav paddlenav-compact rf-navbar-paddlenav rf-navbar-paddlenav-next">
            <button
              type="button"
              className="paddlenav-arrow paddlenav-arrow-next rf-navbar-paddlenav-arrow-next"
              disabled={!canScrollRight}
              onClick={() => scroll('right')}
              aria-label="Next"
            >
              <span className="a11y">Next</span>
            </button>
            <div className="rf-navbar-fade"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navigation
