import { useDispatch, useSelector } from 'react-redux';
import { setQuery, setVeg } from '../slices/filtersSlice';
import React from 'react';

export default function Filters() {
  const dispatch = useDispatch();
  const query = useSelector(state => state.filters.query);
  const veg = useSelector(state => state.filters.veg);

  // Toggle checkbox filter
  const handleVegToggle = (type) => {
    dispatch(setVeg(veg === type ? 'all' : type));
  };

  return (
    <div className="search-row">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search dishes..."
        value={query}
        onChange={(e) => dispatch(setQuery(e.target.value))}
        aria-label="Search dishes by name"
      />

      {/* Veg Filter */}
      <label className="row" style={{ gap: 8 }}>
        <input
          type="checkbox"
          checked={veg === "veg"}
          onChange={() => handleVegToggle("veg")}
          aria-label="Show only vegetarian dishes"
        />
        Veg only
      </label>

      {/* Non-Veg Filter */}
      <label className="row" style={{ gap: 8 }}>
        <input
          type="checkbox"
          checked={veg === "non-veg"}
          onChange={() => handleVegToggle("non-veg")}
          aria-label="Show only non-vegetarian dishes"
        />
        Non‑Veg only
      </label>
    </div>
  );
}
