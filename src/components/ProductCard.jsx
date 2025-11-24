import React from 'react'

const WHATSAPP_NUMBER = '+255755855909'

const getWhatsAppLink = (title, details, originalLink) => {
  const cleanTitle = title?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&') || 'Product'
  const message = `Hello! I'm interested in: ${cleanTitle}${details ? `\nDetails: ${details}` : ''}${originalLink && originalLink !== '#' ? `\nLink: ${originalLink}` : ''}`
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}?text=${encodedMessage}`
}

const ProductCard = ({
  type = 'hcard',
  eyebrow,
  title,
  image,
  imageAlt,
  price,
  monthlyPrice,
  installmentTerm,
  colors = [],
  primaryButtonText = 'Buy',
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  tag,
  partNumber,
  cardSize = '40',
  details
}) => {
  if (type === 'ccard') {
    return (
      <div className={`rf-ccard rf-ccard-${cardSize}`}>
        <a
          href={getWhatsAppLink(title, details, '#')}
          target="_blank"
          rel="noopener noreferrer"
          className="as-util-relatedlink"
          data-slot-name={partNumber}
        >
          <div className="rf-ccard-content rf-ccard-content-withfullimg">
            <div className="rf-ccard-img-full-wrapper">
              {image && (
                <img
                  loading="lazy"
                  src={image}
                  alt={imageAlt || title}
                  className="rf-ccard-img"
                />
              )}
            </div>
            <div className="rf-ccard-content-info">
              {eyebrow && (
                <h3 className="rf-ccard-content-header-eyebrow">{eyebrow}</h3>
              )}
              <div className="rf-ccard-content-header">
                <a
                  href={getWhatsAppLink(title, details, '#')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rf-ccard-content-headerlink"
                  data-slot-name={partNumber}
                >
                  <div dangerouslySetInnerHTML={{ __html: title }} />
                </a>
              </div>
            </div>
          </div>
        </a>
      </div>
    )
  }

  // Hero card (hcard)
  const cardClass = `rf-hcard rf-hcard-${cardSize} ${tag ? `rf-card-msgtag-${tag}` : ''} rf-hcard-centered-image`
  
  return (
    <div className={cardClass}>
      <div className="rf-hcard-content tile as-util-relatedlink">
        <div className="rf-hcard-copy">
          {eyebrow && (
            <div className="rf-hcard-eyebrow-content">{eyebrow}</div>
          )}
          {title && (
            <h3 className="rf-hcard-content-title" dangerouslySetInnerHTML={{ __html: title }} />
          )}
        </div>
        
        {image && (
          <div className="rf-hcard-img-wrapper">
            <img
              loading="lazy"
              width="340"
              height="264"
              alt={imageAlt || title}
              src={image}
              className="rf-hcard-img"
            />
          </div>
        )}
        
        {secondaryButtonText && (
          <button
            type="button"
            className="rf-hcard-secondary-cta button button-secondary-alpha"
            onClick={() => secondaryButtonLink && window.open(secondaryButtonLink, '_blank')}
          >
            {secondaryButtonText}
            <span className="visuallyhidden"> - {title}</span>
          </button>
        )}
        
        <div className="rf-hcard-content-info">
          <div className="rf-hcard-scrim">
            {details && (
              <div className="rf-hcard-scrim-details">
                {details}
              </div>
            )}
            {(primaryButtonText || true) && (
              <a
                href={getWhatsAppLink(title, details, '#')}
                target="_blank"
                rel="noopener noreferrer"
                className="rf-hcard-cta button button-reduced"
                data-part-number={partNumber}
              >
                {primaryButtonText || 'Buy'}
                <span className="visuallyhidden"> - {title}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
