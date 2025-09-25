import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MENU } from "../data/menu";
import MenuList from "../components/MenuList";
import QuantityStepper from "../components/QuantityStepper";
import Filters from "../components/Filters";
import { addItem, updateItem, clearCart } from "../slices/cartSlice";
import "../styles/online.css";

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

export default function OrderOnline() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const query = useSelector((state) => state.filters.query);
  const veg = useSelector((state) => state.filters.veg);

  // Local state
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState({ items: [], total: 0 });

  // Filtered items
  const filteredItems = useMemo(() => {
    return MENU.filter((item) => {
      const matchesType = veg === "all" || item.type === veg;
      const matchesQuery = (item.name + " " + item.desc)
        .toLowerCase()
        .includes(query.toLowerCase());
      return matchesType && matchesQuery;
    });
  }, [veg, query]);

  // Total cost (safe)
  const total = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = MENU.find((i) => i.id === Number(id));
      return sum + (item ? item.price * qty : 0);
    }, 0);
  }, [cart]);

  // Place order
  const placeOrder = () => {
    // Filter out invalid items
    const orderItems = Object.entries(cart)
      .map(([id, qty]) => {
        const item = MENU.find((i) => i.id === Number(id));
        if (!item) return null;
        return { ...item, qty };
      })
      .filter(Boolean);

    const orderTotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    setSummary({ items: orderItems, total: orderTotal });
    setOpen(true);
    dispatch(clearCart());
  };

  return (
    <section className="container" aria-label="Order Online Section">
      <h1 className="title">Order Online</h1>

      {/* Filters */}
      <Filters />

      {/* Menu list with quantity controls */}
      <MenuList
        items={filteredItems}
        showImages
        controlsRenderer={(item) => {
          const qty = cart?.[item.id] || 0;

          return (
            <div className="controls-column">
              <button
                onClick={() => dispatch(addItem(item.id))}
                aria-label={`Add ${item.name} to cart`}
              >
                Add Item
              </button>

              {qty > 0 && (
                <div style={{ marginTop: 8 }}>
                  <QuantityStepper
                    value={qty}
                    onChange={(v) =>
                      dispatch(updateItem({ id: item.id, qty: v }))
                    }
                    ariaLabel={`Adjust quantity of ${item.name}`}
                  />
                </div>
              )}
            </div>
          );
        }}
      />

      {/* Place Order button */}
      {Object.keys(cart).length > 0 && (
        <div className="place-order">
          <button
            onClick={placeOrder}
            aria-label={`Place order with total ₹${total}`}
          >
            Place Order • ₹{total}
          </button>
        </div>
      )}

      {/* Order summary modal */}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          window.location.href = "/";
        }}
        title="Order Placed Successfully"
      >
        <div>
          <h3>Summary</h3>
          <ul className="plain" aria-label="Order summary list">
            {summary.items.map((item) => (
              <li
                key={item.id}
                className="row"
                style={{ justifyContent: "space-between" }}
                aria-label={`${item.name}, Quantity: ${item.qty}, Price: ₹${
                  item.price * item.qty
                }`}
              >
                <span>
                  {item.name} × {item.qty}
                </span>
                <span>₹{item.price * item.qty}</span>
              </li>
            ))}
          </ul>

          <hr className="divider" />

          <div
            className="row"
            style={{ justifyContent: "space-between" }}
            aria-label={`Total amount: ₹${summary.total}`}
          >
            <strong>Total</strong>
            <strong>₹{summary.total}</strong>
          </div>
        </div>
      </Modal>
    </section>
  );
}
