import React from 'react';
import { SECTIONS } from '../data/menu';
import '../styles/menu.css';

export default function MenuList({ items, showImages = false, controlsRenderer }) {
  return (
    <section
      id="menu-section"
      aria-label="Menu Items"
      data-testid="menu-section"
    >
      <h1 className="title">Menu</h1>

      {SECTIONS.map((section) => {
        const sectionItems = items.filter((item) => item.section === section);

        return (
          <div
            className="menu-block"
            key={section}
            aria-label={`${section} section`}
          >
            <h3>{section}</h3>
            <div>
              {sectionItems.map((item) => (
                <div
                  className="item"
                  key={item.id}
                  aria-label={`Dish: ${item.name}, ${item.type}, Price: ₹${item.price}`}
                >
                  {/* Item Details */}
                  <div className="meta">
                    {showImages && (
                      <img className="thumb" src={item.img} alt={item.name} />
                    )}

                    <div>
                      <div className="row" style={{ gap: 8 }}>
                        <span
                          className={`dot ${
                            item.type === "veg" ? "veg" : "nonveg"
                          }`}
                          aria-label={
                            item.type === "veg"
                              ? "Vegetarian"
                              : "Non-Vegetarian"
                          }
                        />
                        <strong>{item.name}</strong>
                        <span
                          className="badge"
                          aria-label={`Type: ${item.type}`}
                        >
                          {item.type}
                        </span>
                      </div>

                      <div style={{ color: "var(--muted)" }}>{item.desc}</div>
                    </div>
                  </div>

                  {/* Price & Controls */}
                  <div className="controls">
                    <div className="price" aria-label={`Price: ₹${item.price}`}>
                      ₹{item.price}
                    </div>
                    {controlsRenderer?.(item)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
