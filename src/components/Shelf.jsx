import React from 'react'
import CardsScroller from './CardsScroller'

const Shelf = ({ id, title, secondaryTitle, items, eyebrow }) => {
  const sectionId = `${id}_section`
  
  return (
    <div className="rs-cardsshelf" id={sectionId}>
      <div id={id}></div>
      <div className="as-l-container rs-cardsshelf-section-top rs-cards-shelf-header">
        {title && <h2 className="rs-cards-shelf-mainheader">{title}</h2>}
        {secondaryTitle && (
          <span className="rs-cards-shelf-secondaryheader">{secondaryTitle}</span>
        )}
      </div>
      <div className="rs-cardsshelf-section-bottom">
        <CardsScroller items={items} />
      </div>
    </div>
  )
}

export default Shelf
