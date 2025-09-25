import '../styles/footer.css'
import React from 'react'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container wrap">
        <div>
          <h3>Hours</h3>
          <ul className="plain" aria-label="Restaurant opening hours">
            <li>Mon - Fri: 11am - 10pm</li>
            <li>Sat - Sun: 11am - 12am</li>
          </ul>
        </div>

        <div>
          <h3>Address</h3>
          <address className="plain" aria-label="Restaurant address">
            Opp. DLF Gate 3, Gachibowli, Hyderabad
            <br />
            Telangana - 500032
          </address>
        </div>

        <div>
          <h3>Follow Us</h3>
          <ul className="plain" aria-label="Social media links">
            <li>Facebook • Instagram</li>
          </ul>
        </div>
      </div>

      <small>© 2025 ABC Multi Cuisine Restaurant</small>
    </footer>
  )
}
