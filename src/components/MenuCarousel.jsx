  import React from 'react';
  import { useEffect, useState } from 'react';
  import { MENU } from '../data/menu';
  import '../styles/MenuCarousel.css';

  export default function MenuCarousel() {
    const [index, setIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(1);

    //Screen size batti visual sides adjustment
    useEffect(() => {
      const updateVisibleCount = () => {
        const width = window.innerWidth;
        if (width < 640) {
          setVisibleCount(1); //phone
        } else if (width < 1024) {
          setVisibleCount(2); //tab
        } else {
          setVisibleCount(3); //laptop
        }
      };

      updateVisibleCount();
      window.addEventListener('resize', updateVisibleCount);
      return () => window.removeEventListener('resize', updateVisibleCount);
    }, []);

    //Automatic slide 
    useEffect(() => {
      if (!visibleCount) return;
      const interval = setInterval(() => {
        setIndex((prev) =>
          prev + visibleCount >= MENU.length ? 0 : prev + 1
        );
      }, 3000);

      return () => clearInterval(interval);
    }, [visibleCount]);

    //Slice visible items
    const visibleItems = MENU.slice(index, index + visibleCount);

    //Wrap around if not enough items at the end
    const slidesToShow =
      visibleItems.length < visibleCount
        ? [...visibleItems, ...MENU.slice(0, visibleCount - visibleItems.length)]
        : visibleItems;

    return (
      <div
        className="carousel-container"
        role="region"
        aria-label="Menu items carousel"
      >
        <div className="carousel-track">
          {slidesToShow.map((item) => (
            <div
              className="carousel-slide"
              key={item.id}
              aria-label={item.name}
            >
              <img src={item.img} alt={item.name} />
            </div>
          ))}
        </div>
      </div>
    );
  }
