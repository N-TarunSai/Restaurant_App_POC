import React, { useState, useMemo } from "react";
import "../styles/book.css";

// Modal component
function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header>
          <h3 id="modal-title">{title}</h3>
          <button onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </header>
        <div className="content">{children}</div>
        <footer>
          <button onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>
  );
}

// Generate time slots
function getTimeSlots(dateString) {
  const date = new Date(dateString);
  const day = date.getDay();
  const startHour = 11;
  const endHour = day === 0 || day === 6 ? 23 : 21;

  return Array.from({ length: endHour - startHour + 1 }, (_, i) => {
    const hour = startHour + i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });
}

// Exported helper for testing
export function _handleBookClick(date, time, size, setOpen, setTableNo) {
  if (!date || !time || !size) return;
  setTableNo(Math.floor(Math.random() * 20) + 1);
  setOpen(true);
}

export default function BookTable() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("");
  const [size, setSize] = useState("");
  const [open, setOpen] = useState(false);
  const [tableNo, setTableNo] = useState(null);

  // Generate time slots based on selected date
  const times = useMemo(() => getTimeSlots(date), [date]);

  // Regular handler wraps the exported testable function
  const handleBookClick = () =>
    _handleBookClick(date, time, size, setOpen, setTableNo);

  return (
    <section className="book-section" aria-label="Table booking section">
      <div className="overlay">
        <h1 className="title">Book a Table</h1>
        <p className="info">
          Please select a time slot to make sure the table is not allotted to
          others.
        </p>

        <div className="form-row">
          {/* Date Selector */}
          <div>
            <input
              id="date"
              type="date"
              value={date}
              min={new Date().toISOString().slice(0, 10)}
              max={new Date(new Date().setMonth(new Date().getMonth() + 1))
                .toISOString()
                .slice(0, 10)}
              onChange={(e) => {
                setDate(e.target.value);
                setTime("");
                setSize("");
              }}
              aria-label="Select booking date"
            />
          </div>

          {/* Time Selector */}
          <div>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              aria-label="Select booking time"
              disabled={!date}
            >
              <option value="" disabled hidden>
                Time
              </option>
              {times.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Party Size Selector */}
          <div>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              aria-label="Select party size"
              disabled={!time}
            >
              <option value="" disabled hidden>
                Party Size
              </option>
              {Array.from({ length: 9 }, (_, i) => i + 2).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* Book Now Button */}
          <div style={{ alignSelf: "end" }}>
            <button
              id="btn"
              onClick={handleBookClick}
              disabled={!date || !time || !size}
              aria-label="Book a table"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Restaurant Image */}
      <img
        className="Image"
        src="https://static.wixstatic.com/media/0b340f_78ad19e599d642a28de7ce823686cbc6~mv2.jpg/v1/fill/w_1785,h_911,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0b340f_78ad19e599d642a28de7ce823686cbc6~mv2.jpg"
        alt="Restaurant Interior"
      />

      {/* Success Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Reservation Successful"
      >
        <div className="success">
          <p>Your table has been reserved.</p>
          <ul>
            <li>
              <strong>Date:</strong> {date}
            </li>
            <li>
              <strong>Time:</strong> {time}
            </li>
            <li>
              <strong>Party size:</strong> {size}
            </li>
            <li>
              <strong>Allotted Table No:</strong> {tableNo}
            </li>
          </ul>
        </div>
      </Modal>
    </section>
  );
}
