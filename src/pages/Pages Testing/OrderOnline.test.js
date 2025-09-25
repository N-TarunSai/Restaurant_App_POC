import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import OrderOnline from "../OrderOnline";
import cartReducer from "../../slices/cartSlice";
import filtersReducer from "../../slices/filtersSlice";
import { MENU } from "../../data/menu";

function renderWithStore(preloadedState = {}) {
  const store = configureStore({
    reducer: { cart: cartReducer, filters: filtersReducer },
    preloadedState,
  });

  return {
    ...render(
      <Provider store={store}>
        <OrderOnline />
      </Provider>
    ),
    store,
  };
}

describe("OrderOnline Page", () => {
  const firstItem = MENU[0];

  test("Renders page title", () => {
    renderWithStore();
    expect(
      screen.getByRole("heading", { name: /order online/i })
    ).toBeInTheDocument();
  });

  test("Filters component renders and updates correctly", () => {
    renderWithStore({ cart: {}, filters: { query: "", veg: "all" } });

    const searchInput = screen.getByRole("textbox", {
      name: /search dishes by name/i,
    });
    const vegCheckbox = screen.getByRole("checkbox", {
      name: /show only vegetarian dishes/i,
    });
    const nonVegCheckbox = screen.getByRole("checkbox", {
      name: /show only non-vegetarian dishes/i,
    });

    // initial values
    expect(searchInput.value).toBe("");
    expect(vegCheckbox.checked).toBe(false);
    expect(nonVegCheckbox.checked).toBe(false);

    // type in search
    fireEvent.change(searchInput, { target: { value: "Soup" } });
    expect(searchInput.value).toBe("Soup");

    // toggle checkboxes
    fireEvent.click(vegCheckbox);
    expect(vegCheckbox.checked).toBe(true);

    fireEvent.click(nonVegCheckbox);
    expect(nonVegCheckbox.checked).toBe(true);
  }); 

  test("Add Item button adds item to cart and shows QuantityStepper", () => {
    renderWithStore({ cart: {}, filters: { query: "", veg: "all" } });
    const addBtn = screen.getByRole("button", {
      name: `Add ${firstItem.name} to cart`,
    });
    fireEvent.click(addBtn);

    expect(
      screen.getByRole("group", { name: /adjust quantity of/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /place order/i })
    ).toBeInTheDocument();
  });

  test("QuantityStepper can increase and decrease quantity", () => {
    renderWithStore({
      cart: { [firstItem.id]: 1 },
      filters: { query: "", veg: "all" },
    });

    const stepper = screen.getByRole("group", { name: /adjust quantity of/i });
    const increaseBtn = within(stepper).getByRole("button", {
      name: /increase/i,
    });
    const decreaseBtn = within(stepper).getByRole("button", {
      name: /decrease/i,
    });


    fireEvent.click(increaseBtn);
    expect(stepper).toHaveTextContent("2");

    fireEvent.click(decreaseBtn);
    expect(stepper).toHaveTextContent("1");
  });

  test("QuantityStepper removing item clears it from cart (updateItem with qty <= 0)", () => {
    const secondItem = MENU[1]; // e.g., Smoked Salmon Toasts
    renderWithStore({
      cart: { [secondItem.id]: 1 },
      filters: { query: "", veg: "all" },
    });

    // Stepper should exist
    const stepper = screen.getByRole("group", {
      name: `Adjust quantity of ${secondItem.name}`,
    });
    const decreaseBtn = within(stepper).getByRole("button", {
      name: /decrease/i,
    });

    // Click decrease to 0
    fireEvent.click(decreaseBtn);

    // Stepper should disappear (item removed from cart)
    expect(
      screen.queryByRole("group", {
        name: `Adjust quantity of ${secondItem.name}`,
      })
    ).not.toBeInTheDocument();

    // Place Order button should not appear
    expect(
      screen.queryByRole("button", { name: /place order/i })
    ).not.toBeInTheDocument();
  });

  test("Place Order button is hidden when cart is empty", () => {
    renderWithStore({ cart: {}, filters: { query: "", veg: "all" } });
    expect(
      screen.queryByRole("button", { name: /place order/i })
    ).not.toBeInTheDocument();
  });

  test("Place Order opens modal, clears cart, and displays single/multiple items correctly", () => {
    const secondItem = MENU[1];
    renderWithStore({
      cart: { [firstItem.id]: 1, [secondItem.id]: 2 },
      filters: { query: "", veg: "all" },
    });

    // Place Order
    fireEvent.click(screen.getByRole("button", { name: /place order/i }));

    const modal = screen.getByRole("dialog");
    const modalWithin = within(modal);

    // Modal displays summary
    expect(modalWithin.getByText(/summary/i)).toBeInTheDocument();
    expect(modalWithin.getByText(`${firstItem.name} × 1`)).toBeInTheDocument();
    expect(modalWithin.getByText(`${secondItem.name} × 2`)).toBeInTheDocument();

    const total = firstItem.price * 1 + secondItem.price * 2;
    expect(
      modalWithin.getByLabelText(`Total amount: ₹${total}`)
    ).toBeInTheDocument();

    // Place Order button disappears (cart cleared)
    expect(
      screen.queryByRole("button", { name: /place order/i })
    ).not.toBeInTheDocument();

    // Close modal using header ✕ button
    fireEvent.click(modalWithin.getByRole("button", { name: /close modal/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  test("Total calculation handles missing menu item gracefully", () => {
    const { store } = renderWithStore({
      cart: { 9999: 2 }, // invalid MENU ID
      filters: { query: "", veg: "all" },
    });

    // Click Place Order to open the modal
    const placeOrderBtn = screen.getByRole("button", { name: /place order/i });
    fireEvent.click(placeOrderBtn);

    // Now the total element exists in the modal
    const totalElement = screen.getByLabelText(/total amount/i);
    expect(totalElement).toHaveTextContent("₹0");
  });

  test("Modal closes when clicking backdrop", () => {
    renderWithStore({
      cart: { [firstItem.id]: 1 },
      filters: { query: "", veg: "all" },
    });
    fireEvent.click(screen.getByRole("button", { name: /place order/i }));

    const backdrop = screen.getByRole("dialog");
    fireEvent.click(backdrop);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
