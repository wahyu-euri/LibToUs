import React from 'react'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Section Brand */}
          <div className="footer-section">
            <h3>LibToUs</h3>
            <p>Your digital library management system</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Instagram">📷</a>
            </div>
          </div>

          {/* Section Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/books">Browse Books</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          {/* Section Services */}
          <div className="footer-section">
            <h4>Services</h4>
            <ul>
              <li><a href="/digital-books">Digital Books</a></li>
              <li><a href="/borrowing">Book Borrowing</a></li>
              <li><a href="/reservations">Reservations</a></li>
              <li><a href="/research">Research Help</a></li>
            </ul>
          </div>

          {/* Section Contact Info */}
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <p>📧 librarytous@gmail.com</p>
              <p>📞 +62 (024) 123-4567</p>
              <p>📍 Kota Buku, Semarang, Indonesia</p>
              <p>🕒 Mon-Fri: 9AM-6PM</p>
            </div>
          </div>

          {/* Section Newsletter */}
          <div className="footer-section">
            <h4>Newsletter</h4>
            <p>Subscribe to get updates on new books</p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Your email" 
                className="newsletter-input"
              />
              <button className="newsletter-btn">Subscribe</button>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 LibToUs. All rights reserved.</p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/sitemap">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer