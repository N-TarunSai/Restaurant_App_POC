import { Link, NavLink } from "react-router-dom";
import React from "react";
import "../styles/header.css";

export default function Header() {
  return (
    <header className="header" role="banner">
      <div className="container wrap">
        {/* Brand */}
        <Link className="brand" to="/" aria-label="Go to homepage">
          ABC Multi Cuisine <br /> Restaurant
        </Link>

        {/* Navigation */}
        <nav className="nav" aria-label="Main navigation">
          <NavLink to="/" end aria-label="View Menu">
            Menu
          </NavLink>
          <NavLink to="/book" aria-label="Book a Table">
            Book a Table
          </NavLink>
          <Link to="/order" className="cta" aria-label="Order Online">
            <button>Order Online</button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
