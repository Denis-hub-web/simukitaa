import React from 'react'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Shop</h3>
            <ul>
              <li><a href="#shelf-iphone_section">iPhone</a></li>
              <li><a href="#shelf-samsung_section">Samsung</a></li>
              <li><a href="#shelf-google-pixel_section">Google Pixel</a></li>
              <li><a href="#shelf-macbook_section">MacBook</a></li>
              <li><a href="#shelf-airpods_section">AirPods</a></li>
              <li><a href="#shelf-jbl_section">JBL Speakers</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><a href="https://wa.me/255755855909" target="_blank" rel="noopener noreferrer">Contact Us</a></li>
              <li><a href="#shipping">Shipping Info</a></li>
              <li><a href="#returns">Returns</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>About</h3>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#news">News</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section footer-social">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="social-link"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="social-link"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a 
                href="https://www.instagram.com/simukitaa_/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="social-link"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="https://wa.me/255755855909" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="social-link"
              >
                <i className="fab fa-whatsapp"></i>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="social-link"
              >
                <i className="fab fa-youtube"></i>
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="social-link"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
            <div className="footer-contact">
              <p>
                <i className="fas fa-phone"></i>
                <a href="tel:+255755855909">+255 755 855 909</a>
              </p>
              <p>
                <i className="fab fa-whatsapp"></i>
                <a href="https://wa.me/255755855909" target="_blank" rel="noopener noreferrer">
                  WhatsApp Us
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {currentYear} Shop. All rights reserved.</p>
          </div>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <span className="separator">|</span>
            <a href="#terms">Terms of Service</a>
            <span className="separator">|</span>
            <a href="#cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
