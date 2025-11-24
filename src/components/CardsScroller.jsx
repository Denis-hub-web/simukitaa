import React, { useRef, useEffect, useState } from 'react'
import ProductCard from './ProductCard'

const CardsScroller = ({ items = [] }) => {
  const scrollerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScrollability = () => {
    if (scrollerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
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
  }, [items])

  const scroll = (direction) => {
    if (scrollerRef.current) {
      const scrollAmount = 300
      scrollerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
      
      setTimeout(checkScrollability, 300)
    }
  }

  return (
    <div className="rf-cards-scroller">
      <div className="rf-cards-scroller-overflow">
        <div 
          data-core-scroller="" 
          style={{ overflowX: 'scroll', overflowY: 'hidden' }} 
          ref={scrollerRef}
        >
          <div className="rf-cards-scroller-platter" style={{ display: 'flex' }}>
            {items.map((item, index) => (
              <div
                key={item.id || index}
                className="rf-cards-scroller-item rf-cards-scroller-1cards"
                style={{ flexShrink: 0 }}
              >
                <div className="rf-cards-scroller-itemview">
                  <ProductCard {...item} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="paddlenav paddlenav-alpha paddlenav-framed paddlenav-elevated">
        <button
          type="button"
          className="paddlenav-arrow paddlenav-arrow-previous"
          disabled={!canScrollLeft}
          onClick={() => scroll('left')}
          aria-label="Previous"
        >
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
              <path d="M21.559,12.062 L15.618,17.984 L21.5221,23.944 C22.105,24.533 22.1021,25.482 21.5131,26.065 C21.2211,26.355 20.8391,26.4999987 20.4571,26.4999987 C20.0711,26.4999987 19.6851,26.352 19.3921,26.056 L12.4351,19.034 C11.8531,18.446 11.8551,17.4999987 12.4411,16.916 L19.4411,9.938 C20.0261,9.353 20.9781,9.354 21.5621,9.941 C22.1471,10.528 22.1451,11.478 21.5591,12.062 L21.559,12.062 Z"></path>
            </svg>
          </span>
          <span className="visuallyhidden">Previous</span>
        </button>
        <button
          type="button"
          className="paddlenav-arrow paddlenav-arrow-next"
          disabled={!canScrollRight}
          onClick={() => scroll('right')}
          aria-label="Next"
        >
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36">
              <path d="M23.5587,16.916 C24.1447,17.4999987 24.1467,18.446 23.5647,19.034 L16.6077,26.056 C16.3147,26.352 15.9287,26.4999987 15.5427,26.4999987 C15.1607,26.4999987 14.7787,26.355 14.4867,26.065 C13.8977,25.482 13.8947,24.533 14.4777,23.944 L20.3818,17.984 L14.4408,12.062 C13.8548,11.478 13.8528,10.5279 14.4378,9.941 C15.0218,9.354 15.9738,9.353 16.5588,9.938 L23.5588,16.916 L23.5587,16.916 Z"></path>
            </svg>
          </span>
          <span className="visuallyhidden">Next</span>
        </button>
      </div>
    </div>
  )
}

export default CardsScroller
